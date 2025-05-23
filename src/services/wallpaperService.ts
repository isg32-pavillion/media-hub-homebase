
export interface WallpaperConfig {
  url: string;
  isCustom: boolean;
  uploadedAt?: string;
}

class WallpaperService {
  private readonly DEFAULT_WALLPAPER = '/assets/wallpaper/default.jpg';

  getWallpaper(): WallpaperConfig {
    // We're now using a static path instead of localStorage
    return {
      url: '/assets/wallpaper/wallpaper.png',
      isCustom: false
    };
  }

  setWallpaper(wallpaperConfig: WallpaperConfig): void {
    // This would normally require server-side implementation
    console.log('Wallpaper would be saved to /assets/wallpaper/ on the server');
    // In a real implementation, you would send a request to the server
    // to save the wallpaper file to the correct location
  }

  setCustomWallpaper(imageDataUrl: string): void {
    console.log('Custom wallpaper would be uploaded to the server');
    // In a real implementation, this would upload the image to the server
    // and save it as /assets/wallpaper/wallpaper.png
  }

  setDefaultWallpaper(): void {
    console.log('Setting default wallpaper');
    // In a real implementation, this would copy the default wallpaper
    // to /assets/wallpaper/wallpaper.png on the server
  }
}

export const wallpaperService = new WallpaperService();
