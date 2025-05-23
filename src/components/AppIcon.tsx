
import React from 'react';
import { cn } from '@/lib/utils';

interface AppIconProps {
  name: string;
  icon: React.ReactNode;
  url: string;
  className?: string;
}

const AppIcon: React.FC<AppIconProps> = ({ name, icon, url, className }) => {
  const handleClick = () => {
    window.open(url, '_blank');
  };

  return (
    <div 
      className={cn("app-icon w-24 h-24 cursor-pointer", className)}
      onClick={handleClick}
    >
      <div className="text-3xl">{icon}</div>
      <div className="text-xs font-medium text-center mt-1">{name}</div>
    </div>
  );
};

export default AppIcon;
