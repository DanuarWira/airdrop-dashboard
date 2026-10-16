"use client";

import * as React from "react";
import Link from "next/link";
import {
  CheckSquare,
  Plus,
  ExternalLink,
  Trash2,
  Wallet,
  Download,
  Upload,
  RotateCcw,
  CheckCircle2,
  Circle,
  FileText,
  AlertCircle,
} from "lucide-react";
import { useAirdrops } from "@/context/AirdropContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Progress } from "@/components/ui/Progress";
import { Modal } from "@/components/ui/Modal";

export default function TrackerPage() {
  const {
    projects,
    trackedProjectIds,
    toggleTrackProject,
    completedMilestones,
    toggleMilestoneTask,
    isMilestoneCompleted,
    customTasks,
    addCustomTask,
    toggleCustomTask,
    deleteCustomTask,
    wallets,
    addWallet,
    deleteWallet,
    exportBackupJson,
    importBackupJson,
    resetToDefaults,
  } = useAirdrops();

  // State for new custom task inputs
  const [taskInputs, setTaskInputs] = React.useState<Record<string, { title: string; txHash: string }>>({});
  
  // Wallet modal state
  const [walletModalOpen, setWalletModalOpen] = React.useState(false);
  const [walletLabel, setWalletLabel] = React.useState("");
  const [walletAddress, setWalletAddress] = React.useState("");

  // Backup modal state
  const [backupModalOpen, setBackupModalOpen] = React.useState(false);
  const [importJsonText, setImportJsonText] = React.useState("");
  const [importStatus, setImportStatus] = React.useState<"idle" | "success" | "error">("idle");

  const trackedProjects = React.useMemo(() => {
    return projects.filter((p) => trackedProjectIds.includes(p.id));
  }, [projects, trackedProjectIds]);

  const handleCustomTaskSubmit = (projectId: string) => {
    const input = taskInputs[projectId];
    if (!input || !input.title.trim()) return;
    addCustomTask(projectId, input.title.trim(), input.txHash.trim() || undefined);
    setTaskInputs((prev) => ({
      ...prev,
      [projectId]: { title: "", txHash: "" },
    }));
  };

  const handleWalletSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!walletLabel.trim() || !walletAddress.trim()) return;
    addWallet(walletLabel.trim(), walletAddress.trim());
    setWalletLabel("");
    setWalletAddress("");
    setWalletModalOpen(false);
  };

  const handleDownloadBackup = () => {
    const json = exportBackupJson();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `airdrop-tracker-backup-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportSubmit = () => {
    if (!importJsonText.trim()) return;
    const ok = importBackupJson(importJsonText);
    if (ok) {
      setImportStatus("success");
      setTimeout(() => {
        setBackupModalOpen(false);
        setImportStatus("idle");
        setImportJsonText("");
      }, 1200);
    } else {
      setImportStatus("error");
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Pencatat Progres Tugas
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Pantau penyelesaian tugas per proyek, simpan hash transaksi, dan kelola dompet garapan.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setWalletModalOpen(true)}
            className="text-xs"
          >
            <Wallet className="h-3.5 w-3.5 mr-1.5 text-slate-600" />
            Daftar Dompet ({wallets.length})
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setBackupModalOpen(true)}
            className="text-xs"
          >
            <Download className="h-3.5 w-3.5 mr-1.5 text-slate-600" />
            Cadangkan / Pulihkan
          </Button>
        </div>
      </div>

      {/* Main Tracked Projects List */}
      {trackedProjects.length > 0 ? (
        <div className="space-y-6">
          {trackedProjects.map((project) => {
            const completedIds = completedMilestones[project.id] || [];
            const totalTasks = project.milestoneTasks.length;
            const completedCount = completedIds.length;
            const percentage =
              totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

            const projectCustomTasks = customTasks.filter(
              (t) => t.projectId === project.id
            );

            return (
              <Card key={project.id} className="overflow-hidden">
                {/* Project Header Bar */}
                <CardHeader className="bg-slate-50/70 py-4 px-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white border border-slate-200 font-bold text-slate-900 text-xs">
                        {project.ticker || project.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-base font-semibold text-slate-900">
                            {project.name}
                          </h2>
                          <Badge
                            variant={
                              project.potential.tier === "Tier S"
                                ? "tier-s"
                                : project.potential.tier === "Tier A"
                                ? "tier-a"
                                : "tier-b"
                            }
                            size="sm"
                          >
                            {project.potential.tier}
                          </Badge>
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          {project.chains.join(", ")} • {project.costType}
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar & Counter */}
                    <div className="flex items-center gap-3 min-w-[200px]">
                      <div className="flex-1 space-y-1">
                        <div className="flex justify-between text-xs font-mono font-medium">
                          <span className="text-slate-500">Progres Tugas</span>
                          <span className="text-emerald-700 font-semibold">
                            {completedCount}/{totalTasks} ({percentage}%)
                          </span>
                        </div>
                        <Progress value={percentage} />
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleTrackProject(project.id)}
                        className="text-xs text-slate-400 hover:text-rose-600"
                        title="Hentikan tracking proyek ini"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-5 space-y-6">
                  {/* Preset Milestone Checklist */}
                  <div className="space-y-3">
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Daftar Tugas Utama
                    </div>

                    <div className="space-y-2">
                      {project.milestoneTasks.map((task) => {
                        const isDone = isMilestoneCompleted(project.id, task.id);

                        return (
                          <div
                            key={task.id}
                            className={`flex items-start justify-between gap-3 p-3 rounded-lg border transition-all ${
                              isDone
                                ? "bg-emerald-50/30 border-emerald-200"
                                : "bg-white border-slate-200 hover:border-slate-300"
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <button
                                onClick={() => toggleMilestoneTask(project.id, task.id)}
                                aria-label={`Tandai tugas ${task.title}`}
                                className="mt-0.5 shrink-0 text-slate-400 hover:text-emerald-600 transition-colors"
                              >
                                {isDone ? (
                                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                                ) : (
                                  <Circle className="h-5 w-5 text-slate-300 hover:text-slate-400" />
                                )}
                              </button>

                              <div>
                                <div className="flex items-center gap-2">
                                  <span
                                    className={`text-xs font-semibold ${
                                      isDone
                                        ? "text-slate-500 line-through"
                                        : "text-slate-900"
                                    }`}
                                  >
                                    {task.title}
                                  </span>
                                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                                    {task.category}
                                  </span>
                                  {task.isOptional && (
                                    <span className="text-[10px] text-slate-400">
                                      (Opsional)
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                                  {task.description}
                                </p>
                              </div>
                            </div>

                            {task.actionUrl && (
                              <a
                                href={task.actionUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="shrink-0 text-xs text-emerald-700 hover:text-emerald-800 font-medium inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-50 hover:bg-slate-100 border border-slate-200"
                              >
                                <span>Buka dApp</span>
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Custom Tasks & Tx Hash Notes */}
                  <div className="space-y-3 pt-3 border-t border-slate-100">
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                      <span>Catatan Transaksi & Tugas Tambahan</span>
                      <span className="text-[11px] text-slate-400 lowercase font-normal">
                        ({projectCustomTasks.length} catatan)
                      </span>
                    </div>

                    {/* Custom Task List */}
                    {projectCustomTasks.length > 0 && (
                      <div className="space-y-1.5">
                        {projectCustomTasks.map((ct) => (
                          <div
                            key={ct.id}
                            className="flex items-center justify-between gap-3 p-2 rounded-md bg-slate-50 border border-slate-200 text-xs"
                          >
                            <div className="flex items-center gap-2 flex-1">
                              <button
                                onClick={() => toggleCustomTask(ct.id)}
                                className="shrink-0"
                              >
                                {ct.completed ? (
                                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                                ) : (
                                  <Circle className="h-4 w-4 text-slate-300" />
                                )}
                              </button>
                              <span
                                className={
                                  ct.completed
                                    ? "text-slate-400 line-through"
                                    : "text-slate-800"
                                }
                              >
                                {ct.title}
                              </span>
                              {ct.txHash && (
                                <span className="font-mono text-[10px] bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-600 truncate max-w-xs">
                                  TX: {ct.txHash}
                                </span>
                              )}
                            </div>

                            <button
                              onClick={() => deleteCustomTask(ct.id)}
                              className="text-slate-400 hover:text-rose-600 p-1"
                              aria-label="Hapus catatan"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add Custom Task Form */}
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="text"
                        placeholder="Contoh: Deploy smart contract via Remix, Mint NFT #124..."
                        value={taskInputs[project.id]?.title || ""}
                        onChange={(e) =>
                          setTaskInputs((prev) => ({
                            ...prev,
                            [project.id]: {
                              title: e.target.value,
                              txHash: prev[project.id]?.txHash || "",
                            },
                          }))
                        }
                        className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-900 focus:border-emerald-600 focus:outline-none"
                      />
                      <input
                        type="text"
                        placeholder="TX Hash (opsional): 0x7a8b..."
                        value={taskInputs[project.id]?.txHash || ""}
                        onChange={(e) =>
                          setTaskInputs((prev) => ({
                            ...prev,
                            [project.id]: {
                              title: prev[project.id]?.title || "",
                              txHash: e.target.value,
                            },
                          }))
                        }
                        className="sm:w-48 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-mono text-slate-900 focus:border-emerald-600 focus:outline-none"
                      />
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleCustomTaskSubmit(project.id)}
                        className="text-xs"
                      >
                        <Plus className="h-3.5 w-3.5 mr-1" />
                        Tambah
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="rounded-lg border border-dashed border-slate-200 bg-white p-12 text-center space-y-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
            <CheckSquare className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-slate-900">
              Belum Ada Airdrop yang Ditrack
            </h3>
            <p className="max-w-md mx-auto text-xs text-slate-500 leading-relaxed">
              Pilih airdrop potensial dari katalog dan klik tombol &quot;Track&quot; untuk mulai mencatat progres dan task milestone Anda di sini.
            </p>
          </div>
          <Link href="/">
            <Button variant="primary" size="sm">
              Jelajahi Katalog Airdrop
            </Button>
          </Link>
        </div>
      )}

      {/* Wallet Management Modal */}
      <Modal
        isOpen={walletModalOpen}
        onClose={() => setWalletModalOpen(false)}
        maxWidth="md"
        title="Daftar Dompet / Wallet Garapan"
        description="Simpan alamat wallet untuk mencatat wallet mana yang mengerjakan proyek tertentu."
      >
        <div className="space-y-4 py-2 text-xs">
          {/* List of existing wallets */}
          <div className="space-y-2">
            {wallets.map((w) => (
              <div
                key={w.id}
                className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 bg-slate-50"
              >
                <div>
                  <div className="font-semibold text-slate-900">{w.label}</div>
                  <div className="font-mono text-slate-500 text-[11px] mt-0.5">
                    {w.address}
                  </div>
                </div>
                <button
                  onClick={() => deleteWallet(w.id)}
                  aria-label="Hapus wallet"
                  className="text-slate-400 hover:text-rose-600 p-1"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Form to add new wallet */}
          <form onSubmit={handleWalletSubmit} className="space-y-3 pt-3 border-t border-slate-100">
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-slate-600">Label Wallet</label>
              <input
                type="text"
                placeholder="Contoh: Metamask Utama, Rabby Sybil-2, OKX Taproot"
                value={walletLabel}
                onChange={(e) => setWalletLabel(e.target.value)}
                required
                className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-900 focus:border-emerald-600 focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-slate-600">Alamat Wallet</label>
              <input
                type="text"
                placeholder="0x... atau bc1p..."
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                required
                className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-mono text-slate-900 focus:border-emerald-600 focus:outline-none"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setWalletModalOpen(false)}
              >
                Batal
              </Button>
              <Button type="submit" variant="primary" size="sm">
                Simpan Wallet
              </Button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Backup & Restore Modal */}
      <Modal
        isOpen={backupModalOpen}
        onClose={() => setBackupModalOpen(false)}
        maxWidth="lg"
        title="Backup & Restore Data Tracker"
        description="Data progres task Anda tersimpan di browser. Ekspor cadangan JSON agar tidak hilang saat berganti perangkat."
      >
        <div className="space-y-5 py-2 text-xs">
          {/* Export Action */}
          <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 space-y-2">
            <div className="font-semibold text-slate-900">Unduh Cadangan JSON</div>
            <p className="text-slate-500 leading-relaxed text-[11px]">
              Simpan seluruh data progres milestone, checklist, catatan transaksi, dan wallet ke dalam satu file JSON.
            </p>
            <Button variant="primary" size="sm" onClick={handleDownloadBackup}>
              <Download className="h-3.5 w-3.5 mr-1.5" />
              Download Backup JSON
            </Button>
          </div>

          {/* Import Action */}
          <div className="space-y-2">
            <div className="font-semibold text-slate-900">Pulihkan / Impor JSON</div>
            <textarea
              rows={4}
              placeholder="Tempelkan isi file backup JSON di sini..."
              value={importJsonText}
              onChange={(e) => setImportJsonText(e.target.value)}
              className="w-full rounded-lg border border-slate-200 p-2.5 font-mono text-[11px] text-slate-900 focus:border-emerald-600 focus:outline-none"
            />

            {importStatus === "error" && (
              <div className="flex items-center gap-1.5 text-rose-600 text-xs">
                <AlertCircle className="h-4 w-4" />
                <span>Format JSON tidak valid atau struktur tidak sesuai.</span>
              </div>
            )}

            {importStatus === "success" && (
              <div className="flex items-center gap-1.5 text-emerald-700 text-xs">
                <CheckCircle2 className="h-4 w-4" />
                <span>Data berhasil dipulihkan!</span>
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={resetToDefaults}
                className="text-xs text-rose-600 hover:text-rose-700"
              >
                <RotateCcw className="h-3 w-3 mr-1" />
                Reset ke Default
              </Button>

              <Button
                variant="secondary"
                size="sm"
                onClick={handleImportSubmit}
                disabled={!importJsonText.trim()}
              >
                <Upload className="h-3.5 w-3.5 mr-1" />
                Pulihkan Data
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
