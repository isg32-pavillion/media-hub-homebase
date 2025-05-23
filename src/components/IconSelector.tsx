
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import * as Icons from 'lucide-react';

interface IconSelectorProps {
  currentIcon: string;
  onIconSelect: (iconName: string) => void;
  trigger?: React.ReactNode;
}

const COMMON_ICONS = [
  'Play', 'Download', 'FolderOpen', 'Terminal', 'Settings', 'Globe',
  'Database', 'Server', 'Monitor', 'Cpu', 'HardDrive', 'Wifi',
  'Film', 'Music', 'Image', 'FileText', 'Archive', 'Shield',
  'Lock', 'Key', 'Cloud', 'Smartphone', 'Tablet', 'Camera'
];

const IconSelector: React.FC<IconSelectorProps> = ({ currentIcon, onIconSelect, trigger }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filteredIcons = COMMON_ICONS.filter(iconName =>
    iconName.toLowerCase().includes(search.toLowerCase())
  );

  const handleIconSelect = (iconName: string) => {
    onIconSelect(iconName);
    setOpen(false);
  };

  const CurrentIcon = Icons[currentIcon as keyof typeof Icons] || Icons.Square;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <CurrentIcon size={16} className="mr-2" />
            Change Icon
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="glass-card max-w-md">
        <DialogHeader>
          <DialogTitle>Select Icon</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Search icons..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-background/50"
          />
          <div className="grid grid-cols-6 gap-2 max-h-64 overflow-y-auto">
            {filteredIcons.map((iconName) => {
              const IconComponent = Icons[iconName as keyof typeof Icons];
              if (!IconComponent) return null;
              
              return (
                <button
                  key={iconName}
                  onClick={() => handleIconSelect(iconName)}
                  className={`p-3 rounded-md border transition-colors hover:bg-accent ${
                    currentIcon === iconName ? 'bg-accent border-accent-foreground' : 'border-border'
                  }`}
                  title={iconName}
                >
                  <IconComponent size={20} />
                </button>
              );
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default IconSelector;
