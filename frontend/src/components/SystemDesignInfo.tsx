import React, { useState } from 'react';
import { Database, Zap, Radio, Layers, CheckCircle2 } from 'lucide-react';

export const SystemDesignInfo: React.FC = () => {
  const [selectedComponent, setSelectedComponent] = useState<'hexagonal' | 'redis' | 'kafka' | 'postgres'>('hexagonal');

  return (
    <div className="w-full max-w-6xl mx-auto my-8 px-4">
      
      {/* Header */}
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold font-outfit text-white mb-2">
          System Architecture & Engineering Highlights
        </h2>
        <p className="text-slate-400 text-sm max-w-2xl mx-auto">
          Explore how NanoLink combines Hexagonal Architecture in Java 21 with Redis, Kafka, and PostgreSQL for maximum scalability.
        </p>
      </div>

      {/* Component Selector Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <button
          onClick={() => setSelectedComponent('hexagonal')}
          className={`p-5 rounded-2xl border text-left transition-all ${
            selectedComponent === 'hexagonal'
              ? 'bg-purple-600/20 border-purple-500/50 shadow-lg shadow-purple-500/10'
              : 'glass-card border-slate-800 hover:border-slate-700'
          }`}
        >
          <Layers className="w-6 h-6 text-purple-400 mb-2" />
          <h4 className="text-white font-bold text-base font-outfit">Hexagonal Architecture</h4>
          <p className="text-slate-400 text-xs mt-1">Ports & Adapters in Java 21</p>
        </button>

        <button
          onClick={() => setSelectedComponent('redis')}
          className={`p-5 rounded-2xl border text-left transition-all ${
            selectedComponent === 'redis'
              ? 'bg-amber-600/20 border-amber-500/50 shadow-lg shadow-amber-500/10'
              : 'glass-card border-slate-800 hover:border-slate-700'
          }`}
        >
          <Zap className="w-6 h-6 text-amber-400 mb-2" />
          <h4 className="text-white font-bold text-base font-outfit">Redis Cache Layer</h4>
          <p className="text-slate-400 text-xs mt-1">Sub-millisecond lookups</p>
        </button>

        <button
          onClick={() => setSelectedComponent('kafka')}
          className={`p-5 rounded-2xl border text-left transition-all ${
            selectedComponent === 'kafka'
              ? 'bg-indigo-600/20 border-indigo-500/50 shadow-lg shadow-indigo-500/10'
              : 'glass-card border-slate-800 hover:border-slate-700'
          }`}
        >
          <Radio className="w-6 h-6 text-indigo-400 mb-2" />
          <h4 className="text-white font-bold text-base font-outfit">Kafka Event Stream</h4>
          <p className="text-slate-400 text-xs mt-1">Non-blocking click analytics</p>
        </button>

        <button
          onClick={() => setSelectedComponent('postgres')}
          className={`p-5 rounded-2xl border text-left transition-all ${
            selectedComponent === 'postgres'
              ? 'bg-cyan-600/20 border-cyan-500/50 shadow-lg shadow-cyan-500/10'
              : 'glass-card border-slate-800 hover:border-slate-700'
          }`}
        >
          <Database className="w-6 h-6 text-cyan-400 mb-2" />
          <h4 className="text-white font-bold text-base font-outfit">PostgreSQL Store</h4>
          <p className="text-slate-400 text-xs mt-1">Persistent & Base62 Indexed</p>
        </button>
      </div>

      {/* Detail Showcase Container */}
      <div className="glass-card rounded-3xl p-8 border border-slate-800">
        
        {selectedComponent === 'hexagonal' && (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Layers className="w-8 h-8 text-purple-400" />
              <div>
                <h3 className="text-2xl font-bold font-outfit text-white">Hexagonal Architecture (Ports & Adapters)</h3>
                <p className="text-slate-400 text-sm">Decoupling business logic from Spring Boot frameworks and external databases.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
              <div className="bg-slate-900/90 p-5 rounded-2xl border border-purple-500/20">
                <span className="text-xs font-bold uppercase text-purple-400 font-mono">Domain Layer</span>
                <h4 className="text-white font-bold mt-1">Pure Java Domain Model</h4>
                <p className="text-slate-400 text-xs mt-2">
                  Zero framework dependencies. Contains Base62 encoding logic, ShortUrl aggregate, and domain rules.
                </p>
              </div>

              <div className="bg-slate-900/90 p-5 rounded-2xl border border-indigo-500/20">
                <span className="text-xs font-bold uppercase text-indigo-400 font-mono">Application Layer</span>
                <h4 className="text-white font-bold mt-1">Ports & Use Cases</h4>
                <p className="text-slate-400 text-xs mt-2">
                  Input Ports (ShortenUrlUseCase) and Output Ports (UrlRepositoryPort, CachePort, EventPublisherPort).
                </p>
              </div>

              <div className="bg-slate-900/90 p-5 rounded-2xl border border-cyan-500/20">
                <span className="text-xs font-bold uppercase text-cyan-400 font-mono">Infrastructure Layer</span>
                <h4 className="text-white font-bold mt-1">Adapters</h4>
                <p className="text-slate-400 text-xs mt-2">
                  Spring Web Controllers, JPA Repositories, Redis Spring Cache, and Kafka Event Publishers.
                </p>
              </div>
            </div>
          </div>
        )}

        {selectedComponent === 'redis' && (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Zap className="w-8 h-8 text-amber-400" />
              <div>
                <h3 className="text-2xl font-bold font-outfit text-white">Redis Multi-Level Caching</h3>
                <p className="text-slate-400 text-sm">Achieving ultra-fast HTTP 302 redirects by bypassing disk I/O.</p>
              </div>
            </div>

            <div className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 font-mono text-sm space-y-3">
              <div className="flex items-center gap-2 text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>1. Request GET /{`{shortCode}`} received</span>
              </div>
              <div className="flex items-center gap-2 text-amber-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>2. Check Redis Cache: Key `url:short:{`{shortCode}`}`</span>
              </div>
              <div className="flex items-center gap-2 text-indigo-400 pl-6 border-l-2 border-indigo-500/30">
                <span>⚡ HIT: Return 302 Found immediately (~0.8ms)</span>
              </div>
              <div className="flex items-center gap-2 text-cyan-400 pl-6 border-l-2 border-cyan-500/30">
                <span>🐢 MISS: Query PostgreSQL DB -&gt; Populate Redis -&gt; Return 302 (~12ms)</span>
              </div>
            </div>
          </div>
        )}

        {selectedComponent === 'kafka' && (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Radio className="w-8 h-8 text-indigo-400" />
              <div>
                <h3 className="text-2xl font-bold font-outfit text-white">Event-Driven Analytics with Apache Kafka</h3>
                <p className="text-slate-400 text-sm">Asynchronous click event streaming without blocking user redirection response time.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800">
                <h4 className="text-indigo-400 font-bold text-base mb-2">Kafka Event Producer</h4>
                <p className="text-slate-400 text-xs leading-relaxed">
                  When a redirection happens, Spring Boot fires an asynchronous `ClickEvent` to Kafka topic `url_click_events` non-blockingly via worker threads.
                </p>
              </div>

              <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800">
                <h4 className="text-purple-400 font-bold text-base mb-2">Kafka Event Consumer</h4>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Background consumers read click events in batches, update total click statistics in PostgreSQL, and stream metrics to real-time dashboards.
                </p>
              </div>
            </div>
          </div>
        )}

        {selectedComponent === 'postgres' && (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Database className="w-8 h-8 text-cyan-400" />
              <div>
                <h3 className="text-2xl font-bold font-outfit text-white">PostgreSQL Storage & Base62 Indexing</h3>
                <p className="text-slate-400 text-sm">ACID compliant relational storage with Base62 auto-increment ID encoding.</p>
              </div>
            </div>

            <div className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 text-slate-300 text-sm space-y-2">
              <p>• Auto-incrementing 64-bit integer IDs are encoded into 6-character Base62 strings (e.g. ID `1000000` $\rightarrow$ `bf4`).</p>
              <p>• Unique B-Tree index on `short_code` column ensures $O(\log N)$ fast lookup queries on DB fallback.</p>
              <p>• Verified with <strong>Testcontainers PostgreSQL 15</strong> in automated GitHub Actions CI pipelines.</p>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
