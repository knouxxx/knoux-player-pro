/**
 * ================================================================================
 * KNOUX Player X
 * ================================================================================
 * Project: KNOUX Player X
 * File: C:\Users\Aisha\Downloads\knox-player-x\src\App.tsx
 * Role: Main Application Component with Cinematic Intelligence Routing
 * Layer: UI
 * Author: SADEK ELGAZAR (KNOUX)
 * Status: FINALIZED
 * ================================================================================
 * 
 * This component orchestrates the entire application UI with cinematic intelligence:
 * 
 * - Dynamic route-based view transitions
 * - Glassmorphism UI with neon interactions
 * - Real-time state synchronization
 * - Performance-optimized rendering
 * - Accessibility-compliant navigation
 * - Responsive layout management
 * - Theme-adaptive components
 * - Offline-capable architecture
 * - Security-hardened interfaces
 * - Internationalization support
 */

import React, { Suspense, lazy, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import clsx from 'clsx';

// Lazy-loaded views for performance optimization
const SplashView = lazy(() => import('./ui/views/SplashView/SplashScreen'));
const PlayerView = lazy(() => import('./ui/views/PlayerView/PlayerView'));
const LibraryView = lazy(() => import('./ui/views/LibraryView/LibraryView'));
const PlaylistView = lazy(() => import('./ui/views/PlaylistView/PlaylistView'));
const SettingsView = lazy(() => import('./ui/views/SettingsView/SettingsView'));
const DiagnosticsView = lazy(() => import('./ui/views/DiagnosticsView/DiagnosticsView'));
const MediaBrowserView = lazy(() => import('./ui/views/MediaBrowserView/MediaBrowserView'));

// Core UI components
import MainWindow from './ui/layouts/MainWindow';
import LoadingSpinner from './ui/components/shared/LoadingSpinner';
import ErrorBoundary from './ui/components/shared/ErrorBoundary';
import NotificationContainer from './ui/components/shared/NotificationContainer';

// State selectors
import { selectCurrentView, selectIsInitialized } from './state/selectors/appSelectors';
import { selectTheme } from './state/selectors/themeSelectors';
import { selectLocale } from './state/selectors/localizationSelectors';

// Actions
import { initializeApp } from './state/slices/appSlice';
import { loadUserPreferences } from './state/slices/settingsSlice';
import { useNetworkStatus } from './state/hooks/useNetworkStatus';

// Styles
import './styles/views/App.scss';
import './styles/transitions.scss';

// Performance monitoring
import { measureRender } from './utils/performance';

// Constants
const VIEW_TRANSITION_DURATION = 300;

// Main application component
const App: React.FC = () => {
  const dispatch = useDispatch();
  
  // State management
  const currentView = useSelector(selectCurrentView);
  const isInitialized = useSelector(selectIsInitialized);
  const theme = useSelector(selectTheme);
  const locale = useSelector(selectLocale);
  const [isLoading, setIsLoading] = useState(true);
  const [viewTransition, setViewTransition] = useState(false);
  useNetworkStatus();
  
  // Performance monitoring
  const renderStart = performance.now();
  
  // Initialize application
  useEffect(() => {
    const initApp = async () => {
      try {
        console.info('Initializing application...');
        
        // Load user preferences
        await dispatch(loadUserPreferences() as any).unwrap();
        
        // Initialize core systems
        await dispatch(initializeApp() as any).unwrap();
        
        setIsLoading(false);
        console.info('Application initialized successfully');
      } catch (error) {
        console.error('Failed to initialize application:', error);
        setIsLoading(false);
      }
    };
    
    initApp();
  }, [dispatch]);
  
  // View transition handling
  useEffect(() => {
    setViewTransition(true);
    const timer = setTimeout(() => {
      setViewTransition(false);
    }, VIEW_TRANSITION_DURATION);
    
    return () => clearTimeout(timer);
  }, [currentView]);
  
  // Performance measurement
  useEffect(() => {
    const renderTime = performance.now() - renderStart;
    measureRender('App', renderTime);
  });
  
  // Theme and locale application
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme.name);
    document.documentElement.setAttribute('lang', locale);
  }, [theme.name, locale]);
  
  // Render loading state
  if (isLoading || !isInitialized) {
    return (
      <div className="app-loading">
        <LoadingSpinner size="large" />
        <div className="app-loading-text">Initializing KNOUX Player X</div>
      </div>
    );
  }
  
  // Main application render
  return (
    <ErrorBoundary>
      <div 
        className={clsx(
          'app-container',
          `theme-${theme.name}`,
          `locale-${locale}`,
          {
            'view-transition': viewTransition,
            'glassmorphism': theme.glassmorphism,
            'neon-enabled': theme.neonEffects
          }
        )}
      >
        <MainWindow>
          <Suspense fallback={<LoadingSpinner size="medium" />}>
            {currentView === 'splash' && <SplashView />}
            {currentView === 'player' && <PlayerView />}
            {currentView === 'library' && <LibraryView />}
            {currentView === 'playlists' && <PlaylistView />}
            {currentView === 'browser' && <MediaBrowserView />}
            {currentView === 'settings' && <SettingsView />}
            {currentView === 'diagnostics' && <DiagnosticsView />}
            {!['splash', 'player', 'library', 'playlists', 'browser', 'settings', 'diagnostics'].includes(currentView) && (
              <PlayerView />
            )}
          </Suspense>
        </MainWindow>
        
        {/* Global notification system */}
        <NotificationContainer />
        
        {/* Performance overlay (development only) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="perf-overlay">
            <div>Current View: {currentView}</div>
            <div>Theme: {theme.name}</div>
            <div>Locale: {locale}</div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default App;
