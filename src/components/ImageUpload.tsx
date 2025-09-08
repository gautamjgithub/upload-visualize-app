import React, { useState, useCallback } from 'react';
import { Upload, Image as ImageIcon, X } from 'lucide-react';
import { Button } from './ui/button';
import { Progress } from './ui/progress';

interface UploadedImage {
  id: string;
  file: File;
  url: string;
  name: string;
  size: number;
  width?: number;
  height?: number;
}

interface ImageUploadProps {
  onImagesChange: (images: UploadedImage[]) => void;
  onImageSelect: (image: UploadedImage) => void;
  selectedImage: UploadedImage | null;
  maxImages?: number;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  onImagesChange,
  onImageSelect,
  selectedImage,
  maxImages = 10
}) => {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    processFiles(files);
  }, []);

  const processFiles = useCallback((files: File[]) => {
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    const remainingSlots = maxImages - images.length;
    const filesToProcess = imageFiles.slice(0, remainingSlots);

    if (filesToProcess.length === 0) return;

    setUploading(true);
    setUploadProgress(0);

    const newImages: UploadedImage[] = [];

    filesToProcess.forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const uploadedImage: UploadedImage = {
            id: `${Date.now()}-${index}`,
            file,
            url: e.target?.result as string,
            name: file.name,
            size: file.size,
            width: img.width,
            height: img.height
          };
          
          newImages.push(uploadedImage);
          setUploadProgress((newImages.length / filesToProcess.length) * 100);

          if (newImages.length === filesToProcess.length) {
            const updatedImages = [...images, ...newImages];
            setImages(updatedImages);
            onImagesChange(updatedImages);
            setUploading(false);
            setUploadProgress(0);
          }
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  }, [images, maxImages, onImagesChange]);

  const removeImage = useCallback((id: string) => {
    const updatedImages = images.filter(img => img.id !== id);
    setImages(updatedImages);
    onImagesChange(updatedImages);
    
    if (selectedImage?.id === id) {
      onImageSelect(updatedImages[0] || null);
    }
  }, [images, onImagesChange, selectedImage, onImageSelect]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="flex flex-col h-full">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-foreground mb-2">Image Batch</h2>
        
        {/* Upload Area */}
        <div
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive 
              ? 'border-primary bg-primary/5' 
              : 'border-border hover:border-primary/50'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={images.length >= maxImages}
          />
          
          <div className="flex flex-col items-center space-y-2">
            <ImageIcon className="w-8 h-8 text-muted-foreground" />
            <div>
              <p className="text-sm text-foreground">Drop images or click to browse</p>
              <p className="text-xs text-muted-foreground">
                PNG, JPG, WebP • Max 25 MB each
              </p>
            </div>
          </div>
        </div>

        {/* Upload Progress */}
        {uploading && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-foreground">Uploading images...</span>
              <span className="text-sm text-muted-foreground">{Math.round(uploadProgress)}%</span>
            </div>
            <Progress value={uploadProgress} className="h-2" />
          </div>
        )}

        {/* Upload Button */}
        <div className="flex space-x-2 mt-4">
          <Button variant="outline" size="sm" disabled={images.length === 0}>
            <Upload className="w-4 h-4 mr-2" />
            Analyze Selected
          </Button>
          <Button variant="outline" size="sm" onClick={() => {
            setImages([]);
            onImagesChange([]);
          }}>
            Clear Batch
          </Button>
        </div>
      </div>

      {/* Image Grid */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-2 gap-3">
          {images.map((image) => (
            <div
              key={image.id}
              className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                selectedImage?.id === image.id 
                  ? 'border-primary shadow-lg shadow-primary/20' 
                  : 'border-border hover:border-primary/50'
              }`}
              onClick={() => onImageSelect(image)}
            >
              <div className="aspect-square">
                <img
                  src={image.url}
                  alt={image.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Remove Button */}
              <button
                className="absolute top-1 right-1 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage(image.id);
                }}
              >
                <X className="w-3 h-3" />
              </button>
              
              {/* Image Info */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                <p className="text-white text-xs font-medium truncate">{image.name}</p>
                <p className="text-white/80 text-xs">
                  {formatFileSize(image.size)}
                </p>
                {image.width && image.height && (
                  <p className="text-white/60 text-xs">
                    {image.width} × {image.height}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* File Count Warning */}
        {images.length > 0 && (
          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              {images.length} images • {formatFileSize(images.reduce((acc, img) => acc + img.size, 0))}
            </p>
            {images.some(img => img.size > 25 * 1024 * 1024) && (
              <p className="text-sm text-warning mt-1">
                ⚠️ 3 files exceed 25 MB (highlighted)
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};