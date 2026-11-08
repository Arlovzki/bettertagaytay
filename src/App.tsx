import { NuqsAdapter } from 'nuqs/adapters/react';
import { HelmetProvider } from 'react-helmet-async';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import ScrollToTop from './components/ui/ScrollToTop';
import { lazy, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import PageErrorBoundary from './components/PageErrorBoundary';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const Services = lazy(() => import('./pages/Services'));
const Document = lazy(() => import('./pages/Document'));
const Government = lazy(() => import('./pages/Government'));
const TouristSpots = lazy(() => import('./pages/TouristSpots'));
const PublicDocuments = lazy(() => import('./pages/PublicDocuments'));
const SportsAndExercise = lazy(() => import('./pages/SportsAndExercise'));

function App() {
  const { t } = useTranslation('common');
  return (
    <HelmetProvider>
      <Router>
        <NuqsAdapter>
          <div className="min-h-screen flex flex-col">
            <a href="#main-content" className="skip-link">
              Skip to content
            </a>
            <Navbar />
            <ScrollToTop />
            <main id="main-content" tabIndex={-1} className="flex-1 min-w-0">
              <PageErrorBoundary
                message={t('page.error')}
                action={t('page.reload')}
              >
                <Suspense
                  fallback={
                    <div
                      role="status"
                      className="max-w-7xl mx-auto px-4 sm:px-6 py-12"
                    >
                      {t('page.loading')}
                    </div>
                  }
                >
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/services/:category" element={<Services />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/documents" element={<PublicDocuments />} />
                    <Route
                      path="/services/tourism/sports-and-exercise"
                      element={<SportsAndExercise />}
                    />
                    <Route
                      path="/services/tourism/explore-tourist-spots"
                      element={<TouristSpots />}
                    />
                    <Route
                      path="/services/:category/:documentSlug"
                      element={<Document categoryType="service" />}
                    />
                    <Route
                      path="/government/:category"
                      element={<Government />}
                    />
                    <Route path="/government" element={<Government />} />
                    <Route
                      path="/government/:category/:documentSlug"
                      element={<Document categoryType="government" />}
                    />
                    <Route path="/:lang/:documentSlug" element={<Document />} />
                    <Route path="/:documentSlug" element={<Document />} />
                    <Route path="*" element={<Document />} />
                  </Routes>
                </Suspense>
              </PageErrorBoundary>
            </main>
            <Footer />
          </div>
        </NuqsAdapter>
      </Router>
    </HelmetProvider>
  );
}

export default App;
