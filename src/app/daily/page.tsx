"use client";

import * as React from "react";
import Link from "next/link";
import {
  CalendarDays,
  Clock,
  ExternalLink,
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
} from "lucide-react";
import { useAirdrops } from "@/context/AirdropContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Progress } from "@/components/ui/Progress";
import { Modal } from "@/components/ui/Modal";

export default function DailyPage() {
  const {
    projects,
    trackedProjectIds,
    toggleDailyTask,
    isDailyTaskCompleted,
    getDailyCompletionRate,
    addDailyTaskToProject,
    deleteDailyTaskFromProject,
  } = useAirdrops();

  // Selected project filter for daily tasks
  const [selectedProjectId, setSelectedProjectId] = React.useState<string>("ALL");

  // Add Daily Task Modal State
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [targetProjectId, setTargetProjectId] = React.useState<string>("");
  const [taskTitle, setTaskTitle] = React.useState("");
  const [taskDesc, setTaskDesc] = React.useState("");
  const [taskUrl, setTaskUrl] = React.useState("");
  const [taskMinutes, setTaskMinutes] = React.useState(2);

  // UTC Midnight Countdown Timer
  const [timeLeft, setTimeLeft] = React.useState({
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  React.useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      // Calculate next UTC midnight
      const nextUtcMidnight = new Date(
        Date.UTC(
          now.getUTCFullYear(),
          now.getUTCMonth(),
          now.getUTCDate() + 1,
          0,
          0,
          0
        )
      );
      const diffMs = nextUtcMidnight.getTime() - now.getTime();
      if (diffMs > 0) {
        const totalSeconds = Math.floor(diffMs / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        setTimeLeft({
          hours: String(hours).padStart(2, "0"),
          minutes: String(minutes).padStart(2, "0"),
          seconds: String(seconds).padStart(2, "0"),
        });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  // Filter tracked projects that have daily tasks
  const trackedProjectsWithDaily = React.useMemo(() => {
    return projects.filter(
      (p) => trackedProjectIds.includes(p.id) && p.dailyTasks.length > 0
    );
  }, [projects, trackedProjectIds]);

  // Aggregate all daily tasks according to filter
  const activeDailyTasks = React.useMemo(() => {
    const targetProjects =
      selectedProjectId === "ALL"
        ? trackedProjectsWithDaily
        : trackedProjectsWithDaily.filter((p) => p.id === selectedProjectId);

    return targetProjects.flatMap((p) =>
      p.dailyTasks.map((task) => ({
        ...task,
        project: p,
      }))
    );
  }, [trackedProjectsWithDaily, selectedProjectId]);

  const dailyStats = getDailyCompletionRate();
  const isAllCompleted = dailyStats.total > 0 && dailyStats.completed === dailyStats.total;

  const handleOpenAddModal = (presetProjectId?: string) => {
    const defaultProj =
      presetProjectId ||
      (selectedProjectId !== "ALL" ? selectedProjectId : projects[0]?.id || "");
    setTargetProjectId(defaultProj);
    const projObj = projects.find((p) => p.id === defaultProj);
    setTaskUrl(projObj?.faucetLinks[0]?.url || projObj?.links.website || "https://");
    setTaskTitle("");
    setTaskDesc("");
    setTaskMinutes(2);
    setIsAddModalOpen(true);
  };

  const handleCreateDailyTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetProjectId || !taskTitle.trim()) return;

    addDailyTaskToProject(targetProjectId, {
      title: taskTitle.trim(),
      description: taskDesc.trim(),
      actionUrl: taskUrl.trim() || "https://",
      estimatedMinutes: Number(taskMinutes) || 2,
    });

    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Reset Countdown */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Daftar Tugas Harian
            </h1>
            <Badge variant="amber" size="sm">
              Reset Tiap UTC 00:00
            </Badge>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Aktivitas rutin harian seperti klaim faucet dan transaksi testnet untuk menjaga keaktifan dompet on-chain.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleOpenAddModal()}
            className="text-xs"
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            Tambah Tugas Harian
          </Button>

          {/* Live UTC Countdown Widget */}
          <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-lg p-2 px-3 shadow-sm">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-amber-50 text-amber-700 border border-amber-200">
              <Clock className="h-4 w-4" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-medium">
                Reset Harian (UTC 00:00)
              </span>
              <div className="font-mono text-sm font-bold text-slate-900">
                {timeLeft.hours}j {timeLeft.minutes}m {timeLeft.seconds}d
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Progress Gauge Card */}
      <Card>
        <CardContent className="p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-slate-900">
                  Progres Tugas Hari Ini
                </span>
                {isAllCompleted && (
                  <Badge variant="tier-s" size="sm">
                    100% Selesai Hari Ini
                  </Badge>
                )}
              </div>
              <p className="text-xs text-slate-500">
                {dailyStats.completed} dari {dailyStats.total} tugas harian telah selesai.
              </p>
            </div>

            <div className="w-full sm:w-64 space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-500">Penyelesaian</span>
                <span className="font-semibold text-emerald-700">
                  {dailyStats.percentage}%
                </span>
              </div>
              <Progress value={dailyStats.percentage} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filter by Project */}
      {trackedProjectsWithDaily.length > 0 && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-400 font-medium mr-1 text-[11px]">
            Filter Proyek:
          </span>
          <button
            onClick={() => setSelectedProjectId("ALL")}
            className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
              selectedProjectId === "ALL"
                ? "bg-emerald-50 text-emerald-800 border-emerald-300 font-semibold"
                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
            }`}
          >
            Semua Proyek ({activeDailyTasks.length})
          </button>
          {trackedProjectsWithDaily.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedProjectId(p.id)}
              className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors whitespace-nowrap ${
                selectedProjectId === p.id
                  ? "bg-emerald-50 text-emerald-800 border-emerald-300 font-semibold"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
              }`}
            >
              {p.name} ({p.dailyTasks.length})
            </button>
          ))}
        </div>
      )}

      {/* Daily Tasks List */}
      {activeDailyTasks.length > 0 ? (
        <div className="space-y-3">
          {activeDailyTasks.map((item) => {
            const isDone = isDailyTaskCompleted(item.id);

            return (
              <div
                key={item.id}
                className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-lg border transition-all ${
                  isDone
                    ? "bg-emerald-50/30 border-emerald-200"
                    : "bg-white border-slate-200 hover:border-slate-300 shadow-sm"
                }`}
              >
                {/* Left: Checkbox & Info */}
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => toggleDailyTask(item.id)}
                    aria-label={`Tandai tugas ${item.title}`}
                    className="mt-0.5 shrink-0 text-slate-400 hover:text-emerald-600 transition-colors"
                  >
                    {isDone ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    ) : (
                      <Circle className="h-5 w-5 text-slate-300 hover:text-slate-400" />
                    )}
                  </button>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-xs font-semibold ${
                          isDone
                            ? "text-slate-500 line-through"
                            : "text-slate-900"
                        }`}
                      >
                        {item.title}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 font-medium text-slate-700 border border-slate-200">
                        {item.project.name}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        ±{item.estimatedMinutes} menit
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Right: Direct Action Button & Delete */}
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                  <a
                    href={item.actionUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm transition-colors"
                  >
                    <span>Buka dApp</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                  <Button
                    variant={isDone ? "secondary" : "outline"}
                    size="sm"
                    onClick={() => toggleDailyTask(item.id)}
                    className="text-xs"
                  >
                    {isDone ? "Selesai" : "Tandai Selesai"}
                  </Button>
                  <button
                    onClick={() => {
                      if (
                        confirm(
                          `Hapus tugas "${item.title}" dari rutinitas ${item.project.name}?`
                        )
                      ) {
                        deleteDailyTaskFromProject(item.project.id, item.id);
                      }
                    }}
                    title="Hapus tugas harian ini"
                    className="p-1.5 text-slate-300 hover:text-rose-600 rounded transition-colors"
                    aria-label="Hapus tugas harian"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-slate-200 bg-white p-12 text-center space-y-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
            <CalendarDays className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-slate-900">
              Tidak Ada Tugas Harian yang Aktif
            </h3>
            <p className="max-w-md mx-auto text-xs text-slate-500 leading-relaxed">
              Tambahkan tugas harian baru untuk proyek airdrop Anda atau tandai proyek di katalog untuk memunculkan aktivitas bawaan.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5">
            <Button
              variant="primary"
              size="sm"
              onClick={() =>
                handleOpenAddModal(
                  selectedProjectId !== "ALL" ? selectedProjectId : undefined
                )
              }
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              Tambah Tugas Harian Baru
            </Button>
            <Link href="/">
              <Button variant="outline" size="sm">
                Lihat Katalog Airdrop
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Add Daily Task Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        maxWidth="lg"
        title="Tambah Tugas Harian Baru"
        description="Tambahkan rutinitas harian untuk proyek airdrop (klaim faucet, check-in, atau interaksi testnet)."
      >
        <form onSubmit={handleCreateDailyTask} className="space-y-4 py-2 text-xs">
          <div className="space-y-1">
            <label className="text-[11px] font-medium text-slate-700">Pilih Proyek Airdrop *</label>
            <select
              value={targetProjectId}
              onChange={(e) => {
                const pid = e.target.value;
                setTargetProjectId(pid);
                const projObj = projects.find((p) => p.id === pid);
                if (projObj) {
                  setTaskUrl(projObj.faucetLinks[0]?.url || projObj.links.website || "https://");
                }
              }}
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

          <div className="space-y-1">
            <label className="text-[11px] font-medium text-slate-700">Judul Tugas Harian *</label>
            <input
              type="text"
              required
              placeholder="Contoh: Klaim Testnet Faucet 24 Jam, Daily GM Discord..."
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:border-emerald-600 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-medium text-slate-700">Deskripsi Singkat</label>
            <input
              type="text"
              placeholder="Petunjuk ringkas pengerjaan tugas harian ini..."
              value={taskDesc}
              onChange={(e) => setTaskDesc(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:border-emerald-600 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 space-y-1">
              <label className="text-[11px] font-medium text-slate-700">URL dApp / Faucet</label>
              <input
                type="url"
                placeholder="https://..."
                value={taskUrl}
                onChange={(e) => setTaskUrl(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-mono text-slate-900 focus:border-emerald-600 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-medium text-slate-700">Estimasi Waktu</label>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  min={1}
                  max={60}
                  value={taskMinutes}
                  onChange={(e) => setTaskMinutes(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-mono text-center text-slate-900 focus:border-emerald-600 focus:outline-none"
                />
                <span className="text-slate-500 text-xs shrink-0">menit</span>
              </div>
            </div>
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
              Simpan Tugas Harian
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
