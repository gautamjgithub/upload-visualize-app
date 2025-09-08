import React, { useState } from 'react';
import { Settings } from 'lucide-react';
import { ImageUpload } from '@/components/ImageUpload';
import { AnalysisPanel } from '@/components/AnalysisPanel';

interface UploadedImage {
  id: string;
  file: File;
  url: string;
  name: string;
  size: number;
  width?: number;
  height?: number;
}

const Index = () => {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<UploadedImage | null>(null);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const handleImagesChange = (newImages: UploadedImage[]) => {
    setImages(newImages);
    if (newImages.length > 0 && !selectedImage) {
      setSelectedImage(newImages[0]);
    }
  };

  const handleImageSelect = (image: UploadedImage) => {
    setSelectedImage(image);
  };

  const handleAnalysisComplete = (analysis: any) => {
    setAnalysisResult(analysis);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold text-foreground">VisionChat</h1>
            <span className="text-sm px-2 py-1 bg-muted rounded text-muted-foreground">Dev</span>
          </div>
          <Settings className="w-5 h-5 text-muted-foreground hover:text-foreground cursor-pointer" />
        </div>
      </header>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-73px)]">
        {/* Left Panel - Image Upload */}
        <div className="w-1/3 border-r border-border bg-card p-6">
          <ImageUpload
            onImagesChange={handleImagesChange}
            onImageSelect={handleImageSelect}
            selectedImage={selectedImage}
            maxImages={10}
            onAnalysisComplete={handleAnalysisComplete}
          />
        </div>

        {/* Right Panel - Analysis */}
        <div className="flex-1 p-6">
          <AnalysisPanel 
            images={images}
            selectedImage={selectedImage}
            analysisResult={analysisResult}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
