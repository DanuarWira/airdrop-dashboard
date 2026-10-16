"use client";

import * as React from "react";
import {
  Send,
  Search,
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  RefreshCw,
  Plus,
  Coins,
  ShieldCheck,
  AlertCircle,
  FileText,
  Layers,
  Radio,
} from "lucide-react";
import { useAirdrops } from "@/context/AirdropContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { AddEditAirdropModal } from "@/components/AddEditAirdropModal";
import { parseTelegramText, ParsedTelegramAirdrop } from "@/lib/telegramParser";

interface TelegramPost {
  id: string;
  channel: string;
  text: string;
  date: string;
  links: string[];
  parsedAirdrop?: ParsedTelegramAirdrop;
}

const PRESET_CHANNELS = [
  { label: "Airdrop Find", username: "airdropfind" },
  { label: "Garapan Crypto", username: "garapancrypto" },
  { label: "Airdrop Alert", username: "airdropalertcom" },
  { label: "Crypto Hunters", username: "airdropinspect" },
];

const SAMPLE_TELEGRAM_TEXT = `🔥 AIRDROP BARU: MONAD TESTNET (CONFIRMED AIRDROP)
Ticker: $MON
Tier: S
Raised: $225M dipimpin oleh Paradigm & Electric Capital
Ecosystem: Monad Parallel EVM Layer 1
Biaya: Free (Testnet)

Langkah-langkah garap / Task:
1. Setup RPC Monad di MetaMask via Chainlist
2. Claim Faucet MON: https://testnet.monad.xyz/
3. Lakukan 5x swap di Ambient DEX: https://testnet.ambient.finance/
4. Deploy contract sederhana via Thirdweb
5. Join Discord resmi & ambil verified role: https://discord.gg/monad

Official Links:
Website: https://monad.xyz/
Twitter: https://x.com/monad_xyz`;

export default function TelegramHubPage() {
  const { addProject } = useAirdrops();

  // Active view tab: "feed" vs "paste"
  const [activeTab, setActiveTab] = React.useState<"feed" | "paste">("feed");

  // Feed State
  const [channelInput, setChannelInput] = React.useState("airdropfind");
  const [currentChannel, setCurrentChannel] = React.useState("airdropfind");
  const [posts, setPosts] = React.useState<TelegramPost[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [feedError, setFeedError] = React.useState<string | null>(null);

  // Smart Paste State
  const [pasteText, setPasteText] = React.useState("");
  const [parsedResult, setParsedResult] = React.useState<ParsedTelegramAirdrop | null>(null);

  // Import Modal State
  const [importModalOpen, setImportModalOpen] = React.useState(false);
  const [projectToImport, setProjectToImport] = React.useState<any>(null);
  const [copiedPostId, setCopiedPostId] = React.useState<string | null>(null);

  // Fetch channel posts
  const fetchChannelFeed = React.useCallback(async (channelName: string) => {
    setIsLoading(true);
    setFeedError(null);
    try {
      const cleanChannel = channelName.replace(/^@/, "").trim();
      const res = await fetch(`/api/telegram-feed?channel=${cleanChannel}`);
      const data = await res.json();
      if (!res.ok || data.error) {
        setFeedError(data.error || "Gagal mengambil data dari channel.");
        setPosts([]);
      } else {
        setPosts(data.posts || []);
        setCurrentChannel(cleanChannel);
      }
    } catch {
      setFeedError("Gagal menghubungi server. Periksa koneksi internet.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load
  React.useEffect(() => {
    fetchChannelFeed("airdropfind");
  }, [fetchChannelFeed]);

  // Handle Smart Paste Parsing on text change
  React.useEffect(() => {
    if (pasteText.trim().length > 15) {
      const parsed = parseTelegramText(pasteText);
      setParsedResult(parsed);
    } else {
      setParsedResult(null);
    }
  }, [pasteText]);

  const handleChannelSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!channelInput.trim()) return;
    fetchChannelFeed(channelInput);
  };

  const handleOpenImportFromPost = (post: TelegramPost) => {
    const data = post.parsedAirdrop || parseTelegramText(post.text);
    setProjectToImport(data);
    setImportModalOpen(true);
  };

  const handleOpenImportFromPaste = () => {
    if (!parsedResult) return;
    setProjectToImport(parsedResult);
    setImportModalOpen(true);
  };

  const handleSaveImportedProject = (projectData: any) => {
    addProject(projectData);
    setImportModalOpen(false);
    alert(`Airdrop "${projectData.name}" berhasil disimpan ke katalog.`);
  };

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPostId(id);
    setTimeout(() => setCopiedPostId(null), 1500);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Feed & Ekstraktor Telegram
            </h1>
            <Badge variant="emerald" size="sm">
              <Radio className="h-3 w-3 mr-1 text-emerald-600" />
              Feed Langsung
            </Badge>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Pantau postingan airdrop dari kanal Telegram publik atau tempel pesan garapan untuk dimasukkan ke katalog.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center rounded-lg border border-slate-200 bg-white p-1 shadow-sm text-xs">
          <button
            onClick={() => setActiveTab("feed")}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeTab === "feed"
                ? "bg-emerald-600 text-white font-semibold shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Kanal Telegram
          </button>
          <button
            onClick={() => setActiveTab("paste")}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeTab === "paste"
                ? "bg-emerald-600 text-white font-semibold shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Tempel Teks
          </button>
        </div>
      </div>

      {activeTab === "feed" ? (
        /* ================= TAB 1: LIVE CHANNEL FEED ================= */
        <div className="space-y-4">
          {/* Channel Selector & Search */}
          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm space-y-3">
            <form onSubmit={handleChannelSubmit} className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-xs">
                  @
                </span>
                <input
                  type="text"
                  value={channelInput}
                  onChange={(e) => setChannelInput(e.target.value)}
                  placeholder="Nama kanal Telegram publik (contoh: airdropfind)..."
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-7 pr-3 text-xs font-mono text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <Button type="submit" variant="primary" size="sm" disabled={isLoading}>
                {isLoading ? (
                  <RefreshCw className="h-3.5 w-3.5 animate-spin mr-1" />
                ) : (
                  <Search className="h-3.5 w-3.5 mr-1" />
                )}
                Muat Kanal
              </Button>
            </form>

            {/* Quick Channel Presets */}
            <div className="flex items-center gap-1.5 flex-wrap text-xs pt-1 border-t border-slate-100">
              <span className="text-slate-400 text-[11px] font-medium mr-1">
                Kanal Rekomendasi:
              </span>
              {PRESET_CHANNELS.map((preset) => (
                <button
                  key={preset.username}
                  onClick={() => {
                    setChannelInput(preset.username);
                    fetchChannelFeed(preset.username);
                  }}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition-colors border ${
                    currentChannel === preset.username
                      ? "bg-emerald-50 text-emerald-800 border-emerald-300 font-semibold"
                      : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  @{preset.username}
                </button>
              ))}
            </div>
          </div>

          {/* Error Notice */}
          {feedError && (
            <div className="p-4 rounded-lg border border-rose-200 bg-rose-50 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
              <span>{feedError}</span>
            </div>
          )}

          {/* Posts Feed List */}
          {isLoading ? (
            <div className="p-12 text-center space-y-3 bg-white rounded-lg border border-slate-200">
              <RefreshCw className="h-6 w-6 animate-spin text-emerald-600 mx-auto" />
              <p className="text-xs text-slate-500">
                Memuat postingan dari @{currentChannel}...
              </p>
            </div>
          ) : posts.length > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                <span>
                  Menampilkan <strong>{posts.length}</strong> postingan dari @{currentChannel}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  Sumber: t.me/s/{currentChannel}
                </span>
              </div>

              {posts.map((post) => {
                const parsed = post.parsedAirdrop;

                return (
                  <Card key={post.id} className="overflow-hidden hover:border-slate-300 transition-all">
                    <CardHeader className="bg-slate-50/70 py-3 px-4 border-b border-slate-100">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                            {post.channel}
                          </span>
                          {parsed && parsed.name && (
                            <span className="text-xs font-semibold text-slate-900">
                              Proyek: <strong>{parsed.name}</strong>
                              {parsed.ticker && ` ($${parsed.ticker})`}
                            </span>
                          )}
                          {parsed && (
                            <Badge variant={parsed.potential.tier === "Tier S" ? "tier-s" : "tier-a"} size="sm">
                              {parsed.potential.tier}
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5 text-xs">
                          <button
                            onClick={() => handleCopyText(post.text, post.id)}
                            className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors"
                            title="Salin teks postingan"
                          >
                            {copiedPostId === post.id ? (
                              <Check className="h-3.5 w-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="h-3.5 w-3.5" />
                            )}
                          </button>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="p-4 space-y-3.5 text-xs">
                      {/* Post Content */}
                      <div className="whitespace-pre-line text-slate-700 leading-relaxed font-sans text-xs bg-slate-50/50 p-3 rounded-lg border border-slate-100">
                        {post.text}
                      </div>

                      {/* Links preview */}
                      {post.links.length > 0 && (
                        <div className="space-y-1">
                          <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 block">
                            Tautan Terdeteksi ({post.links.length}):
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {post.links.map((link, idx) => (
                              <a
                                key={idx}
                                href={link}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white text-[11px] font-mono text-emerald-700 border border-slate-200 hover:border-emerald-300 truncate max-w-sm"
                              >
                                <span>{link.replace(/^https?:\/\//, "").slice(0, 35)}...</span>
                                <ExternalLink className="h-2.5 w-2.5 shrink-0" />
                              </a>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Import Action Banner */}
                      <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                        <span className="text-[11px] text-slate-400">
                          {parsed?.milestoneTasks.length || 0} tugas terdeteksi
                        </span>

                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleOpenImportFromPost(post)}
                          className="text-xs"
                        >
                          <Plus className="h-3.5 w-3.5 mr-1" />
                          Simpan ke Katalog
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="p-12 text-center space-y-3 bg-white rounded-lg border border-slate-200">
              <Send className="h-8 w-8 text-slate-400 mx-auto" />
              <h3 className="text-sm font-semibold text-slate-900">
                Tidak ada pesan yang dapat dimuat dari @{currentChannel}
              </h3>
              <p className="max-w-md mx-auto text-xs text-slate-500">
                Pastikan kanal Telegram berstatus publik dan memiliki postingan.
              </p>
            </div>
          )}
        </div>
      ) : (
        /* ================= TAB 2: SMART PASTE & PARSE ================= */
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Input Textarea */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700">
                  Teks Garapan Telegram:
                </span>
                <button
                  onClick={() => setPasteText(SAMPLE_TELEGRAM_TEXT)}
                  className="text-xs text-emerald-700 hover:underline font-medium inline-flex items-center gap-1"
                >
                  <Sparkles className="h-3 w-3" />
                  Gunakan Contoh Teks
                </button>
              </div>

              <textarea
                rows={14}
                value={pasteText}
                onChange={(e) => setPasteText(e.target.value)}
                placeholder="Tempel pesan informasi airdrop dari Telegram di sini...&#10;&#10;Sistem mengekstrak nama proyek, ticker, pendanaan, investor, tugas, dan tautan resmi."
                className="w-full rounded-lg border border-slate-200 bg-white p-3.5 text-xs font-mono text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:outline-none shadow-sm"
              />

              <div className="flex justify-between items-center text-xs text-slate-500">
                <span>{pasteText.length} karakter</span>
                {pasteText && (
                  <button
                    onClick={() => setPasteText("")}
                    className="text-xs text-slate-400 hover:text-rose-600"
                  >
                    Bersihkan Teks
                  </button>
                )}
              </div>
            </div>

            {/* Right: Real-time Parsed Preview */}
            <div className="space-y-3">
              <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                <span>Hasil Ekstraksi:</span>
              </span>

              {parsedResult ? (
                <Card className="p-4 space-y-4">
                  {/* Extracted Header */}
                  <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-bold text-slate-900">
                          {parsedResult.name}
                        </span>
                        {parsedResult.ticker && (
                          <span className="text-xs font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">
                            ${parsedResult.ticker}
                          </span>
                        )}
                        <Badge
                          variant={parsedResult.potential.tier === "Tier S" ? "tier-s" : "tier-a"}
                          size="sm"
                        >
                          {parsedResult.potential.tier} • {parsedResult.potential.score}/100
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Kategori: {parsedResult.category} • Biaya: {parsedResult.costType}
                      </p>
                    </div>

                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleOpenImportFromPaste}
                      className="shrink-0 text-xs"
                    >
                      <Plus className="h-3.5 w-3.5 mr-1" />
                      Simpan ke Katalog
                    </Button>
                  </div>

                  {/* Funding & Backers */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                      <span className="text-[10px] text-slate-400 block font-medium">PENDANAAN</span>
                      <span className="font-mono font-bold text-slate-900 text-sm">
                        ${(parsedResult.potential.fundingRaisedUsd / 1_000_000).toFixed(0)}M
                      </span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                      <span className="text-[10px] text-slate-400 block font-medium">INVESTOR UTAMA</span>
                      <span className="font-medium text-slate-800 truncate block">
                        {parsedResult.potential.leadBackers.join(", ")}
                      </span>
                    </div>
                  </div>

                  {/* Tasks Detected */}
                  <div className="space-y-1.5 text-xs">
                    <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider block">
                      Daftar Tugas Terdeteksi ({parsedResult.milestoneTasks.length}):
                    </span>
                    <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                      {parsedResult.milestoneTasks.map((t, idx) => (
                        <div
                          key={idx}
                          className="p-2 rounded bg-slate-50 border border-slate-200 text-xs flex items-center justify-between gap-2"
                        >
                          <span className="font-medium text-slate-800 truncate">{t.title}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-white text-slate-500 border border-slate-200 shrink-0">
                            {t.category}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Links Detected */}
                  <div className="text-xs space-y-1 pt-2 border-t border-slate-100">
                    <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider block">
                      Tautan Resmi:
                    </span>
                    <div className="text-[11px] text-slate-600 space-y-0.5">
                      <div>Website: <span className="font-mono text-emerald-700">{parsedResult.links.website}</span></div>
                      <div>Twitter / X: <span className="font-mono text-slate-700">{parsedResult.links.twitter}</span></div>
                    </div>
                  </div>
                </Card>
              ) : (
                <div className="p-12 text-center space-y-2 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                  <FileText className="h-6 w-6 text-slate-400 mx-auto" />
                  <p className="text-xs text-slate-500">
                    Tempel teks garapan di kolom kiri untuk melihat hasil ekstraksi data di sini.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Import Modal */}
      <AddEditAirdropModal
        isOpen={importModalOpen}
        onClose={() => {
          setImportModalOpen(false);
          setProjectToImport(null);
        }}
        projectToEdit={projectToImport}
        onSave={handleSaveImportedProject}
      />
    </div>
  );
}
