import React, { createContext, useContext, useState, ReactNode } from 'react';

export type PanelDockMode = 'left' | 'right' | 'float';

interface ChatContextType {
  isPanelOpen: boolean;
  dockMode: PanelDockMode;
  togglePanel: () => void;
  openPanel: () => void;
  closePanel: () => void;
  setDockMode: (mode: PanelDockMode) => void;
  openPanelWithMessage: (message: string, context?: any) => void;
  contextData: any;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [dockMode, setDockMode] = useState<PanelDockMode>('right');
  const [contextData, setContextData] = useState<any>(null);

  const togglePanel = () => setIsPanelOpen(prev => !prev);
  const openPanel = () => setIsPanelOpen(true);
  const closePanel = () => setIsPanelOpen(false);
  
  const openPanelWithMessage = (message: string, context?: any) => {
    setContextData({ message, ...context });
    setIsPanelOpen(true);
  };

  return (
    <ChatContext.Provider value={{ 
      isPanelOpen, 
      dockMode, 
      togglePanel, 
      openPanel, 
      closePanel, 
      setDockMode,
      openPanelWithMessage,
      contextData
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};