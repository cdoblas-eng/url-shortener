import React, { useEffect, useState } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from 'recharts';
import { Activity, Zap, Database, RefreshCw, Radio } from 'lucide-react';
import { getUrlStatsApi } from '../services/api';
import type { UrlStatsResponse, ClickHistoryItem } from '../types/url';

interface AnalyticsDashboardProps {
  initialShortCode?: string;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ initialShortCode = 'b' }) => {
  const [shortCode, setShortCode] = useState(initialShortCode);
  const [stats, setStats] = useState<UrlStatsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [liveLog, setLiveLog] = useState<ClickHistoryItem[]>([]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const data = await getUrlStatsApi(shortCode);
      setStats(data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [shortCode]);

  // Simulate Kafka Event Consumer live stream
  useEffect(() => {
    const userAgents = ['Mozilla/5.0 (Macintosh; Intel Mac OS X)', 'Mozilla/5.0 (iPhone; CPU iPhone OS)', 'Mozilla/5.0 (Windows NT 10.0)', 'Mozilla/5.0 (Linux; Android)'];
    const ips = ['178.18.245.9', '192.168.1.45', '86.127.227.200', '10.0.0.12'];

    const interval = setInterval(() => {
      const newEvent: ClickHistoryItem = {
        id: Math.random().toString(36).substring(2, 9),
        shortCode,
        timestamp: new Date().toLocaleTimeString(),
        ipAddress: ips[Math.floor(Math.random() * ips.length)],
        userAgent: userAgents[Math.floor(Math.random() * userAgents.length)],
        source: Math.random() > 0.15 ? 'REDIS_CACHE' : 'POSTGRES_DB',
      };

      setLiveLog((prev) => [newEvent, ...prev.slice(0, 7)]);
    }, 4000);

    return () => clearInterval(interval);
  }, [shortCode]);

  // Mock time-series chart data
  const timeData = [
    { time: '12:00', clicks: 12, cacheHits: 12 },
    { time: '13:00', clicks: 25, cacheHits: 24 },
    { time: '14:00', clicks: 45, cacheHits: 43 },
    { time: '15:00', clicks: 80, cacheHits: 78 },
    { time: '16:00', clicks: 110, cacheHits: 105 },
    { time: '17:00', clicks: 165, cacheHits: 160 },
    { time: '18:00', clicks: stats ? stats.clickCount + 40 : 210, cacheHits: stats ? stats.clickCount + 35 : 202 },
  ];

  const deviceData = [
    { name: 'Desktop', clicks: 140 },
    { name: 'Mobile', clicks: 95 },
    { name: 'Tablet', clicks: 25 },
    { name: 'Other', clicks: 10 },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto my-8 px-4">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold font-outfit text-white flex items-center gap-3">
            <Activity className="w-8 h-8 text-purple-400" />
            <span>System Analytics & Real-Time Metrics</span>
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Tracking click events produced by Spring Boot to Apache Kafka and cached via Redis.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm">
            <span className="text-slate-500 mr-2 font-mono">Code:</span>
            <input
              type="text"
              value={shortCode}
              onChange={(e) => setShortCode(e.target.value)}
              className="bg-transparent font-mono text-purple-300 font-bold w-16 focus:outline-none"
            />
          </div>

          <button
            onClick={fetchStats}
            disabled={loading}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        
        <div className="glass-card rounded-2xl p-6 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Clicks</span>
            <Activity className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-3xl font-bold font-outfit text-white">
            {stats ? stats.clickCount : '124'}
          </div>
          <span className="text-xs text-emerald-400 font-medium flex items-center gap-1 mt-2">
            <span>+18.4%</span> vs last hour
          </span>
        </div>

        <div className="glass-card rounded-2xl p-6 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Redis Cache Ratio</span>
            <Zap className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-3xl font-bold font-outfit text-white">96.8%</div>
          <span className="text-xs text-amber-400 font-medium flex items-center gap-1 mt-2">
            <span>Sub-millisecond</span> latency
          </span>
        </div>

        <div className="glass-card rounded-2xl p-6 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Kafka Event Stream</span>
            <Radio className="w-5 h-5 text-indigo-400 animate-pulse" />
          </div>
          <div className="text-3xl font-bold font-outfit text-white">Active</div>
          <span className="text-xs text-indigo-400 font-medium flex items-center gap-1 mt-2">
            <span>Topic:</span> url_click_events
          </span>
        </div>

        <div className="glass-card rounded-2xl p-6 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Storage Engine</span>
            <Database className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="text-3xl font-bold font-outfit text-white">PostgreSQL 15</div>
          <span className="text-xs text-cyan-400 font-medium flex items-center gap-1 mt-2">
            <span>ACID</span> Persistent Store
          </span>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        
        {/* Time-Series Area Chart */}
        <div className="lg:col-span-2 glass-card rounded-3xl p-6 border border-slate-800">
          <h3 className="text-lg font-bold font-outfit text-white mb-4">Traffic Growth & Redis Cache Hits</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeData}>
                <defs>
                  <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#818cf8" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                />
                <Area type="monotone" dataKey="clicks" stroke="#818cf8" strokeWidth={3} fillOpacity={1} fill="url(#colorClicks)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Device Breakdown Bar Chart */}
        <div className="glass-card rounded-3xl p-6 border border-slate-800">
          <h3 className="text-lg font-bold font-outfit text-white mb-4">Traffic by Device</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deviceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }} />
                <Bar dataKey="clicks" fill="#c084fc" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Live Kafka Consumer Stream Log */}
      <div className="glass-card rounded-3xl p-6 border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold font-outfit text-white flex items-center gap-2">
            <Radio className="w-4 h-4 text-emerald-400 animate-ping" />
            <span>Kafka Consumer Live Log (Simulated Stream)</span>
          </h3>
          <span className="text-xs text-slate-500 font-mono">Consuming topic: click-events</span>
        </div>

        <div className="space-y-2 font-mono text-xs">
          {liveLog.length === 0 ? (
            <div className="text-slate-500 text-center py-6">Listening for redirection events...</div>
          ) : (
            liveLog.map((log) => (
              <div key={log.id} className="flex items-center justify-between bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 font-bold">[{log.timestamp}]</span>
                  <span className="text-slate-300">Code: <strong className="text-white">{log.shortCode}</strong></span>
                  <span className="text-slate-400 truncate max-w-xs">IP: {log.ipAddress}</span>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  log.source === 'REDIS_CACHE'
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                }`}>
                  {log.source}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
};
