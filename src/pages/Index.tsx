
import React, { useState, useEffect } from 'react';
import StatusBar from '@/components/StatusBar';
import HomePage from '@/components/HomePage';
import Login from '@/components/Login';
import AdminSettings from '@/components/AdminSettings';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { isAuthenticated, role } = useAuth();
  const [backgroundUrl, setBackgroundUrl] = useState('/bg-mountains.jpg');

  // Load background from localStorage if available
  useEffect(() => {
    const savedBackground = localStorage.getItem('backgroundUrl');
    if (savedBackground) {
      setBackgroundUrl(savedBackground);
    }
  }, []);

  const handleChangeBackground = (url: string) => {
    setBackgroundUrl(url);
    localStorage.setItem('backgroundUrl', url);
  };

  // If not authenticated, show login page
  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="flex justify-end items-center absolute top-3 right-4 z-10">
        {role === 'admin' && (
          <AdminSettings 
            onChangeBackground={handleChangeBackground}
            currentBackground={backgroundUrl}
          />
        )}
      </div>
      <StatusBar />
      <HomePage backgroundUrl={backgroundUrl} />
    </div>
  );
};

export default Index;
