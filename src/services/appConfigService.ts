
import { LucideIcon } from 'lucide-react';

export interface AppConfig {
  id: string;
  name: string;
  url: string;
  iconName: string;
}

const DEFAULT_APPS: AppConfig[] = [
  { id: '1', name: 'Jellyfin', url: 'http://192.168.31.96:8089', iconName: 'Play' },
  { id: '2', name: 'qBittorrent', url: 'http://192.168.31.96:8090', iconName: 'Download' },
  { id: '3', name: 'SFTP WebUI', url: 'http://192.168.31.96:8800', iconName: 'FolderOpen' },
  { id: '4', name: 'SSH', url: '#', iconName: 'Terminal' },
];

class AppConfigService {
  private static instance: AppConfigService;
  private apps: AppConfig[];

  constructor() {
    this.loadApps();
  }

  static getInstance(): AppConfigService {
    if (!AppConfigService.instance) {
      AppConfigService.instance = new AppConfigService();
    }
    return AppConfigService.instance;
  }

  private loadApps(): void {
    const stored = localStorage.getItem('app_configs');
    if (stored) {
      try {
        this.apps = JSON.parse(stored);
      } catch {
        this.apps = DEFAULT_APPS;
        this.saveApps();
      }
    } else {
      this.apps = DEFAULT_APPS;
      this.saveApps();
    }
  }

  private saveApps(): void {
    localStorage.setItem('app_configs', JSON.stringify(this.apps));
  }

  getApps(): AppConfig[] {
    return [...this.apps];
  }

  updateApp(id: string, updates: Partial<Omit<AppConfig, 'id'>>): boolean {
    const appIndex = this.apps.findIndex(app => app.id === id);
    if (appIndex >= 0) {
      this.apps[appIndex] = { ...this.apps[appIndex], ...updates };
      this.saveApps();
      return true;
    }
    return false;
  }

  addApp(app: Omit<AppConfig, 'id'>): AppConfig {
    const newApp: AppConfig = {
      ...app,
      id: Date.now().toString()
    };
    this.apps.push(newApp);
    this.saveApps();
    return newApp;
  }

  removeApp(id: string): boolean {
    const initialLength = this.apps.length;
    this.apps = this.apps.filter(app => app.id !== id);
    if (this.apps.length !== initialLength) {
      this.saveApps();
      return true;
    }
    return false;
  }
}

export const appConfigService = AppConfigService.getInstance();
