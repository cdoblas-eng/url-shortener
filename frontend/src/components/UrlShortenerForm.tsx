import React, { useState } from 'react';
import { ArrowRight, Link2, Sparkles, AlertCircle, ShieldCheck, Tag } from 'lucide-react';
import confetti from 'canvas-confetti';
import { shortenUrlApi } from '../services/api';
import type { UrlMapping } from '../types/url';

interface UrlShortenerFormProps {
  onUrlShortened: (mapping: UrlMapping) => void;
}

export const UrlShortenerForm: React.FC<UrlShortenerFormProps> = ({ onUrlShortened }) => {
  const [url, setUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedUrl = url.trim();
    if (!trimmedUrl) {
      setError('Please enter a URL to shorten.');
      return;
    }

    let urlToSubmit = trimmedUrl;
    if (!/^https?:\/\//i.test(urlToSubmit)) {
      urlToSubmit = `https://${urlToSubmit}`;
    }

    if (!isValidUrl(urlToSubmit)) {
      setError('Please enter a valid HTTP or HTTPS URL.');
      return;
    }

    if (customAlias.trim() && !/^[a-zA-Z0-9_-]{3,30}$/.test(customAlias.trim())) {
      setError('Custom alias must be 3-30 characters long and contain only letters, numbers, hyphens, or underscores.');
      return;
    }

    setIsLoading(true);

    try {
      const mapping = await shortenUrlApi(urlToSubmit, customAlias.trim());
      
      // Trigger Confetti effect on success
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#6366f1', '#a855f7', '#ec4899', '#3b82f6'],
      });

      onUrlShortened(mapping);
      setUrl('');
      setCustomAlias('');
    } catch (err: any) {
      setError(err?.message || 'An error occurred while shortening the URL. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-12 px-4">
      {/* Hero Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold uppercase tracking-wider mb-4">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span>High Performance • Event-Driven System Design</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-bold font-outfit text-white tracking-tight mb-4">
          Shorten Links with <span className="gradient-text">Sub-Millisecond</span> Latency
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
          Powered by Redis in-memory caching for instant redirection, PostgreSQL persistence, and Apache Kafka for asynchronous click analytics.
        </p>
      </div>

      {/* Main Form Card */}
      <div className="glass-card rounded-3xl p-6 sm:p-10 relative overflow-hidden border border-slate-800">
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        <form onSubmit={handleSubmit} className="relative z-10 space-y-4">
          
          {/* Main URL Input */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <Link2 className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Paste your long link here (e.g. https://github.com/cdoblas-eng/url-shortener)"
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-900/80 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 text-base transition-all duration-200"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl font-semibold text-white glow-button flex items-center justify-center gap-2 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Shortening...</span>
                </>
              ) : (
                <>
                  <span>Shorten URL</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>

          {/* Optional Custom Alias Input */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <div className="relative w-full sm:w-1/2">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <Tag className="w-4 h-4 text-purple-400" />
              </div>
              <input
                type="text"
                value={customAlias}
                onChange={(e) => setCustomAlias(e.target.value)}
                placeholder="Custom alias (optional, e.g. my-custom-alias)"
                className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-sm text-purple-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500/60 font-mono transition-all"
              />
            </div>

            {customAlias.trim() && (
              <div className="text-xs text-purple-400 font-mono flex items-center gap-1.5 px-3 py-2 rounded-xl bg-purple-500/10 border border-purple-500/20">
                <span>Preview:</span>
                <span className="font-bold text-white">url.doblas.dev/{customAlias.trim()}</span>
              </div>
            )}
          </div>

          {error && (
            <div className="mt-4 flex items-center gap-2 text-rose-400 text-sm bg-rose-500/10 border border-rose-500/20 px-4 py-3 rounded-xl">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </form>

        {/* Feature Pills */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-400 font-medium">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            <span>Custom Aliases & Base62</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span>
            <span>Redis Cache Read-Through</span>
          </div>
          <div className="flex items-center justify-center sm:justify-end gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
            <span>Kafka Analytics Producer</span>
          </div>
        </div>
      </div>
    </div>
  );
};
