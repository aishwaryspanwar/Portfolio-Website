import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import CircleTrail from './components/CircleTrail';
import PageShell from './components/PageShell';
import Home from './pages/Home';

// Work (GSAP) and Contact (Lottie) are loaded on demand to keep the first load small.
const Work = lazy(() => import('./pages/Work'));
const Contact = lazy(() => import('./pages/Contact'));
const NotFound = lazy(() => import('./pages/NotFound'));

const NAME = 'Aishwary Panwar';

function AppRoutes() {
  const location = useLocation();

  // Keying by location remounts the page shell on every navigation so the curtain replays.
  return (
    <Suspense fallback={null}>
      <Routes location={location} key={location.key}>
        <Route path="/" element={<PageShell label="Home" title={NAME}><Home /></PageShell>} />
        <Route path="/work" element={<PageShell label="Work" title={`Work — ${NAME}`}><Work /></PageShell>} />
        <Route path="/contact" element={<PageShell label="Contact" title={`Contact — ${NAME}`}><Contact /></PageShell>} />
        <Route path="*" element={<PageShell label="Lost" title={`Not found — ${NAME}`}><NotFound /></PageShell>} />
      </Routes>
    </Suspense>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <CircleTrail />
        <AppRoutes />
      </BrowserRouter>
    </ThemeProvider>
  );
}
