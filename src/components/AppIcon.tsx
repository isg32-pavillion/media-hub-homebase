
import React from 'react';
import { cn } from '@/lib/utils';
import * as Icons from 'lucide-react';

interface AppIconProps {
  name: string;
  iconName: string;
  url: string;
  className?: string;
}

const AppIcon: React.FC<AppIconProps> = ({ name, iconName, url, className }) => {
  const handleClick = () => {
    if (url !== '#') {
      window.open(url, '_blank');
    }
  };

  const IconComponent = Icons[iconName as keyof typeof Icons] || Icons.Square;

  return (
    <div 
      className={cn("app-icon w-24 h-24 cursor-pointer", className)}
      onClick={handleClick}
    >
      <div className="text-3xl text-white/90 hover:text-white transition-colors">
        <IconComponent size={32} />
      </div>
      <div className="text-xs font-medium text-center mt-1 text-white/90 hover:text-white transition-colors">{name}</div>
    </div>
  );
};

export default AppIcon;
