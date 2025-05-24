
import React, { useState, useEffect } from 'react';
import { Clock, PowerOff } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useAuth } from '@/contexts/AuthContext';

const StatusBar = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { logout } = useAuth();
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => {
      clearInterval(timer);
    };
  }, []);
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handlePowerOff = () => {
    // This would be handled by the server to shut down the host computer
    alert("Power off command would be sent to server");
  };

  const handleLogout = () => {
    logout();
  };
  
  return (
    <div className="h-12 px-4 py-2 flex items-center justify-between border-b border-border/40 bg-black/30 backdrop-blur-md">
      <div className="flex items-center gap-4">
        {/* System stats removed */}
      </div>
      
      <div className="flex items-center gap-1 text-sm">
        <Clock size={14} className="text-accent" />
        <span>{formatTime(currentTime)}</span>
        <span className="text-xs text-muted-foreground ml-2">{formatDate(currentTime)}</span>
      </div>
      
      <div className="flex items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="h-7 w-7">
                <AvatarFallback className="bg-accent text-xs">AD</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40 bg-background border-border">
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full hover:bg-destructive/20 hover:text-destructive" 
          onClick={handlePowerOff}
        >
          <PowerOff size={18} />
        </Button>
      </div>
    </div>
  );
};

export default StatusBar;
