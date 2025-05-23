
import React, { useState, useEffect } from 'react';
import { Cpu, Clock, PowerOff, Monitor } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

const StatusBar = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [cpuUsage, setCpuUsage] = useState(Math.floor(Math.random() * 60) + 10);
  const [ramUsage, setRamUsage] = useState(Math.floor(Math.random() * 50) + 20);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      // In a real scenario, we would fetch real CPU and RAM usage data
      setCpuUsage((prev) => {
        const newValue = prev + (Math.random() * 10 - 5);
        return Math.min(Math.max(newValue, 5), 95);
      });
      setRamUsage((prev) => {
        const newValue = prev + (Math.random() * 8 - 4);
        return Math.min(Math.max(newValue, 10), 90);
      });
    }, 1000);
    
    return () => clearInterval(timer);
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
  
  return (
    <div className="h-12 px-4 py-2 flex items-center justify-between border-b border-border/40 bg-black/30 backdrop-blur-md">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1 text-xs">
          <Cpu size={14} className="text-accent animate-pulse-slow" />
          <span>{cpuUsage.toFixed(1)}% </span>
        </div>
        <div className="flex items-center gap-1 text-xs">
          <Monitor size={14} className="text-accent animate-pulse-slow" />
          <span>{ramUsage.toFixed(1)}% </span>
        </div>
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
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Log out</DropdownMenuItem>
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
