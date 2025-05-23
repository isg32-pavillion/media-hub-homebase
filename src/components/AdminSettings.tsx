
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Settings } from 'lucide-react';

interface AdminSettingsProps {
  onChangeBackground: (url: string) => void;
  currentBackground: string;
}

const AdminSettings: React.FC<AdminSettingsProps> = ({ onChangeBackground, currentBackground }) => {
  const [open, setOpen] = useState(false);
  const [backgroundUrl, setBackgroundUrl] = useState(currentBackground);
  const [newAppName, setNewAppName] = useState('');
  const [newAppUrl, setNewAppUrl] = useState('');
  const { toast } = useToast();

  const handleSaveBackground = () => {
    onChangeBackground(backgroundUrl);
    toast({
      title: "Background Updated",
      description: "The wallpaper has been updated successfully.",
    });
    setOpen(false);
  };

  const handleAddApp = () => {
    // This would save the new app to a database or config file
    toast({
      title: "App Added",
      description: `New app "${newAppName}" has been added.`,
    });
    setNewAppName('');
    setNewAppUrl('');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full">
          <Settings size={18} />
        </Button>
      </DialogTrigger>
      <DialogContent className="glass-card max-w-md">
        <DialogHeader>
          <DialogTitle>Admin Settings</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="background">Background Image URL</Label>
            <Input
              id="background"
              value={backgroundUrl}
              onChange={(e) => setBackgroundUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="bg-background/50"
            />
            <Button onClick={handleSaveBackground} className="w-full mt-2">
              Update Background
            </Button>
          </div>
          
          <div className="border-t border-border/40 pt-4 mt-2">
            <h3 className="text-sm font-medium mb-3">Add New App</h3>
            <div className="space-y-2">
              <Label htmlFor="appName">App Name</Label>
              <Input
                id="appName"
                value={newAppName}
                onChange={(e) => setNewAppName(e.target.value)}
                placeholder="App Name"
                className="bg-background/50"
              />
            </div>
            <div className="space-y-2 mt-2">
              <Label htmlFor="appUrl">App URL</Label>
              <Input
                id="appUrl"
                value={newAppUrl}
                onChange={(e) => setNewAppUrl(e.target.value)}
                placeholder="http://192.168.31.96:8091"
                className="bg-background/50"
              />
            </div>
            <Button onClick={handleAddApp} className="w-full mt-4">
              Add App
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdminSettings;
