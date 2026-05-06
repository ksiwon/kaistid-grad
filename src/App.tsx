import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import styled from 'styled-components';
import { GlobalStyle } from './styles/GlobalStyle';
import { USE_MOCK } from './services/firebase';

// ── Dev badge (shown only in DEMO/dev mode) ───────────────────
const DevBadge = styled.div`
  position: fixed;
  bottom: 16px;
  right: 16px;
  background: #c8a882;
  color: #0a0a0a;
  font-family: 'DM Mono', monospace;
  font-size: 10px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 4px;
  z-index: 9999;
  pointer-events: none;
  opacity: 0.8;
  letter-spacing: 0.05em;
`;

// ── Page-level Suspense fallback ──────────────────────────────
const PageLoader: React.FC = () => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      background: '#0a0a0a',
      color: 'rgba(232,228,220,0.28)',
      fontFamily: "'DM Mono', monospace",
      fontSize: '11px',
      letterSpacing: '0.2em',
    }}
  >
    LOADING
  </div>
);

// ── Lazy pages (code-split) ───────────────────────────────────
const HomePage       = lazy(() => import('./pages/HomePage'));
const WorksPage      = lazy(() => import('./pages/WorksPage'));
const ArtistDetailPage = lazy(() => import('./pages/ArtistDetailPage'));
const QAPage         = lazy(() => import('./pages/QAPage'));
const StampPage      = lazy(() => import('./pages/StampPage'));
const StampScanPage  = lazy(() => import('./pages/StampScanPage'));
const AboutPage      = lazy(() => import('./pages/AboutPage'));
const AdminLoginPage = lazy(() => import('./pages/AdminLoginPage'));
const ArtistCMSPage  = lazy(() => import('./pages/ArtistCMSPage'));
const SuperAdminPage = lazy(() => import('./pages/SuperAdminPage'));
// GalleryPage has its own internal Suspense wrapping the Three.js scene
const GalleryPage    = lazy(() => import('./pages/GalleryPage'));

// styled-components theme (tokens are imported directly in components)
const theme = {};

const App: React.FC = () => (
  <ThemeProvider theme={theme}>
    <GlobalStyle />
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        {USE_MOCK && <DevBadge>DEMO</DevBadge>}
        <Routes>
          <Route path="/"              element={<HomePage />} />
          <Route path="/gallery"       element={<GalleryPage />} />
          <Route path="/works"         element={<WorksPage />} />
          <Route path="/works/:artistId" element={<ArtistDetailPage />} />
          <Route path="/qa"            element={<QAPage />} />
          <Route path="/stamp"         element={<StampPage />} />
          <Route path="/stamp/scan"    element={<StampScanPage />} />
          <Route path="/about"         element={<AboutPage />} />
          <Route path="/admin"         element={<AdminLoginPage />} />
          <Route path="/admin/super"   element={<SuperAdminPage />} />
          <Route path="/admin/:artistId" element={<ArtistCMSPage />} />
          {/* Catch-all */}
          <Route path="*"              element={<HomePage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  </ThemeProvider>
);

export default App;