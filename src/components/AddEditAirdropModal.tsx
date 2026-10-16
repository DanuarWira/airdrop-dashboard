"use client";

import * as React from "react";
import {
  AirdropProject,
  ProjectCategory,
  ProjectStatus,
  CostType,
  PotentialTier,
} from "@/types/airdrop";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Send, Sparkles, ChevronDown, ChevronUp } from "lucide-react";
import { parseTelegramText } from "@/lib/telegramParser";

interface AddEditAirdropModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectToEdit?: AirdropProject | null;
  onSave: (projectData: any) => void;
  onDelete?: (projectId: string) => void;
}

export const AddEditAirdropModal: React.FC<AddEditAirdropModalProps> = ({
  isOpen,
  onClose,
  projectToEdit,
  onSave,
  onDelete,
}) => {
  const isEditing = !!projectToEdit;

  // Form State
  const [name, setName] = React.useState("");
  const [ticker, setTicker] = React.useState("");
  const [category, setCategory] = React.useState<ProjectCategory>("Layer 1");
  const [chainsStr, setChainsStr] = React.useState("");
  const [status, setStatus] = React.useState<ProjectStatus>("Testnet Live");
  const [costType, setCostType] = React.useState<CostType>("Free (Testnet)");
  const [shortDescription, setShortDescription] = React.useState("");
  const [defiLlamaSlug, setDefiLlamaSlug] = React.useState("");

  // Potential fields
  const [tier, setTier] = React.useState<PotentialTier>("Tier S");
  const [score, setScore] = React.useState(90);
  const [fundingRaisedUsd, setFundingRaisedUsd] = React.useState(50000000);
  const [leadBackersStr, setLeadBackersStr] = React.useState("");
  const [justificationSummary, setJustificationSummary] = React.useState("");
  const [bullishLines, setBullishLines] = React.useState("");
  const [riskLines, setRiskLines] = React.useState("");
  const [estimatedTGE, setEstimatedTGE] = React.useState("Q4 2026");
  const [expectedRewardTier, setExpectedRewardTier] = React.useState<
    "Massive ($1,500+)" | "Substantial ($500-$1,500)" | "Moderate ($150-$500)" | "Speculative"
  >("Substantial ($500-$1,500)");

  // Links
  const [website, setWebsite] = React.useState("");
  const [twitter, setTwitter] = React.useState("");
  const [docs, setDocs] = React.useState("");

  // Telegram Paste Helper State
  const [showTelegramPaste, setShowTelegramPaste] = React.useState(false);
  const [telegramRawInput, setTelegramRawInput] = React.useState("");

  const handleApplyTelegramParse = () => {
    if (!telegramRawInput.trim()) return;
    const parsed = parseTelegramText(telegramRawInput);
    if (parsed.name) setName(parsed.name);
    if (parsed.ticker) setTicker(parsed.ticker);
    setCategory(parsed.category);
    if (parsed.chains.length > 0) setChainsStr(parsed.chains.join(", "));
    setStatus(parsed.status);
    setCostType(parsed.costType);
    setShortDescription(parsed.shortDescription);
    setTier(parsed.potential.tier);
    setScore(parsed.potential.score);
    setFundingRaisedUsd(parsed.potential.fundingRaisedUsd);
    setLeadBackersStr(parsed.potential.leadBackers.join(", "));
    setJustificationSummary(parsed.potential.justificationSummary);
    setBullishLines(parsed.potential.bullishFactors.join("\n"));
    setRiskLines(parsed.potential.riskFactors.join("\n"));
    setWebsite(parsed.links.website);
    setTwitter(parsed.links.twitter);
    if (parsed.links.docs) setDocs(parsed.links.docs);
    setShowTelegramPaste(false);
    setTelegramRawInput("");
  };

  // Sync state when opening or changing project
  React.useEffect(() => {
    if (projectToEdit) {
      setName(projectToEdit.name);
      setTicker(projectToEdit.ticker || "");
      setCategory(projectToEdit.category);
      setChainsStr(projectToEdit.chains.join(", "));
      setStatus(projectToEdit.status);
      setCostType(projectToEdit.costType);
      setShortDescription(projectToEdit.shortDescription);
      setDefiLlamaSlug(projectToEdit.defiLlamaSlug || "");

      setTier(projectToEdit.potential.tier);
      setScore(projectToEdit.potential.score);
      setFundingRaisedUsd(projectToEdit.potential.fundingRaisedUsd);
      setLeadBackersStr(projectToEdit.potential.leadBackers.join(", "));
      setJustificationSummary(projectToEdit.potential.justificationSummary);
      setBullishLines(projectToEdit.potential.bullishFactors.join("\n"));
      setRiskLines(projectToEdit.potential.riskFactors.join("\n"));
      setEstimatedTGE(projectToEdit.potential.estimatedTGE);
      setExpectedRewardTier(projectToEdit.potential.expectedRewardTier);

      setWebsite(projectToEdit.links.website);
      setTwitter(projectToEdit.links.twitter);
      setDocs(projectToEdit.links.docs || "");
    } else {
      // Reset defaults for adding new
      setName("");
      setTicker("");
      setCategory("Layer 1");
      setChainsStr("EVM Testnet");
      setStatus("Testnet Live");
      setCostType("Free (Testnet)");
      setShortDescription("");
      setDefiLlamaSlug("");

      setTier("Tier S");
      setScore(90);
      setFundingRaisedUsd(25000000);
      setLeadBackersStr("Paradigm, a16z");
      setJustificationSummary("");
      setBullishLines("Pendanaan tier-1 dengan alokasi komunitas tinggi.\nEkosistem dApp aktif.");
      setRiskLines("Kompetisi tinggi, potensi filter Sybil on-chain.");
      setEstimatedTGE("Q4 2026");
      setExpectedRewardTier("Substantial ($500-$1,500)");

      setWebsite("https://");
      setTwitter("https://x.com/");
      setDocs("");
    }
  }, [projectToEdit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const chains = chainsStr
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const leadBackers = leadBackersStr
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const bullishFactors = bullishLines
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    const riskFactors = riskLines
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    const projectData = {
      ...(projectToEdit ? { id: projectToEdit.id, slug: projectToEdit.slug } : {}),
      name: name.trim(),
      slug: projectToEdit?.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      ticker: ticker.trim().toUpperCase() || undefined,
      shortDescription: shortDescription.trim(),
      logo:
        projectToEdit?.logo ||
        "https://images.unsplash.com/photo-1622979135225-d2ba269bc1df?w=128&auto=format&fit=crop&q=80",
      category,
      chains: chains.length > 0 ? chains : ["EVM"],
      status,
      costType,
      defiLlamaSlug: defiLlamaSlug.trim() || undefined,
      potential: {
        tier,
        score: Number(score),
        fundingRaisedUsd: Number(fundingRaisedUsd),
        leadBackers: leadBackers.length > 0 ? leadBackers : ["Early Angel Investors"],
        justificationSummary:
          justificationSummary.trim() ||
          `${name} memiliki daya tarik ekosistem kuat dan dukungan modal ventura untuk potensi airdrop komunitas.`,
        bullishFactors:
          bullishFactors.length > 0 ? bullishFactors : ["Dukungan pengembang aktif."],
        riskFactors: riskFactors.length > 0 ? riskFactors : ["Risiko pasar standar Web3."],
        estimatedTGE,
        expectedRewardTier,
      },
      links: {
        website: website.trim() || "https://",
        twitter: twitter.trim() || "https://x.com/",
        docs: docs.trim() || undefined,
      },
      milestoneTasks: projectToEdit?.milestoneTasks || [
        {
          id: `task-${Date.now()}-1`,
          title: "Setup Wallet & Hubungkan RPC",
          description: "Tambahkan jaringan ke wallet pribadi.",
          category: "Setup",
        },
      ],
      dailyTasks: projectToEdit?.dailyTasks || [],
      faucetLinks: projectToEdit?.faucetLinks || [],
      timeline: projectToEdit?.timeline || [
        {
          id: `time-${Date.now()}-1`,
          date: estimatedTGE,
          title: "Estimasi TGE & Klaim Token",
          description: "Peluncuran token generasi awal.",
          type: "tge_claim",
          isCompleted: false,
        },
      ],
    };

    onSave(projectData);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="2xl"
      title={isEditing ? `Edit Proyek: ${projectToEdit?.name}` : "Tambah Proyek Airdrop"}
      description="Lengkapi informasi proyek, data pendanaan, dan tautan resmi."
    >
      <form onSubmit={handleSubmit} className="space-y-4 py-2 text-xs">
        {/* Quick Auto-Fill via Telegram Post */}
        <div className="rounded-lg border border-emerald-200 bg-emerald-50/50 p-3">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setShowTelegramPaste(!showTelegramPaste)}
              className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800 hover:text-emerald-900"
            >
              <Send className="h-3.5 w-3.5 text-emerald-600" />
              <span>Isi Otomatis dari Teks Telegram</span>
              {showTelegramPaste ? (
                <ChevronUp className="h-3.5 w-3.5 ml-1" />
              ) : (
                <ChevronDown className="h-3.5 w-3.5 ml-1" />
              )}
            </button>
            <span className="text-[10px] text-slate-500 font-mono">Ekstraksi Otomatis</span>
          </div>

          {showTelegramPaste && (
            <div className="mt-2.5 space-y-2 pt-2 border-t border-emerald-200/60">
              <textarea
                rows={4}
                value={telegramRawInput}
                onChange={(e) => setTelegramRawInput(e.target.value)}
                placeholder="Tempel pesan garapan dari Telegram di sini..."
                className="w-full rounded-md border border-slate-200 bg-white p-2 text-xs font-mono text-slate-900 focus:border-emerald-600 focus:outline-none"
              />
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowTelegramPaste(false)}
                >
                  Tutup
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  disabled={!telegramRawInput.trim()}
                  onClick={handleApplyTelegramParse}
                >
                  <Sparkles className="h-3 w-3 mr-1" />
                  Terapkan ke Formulir
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Section 1: Basic Project Info */}
        <div className="space-y-3">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block">
            1. Informasi Dasar Proyek
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-slate-700">Nama Proyek *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Monad, Berachain..."
                className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-900 focus:border-emerald-600 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-medium text-slate-700">Ticker Token</label>
              <input
                type="text"
                value={ticker}
                onChange={(e) => setTicker(e.target.value)}
                placeholder="Contoh: MON, BERA"
                className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-mono text-slate-900 focus:border-emerald-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-slate-700">Kategori</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ProjectCategory)}
                className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-800 focus:border-emerald-600 focus:outline-none"
              >
                <option value="Layer 1">Layer 1</option>
                <option value="Layer 2">Layer 2</option>
                <option value="DeFi">DeFi</option>
                <option value="Restaking">Restaking</option>
                <option value="DePIN">DePIN</option>
                <option value="AI x Web3">AI x Web3</option>
                <option value="Prediction Market">Prediction Market</option>
                <option value="Interoperability">Interoperability</option>
                <option value="SocialFi">SocialFi</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-medium text-slate-700">Status Proyek</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ProjectStatus)}
                className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-800 focus:border-emerald-600 focus:outline-none"
              >
                <option value="Testnet Live">Testnet Aktif</option>
                <option value="Mainnet / Points">Mainnet / Musim Poin</option>
                <option value="Confirmed">Terkonfirmasi</option>
                <option value="Snapshot Soon">Menjelang Snapshot</option>
                <option value="Speculative">Spekulatif</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-medium text-slate-700">Biaya Garap</label>
              <select
                value={costType}
                onChange={(e) => setCostType(e.target.value as CostType)}
                className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-800 focus:border-emerald-600 focus:outline-none"
              >
                <option value="Free (Testnet)">Gratis (Testnet)</option>
                <option value="Low Gas (< $5)">Gas Rendah (&lt; $5)</option>
                <option value="Medium Gas ($5-$30)">Gas Sedang ($5-$30)</option>
                <option value="Capital / Staking">Modal / Staking</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-medium text-slate-700">Jaringan (pisahkan dengan koma)</label>
            <input
              type="text"
              value={chainsStr}
              onChange={(e) => setChainsStr(e.target.value)}
              placeholder="Contoh: Monad Testnet, EVM, Solana"
              className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-900 focus:border-emerald-600 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-medium text-slate-700">Deskripsi Singkat</label>
            <input
              type="text"
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="Ringkasan singkat tentang proyek ini..."
              className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-900 focus:border-emerald-600 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-medium text-slate-700 flex items-center justify-between">
              <span>Slug Protokol DeFiLlama (Opsional, untuk sinkronisasi TVL)</span>
              <span className="text-[10px] text-slate-400">Contoh: babylon-protocol, polymarket-international</span>
            </label>
            <input
              type="text"
              value={defiLlamaSlug}
              onChange={(e) => setDefiLlamaSlug(e.target.value)}
              placeholder="Slug protokol di defillama.com"
              className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-mono text-slate-900 focus:border-emerald-600 focus:outline-none"
            />
          </div>
        </div>

        {/* Section 2: Potential & Justification */}
        <div className="space-y-3 pt-3 border-t border-slate-100">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block">
            2. Evaluasi & Analisis Potensi
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-slate-700">Tier Potensi</label>
              <select
                value={tier}
                onChange={(e) => setTier(e.target.value as PotentialTier)}
                className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-800 focus:border-emerald-600 focus:outline-none"
              >
                <option value="Tier S">Tier S (Potensi Utama)</option>
                <option value="Tier A">Tier A (Potensi Tinggi)</option>
                <option value="Tier B">Tier B (Potensi Menengah)</option>
                <option value="Tier C">Tier C (Spekulatif)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-medium text-slate-700">Skor Potensi (0 - 100)</label>
              <input
                type="number"
                min={0}
                max={100}
                value={score}
                onChange={(e) => setScore(Number(e.target.value))}
                className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-mono text-slate-900 focus:border-emerald-600 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-medium text-slate-700">Total Pendanaan ($USD)</label>
              <input
                type="number"
                value={fundingRaisedUsd}
                onChange={(e) => setFundingRaisedUsd(Number(e.target.value))}
                placeholder="25000000"
                className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-mono text-slate-900 focus:border-emerald-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-medium text-slate-700">Investor Utama / VC (pisahkan dengan koma)</label>
            <input
              type="text"
              value={leadBackersStr}
              onChange={(e) => setLeadBackersStr(e.target.value)}
              placeholder="Paradigm, Polychain Capital, a16z crypto..."
              className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-900 focus:border-emerald-600 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-medium text-slate-700">Alasan dan Analisis Potensi *</label>
            <textarea
              rows={2}
              required
              value={justificationSummary}
              onChange={(e) => setJustificationSummary(e.target.value)}
              placeholder="Jelaskan faktor pendukung potensi airdrop seperti pendanaan, alokasi komunitas, atau ekosistem..."
              className="w-full rounded-lg border border-slate-200 p-2.5 text-xs text-slate-900 focus:border-emerald-600 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-emerald-800">Faktor Pendorong (1 per baris)</label>
              <textarea
                rows={2}
                value={bullishLines}
                onChange={(e) => setBullishLines(e.target.value)}
                placeholder="Faktor 1&#10;Faktor 2"
                className="w-full rounded-lg border border-slate-200 p-2 text-xs text-slate-900 focus:border-emerald-600 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-medium text-amber-800">Faktor Risiko & Sybil (1 per baris)</label>
              <textarea
                rows={2}
                value={riskLines}
                onChange={(e) => setRiskLines(e.target.value)}
                placeholder="Risiko 1&#10;Risiko 2"
                className="w-full rounded-lg border border-slate-200 p-2 text-xs text-slate-900 focus:border-emerald-600 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Links */}
        <div className="space-y-3 pt-3 border-t border-slate-100">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block">
            3. Tautan Resmi
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-slate-700">Website</label>
              <input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-900 focus:border-emerald-600 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-medium text-slate-700">Twitter / X</label>
              <input
                type="url"
                value={twitter}
                onChange={(e) => setTwitter(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-900 focus:border-emerald-600 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-medium text-slate-700">Dokumentasi</label>
              <input
                type="url"
                value={docs}
                onChange={(e) => setDocs(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-900 focus:border-emerald-600 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Submit / Delete Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <div>
            {isEditing && onDelete && (
              <Button
                type="button"
                variant="danger"
                size="sm"
                onClick={() => {
                  if (confirm(`Yakin ingin menghapus proyek ${projectToEdit?.name}?`)) {
                    onDelete(projectToEdit!.id);
                    onClose();
                  }
                }}
              >
                Hapus Proyek
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit" variant="primary" size="sm">
              {isEditing ? "Simpan Perubahan" : "Simpan ke Katalog"}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};
