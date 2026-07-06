import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import pages from './pages/pagesConfig';
import WhatsAppButton from './components/WhatsAppButton';

const appState = { token: 'dev-token', account: null, roleLevel: 3 };

export default function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="min-h-screen bg-light-background dark:bg-dark-background">
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-screen">
            <div className="flex flex-col items-center gap-4 animate-fade-in">
              <div className="w-8 h-8 rounded-full border-2 border-light-accent dark:border-dark-accent border-t-transparent animate-spin" />
              <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary font-medium">
                Cargando…
              </span>
            </div>
          </div>
        }>
          <Routes>
            {pages.map(({ path, component: Page }) => (
              <Route
                key={path}
                path={path}
                element={<Page appState={appState} />}
              />
            ))}
            <Route path="/" element={<Navigate to={pages[0]?.path ?? '/app/research/revision-narrativa'} replace />} />
            <Route path="*" element={<Navigate to={pages[0]?.path ?? '/app/research/revision-narrativa'} replace />} />
          </Routes>
        </Suspense>

        {/* WhatsApp flotante — siempre visible */}
        <WhatsAppButton />
      </div>
    </BrowserRouter>
  );
}
