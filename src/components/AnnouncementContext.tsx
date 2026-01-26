'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface AnnouncementContextType {
  isVisible: boolean;
  setIsVisible: (visible: boolean) => void;
}

const AnnouncementContext = createContext<AnnouncementContextType | undefined>(undefined);

export function AnnouncementProvider({ children }: { children: ReactNode }) {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <AnnouncementContext.Provider value={{ isVisible, setIsVisible }}>
      {children}
    </AnnouncementContext.Provider>
  );
}

export function useAnnouncement() {
  const context = useContext(AnnouncementContext);
  if (context === undefined) {
    throw new Error('useAnnouncement must be used within an AnnouncementProvider');
  }
  return context;
}
