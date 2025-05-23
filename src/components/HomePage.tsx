
import React, { useEffect, useState } from 'react';
import AppIcon from './AppIcon';
import { appConfigService, AppConfig } from '@/services/appConfigService';

interface HomePageProps {
  backgroundUrl: string;
}

const HomePage: React.FC<HomePageProps> = ({ backgroundUrl }) => {
  const [apps, setApps] = useState<AppConfig[]>([]);

  useEffect(() => {
    setApps(appConfigService.getApps());
  }, []);

  return (
    <div 
      className="flex-1 overflow-auto p-8 bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundUrl})` }}
    >
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-6 mt-4 animate-fade-in">
        {apps.map((app) => (
          <AppIcon
            key={app.id}
            name={app.name}
            iconName={app.iconName}
            url={app.url}
          />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
