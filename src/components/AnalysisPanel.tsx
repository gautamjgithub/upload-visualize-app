import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface UploadedImage {
  id: string;
  file: File;
  url: string;
  name: string;
  size: number;
  width?: number;
  height?: number;
}

interface AnalysisPanelProps {
  images: UploadedImage[];
  selectedImage: UploadedImage | null;
}

export const AnalysisPanel: React.FC<AnalysisPanelProps> = ({ images, selectedImage }) => {
  const totalSize = images.reduce((acc, img) => acc + img.size, 0);
  const avgSize = images.length > 0 ? totalSize / images.length : 0;

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const formatCounts = (count: number) => {
    if (count >= 1000000) return (count / 1000000).toFixed(1) + 'M';
    if (count >= 1000) return (count / 1000).toFixed(1) + 'K';
    return count.toString();
  };

  // Format analysis for file types
  const formatAnalysis = () => {
    const formats = images.reduce((acc, img) => {
      const ext = img.name.split('.').pop()?.toUpperCase() || 'UNKNOWN';
      acc[ext] = (acc[ext] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(formats).map(([format, count]) => ({
      name: format,
      value: count
    }));
  };

  const formatData = formatAnalysis();
  const COLORS = ['hsl(var(--primary))', 'hsl(var(--accent))', 'hsl(var(--success))', 'hsl(var(--warning))'];

  // Mock analysis data - in real app this would come from API
  const analysisData = {
    summary: {
      description: selectedImage 
        ? `Analysis of ${selectedImage.name} containing ${images.length === 1 ? 'a single image' : `batch of ${images.length} images`} with various scene elements and objects.`
        : `This batch of ${images.length} images contains factory floor scenes with machinery, workers, and safety equipment.`,
      labels: ['hard hat', 'person', 'safety vest'],
      confidence: 95.2
    },
    dashboard: {
      detectionCount: 1247,
      averageConfidence: 87.3,
      processingTime: '2.4s'
    }
  };

  const detectionData = [
    { name: 'Person', count: 45, confidence: 92 },
    { name: 'Hard Hat', count: 38, confidence: 89 },
    { name: 'Safety Vest', count: 32, confidence: 85 },
    { name: 'Machinery', count: 28, confidence: 94 },
    { name: 'Tools', count: 15, confidence: 78 }
  ];

  return (
    <div className="flex flex-col h-full">
      <Tabs defaultValue="summary" className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="chat">Chat</TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-y-auto">
          <TabsContent value="summary" className="space-y-6 mt-0">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">
                {selectedImage ? selectedImage.name : 'Batch Analysis'}
              </h3>
              <p className="text-muted-foreground mb-6">
                {analysisData.summary.description}
              </p>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-foreground">{images.length}</div>
                  <div className="text-sm text-muted-foreground">Total Images</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-foreground">{formatFileSize(totalSize)}</div>
                  <div className="text-sm text-muted-foreground">Total Size</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-foreground">{formatFileSize(avgSize)}</div>
                  <div className="text-sm text-muted-foreground">Avg. Size</div>
                </CardContent>
              </Card>
            </div>

            {/* Formats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Formats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {formatData.map((format) => (
                    <Badge key={format.name} variant="secondary">
                      {format.name}: {format.value}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Unique Labels */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Unique Labels</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {analysisData.summary.labels.map((label) => (
                    <div key={label} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-sm text-foreground">{label}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Warning */}
            <Card className="border-warning/20">
              <CardHeader>
                <CardTitle className="text-base text-warning">Warning</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground">
                  Some images may contain sensitive content. Please review before sharing.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dashboard" className="space-y-6 mt-0">
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-foreground">{formatCounts(analysisData.dashboard.detectionCount)}</div>
                  <div className="text-sm text-muted-foreground">Total Detections</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-foreground">{analysisData.dashboard.averageConfidence}%</div>
                  <div className="text-sm text-muted-foreground">Avg. Confidence</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-foreground">{analysisData.dashboard.processingTime}</div>
                  <div className="text-sm text-muted-foreground">Processing Time</div>
                </CardContent>
              </Card>
            </div>

            {/* Detection Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Detection Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={detectionData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Format Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Format Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={formatData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {formatData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="details" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  {selectedImage ? `Details: ${selectedImage.name}` : 'Batch Details'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedImage ? (
                  <>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">File Name:</span>
                        <p className="font-medium">{selectedImage.name}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">File Size:</span>
                        <p className="font-medium">{formatFileSize(selectedImage.size)}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Dimensions:</span>
                        <p className="font-medium">
                          {selectedImage.width}×{selectedImage.height}
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Type:</span>
                        <p className="font-medium">{selectedImage.file.type}</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <span className="text-muted-foreground">Analysis Results:</span>
                      <div className="mt-2 space-y-2">
                        {detectionData.slice(0, 3).map((detection) => (
                          <div key={detection.name} className="flex justify-between">
                            <span>{detection.name}</span>
                            <span className="text-muted-foreground">{detection.confidence}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <p className="text-muted-foreground">Select an image to view detailed information.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="chat" className="mt-0">
            <Card className="h-96">
              <CardHeader>
                <CardTitle className="text-base">Analysis Chat</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col h-full">
                <div className="flex-1 overflow-y-auto mb-4 space-y-3">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <div className="text-sm">
                      <p className="font-medium">System</p>
                      <p className="text-muted-foreground">Analysis complete. Found {analysisData.dashboard.detectionCount} objects across {images.length} images.</p>
                    </div>
                  </div>
                  {selectedImage && (
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                      <div className="text-sm">
                        <p className="font-medium">Analysis</p>
                        <p className="text-muted-foreground">
                          Currently viewing: {selectedImage.name}. 
                          Detected {analysisData.summary.labels.length} unique object types.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="border-t pt-4">
                  <input
                    type="text"
                    placeholder="Type your message..."
                    className="w-full p-2 text-sm bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};