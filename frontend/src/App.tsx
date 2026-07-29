import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { UrlShortenerForm } from './components/UrlShortenerForm';
import { UrlResultCard } from './components/UrlResultCard';
import { UrlHistoryList } from './components/UrlHistoryList';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { SystemDesignInfo } from './components/SystemDesignInfo';
import { Footer } from './components/Footer';
import { historyService } from './services/historyService';
import type { UrlMapping } from './types/url';

export function App() {
  const [activeTab, setActiveTab] = useState<'shortener' | 'analytics' | 'architecture'>('shortener');
  const [history, setHistory] = useState<UrlMapping[]>([]);
  const [latestMapping, setLatestMapping] = useState<UrlMapping | null>(null);
  const [selectedShortCode, setSelectedShortCode] = useState<string>('b');

  const [formInitialUrl, setFormInitialUrl] = useState<string>('');
  const [formInitialAlias, setFormInitialAlias] = useState<string>('');

  useEffect(() => {
    const saved = historyService.getHistory();
    setHistory(saved);
  }, []);

  const handleUrlShortened = (newMapping: UrlMapping) => {
    const updated = historyService.addMapping(newMapping);
    setHistory(updated);
    setLatestMapping(newMapping);

    // Smooth scroll viewport down to the generated URL result card
    setTimeout(() => {
      const resultElement = document.getElementById('result-card');
      if (resultElement) {
        resultElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  const handleRemoveItem = (shortCode: string) => {
    const updated = historyService.removeMapping(shortCode);
    setHistory(updated);
    if (latestMapping?.shortCode === shortCode) {
      setLatestMapping(null);
    }
  };

  const handleClearAll = () => {
    historyService.clearHistory();
    setHistory([]);
    setLatestMapping(null);
  };

  const handleReuseAlias = (mapping: UrlMapping) => {
    setFormInitialUrl(mapping.originalUrl);
    setFormInitialAlias(mapping.shortCode);
    // Smooth scroll to top form
    const formElement = document.getElementById('shortener-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
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
              <UrlShortenerForm
                onUrlShortened={handleUrlShortened}
                initialUrl={formInitialUrl}
                initialAlias={formInitialAlias}
              />

              {/* Render Latest Shortened Result Card */}
              {latestMapping && (
                <UrlResultCard
                  mapping={latestMapping}
                  onViewAnalytics={handleViewAnalytics}
                />
              )}

              {/* Render Local History & Custom Aliases Cache List */}
              <UrlHistoryList
                history={history}
                onRemoveItem={handleRemoveItem}
                onClearAll={handleClearAll}
                onReuseAlias={handleReuseAlias}
                onViewAnalytics={handleViewAnalytics}
              />
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
