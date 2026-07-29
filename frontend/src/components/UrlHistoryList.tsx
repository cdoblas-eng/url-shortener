import React, { useState } from 'react';
import { Search, Trash2, Copy, Check, Share2, RefreshCw, BarChart2, Tag, ExternalLink, Clock, AlertTriangle } from 'lucide-react';
import { deleteUrlApi } from '../services/api';
import type { UrlMapping } from '../types/url';

interface UrlHistoryListProps {
  history: UrlMapping[];
  onRemoveItem: (shortCode: string) => void;
  onClearAll: () => void;
  onReuseAlias: (mapping: UrlMapping) => void;
  onViewAnalytics: (shortCode: string) => void;
}

export const UrlHistoryList: React.FC<UrlHistoryListProps> = ({
  history,
  onRemoveItem,
  onClearAll,
  onReuseAlias,
  onViewAnalytics,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [sharedCode, setSharedCode] = useState<string | null>(null);
  const [deletingCode, setDeletingCode] = useState<string | null>(null);

  const filteredHistory = history.filter((item) => {
    const term = searchTerm.toLowerCase().trim();
    return (
      item.shortCode.toLowerCase().includes(term) ||
      item.originalUrl.toLowerCase().includes(term)
    );
  });

  const getFullShortUrl = (shortCode: string) => {
    return `${window.location.protocol}//${window.location.host}/${shortCode}`;
  };

  const handleCopy = (shortCode: string) => {
    const url = getFullShortUrl(shortCode);
    navigator.clipboard.writeText(url);
    setCopiedCode(shortCode);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleShare = async (shortCode: string) => {
    const url = getFullShortUrl(shortCode);
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'NanoLink Short URL',
          text: `Check out this short link: ${url}`,
          url,
        });
        setSharedCode(shortCode);
        setTimeout(() => setSharedCode(null), 2000);
      } catch (err) {
        console.log('Share dismissed:', err);
      }
    } else {
      handleCopy(shortCode);
    }
  };

  const handleDeleteItem = async (shortCode: string) => {
    setDeletingCode(shortCode);
    try {
      // Call backend DELETE endpoint to free shortCode in DB and Redis
      await deleteUrlApi(shortCode);
    } catch (err) {
      console.error('Failed to delete link from backend:', err);
    } finally {
      onRemoveItem(shortCode);
      setDeletingCode(null);
    }
  };

  if (history.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-4xl mx-auto my-10 px-4">
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800">
        
        {/* Header with Search and Clear */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-xl font-bold font-outfit text-white flex items-center gap-2">
              <span>Local URL Cache & History</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 font-mono">
                {history.length} links saved
              </span>
            </h3>
            <p className="text-slate-400 text-xs mt-1">
              Cached locally. Deleting a link releases its custom alias in the database for reuse.
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search history..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
              />
            </div>

            {/* Clear All Button */}
            <button
              onClick={onClearAll}
              className="px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-colors"
              title="Clear all history"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Clear All</span>
            </button>
          </div>
        </div>

        {/* History List */}
        {filteredHistory.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-sm">
            No matching shortened links found for "{searchTerm}".
          </div>
        ) : (
          <div className="space-y-3">
            {filteredHistory.map((item) => {
              const fullUrl = getFullShortUrl(item.shortCode);
              const isCopied = copiedCode === item.shortCode;
              const isShared = sharedCode === item.shortCode;
              const isDeleting = deletingCode === item.shortCode;

              const isExpired = item.expiresAt && new Date(item.expiresAt) <= new Date();

              return (
                <div
                  key={item.shortCode}
                  className={`p-4 rounded-2xl bg-slate-900/60 border transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                    isExpired
                      ? 'border-rose-500/30 bg-rose-500/5'
                      : 'border-slate-800/80 hover:border-purple-500/30'
                  }`}
                >
                  {/* Info Column */}
                  <div className="space-y-1 min-w-0 w-full md:w-auto flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono font-semibold text-purple-300 bg-purple-500/10 px-2.5 py-0.5 rounded-full border border-purple-500/20 flex items-center gap-1">
                        <Tag className="w-3 h-3 text-purple-400" />
                        <span>/{item.shortCode}</span>
                      </span>

                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </span>

                      {item.expiresAt && (
                        <span
                          className={`text-xs px-2 py-0.5 rounded-md font-mono flex items-center gap-1 border ${
                            isExpired
                              ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                              : 'bg-amber-500/10 text-amber-300 border-amber-500/20'
                          }`}
                        >
                          {isExpired ? <AlertTriangle className="w-3 h-3 text-rose-400" /> : <Clock className="w-3 h-3 text-amber-400" />}
                          <span>{isExpired ? 'Expired' : `Expires: ${new Date(item.expiresAt).toLocaleDateString()}`}</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={fullUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-base font-bold font-mono text-purple-200 hover:text-white truncate flex items-center gap-1.5 max-w-full"
                      >
                        <span className="truncate">{fullUrl}</span>
                        <ExternalLink className="w-3.5 h-3.5 flex-shrink-0 text-purple-400" />
                      </a>
                    </div>

                    <p className="text-slate-400 text-xs truncate max-w-md">
                      <span className="text-slate-500">Destination:</span> {item.originalUrl}
                    </p>
                  </div>

                  {/* Actions Column */}
                  <div className="grid grid-cols-4 sm:flex items-center gap-1.5 w-full md:w-auto">
                    
                    {/* Copy Button */}
                    <button
                      onClick={() => handleCopy(item.shortCode)}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-all ${
                        isCopied
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                      }`}
                      title="Copy short link"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5 text-purple-400" />}
                      <span className="hidden sm:inline">{isCopied ? 'Copied' : 'Copy'}</span>
                    </button>

                    {/* Share Button */}
                    <button
                      onClick={() => handleShare(item.shortCode)}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-all ${
                        isShared
                          ? 'bg-purple-600 text-white'
                          : 'bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-slate-700'
                      }`}
                      title="Share link"
                    >
                      <Share2 className="w-3.5 h-3.5 text-indigo-400" />
                      <span className="hidden sm:inline">{isShared ? 'Shared' : 'Share'}</span>
                    </button>

                    {/* Reuse Alias Button */}
                    <button
                      onClick={() => onReuseAlias(item)}
                      className="px-3 py-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/20 text-xs font-semibold flex items-center justify-center gap-1 transition-all"
                      title="Reuse this alias in the shortener form"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-purple-400" />
                      <span className="hidden sm:inline">Reuse</span>
                    </button>

                    {/* Stats Button */}
                    <button
                      onClick={() => onViewAnalytics(item.shortCode)}
                      className="px-3 py-2 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 text-xs font-semibold flex items-center justify-center gap-1 transition-all"
                      title="View live analytics"
                    >
                      <BarChart2 className="w-3.5 h-3.5 text-indigo-400" />
                      <span className="hidden sm:inline">Stats</span>
                    </button>

                    {/* Delete & Release Alias Button */}
                    <button
                      onClick={() => handleDeleteItem(item.shortCode)}
                      disabled={isDeleting}
                      className="px-2.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-semibold flex items-center justify-center transition-colors disabled:opacity-50"
                      title="Delete link and release custom alias in database"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
