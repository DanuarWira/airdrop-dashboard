"use client";

import * as React from "react";
import Link from "next/link";
import {
  Layers,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  Flame,
  Award,
  Filter,
  Plus,
  Trash2,
} from "lucide-react";
import { useAirdrops } from "@/context/AirdropContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

type MilestoneFilterType = "ALL" | "snapshot_expected" | "tge_claim" | "testnet_launch" | "points_season";

export default function TimelinePage() {
  const {
    projects,
    addTimelineMilestone,
    toggleTimelineMilestone,
    deleteTimelineMilestone,
  } = useAirdrops();

  const [filterType, setFilterType] = React.useState<MilestoneFilterType>("ALL");
  const [showOnlyUpcoming, setShowOnlyUpcoming] = React.useState(true);

  // Add Milestone Modal State
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [targetProjectId, setTargetProjectId] = React.useState("");
  const [milestoneType, setMilestoneType] = React.useState<
    "snapshot_expected" | "tge_claim" | "testnet_launch" | "points_season"
  >("snapshot_expected");
  const [milestoneTitle, setMilestoneTitle] = React.useState("");
  const [milestoneDate, setMilestoneDate] = React.useState("Q4 2026");
  const [milestoneDesc, setMilestoneDesc] = React.useState("");

  // Extract all timeline milestones across projects
  const allMilestones = React.useMemo(() => {
    const list: Array<{
      id: string;
      date: string;
      title: string;
      description: string;
      type: "testnet_launch" | "points_season" | "snapshot_expected" | "tge_claim";
      isCompleted: boolean;
      project: {
        id: string;
        name: string;
        ticker?: string;
        tier: string;
        score: number;
      };
    }> = [];

    projects.forEach((p) => {
      p.timeline.forEach((m) => {
        list.push({
          ...m,
          project: {
            id: p.id,
            name: p.name,
            ticker: p.ticker,
            tier: p.potential.tier,
            score: p.potential.score,
          },
        });
      });
    });

    // Sort order: Upcoming first, then by date string
    return list.sort((a, b) => {
      if (a.isCompleted !== b.isCompleted) {
        return a.isCompleted ? 1 : -1;
      }
      return a.date.localeCompare(b.date);
    });
  }, [projects]);

  // Filtered milestones
  const filteredMilestones = React.useMemo(() => {
    return allMilestones.filter((m) => {
      if (showOnlyUpcoming && m.isCompleted) return false;
      if (filterType !== "ALL" && m.type !== filterType) return false;
      return true;
    });
  }, [allMilestones, showOnlyUpcoming, filterType]);

  const typeLabelMap = {
    testnet_launch: { label: "Peluncuran Testnet", variant: "neutral" as const },
    points_season: { label: "Musim Poin", variant: "amber" as const },
    snapshot_expected: { label: "Estimasi Snapshot", variant: "rose" as const },
    tge_claim: { label: "Klaim Token & TGE", variant: "tier-s" as const },
  };

  const handleOpenAddModal = () => {
    setTargetProjectId(projects[0]?.id || "");
    setMilestoneType("snapshot_expected");
    setMilestoneTitle("");
    setMilestoneDate("Q4 2026");
    setMilestoneDesc("");
    setIsAddModalOpen(true);
  };

  const handleCreateMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetProjectId || !milestoneTitle.trim() || !milestoneDate.trim()) return;

    addTimelineMilestone(targetProjectId, {
      title: milestoneTitle.trim(),
      description: milestoneDesc.trim() || "Jadwal penting terkait ekosistem proyek.",
      date: milestoneDate.trim(),
      type: milestoneType,
      isCompleted: false,
    });

    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Jadwal & Linimasa Airdrop
            </h1>
            <Badge variant="rose" size="sm">
              Agenda Proyek
            </Badge>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Jadwal peluncuran testnet, perkiraan snapshot saldo atau poin, dan tanggal klaim TGE.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="primary"
            size="sm"
            onClick={handleOpenAddModal}
            className="text-xs"
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            Tambah Event Linimasa
          </Button>

          {/* Toggle Upcoming Only */}
          <button
            onClick={() => setShowOnlyUpcoming(!showOnlyUpcoming)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
              showOnlyUpcoming
                ? "bg-emerald-50 text-emerald-800 border-emerald-300 font-semibold"
                : "bg-white text-slate-600 border-slate-200"
            }`}
          >
            {showOnlyUpcoming ? "Hanya Mendatang" : "Semua Status"}
          </button>
        </div>
      </div>

      {/* Filter Tabs by Milestone Type */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-400 font-medium mr-1 text-[11px]">
          Kategori:
        </span>
        <button
          onClick={() => setFilterType("ALL")}
          className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
            filterType === "ALL"
              ? "bg-slate-900 text-white border-slate-900 font-semibold"
              : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
          }`}
        >
          Semua
        </button>

        <button
          onClick={() => setFilterType("snapshot_expected")}
          className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
            filterType === "snapshot_expected"
              ? "bg-rose-50 text-rose-800 border-rose-300 font-semibold"
              : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
          }`}
        >
          Estimasi Snapshot
        </button>

        <button
          onClick={() => setFilterType("tge_claim")}
          className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
            filterType === "tge_claim"
              ? "bg-emerald-50 text-emerald-800 border-emerald-300 font-semibold"
              : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
          }`}
        >
          Klaim Token & TGE
        </button>

        <button
          onClick={() => setFilterType("testnet_launch")}
          className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
            filterType === "testnet_launch"
              ? "bg-sky-50 text-sky-800 border-sky-300 font-semibold"
              : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
          }`}
        >
          Peluncuran Testnet
        </button>
      </div>

      {/* Timeline Stream */}
      <div className="relative border-l border-slate-200 ml-4 sm:ml-6 space-y-6 pb-6">
        {filteredMilestones.map((item) => {
          const badgeConfig = typeLabelMap[item.type];

          return (
            <div key={`${item.project.id}-${item.id}`} className="relative pl-6 sm:pl-8 group">
              {/* Timeline Node Dot */}
              <div
                className={`absolute -left-[9px] top-1.5 h-4 w-4 rounded-full border-2 bg-white transition-colors ${
                  item.isCompleted
                    ? "border-emerald-500 bg-emerald-50"
                    : item.type === "snapshot_expected"
                    ? "border-rose-500"
                    : item.type === "tge_claim"
                    ? "border-emerald-600"
                    : "border-slate-400"
                }`}
              >
                {item.isCompleted && (
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-600 m-auto mt-0.5" />
                )}
              </div>

              {/* Milestone Card */}
              <div
                className={`p-4 rounded-lg border transition-all ${
                  item.isCompleted
                    ? "bg-slate-50/60 border-slate-200 opacity-75"
                    : "bg-white border-slate-200 hover:border-slate-300 shadow-sm"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <span className="font-bold text-slate-900 text-sm">
                      {item.project.name}
                    </span>
                    <Badge variant="neutral" size="sm" className="font-mono text-[10px]">
                      {item.project.tier}
                    </Badge>
                    <Badge variant={badgeConfig.variant} size="sm">
                      {badgeConfig.label}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded">
                      {item.date}
                    </span>
                    <button
                      onClick={() => toggleTimelineMilestone(item.project.id, item.id)}
                      title="Klik untuk ubah status selesai / mendatang"
                      className="transition-opacity hover:opacity-80"
                    >
                      {item.isCompleted ? (
                        <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Selesai
                        </span>
                      ) : (
                        <span className="text-[11px] text-amber-700 font-medium flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" /> Mendatang
                        </span>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        if (
                          confirm(
                            `Hapus event "${item.title}" dari jadwal ${item.project.name}?`
                          )
                        ) {
                          deleteTimelineMilestone(item.project.id, item.id);
                        }
                      }}
                      title="Hapus event ini"
                      className="p-1 text-slate-300 hover:text-rose-600 rounded transition-colors"
                      aria-label="Hapus event linimasa"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <div className="pt-2.5 space-y-1">
                  <h4 className="text-xs font-semibold text-slate-900">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Milestone Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        maxWidth="lg"
        title="Tambah Event Linimasa Baru"
        description="Jadwalkan fase peluncuran, estimasi snapshot saldo/poin, atau tanggal klaim TGE token."
      >
        <form onSubmit={handleCreateMilestone} className="space-y-4 py-2 text-xs">
          <div className="space-y-1">
            <label className="text-[11px] font-medium text-slate-700">Pilih Proyek Airdrop *</label>
            <select
              value={targetProjectId}
              onChange={(e) => setTargetProjectId(e.target.value)}
              required
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:border-emerald-600 focus:outline-none"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} {p.ticker ? `($${p.ticker})` : ""} • {p.potential.tier}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-slate-700">Kategori Event *</label>
              <select
                value={milestoneType}
                onChange={(e) =>
                  setMilestoneType(
                    e.target.value as
                      | "snapshot_expected"
                      | "tge_claim"
                      | "testnet_launch"
                      | "points_season"
                  )
                }
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:border-emerald-600 focus:outline-none"
              >
                <option value="snapshot_expected">Estimasi Snapshot</option>
                <option value="tge_claim">Klaim Token & TGE</option>
                <option value="testnet_launch">Peluncuran Testnet</option>
                <option value="points_season">Musim Poin</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-medium text-slate-700">Tanggal / Kuartal *</label>
              <input
                type="text"
                required
                placeholder="Contoh: Q4 2026, 2026-11-20, Q1 2027..."
                value={milestoneDate}
                onChange={(e) => setMilestoneDate(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-mono text-slate-900 focus:border-emerald-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-medium text-slate-700">Judul Event *</label>
            <input
              type="text"
              required
              placeholder="Contoh: Snapshot Saldo Testnet, Peluncuran Mainnet Genesis..."
              value={milestoneTitle}
              onChange={(e) => setMilestoneTitle(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:border-emerald-600 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-medium text-slate-700">Deskripsi Singkat</label>
            <textarea
              rows={3}
              placeholder="Jelaskan detail aktivitas atau kriteria kelayakan snapshot..."
              value={milestoneDesc}
              onChange={(e) => setMilestoneDesc(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white p-2.5 text-xs text-slate-900 focus:border-emerald-600 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsAddModalOpen(false)}
            >
              Batal
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Simpan Event Linimasa
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
