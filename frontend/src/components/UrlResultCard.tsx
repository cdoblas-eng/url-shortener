import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, Check, ExternalLink, QrCode, Download, BarChart2, Share2 } from 'lucide-react';
import type { UrlMapping } from '../types/url';

interface UrlResultCardProps {
  mapping: UrlMapping;
  onViewAnalytics: (shortCode: string) => void;
}

export const UrlResultCard: React.FC<UrlResultCardProps> = ({ mapping, onViewAnalytics }) => {
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);
  const [showQr, setShowQr] = useState(false);

  // Constructs full short URL (or uses host window origin)
  const fullShortUrl = `${window.location.protocol}//${window.location.host}/${mapping.shortCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullShortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'NanoLink Short URL',
          text: `Here is your shortened link: ${fullShortUrl}`,
          url: fullShortUrl,
        });
        setShared(true);
        setTimeout(() => setShared(false), 2000);
      } catch (err) {
        console.log('Share dismissed:', err);
      }
    } else {
      // Fallback: Copy to clipboard if Web Share API is unavailable
      handleCopy();
    }
  };

  const downloadQrCode = () => {
    const svg = document.getElementById(`qr-code-${mapping.shortCode}`);
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `qr-${mapping.shortCode}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  return (
    <div className="w-full max-w-4xl mx-auto mb-10 px-4">
      <div className="glass-card glass-card-hover rounded-3xl p-5 sm:p-8 border border-purple-500/30 relative">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          
          {/* Main Info */}
          <div className="space-y-2 flex-1 min-w-0 w-full">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                Created & Cached in Redis
              </span>
              <span className="text-xs text-slate-500 font-mono">ID: #{mapping.id || 'N/A'}</span>
            </div>

            <div className="flex items-center gap-3 w-full overflow-hidden">
              <a
                href={fullShortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xl sm:text-2xl font-bold font-mono text-purple-300 hover:text-purple-200 transition-colors flex items-center gap-2 truncate max-w-full"
              >
                <span className="truncate">{fullShortUrl}</span>
                <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 text-purple-400" />
              </a>
            </div>

            <p className="text-slate-400 text-xs sm:text-sm truncate max-w-full">
              <span className="text-slate-500">Destination:</span> {mapping.originalUrl}
            </p>
          </div>

          {/* Action Buttons Grid on Mobile */}
          <div className="grid grid-cols-2 sm:flex items-center gap-2.5 w-full lg:w-auto">
            
            {/* Share Button */}
            <button
              onClick={handleShare}
              className={`px-4 py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all ${
                shared
                  ? 'bg-purple-600 text-white'
                  : 'bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30'
              }`}
              title="Share short URL"
            >
              <Share2 className="w-4 h-4 text-indigo-400" />
              <span>{shared ? 'Shared!' : 'Share'}</span>
            </button>

            {/* Copy Button */}
            <button
              onClick={handleCopy}
              className={`px-4 py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all duration-200 ${
                copied
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-purple-400" />
                  <span>Copy</span>
                </>
              )}
            </button>

            {/* QR Code Button */}
            <button
              onClick={() => setShowQr(!showQr)}
              className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-sm font-medium flex items-center justify-center gap-2 transition-all"
            >
              <QrCode className="w-4 h-4 text-indigo-400" />
              <span>QR Code</span>
            </button>

            {/* Stats Button */}
            <button
              onClick={() => onViewAnalytics(mapping.shortCode)}
              className="px-4 py-3 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-sm font-medium flex items-center justify-center gap-2 transition-all"
            >
              <BarChart2 className="w-4 h-4 text-purple-400" />
              <span>Stats</span>
            </button>

          </div>
        </div>

        {/* QR Code Expandable Modal / Drawer */}
        {showQr && (
          <div className="mt-6 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center gap-6 bg-slate-900/60 p-6 rounded-2xl">
            <div className="bg-white p-4 rounded-xl shadow-lg flex-shrink-0">
              <QRCodeSVG
                id={`qr-code-${mapping.shortCode}`}
                value={fullShortUrl}
                size={140}
                level="H"
                includeMargin={false}
              />
            </div>
            <div className="space-y-3 text-center sm:text-left">
              <h4 className="text-white font-semibold font-outfit text-base">Client-Side Rendered QR Code</h4>
              <p className="text-slate-400 text-xs max-w-md">
                Generated dynamically in the browser using SVG rendering. No server-side CPU or network overhead required.
              </p>
              <button
                onClick={downloadQrCode}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 transition-colors mx-auto sm:mx-0"
              >
                <Download className="w-4 h-4" />
                <span>Download PNG</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
