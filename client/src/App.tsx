import React, { Component, ReactNode, Suspense, lazy } from 'react';
import { Router, Route, Switch } from 'wouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { SkipToContent } from './components/common/SkipToContent';
import { CommandPalette } from './components/common/CommandPalette';
import { DemoTour } from './components/common/DemoTour';

// Lazy-loaded pages
const HomePage = lazy(() => import('./pages/HomePage'));
const ExplorePage = lazy(() => import('./pages/ExplorePage'));
const SearchPage = lazy(() => import('./pages/SearchPage'));
const DatasetsPage = lazy(() => import('./pages/DatasetsPage'));
const DatasetDetailPage = lazy(() => import('./pages/DatasetDetailPage'));
const ExpeditionsPage = lazy(() => import('./pages/ExpeditionsPage'));
const ExpeditionDetailPage = lazy(() => import('./pages/ExpeditionDetailPage'));
const PublicationsPage = lazy(() => import('./pages/PublicationsPage'));
const PublicationDetailPage = lazy(() => import('./pages/PublicationDetailPage'));
const StationsPage = lazy(() => import('./pages/StationsPage'));
const AtlasPage = lazy(() => import('./pages/AtlasPage'));
const MediaArchivePage = lazy(() => import('./pages/MediaArchivePage'));
const ActivitiesPage = lazy(() => import('./pages/ActivitiesPage'));
const KnowledgeGraphPage = lazy(() => import('./pages/KnowledgeGraphPage'));
const StoriesPage = lazy(() => import('./pages/StoriesPage'));
const StoryDetailPage = lazy(() => import('./pages/StoryDetailPage'));
const LearnPage = lazy(() => import('./pages/LearnPage'));
const AskOruviaPage = lazy(() => import('./pages/AskOruviaPage'));

// Studio pages
const StudioPage = lazy(() => import('./pages/studio/StudioPage'));
const StudioUploadPage = lazy(() => import('./pages/studio/StudioUploadPage'));
const StudioDraftPage = lazy(() => import('./pages/studio/StudioDraftPage'));

// Auth pages
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage'));

// Error pages
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = { hasError: false };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#F4F2EC] p-6">
          <div className="max-w-md w-full bg-white border border-[#D8D4C8] rounded-xl p-6 shadow-sm text-center">
            <h1 className="font-serif text-2xl text-[#0D1211] mb-2">Something went wrong</h1>
            <p className="text-sm text-[#747A75] mb-4">
              {this.state.error?.message || 'An unexpected error occurred while rendering this page.'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-[#0D1211] text-[#B7FF5A] font-medium rounded-lg text-sm hover:bg-[#1a2220] transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#F4F2EC]">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-2 border-[#0D1211] border-t-[#B7FF5A] rounded-full animate-spin" />
      <span className="font-mono text-sm text-[#747A75] tracking-widest uppercase">Loading</span>
    </div>
  </div>
);

function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <SkipToContent />
      <Navbar />
      <CommandPalette />
      <main id="main-content" className="flex-1">
        <Suspense fallback={<PageLoader />}>
          {children}
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

function StudioShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#F4F2EC]">
      <SkipToContent />
      <Navbar />
      <main id="main-content" className="flex-1">
        <Suspense fallback={<PageLoader />}>
          {children}
        </Suspense>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Switch>
            {/* Auth routes - no shell */}
            <Route path="/login">
              <Suspense fallback={<PageLoader />}><LoginPage /></Suspense>
            </Route>
            <Route path="/register">
              <Suspense fallback={<PageLoader />}><RegisterPage /></Suspense>
            </Route>

            {/* Studio routes */}
            <Route path="/studio/upload">
              <StudioShell><StudioUploadPage /></StudioShell>
            </Route>
            <Route path="/studio/drafts/:id">
              {(params) => (
                <StudioShell><StudioDraftPage draftId={params.id} /></StudioShell>
              )}
            </Route>
            <Route path="/studio">
              <StudioShell><StudioPage /></StudioShell>
            </Route>

            {/* Public routes with full shell */}
            <Route path="/explore">
              <AppShell><ExplorePage /></AppShell>
            </Route>
            <Route path="/search">
              <AppShell><SearchPage /></AppShell>
            </Route>
            <Route path="/datasets/:slug">
              <AppShell><DatasetDetailPage /></AppShell>
            </Route>
            <Route path="/datasets">
              <AppShell><DatasetsPage /></AppShell>
            </Route>
            <Route path="/expeditions/:slug">
              <AppShell><ExpeditionDetailPage /></AppShell>
            </Route>
            <Route path="/expeditions">
              <AppShell><ExpeditionsPage /></AppShell>
            </Route>
            <Route path="/publications/:slug">
              <AppShell><PublicationDetailPage /></AppShell>
            </Route>
            <Route path="/publications">
              <AppShell><PublicationsPage /></AppShell>
            </Route>
            <Route path="/stations">
              <AppShell><StationsPage /></AppShell>
            </Route>
            <Route path="/atlas">
              <AppShell><AtlasPage /></AppShell>
            </Route>
            <Route path="/media">
              <Suspense fallback={<PageLoader />}><MediaArchivePage /></Suspense>
            </Route>
            <Route path="/activities">
              <AppShell><ActivitiesPage /></AppShell>
            </Route>
            <Route path="/knowledge-graph">
              <AppShell><KnowledgeGraphPage /></AppShell>
            </Route>
            <Route path="/stories/:slug">
              <AppShell><StoryDetailPage /></AppShell>
            </Route>
            <Route path="/stories">
              <AppShell><StoriesPage /></AppShell>
            </Route>
            <Route path="/learn">
              <AppShell><LearnPage /></AppShell>
            </Route>
            <Route path="/ask">
              <AppShell><AskOruviaPage /></AppShell>
            </Route>
            <Route path="/">
              <AppShell><HomePage /></AppShell>
            </Route>
            <Route>
              <AppShell><NotFoundPage /></AppShell>
            </Route>
          </Switch>
        </Router>
        <DemoTour />
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
