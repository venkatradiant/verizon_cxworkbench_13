import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router';
import '@/styles/index.css';
import "slick-carousel/slick/slick.css";
import "@/styles/slick-theme-local.css";
import { Header } from '@/app/components/Header';
import { Sidebar } from '@/app/components/Sidebar';
import { ChatBot } from '@/app/components/ChatBot';
import { AIPanel } from '@/app/components/AIPanel';
import { PasswordGate } from '@/app/components/PasswordGate';
import { ThemeProvider } from '@/app/context/ThemeContext';
import { ChatProvider, useChat } from '@/app/context/ChatContext';

// Pages
import { PlaygroundLanding } from '@/app/pages/PlaygroundLanding';
import { ActiveJourneys } from '@/app/pages/ActiveJourneys';
import { JourneyOverview } from '@/app/pages/JourneyOverview';
import { DeveloperArtifacts } from '@/app/pages/DeveloperArtifacts';
import { DeveloperPackage } from '@/app/pages/DeveloperPackage';
import { JourneyValidation } from '@/app/pages/JourneyValidation';
import { TagManager } from '@/app/pages/TagManager';
import { JiraContextEnrichment } from '@/app/pages/JiraContextEnrichment';

import { Toaster } from 'sonner';
import { PageLoader } from '@/app/components/PageLoader';

const AppContent = () => {
  const { isPanelOpen, dockMode } = useChat();
  
  return (
    <PasswordGate>
      <div className="flex h-screen bg-background text-foreground font-inter antialiased overflow-hidden transition-colors duration-300">
        <Toaster position="top-center" expand={false} richColors closeButton />
        <Sidebar />
        <div className={`flex-1 flex ${dockMode === 'left' ? 'flex-row-reverse' : 'flex-row'} min-w-0 h-full relative overflow-hidden`}>
          <div className="flex-1 flex flex-col min-w-0 h-full relative">
            <Header />
            <main id="main-content" className="flex-1 overflow-y-auto relative">
              <PageLoader>
                <Routes>
                  <Route path="/" element={<Navigate to="/playground" replace />} />
                  <Route path="/playground" element={<PlaygroundLanding />} />
                  <Route path="/journeys" element={<ActiveJourneys />} />
                  <Route path="/tag-manager" element={<TagManager />} />
                  
                  {/* Journey Routes */}
                  <Route path="/playground/journey/:journeyId/overview" element={<JourneyOverview />} />
                  <Route path="/playground/journey/:journeyId/tagging" element={<Navigate to="../overview" relative="path" replace />} />
                  <Route path="/playground/journey/:journeyId/recommendations" element={<Navigate to="../overview" relative="path" replace />} />
                  
                  <Route path="/playground/journey/:journeyId/artifacts" element={<DeveloperArtifacts />} />
                  <Route path="/playground/journey/:journeyId/package" element={<DeveloperPackage />} />
                  <Route path="/playground/journey/:journeyId/validation" element={<JourneyValidation />} />
                  
                  {/* Jira Routes */}
                  <Route path="/jira/:ticketId/enrich" element={<JiraContextEnrichment />} />
                  
                  {/* Other Routes */}
                  <Route path="/playground/developer-artifacts" element={<DeveloperArtifacts />} />
                  <Route path="/playground/developer-package" element={<DeveloperPackage />} />
                  <Route path="/playground/jira-context-enrichment" element={<JiraContextEnrichment />} />
                  
                  {/* Legacy/Redirects */}
                  <Route path="/dashboard" element={<Navigate to="/playground" replace />} />
                  <Route path="/history" element={<Navigate to="/journeys" replace />} />
                </Routes>
              </PageLoader>
            </main>
            <ChatBot />
          </div>
          <AIPanel />
        </div>
      </div>
    </PasswordGate>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <Router>
        <ChatProvider>
          <AppContent />
        </ChatProvider>
      </Router>
    </ThemeProvider>
  );
};

export default App;