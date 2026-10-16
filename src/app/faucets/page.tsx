"use client";

import * as React from "react";
import {
  Droplets,
  ExternalLink,
  Search,
  ShieldAlert,
  Copy,
  Check,
  Wallet,
} from "lucide-react";
import { useAirdrops } from "@/context/AirdropContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

// Additional public testnet faucets for comprehensive Web3 coverage
const GENERAL_FAUCETS = [
  {
    id: "eth-sepolia-alchemy",
    name: "Alchemy Sepolia Faucet",
    url: "https://sepoliafaucet.com/",
    network: "Ethereum Sepolia",
    requirements: "Akun Alchemy (saldo mainnet min. 0.001 ETH)",
    dripAmount: "0.5 Sepolia ETH / 24 jam",
    project: "Infrastruktur Ethereum",
  },
  {
    id: "eth-holesky-pk910",
    name: "Holesky PoW Faucet",
    url: "https://holesky-faucet.pk910.de/",
    network: "Ethereum Holesky",
    requirements: "Mining browser Proof-of-Work (tanpa login)",
    dripAmount: "Hingga 50 Holesky ETH",
    project: "Ethereum Staking & L1",
  },
  {
    id: "base-sepolia-coinbase",
    name: "Coinbase Developer Faucet",
    url: "https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet",
    network: "Base Sepolia",
    requirements: "Dompet Coinbase atau login akun",
    dripAmount: "0.05 Base ETH / 24 jam",
    project: "Ekosistem Base",
  },
  {
    id: "arbitrum-sepolia-bridge",
    name: "Arbitrum Sepolia Faucet",
    url: "https://faucet.quicknode.com/arbitrum/sepolia",
    network: "Arbitrum Sepolia",
    requirements: "Akun QuickNode atau verifikasi akun X",
    dripAmount: "0.05 Sepolia ETH",
    project: "Arbitrum Nitro",
  },
];

export default function FaucetsPage() {
  const { projects, wallets } = useAirdrops();

  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedNetwork, setSelectedNetwork] = React.useState<string>("ALL");
  const [copiedWalletId, setCopiedWalletId] = React.useState<string | null>(null);

  // Consolidate project faucets with general faucets
  const allFaucets = React.useMemo(() => {
    const list = [...GENERAL_FAUCETS];

    projects.forEach((p) => {
      p.faucetLinks.forEach((f) => {
        list.push({
          id: f.id,
          name: f.name,
          url: f.url,
          network: f.network,
          requirements: f.requirements,
          dripAmount: f.dripAmount,
          project: p.name,
        });
      });
    });

    return list;
  }, [projects]);

  // Unique networks for filtering
  const networks = React.useMemo(() => {
    const set = new Set<string>();
    allFaucets.forEach((f) => set.add(f.network));
    return Array.from(set).sort();
  }, [allFaucets]);

  // Filtered faucets
  const filteredFaucets = React.useMemo(() => {
    return allFaucets.filter((f) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = f.name.toLowerCase().includes(q);
        const matchNet = f.network.toLowerCase().includes(q);
        const matchProject = f.project.toLowerCase().includes(q);
        if (!matchName && !matchNet && !matchProject) return false;
      }

      if (selectedNetwork !== "ALL" && f.network !== selectedNetwork) {
        return false;
      }

      return true;
    });
  }, [allFaucets, searchQuery, selectedNetwork]);

  const copyToClipboard = (address: string, id: string) => {
    navigator.clipboard.writeText(address);
    setCopiedWalletId(id);
    setTimeout(() => setCopiedWalletId(null), 1500);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Direktori Faucet Testnet
            </h1>
            <Badge variant="emerald" size="sm">
              {allFaucets.length} Faucet Tersedia
            </Badge>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Tautan faucet resmi untuk klaim token gas testnet di berbagai jaringan L1 dan L2.
          </p>
        </div>

        {/* Quick Wallet Address Copier */}
        {wallets.length > 0 && (
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg p-2 px-3 shadow-sm text-xs">
            <Wallet className="h-4 w-4 text-emerald-600 shrink-0" />
            <div className="truncate max-w-[180px]">
              <span className="text-[10px] text-slate-400 block font-medium">DOMPET AKTIF</span>
              <span className="font-mono text-slate-800 font-semibold truncate block">
                {wallets[0].address}
              </span>
            </div>
            <button
              onClick={() => copyToClipboard(wallets[0].address, wallets[0].id)}
              className="p-1 text-slate-400 hover:text-emerald-700 rounded transition-colors"
              title="Salin alamat"
            >
              {copiedWalletId === wallets[0].id ? (
                <Check className="h-4 w-4 text-emerald-600" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </button>
          </div>
        )}
      </div>

      {/* Security Tip Banner */}
      <div className="rounded-lg border border-amber-200/80 bg-amber-50/50 p-4 text-xs text-amber-900 flex items-start gap-3">
        <ShieldAlert className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-semibold text-slate-900">Tips Keamanan:</span>
          <p className="text-slate-600 leading-relaxed">
            Gunakan dompet khusus garapan (burner wallet). Hindari menghubungkan dompet utama yang menyimpan aset penting ke dApp testnet yang belum diaudit.
          </p>
        </div>
      </div>

      {/* Search & Network Filter Toolbar */}
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari faucet, jaringan, atau proyek..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-emerald-600 focus:outline-none"
            />
          </div>

          <select
            value={selectedNetwork}
            onChange={(e) => setSelectedNetwork(e.target.value)}
            aria-label="Filter berdasarkan jaringan testnet"
            className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-800 focus:border-emerald-600 focus:outline-none"
          >
            <option value="ALL">Semua Jaringan ({allFaucets.length})</option>
            {networks.map((net) => (
              <option key={net} value={net}>
                {net}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Faucet Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFaucets.map((faucet) => (
          <Card key={faucet.id} className="flex flex-col h-full hover:border-slate-300 transition-all">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <Badge variant="neutral" size="sm" className="mb-1 font-mono text-[10px]">
                    {faucet.network}
                  </Badge>
                  <CardTitle className="text-sm font-semibold text-slate-900 mt-1">
                    {faucet.name}
                  </CardTitle>
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-50 text-sky-700 border border-sky-200 shrink-0">
                  <Droplets className="h-4 w-4" />
                </div>
              </div>
            </CardHeader>

            <CardContent className="flex-1 space-y-3 pb-4 text-xs">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                  Jumlah Klaim
                </span>
                <div className="font-mono font-semibold text-emerald-800">
                  {faucet.dripAmount}
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                  Syarat Klaim
                </span>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  {faucet.requirements}
                </p>
              </div>

              <div className="text-[11px] text-slate-400">
                Ekosistem: <span className="font-medium text-slate-700">{faucet.project}</span>
              </div>
            </CardContent>

            <div className="p-4 pt-0 border-t border-slate-100 mt-auto">
              <a
                href={faucet.url}
                target="_blank"
                rel="noreferrer"
                className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm transition-colors mt-3"
              >
                <span>Buka Faucet</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
