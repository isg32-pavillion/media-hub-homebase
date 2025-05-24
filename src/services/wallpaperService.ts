
export interface WallpaperConfig {
  url: string;
  isCustom: boolean;
  uploadedAt?: string;
}

class WallpaperService {
  getWallpaper(): WallpaperConfig {
    // Always return the static wallpaper
    return {
      url: '/wallpaper.jpg',
      isCustom: false
    };
  }
}

export const wallpaperService = new WallpaperService();
