"use client";

import * as React from "react";
import { Search, SlidersHorizontal, LayoutGrid, Table, X } from "lucide-react";
import { PotentialTier, CostType, ProjectCategory } from "@/types/airdrop";
import { cn } from "@/lib/utils";

interface DirectoryToolbarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedTier: PotentialTier | "ALL";
  onTierChange: (t: PotentialTier | "ALL") => void;
  selectedCost: CostType | "ALL";
  onCostChange: (c: CostType | "ALL") => void;
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  categories: string[];
  sortBy: "potential" | "funding" | "alphabetical";
  onSortChange: (sort: "potential" | "funding" | "alphabetical") => void;
  viewMode: "grid" | "table";
  onViewModeChange: (mode: "grid" | "table") => void;
  totalFiltered: number;
}

export const DirectoryToolbar: React.FC<DirectoryToolbarProps> = ({
  searchQuery,
  onSearchChange,
  selectedTier,
  onTierChange,
  selectedCost,
  onCostChange,
  selectedCategory,
  onCategoryChange,
  categories,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  totalFiltered,
}) => {
  return (
    <div className="space-y-3.5 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      {/* Top Search & Primary Controls */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari nama airdrop, ticker, investor, atau jaringan..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-9 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Sort & View Mode controls */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <span className="text-slate-400 hidden sm:inline">Urutkan:</span>
            <select
              value={sortBy}
              onChange={(e) =>
                onSortChange(e.target.value as "potential" | "funding" | "alphabetical")
              }
              aria-label="Urutkan daftar airdrop"
              className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2 text-xs font-medium text-slate-800 focus:border-emerald-600 focus:outline-none"
            >
              <option value="potential">Skor Potensi Tertinggi</option>
              <option value="funding">Total Pendanaan Tertinggi</option>
              <option value="alphabetical">Nama (A ke Z)</option>
            </select>
          </div>

          {/* Grid vs Table View Toggle */}
          <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 p-0.5">
            <button
              onClick={() => onViewModeChange("grid")}
              aria-label="Tampilan Grid"
              className={cn(
                "p-1.5 rounded-md transition-colors",
                viewMode === "grid"
                  ? "bg-white text-emerald-700 shadow-sm"
                  : "text-slate-400 hover:text-slate-700"
              )}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => onViewModeChange("table")}
              aria-label="Tampilan Tabel"
              className={cn(
                "p-1.5 rounded-md transition-colors",
                viewMode === "table"
                  ? "bg-white text-emerald-700 shadow-sm"
                  : "text-slate-400 hover:text-slate-700"
              )}
            >
              <Table className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter Row: Tiers & Categories */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
        {/* Tier filter pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-slate-400 text-[11px] font-medium mr-1">
            Tier Potensi:
          </span>
          {(["ALL", "Tier S", "Tier A", "Tier B"] as const).map((tier) => (
            <button
              key={tier}
              onClick={() => onTierChange(tier)}
              className={cn(
                "px-2.5 py-1 rounded-md text-xs font-medium transition-colors border",
                selectedTier === tier
                  ? "bg-emerald-50 text-emerald-800 border-emerald-300 font-semibold"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
              )}
            >
              {tier === "ALL" ? "Semua Tier" : tier}
            </button>
          ))}
        </div>

        {/* Cost & Category selects */}
        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={selectedCost}
            onChange={(e) => onCostChange(e.target.value as CostType | "ALL")}
            aria-label="Filter berdasarkan biaya garap"
            className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700 focus:border-emerald-600 focus:outline-none"
          >
            <option value="ALL">Semua Biaya</option>
            <option value="Free (Testnet)">Free (Testnet)</option>
            <option value="Low Gas (< $5)">Low Gas (&lt; $5)</option>
            <option value="Capital / Staking">Capital / Staking</option>
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            aria-label="Filter berdasarkan kategori proyek"
            className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700 focus:border-emerald-600 focus:outline-none"
          >
            <option value="ALL">Semua Kategori</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <span className="text-[11px] text-slate-400 font-mono">
            {totalFiltered} Proyek
          </span>
        </div>
      </div>
    </div>
  );
};
