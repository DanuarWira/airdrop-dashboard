"use client";

import * as React from "react";
import {
  Coins,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  Layers,
  Plus,
} from "lucide-react";
import { useAirdrops } from "@/context/AirdropContext";
import { AirdropProject, PotentialTier, CostType } from "@/types/airdrop";
import { AirdropCard } from "@/components/AirdropCard";
import { AirdropTable } from "@/components/AirdropTable";
import { DirectoryToolbar } from "@/components/DirectoryToolbar";
import { JustificationModal } from "@/components/JustificationModal";
import { AddEditAirdropModal } from "@/components/AddEditAirdropModal";
import { LiveMarketBar } from "@/components/LiveMarketBar";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/lib/utils";

export default function Home() {
  const {
    projects,
    trackedProjectIds,
    toggleTrackProject,
    isProjectTracked,
    addProject,
    updateProject,
    deleteProject,
  } = useAirdrops();

  // Search, filter & sort state
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedTier, setSelectedTier] = React.useState<PotentialTier | "ALL">("ALL");
  const [selectedCost, setSelectedCost] = React.useState<CostType | "ALL">("ALL");
  const [selectedCategory, setSelectedCategory] = React.useState<string>("ALL");
  const [sortBy, setSortBy] = React.useState<"potential" | "funding" | "alphabetical">("potential");
  const [viewMode, setViewMode] = React.useState<"grid" | "table">("grid");

  // Selected project for Justification Modal
  const [activeModalProject, setActiveModalProject] = React.useState<AirdropProject | null>(null);

  // Add / Edit Modal state
  const [isAddEditOpen, setIsAddEditOpen] = React.useState(false);
  const [projectToEdit, setProjectToEdit] = React.useState<AirdropProject | null>(null);

  // Extract unique categories
  const categories = React.useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => set.add(p.category));
    return Array.from(set).sort();
  }, [projects]);

  // Aggregate Executive Stats
  const stats = React.useMemo(() => {
    const totalFunding = projects.reduce((acc, p) => acc + p.potential.fundingRaisedUsd, 0);
    const tierSCount = projects.filter((p) => p.potential.tier === "Tier S").length;
    const trackedCount = trackedProjectIds.length;
    return {
      totalProjects: projects.length,
      totalFunding,
      tierSCount,
      trackedCount,
    };
  }, [projects, trackedProjectIds]);

  // Filter & Sort Projects
  const filteredProjects = React.useMemo(() => {
    return projects
      .filter((project) => {
        // Search filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = project.name.toLowerCase().includes(q);
          const matchTicker = project.ticker?.toLowerCase().includes(q);
          const matchBacker = project.potential.leadBackers.some((b) =>
            b.toLowerCase().includes(q)
          );
          const matchChain = project.chains.some((c) => c.toLowerCase().includes(q));
          if (!matchName && !matchTicker && !matchBacker && !matchChain) {
            return false;
          }
        }

        // Tier filter
        if (selectedTier !== "ALL" && project.potential.tier !== selectedTier) {
          return false;
        }

        // Cost filter
        if (selectedCost !== "ALL" && project.costType !== selectedCost) {
          return false;
        }

        // Category filter
        if (selectedCategory !== "ALL" && project.category !== selectedCategory) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "potential") {
          return b.potential.score - a.potential.score;
        }
        if (sortBy === "funding") {
          return b.potential.fundingRaisedUsd - a.potential.fundingRaisedUsd;
        }
        if (sortBy === "alphabetical") {
          return a.name.localeCompare(b.name);
        }
        return 0;
      });
  }, [projects, searchQuery, selectedTier, selectedCost, selectedCategory, sortBy]);

  const handleOpenAdd = () => {
    setProjectToEdit(null);
    setIsAddEditOpen(true);
  };

  const handleOpenEdit = (project: AirdropProject) => {
    setProjectToEdit(project);
    setIsAddEditOpen(true);
  };

  const handleSaveProject = (data: any) => {
    if (projectToEdit) {
      updateProject({ ...projectToEdit, ...data });
    } else {
      addProject(data);
    }
  };

  return (
    <div className="space-y-6">
      {/* Live Market Benchmark Bar from DeFiLlama */}
      <LiveMarketBar />

      {/* Header Banner & Real Metrics */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Katalog Airdrop Web3
            </h1>
            <Button
              variant="outline"
              size="sm"
              onClick={handleOpenAdd}
              className="text-xs"
            >
              <Plus className="h-3.5 w-3.5 mr-1 text-emerald-600" />
              Tambah Airdrop
            </Button>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-2xl">
            Daftar airdrop aktif lengkap dengan rincian pendanaan, investor, analisis potensi, dan panduan pengerjaan.
          </p>
        </div>

        {/* Real Metrics Pill Row */}
        <div className="flex items-center gap-3 overflow-x-auto pb-1 sm:pb-0">
          <div className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white shadow-sm shrink-0">
            <span className="text-[10px] text-slate-400 block font-medium">TOTAL PROYEK</span>
            <span className="text-sm font-bold text-slate-900 font-mono">
              {stats.totalProjects} Proyek
            </span>
          </div>

          <div className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white shadow-sm shrink-0">
            <span className="text-[10px] text-slate-400 block font-medium">TOTAL PENDANAAN</span>
            <span className="text-sm font-bold text-emerald-700 font-mono">
              {formatCurrency(stats.totalFunding)}
            </span>
          </div>

          <div className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white shadow-sm shrink-0">
            <span className="text-[10px] text-slate-400 block font-medium">TIER S (POTENSI UTAMA)</span>
            <span className="text-sm font-bold text-slate-900 font-mono">
              {stats.tierSCount} Proyek
            </span>
          </div>

          <div className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white shadow-sm shrink-0">
            <span className="text-[10px] text-slate-400 block font-medium">SEDANG DITRACK</span>
            <span className="text-sm font-bold text-emerald-800 font-mono">
              {stats.trackedCount} Proyek
            </span>
          </div>
        </div>
      </div>

      {/* Filter & Sort Toolbar */}
      <DirectoryToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedTier={selectedTier}
        onTierChange={setSelectedTier}
        selectedCost={selectedCost}
        onCostChange={setSelectedCost}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        categories={categories}
        sortBy={sortBy}
        onSortChange={setSortBy}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        totalFiltered={filteredProjects.length}
      />

      {/* Project Catalog List / Grid */}
      {filteredProjects.length > 0 ? (
        viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredProjects.map((project) => (
              <AirdropCard
                key={project.id}
                project={project}
                onOpenJustification={(p) => setActiveModalProject(p)}
                isTracking={isProjectTracked(project.id)}
                onToggleTrack={toggleTrackProject}
                onEditProject={handleOpenEdit}
              />
            ))}
          </div>
        ) : (
          <AirdropTable
            projects={filteredProjects}
            onOpenJustification={(p) => setActiveModalProject(p)}
            isProjectTracked={isProjectTracked}
            onToggleTrack={toggleTrackProject}
            onEditProject={handleOpenEdit}
          />
        )
      ) : (
        /* Empty state */
        <div className="rounded-lg border border-dashed border-slate-200 bg-white p-12 text-center space-y-3">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-semibold text-slate-900">
            Tidak ada airdrop yang cocok dengan kriteria filter
          </h3>
          <p className="max-w-md mx-auto text-xs text-slate-500">
            Coba ubah kata kunci pencarian atau reset filter Tier dan Biaya untuk menampilkan seluruh daftar airdrop.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedTier("ALL");
              setSelectedCost("ALL");
              setSelectedCategory("ALL");
            }}
            className="text-xs font-medium text-emerald-700 hover:text-emerald-800 underline"
          >
            Reset Semua Filter
          </button>
        </div>
      )}

      {/* Justification Modal */}
      <JustificationModal
        project={activeModalProject}
        isOpen={!!activeModalProject}
        onClose={() => setActiveModalProject(null)}
        isTracking={activeModalProject ? isProjectTracked(activeModalProject.id) : false}
        onTrackToggle={toggleTrackProject}
        onEdit={handleOpenEdit}
      />

      {/* Add / Edit Airdrop Modal */}
      <AddEditAirdropModal
        isOpen={isAddEditOpen}
        onClose={() => {
          setIsAddEditOpen(false);
          setProjectToEdit(null);
        }}
        projectToEdit={projectToEdit}
        onSave={handleSaveProject}
        onDelete={deleteProject}
      />
    </div>
  );
}
