import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { UrlShortenerForm } from './components/UrlShortenerForm';
import { UrlResultCard } from './components/UrlResultCard';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { SystemDesignInfo } from './components/SystemDesignInfo';
import { Footer } from './components/Footer';
import type { UrlMapping } from './types/url';

export function App() {
  const [activeTab, setActiveTab] = useState<'shortener' | 'analytics' | 'architecture'>('shortener');
  const [shortenedUrls, setShortenedUrls] = useState<UrlMapping[]>([]);
  const [selectedShortCode, setSelectedShortCode] = useState<string>('b');

  useEffect(() => {
    const saved = localStorage.getItem('demo_url_mappings');
    if (saved) {
      try {
        setShortenedUrls(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved mappings:', e);
      }
    }
  }, []);

  const handleUrlShortened = (newMapping: UrlMapping) => {
    setShortenedUrls((prev) => [newMapping, ...prev]);
  };

  const handleViewAnalytics = (code: string) => {
    setSelectedShortCode(code);
    setActiveTab('analytics');
  };

  return (
    <div className="min-h-screen flex flex-col justify-between text-slate-100 font-sans selection:bg-purple-500 selection:text-white">
      <div>
        <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="pb-16">
          {activeTab === 'shortener' && (
            <>
              <UrlShortenerForm onUrlShortened={handleUrlShortened} />

              {/* Render Recently Shortened URLs */}
              {shortenedUrls.length > 0 && (
                <div className="max-w-4xl mx-auto px-4 mt-8">
                  <h3 className="text-xl font-bold font-outfit text-white mb-4 flex items-center justify-between">
                    <span>Recent Shortened Links</span>
                    <span className="text-xs text-purple-400 font-mono font-normal">
                      {shortenedUrls.length} links generated
                    </span>
                  </h3>

                  <div className="space-y-4">
                    {shortenedUrls.map((mapping, idx) => (
                      <UrlResultCard
                        key={mapping.shortCode + idx}
                        mapping={mapping}
                        onViewAnalytics={handleViewAnalytics}
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {activeTab === 'analytics' && (
            <AnalyticsDashboard initialShortCode={selectedShortCode} />
          )}

          {activeTab === 'architecture' && <SystemDesignInfo />}
        </main>
      </div>

      <Footer />
    </div>
  );
}

export default App;
