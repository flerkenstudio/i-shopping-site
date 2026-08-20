import React, { useState, useEffect } from 'react';
import {
  Zap,
  X,
  Play,
  Trash2,
  RefreshCw,
  Activity,
  Database,
  Layers,
  Clock,
  ToggleLeft,
  ToggleRight,
  TrendingUp,
} from 'lucide-react';
import { redisCache } from '../services/redisCacheService';
import { RedisCacheStats } from '../types';

interface RedisConsoleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RedisConsoleModal: React.FC<RedisConsoleModalProps> = ({ isOpen, onClose }) => {
  const [stats, setStats] = useState<RedisCacheStats>(redisCache.getStats());
  const [keysList, setKeysList] = useState(redisCache.getKeysList());
  const [burstCount, setBurstCount] = useState<number>(100);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulationProgress, setSimulationProgress] = useState<number>(0);
  const [lastBurstResult, setLastBurstResult] = useState<{
    completedRequests: number;
    hits: number;
    misses: number;
    avgLatencyMs: number;
    p99LatencyMs: number;
    throughputReqSec: number;
    savedDbQueries: number;
  } | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const unsubscribe = redisCache.subscribe(newStats => {
      setStats(newStats);
      setKeysList(redisCache.getKeysList());
    });

    const interval = setInterval(() => {
      setKeysList(redisCache.getKeysList());
    }, 2000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleRunTrafficBurst = async () => {
    setIsSimulating(true);
    setSimulationProgress(0);

    const result = await redisCache.simulateTrafficBurst(burstCount, (completed, total) => {
      setSimulationProgress(Math.round((completed / total) * 100));
    });

    setLastBurstResult(result);
    setIsSimulating(false);
  };

  const handleFlushCache = () => {
    redisCache.flushAll();
  };

  const handleWarmCache = () => {
    redisCache.warmCache();
  };

  const handleToggleCache = () => {
    redisCache.toggleCache();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 transition-opacity">
      <div className="w-full max-w-4xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl overflow-hidden text-zinc-900 dark:text-zinc-100 flex flex-col max-h-[90vh] transition-colors">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold font-display tracking-tight text-zinc-900 dark:text-white flex items-center space-x-2">
                <span>Redis In-Memory Cache Engine</span>
                <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${stats.cacheEnabled ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-700 dark:text-rose-300'}`}>
                  {stats.cacheEnabled ? 'ACTIVE & OPERATIONAL' : 'BYPASSED'}
                </span>
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                High-throughput caching layer for sub-millisecond catalog reads and traffic surge resilience
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            {/* Metric 1: Cache Hit Ratio */}
            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/80 space-y-1 shadow-xs">
              <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                <span>Hit Ratio</span>
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <p className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400 tabular-nums">
                {stats.hitRatio}%
              </p>
              <div className="w-full h-1 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${stats.hitRatio}%` }} />
              </div>
            </div>

            {/* Metric 2: Average Latency */}
            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/80 space-y-1 shadow-xs">
              <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                <span>Cached Latency</span>
                <Clock className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
              </div>
              <p className="text-xl font-bold font-mono text-cyan-600 dark:text-cyan-400 tabular-nums">
                {stats.avgCachedMs}ms
              </p>
              <span className="text-[10px] text-zinc-500 block">vs {stats.avgUncachedMs}ms uncached DB</span>
            </div>

            {/* Metric 3: Active Cache Keys */}
            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/80 space-y-1 shadow-xs">
              <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                <span>Stored Keys</span>
                <Database className="w-3.5 h-3.5 text-zinc-400" />
              </div>
              <p className="text-xl font-bold font-mono text-zinc-900 dark:text-zinc-100 tabular-nums">
                {stats.keysCount}
              </p>
              <span className="text-[10px] text-zinc-500 block">{(stats.memoryUsedBytes / 1024).toFixed(2)} KB in memory</span>
            </div>

            {/* Metric 4: Total Requests */}
            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/80 space-y-1 shadow-xs">
              <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                <span>Total Requests</span>
                <Activity className="w-3.5 h-3.5 text-zinc-400" />
              </div>
              <p className="text-xl font-bold font-mono text-zinc-900 dark:text-zinc-100 tabular-nums">
                {stats.totalRequests}
              </p>
              <span className="text-[10px] text-zinc-500 block">{stats.hits} Hits / {stats.misses} Misses</span>
            </div>
          </div>

          {/* Traffic Burst Stress Testing Tool */}
          <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 space-y-4 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-200 flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>High-Traffic Burst Simulator</span>
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">
                  Simulate concurrent catalog traffic surges to benchmark Redis throughput & p99 response times
                </p>
              </div>

              {/* Request Count Selector */}
              <div className="flex items-center space-x-2">
                {[50, 100, 250].map(count => (
                  <button
                    key={count}
                    onClick={() => setBurstCount(count)}
                    disabled={isSimulating}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-all ${
                      burstCount === count
                        ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 font-bold shadow-xs'
                        : 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                    }`}
                  >
                    {count} reqs
                  </button>
                ))}

                <button
                  onClick={handleRunTrafficBurst}
                  disabled={isSimulating}
                  className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center space-x-1.5 transition-colors disabled:opacity-50 shadow-xs"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{isSimulating ? `Testing (${simulationProgress}%)` : 'Run Surge Test'}</span>
                </button>
              </div>
            </div>

            {/* Simulation Progress Bar */}
            {isSimulating && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono text-zinc-600 dark:text-zinc-400">
                  <span>Executing concurrent load test...</span>
                  <span>{simulationProgress}%</span>
                </div>
                <div className="w-full h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 transition-all duration-100" style={{ width: `${simulationProgress}%` }} />
                </div>
              </div>
            )}

            {/* Test Results Output */}
            {lastBurstResult && !isSimulating && (
              <div className="p-4 rounded-xl bg-white dark:bg-zinc-950 border border-emerald-500/30 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs shadow-xs">
                <div>
                  <span className="text-zinc-500 block font-mono text-[10px] uppercase">Throughput</span>
                  <span className="text-sm font-bold font-mono text-emerald-600 dark:text-emerald-400">
                    {lastBurstResult.throughputReqSec.toLocaleString()} req/s
                  </span>
                </div>
                <div>
                  <span className="text-zinc-500 block font-mono text-[10px] uppercase">P99 Latency</span>
                  <span className="text-sm font-bold font-mono text-zinc-900 dark:text-zinc-100">
                    {lastBurstResult.p99LatencyMs}ms
                  </span>
                </div>
                <div>
                  <span className="text-zinc-500 block font-mono text-[10px] uppercase">Cache Hit Rate</span>
                  <span className="text-sm font-bold font-mono text-emerald-600 dark:text-emerald-400">
                    {((lastBurstResult.hits / lastBurstResult.completedRequests) * 100).toFixed(1)}%
                  </span>
                </div>
                <div>
                  <span className="text-zinc-500 block font-mono text-[10px] uppercase">DB Queries Saved</span>
                  <span className="text-sm font-bold font-mono text-zinc-900 dark:text-zinc-100">
                    {lastBurstResult.savedDbQueries} queries
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Active Keys Inspector Table */}
          <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-200 flex items-center space-x-2">
                <Database className="w-4 h-4 text-zinc-400" />
                <span>Active Redis Key Store ({keysList.length})</span>
              </h3>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleWarmCache}
                  className="px-2.5 py-1 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-[11px] font-mono text-zinc-700 dark:text-zinc-300 flex items-center space-x-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Warm Cache</span>
                </button>
                <button
                  onClick={handleFlushCache}
                  className="px-2.5 py-1 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:bg-rose-50 dark:hover:bg-rose-900/50 text-[11px] font-mono text-rose-600 dark:text-rose-300 flex items-center space-x-1"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Flush All</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto max-h-52 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-950">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-zinc-50 dark:bg-zinc-900/80 text-zinc-500 dark:text-zinc-400 border-b border-zinc-200 dark:border-zinc-800">
                  <tr>
                    <th className="py-2 px-3 font-medium">Key Name</th>
                    <th className="py-2 px-3 font-medium">Size</th>
                    <th className="py-2 px-3 font-medium">TTL Left</th>
                    <th className="py-2 px-3 font-medium text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-850 text-zinc-700 dark:text-zinc-300">
                  {keysList.map(item => (
                    <tr key={item.key} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
                      <td className="py-2 px-3 text-emerald-600 dark:text-emerald-400 font-medium truncate max-w-xs">{item.key}</td>
                      <td className="py-2 px-3 text-zinc-500 dark:text-zinc-400">{item.size} B</td>
                      <td className="py-2 px-3 text-zinc-600 dark:text-zinc-300">
                        {item.ttlSecondsRemaining > 0 ? `${item.ttlSecondsRemaining}s` : 'Persistent'}
                      </td>
                      <td className="py-2 px-3 text-right">
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                          HOT
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Live Hit/Miss Access Log */}
          <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 space-y-3 shadow-xs">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-200 flex items-center space-x-2">
              <Layers className="w-4 h-4 text-zinc-400" />
              <span>Real-Time Request Stream</span>
            </h3>

            <div className="max-h-40 overflow-y-auto space-y-1 font-mono text-xs pr-1">
              {stats.recentLogs.slice(0, 10).map(log => (
                <div
                  key={log.id}
                  className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 text-[11px]"
                >
                  <div className="flex items-center space-x-2 truncate">
                    <span
                      className={`px-1.5 py-0.5 rounded font-bold text-[10px] ${
                        log.status === 'HIT'
                          ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {log.status}
                    </span>
                    <span className="text-zinc-700 dark:text-zinc-300 truncate">{log.key}</span>
                  </div>
                  <span className="text-zinc-500 dark:text-zinc-400 shrink-0 font-bold ml-2">
                    {log.durationMs}ms
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 sm:p-5 bg-zinc-50 dark:bg-zinc-900/80 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <button
            onClick={handleToggleCache}
            className="flex items-center space-x-2 text-xs text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            {stats.cacheEnabled ? (
              <ToggleRight className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <ToggleLeft className="w-6 h-6 text-zinc-400 dark:text-zinc-600" />
            )}
            <span>Toggle Cache ({stats.cacheEnabled ? 'ENABLED' : 'DISABLED'})</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 text-xs font-bold uppercase hover:bg-zinc-800 dark:hover:bg-white transition-colors shadow-xs"
          >
            Close Console
          </button>
        </div>
      </div>
    </div>
  );
};
