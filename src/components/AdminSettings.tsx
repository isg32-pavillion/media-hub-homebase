import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Settings, Plus, Trash2, Edit } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ImageUpload from './ImageUpload';
import IconSelector from './IconSelector';
import { appConfigService, AppConfig } from '@/services/appConfigService';
import { credentialsService } from '@/services/credentialsService';

interface AdminSettingsProps {
  onChangeBackground: (url: string) => void;
  currentBackground: string;
}

const AdminSettings: React.FC<AdminSettingsProps> = ({ onChangeBackground, currentBackground }) => {
  const [open, setOpen] = useState(false);
  const [apps, setApps] = useState<AppConfig[]>([]);
  const [editingApp, setEditingApp] = useState<AppConfig | null>(null);
  const [newAppName, setNewAppName] = useState('');
  const [newAppUrl, setNewAppUrl] = useState('');
  const [newAppIcon, setNewAppIcon] = useState('Square');
  
  // Credentials management
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState<'admin' | 'user'>('user');
  
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      setApps(appConfigService.getApps());
    }
  }, [open]);

  const handleAddApp = () => {
    if (!newAppName || !newAppUrl) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const newApp = appConfigService.addApp({
      name: newAppName,
      url: newAppUrl,
      iconName: newAppIcon
    });

    setApps(appConfigService.getApps());
    setNewAppName('');
    setNewAppUrl('');
    setNewAppIcon('Square');
    
    toast({
      title: "App Added",
      description: `${newApp.name} has been added successfully.`,
    });
  };

  const handleUpdateApp = (app: AppConfig) => {
    appConfigService.updateApp(app.id, {
      name: app.name,
      url: app.url,
      iconName: app.iconName
    });
    setApps(appConfigService.getApps());
    setEditingApp(null);
    
    toast({
      title: "App Updated",
      description: `${app.name} has been updated successfully.`,
    });
  };

  const handleDeleteApp = (id: string) => {
    appConfigService.removeApp(id);
    setApps(appConfigService.getApps());
    
    toast({
      title: "App Removed",
      description: "App has been removed successfully.",
    });
  };

  const handleAddUser = () => {
    if (!newUsername || !newPassword) {
      toast({
        title: "Error",
        description: "Please fill in username and password",
        variant: "destructive",
      });
      return;
    }

    credentialsService.updateCredentials(newUsername, newPassword, newRole);
    setNewUsername('');
    setNewPassword('');
    setNewRole('user');
    
    toast({
      title: "User Added",
      description: `User ${newUsername} has been added successfully.`,
    });
  };

  const handleImageUpload = (imageUrl: string) => {
    onChangeBackground(imageUrl);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full">
          <Settings size={18} />
        </Button>
      </DialogTrigger>
      <DialogContent className="glass-card max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Admin Settings</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="wallpaper" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="wallpaper">Wallpaper</TabsTrigger>
            <TabsTrigger value="apps">Apps</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>
          
          <TabsContent value="wallpaper" className="space-y-4">
            <div className="space-y-2">
              <Label>Upload Custom Wallpaper</Label>
              <ImageUpload 
                onImageSelect={handleImageUpload}
                currentImage={currentBackground}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="apps" className="space-y-4">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Manage Apps</h3>
              
              {/* Add new app */}
              <div className="border border-border/40 rounded-lg p-4 space-y-3">
                <h4 className="font-medium">Add New App</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="appName">App Name</Label>
                    <Input
                      id="appName"
                      value={newAppName}
                      onChange={(e) => setNewAppName(e.target.value)}
                      placeholder="App Name"
                      className="bg-background/50"
                    />
                  </div>
                  <div>
                    <Label htmlFor="appUrl">App URL</Label>
                    <Input
                      id="appUrl"
                      value={newAppUrl}
                      onChange={(e) => setNewAppUrl(e.target.value)}
                      placeholder="http://192.168.31.96:8091"
                      className="bg-background/50"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <IconSelector
                    currentIcon={newAppIcon}
                    onIconSelect={setNewAppIcon}
                  />
                  <Button onClick={handleAddApp} className="flex-1">
                    <Plus size={16} className="mr-2" />
                    Add App
                  </Button>
                </div>
              </div>
              
              {/* Existing apps */}
              <div className="space-y-2">
                {apps.map((app) => (
                  <div key={app.id} className="border border-border/40 rounded-lg p-3">
                    {editingApp?.id === app.id ? (
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <Input
                            value={editingApp.name}
                            onChange={(e) => setEditingApp({ ...editingApp, name: e.target.value })}
                            className="bg-background/50"
                          />
                          <Input
                            value={editingApp.url}
                            onChange={(e) => setEditingApp({ ...editingApp, url: e.target.value })}
                            className="bg-background/50"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <IconSelector
                            currentIcon={editingApp.iconName}
                            onIconSelect={(iconName) => setEditingApp({ ...editingApp, iconName })}
                          />
                          <Button size="sm" onClick={() => handleUpdateApp(editingApp)}>
                            Save
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setEditingApp(null)}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-medium">{app.name}</span>
                          <span className="text-sm text-muted-foreground ml-2">{app.url}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingApp(app)}
                          >
                            <Edit size={14} />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteApp(app.id)}
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="users" className="space-y-4">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">User Management</h3>
              
              <div className="border border-border/40 rounded-lg p-4 space-y-3">
                <h4 className="font-medium">Add/Update User</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      placeholder="Username"
                      className="bg-background/50"
                    />
                  </div>
                  <div>
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Password"
                      className="bg-background/50"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as 'admin' | 'user')}
                    className="px-3 py-2 border border-border rounded-md bg-background/50"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                  <Button onClick={handleAddUser} className="flex-1">
                    <Plus size={16} className="mr-2" />
                    Add/Update User
                  </Button>
                </div>
              </div>
              
              <div className="text-sm text-muted-foreground">
                <p>Current users:</p>
                {credentialsService.getAllUsers().map(user => (
                  <p key={user.username}>• {user.username} ({user.role})</p>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AdminSettings;
