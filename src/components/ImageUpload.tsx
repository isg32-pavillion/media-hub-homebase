
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { wallpaperService } from '@/services/wallpaperService';

interface ImageUploadProps {
  onImageSelect: (imageUrl: string) => void;
  currentImage?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelect, currentImage }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    // Convert to base64 and store permanently
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      wallpaperService.setCustomWallpaper(result);
      onImageSelect(result);
      toast({
        title: "Wallpaper saved",
        description: "Custom wallpaper has been permanently saved",
      });
    };
    reader.readAsDataURL(file);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleClearWallpaper = () => {
    wallpaperService.clearCustomWallpaper();
    onImageSelect('/bg-mountains.jpg');
    toast({
      title: "Wallpaper reset",
      description: "Wallpaper has been reset to default",
    });
  };

  const wallpaperConfig = wallpaperService.getWallpaper();

  return (
    <div className="space-y-2">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      <Button onClick={handleButtonClick} className="w-full">
        <Upload size={16} className="mr-2" />
        Upload Custom Wallpaper
      </Button>
      {wallpaperConfig.isCustom && (
        <Button onClick={handleClearWallpaper} variant="outline" className="w-full">
          <X size={16} className="mr-2" />
          Reset to Default
        </Button>
      )}
      <div className="text-xs text-muted-foreground">
        {wallpaperConfig.isCustom 
          ? `Custom wallpaper uploaded: ${wallpaperConfig.uploadedAt ? new Date(wallpaperConfig.uploadedAt).toLocaleDateString() : 'Unknown'}`
          : 'Using default wallpaper'
        }
      </div>
    </div>
  );
};

export default ImageUpload;
