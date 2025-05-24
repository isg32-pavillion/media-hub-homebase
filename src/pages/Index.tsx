
import React from 'react';
import StatusBar from '@/components/StatusBar';
import HomePage from '@/components/HomePage';
import Login from '@/components/Login';
import AdminSettings from '@/components/AdminSettings';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { isAuthenticated, role } = useAuth();

  // If not authenticated, show login page
  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="flex justify-end items-center absolute top-3 right-4 z-10">
        {role === 'admin' && (
          <AdminSettings />
        )}
      </div>
      <StatusBar />
      <HomePage backgroundUrl="/wallpaper.jpg" />
    </div>
  );
};

export default Index;
