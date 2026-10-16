"use client";

import * as React from "react";
import { Activity, RefreshCw } from "lucide-react";
import { useAirdrops } from "@/context/AirdropContext";

export const LiveMarketBar: React.FC = () => {
  const { liveData, isLiveLoading, refreshLiveData } = useAirdrops();

  if (!liveData) return null;

  const { prices } = liveData;

  const formatPrice = (p: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: p > 1000 ? 0 : 2,
    }).format(p);
  };

  return (
    <div className="flex items-center justify-between gap-3 px-3.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-700 shadow-sm">
      {/* Live Indicator */}
      <div className="flex items-center gap-2 shrink-0">
        <span className="flex h-2 w-2 relative">
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
        <span className="text-[11px] font-semibold text-slate-900 tracking-tight flex items-center gap-1">
          <Activity className="h-3 w-3 text-emerald-600" />
          <span className="hidden sm:inline">Data Pasar:</span>
        </span>
      </div>

      {/* Benchmark Prices */}
      <div className="flex items-center gap-4 overflow-x-auto text-[11px] font-mono">
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-slate-400 font-medium">BTC</span>
          <span className="font-semibold text-slate-900">
            {formatPrice(prices.btc)}
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-slate-400 font-medium">ETH</span>
          <span className="font-semibold text-slate-900">
            {formatPrice(prices.eth)}
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-slate-400 font-medium">SOL</span>
          <span className="font-semibold text-slate-900">
            {formatPrice(prices.sol)}
          </span>
        </div>
      </div>

      {/* Refresh trigger */}
      <button
        onClick={() => refreshLiveData()}
        disabled={isLiveLoading}
        title="Perbarui data harga pasar"
        className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors shrink-0 disabled:opacity-50"
        aria-label="Perbarui data harga pasar"
      >
        <RefreshCw className={`h-3 w-3 ${isLiveLoading ? "animate-spin text-emerald-600" : ""}`} />
      </button>
    </div>
  );
};
