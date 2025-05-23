
import React from 'react';
import AppIcon from './AppIcon';
import { Play, Download, FolderOpen, Terminal } from 'lucide-react';

// These would be loaded from a configuration file or database in a real application
const defaultApps = [
  { name: 'Jellyfin', icon: <Play />, url: 'http://192.168.31.96:8089' },
  { name: 'qBittorrent', icon: <Download />, url: 'http://192.168.31.96:8090' },
  { name: 'SFTP WebUI', icon: <FolderOpen />, url: 'http://192.168.31.96:8800' },
  { name: 'SSH', icon: <Terminal />, url: '#' },
];

interface HomePageProps {
  backgroundUrl: string;
}

const HomePage: React.FC<HomePageProps> = ({ backgroundUrl }) => {
  return (
    <div 
      className="flex-1 overflow-auto p-8 bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundUrl})` }}
    >
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-6 mt-4 animate-fade-in">
        {defaultApps.map((app, index) => (
          <AppIcon
            key={index}
            name={app.name}
            icon={app.icon}
            url={app.url}
          />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
