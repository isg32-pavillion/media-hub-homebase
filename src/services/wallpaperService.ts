
export interface WallpaperConfig {
  url: string;
  isCustom: boolean;
  uploadedAt?: string;
}

class WallpaperService {
  private readonly STORAGE_KEY = 'wallpaper_config';

  getWallpaper(): WallpaperConfig {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        // If parsing fails, return default
      }
    }
    
    return {
      url: '/bg-mountains.jpg',
      isCustom: false
    };
  }

  setWallpaper(wallpaperConfig: WallpaperConfig): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(wallpaperConfig));
  }

  setCustomWallpaper(imageDataUrl: string): void {
    const config: WallpaperConfig = {
      url: imageDataUrl,
      isCustom: true,
      uploadedAt: new Date().toISOString()
    };
    this.setWallpaper(config);
  }

  setDefaultWallpaper(url: string): void {
    const config: WallpaperConfig = {
      url,
      isCustom: false
    };
    this.setWallpaper(config);
  }

  clearCustomWallpaper(): void {
    this.setDefaultWallpaper('/bg-mountains.jpg');
  }
}

export const wallpaperService = new WallpaperService();
