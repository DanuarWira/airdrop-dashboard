"use client";

import * as React from "react";
import {
  TrendingUp,
  ShieldCheck,
  AlertTriangle,
  Coins,
  Calendar,
  ExternalLink,
  Award,
  Layers,
  Droplets,
  CheckCircle2,
} from "lucide-react";
import { AirdropProject } from "@/types/airdrop";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/lib/utils";

interface JustificationModalProps {
  project: AirdropProject | null;
  isOpen: boolean;
  onClose: () => void;
  onTrackToggle?: (projectId: string) => void;
  isTracking?: boolean;
  onEdit?: (project: AirdropProject) => void;
}

export const JustificationModal: React.FC<JustificationModalProps> = ({
  project,
  isOpen,
  onClose,
  onTrackToggle,
  isTracking = false,
  onEdit,
}) => {
  if (!project) return null;

  const { potential } = project;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="3xl"
      title={
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-sm">
            {project.ticker || project.name.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-semibold text-slate-900">
                {project.name}
              </span>
              <Badge
                variant={
                  potential.tier === "Tier S"
                    ? "tier-s"
                    : potential.tier === "Tier A"
                    ? "tier-a"
                    : "tier-b"
                }
              >
                {potential.tier} • Skor {potential.score}/100
              </Badge>
            </div>
            <p className="text-xs text-slate-500 font-normal mt-0.5">
              {project.category} • {project.chains.join(", ")}
            </p>
          </div>
        </div>
      }
    >
      <div className="space-y-6 text-sm text-slate-700 py-2">
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-lg border border-slate-200 bg-slate-50/60 p-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
              <Coins className="h-3.5 w-3.5 text-emerald-600" />
              <span>Total Pendanaan</span>
            </div>
            <div className="text-base font-bold text-slate-900 font-mono">
              {formatCurrency(potential.fundingRaisedUsd)}
            </div>
            {typeof project.liveTvlUsd === "number" ? (
              <div className="text-[10px] text-emerald-700 font-mono font-semibold">
                TVL Terkini: {formatCurrency(project.liveTvlUsd)}
              </div>
            ) : potential.valuationUsd ? (
              <div className="text-[10px] text-slate-500 font-mono">
                Valuasi: {formatCurrency(potential.valuationUsd)}
              </div>
            ) : null}
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50/60 p-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
              <Award className="h-3.5 w-3.5 text-sky-600" />
              <span>Perkiraan Nilai</span>
            </div>
            <div className="text-sm font-semibold text-slate-900">
              {potential.expectedRewardTier
                .replace("Massive", "Sangat Besar")
                .replace("Substantial", "Besar")
                .replace("Moderate", "Sedang")
                .replace("Speculative", "Spekulatif")}
            </div>
            <div className="text-[10px] text-slate-500">Estimasi reward</div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50/60 p-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
              <Calendar className="h-3.5 w-3.5 text-amber-600" />
              <span>Estimasi TGE</span>
            </div>
            <div className="text-sm font-semibold text-slate-900">
              {potential.estimatedTGE}
            </div>
            <div className="text-[10px] text-slate-500">Jadwal distribusi</div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50/60 p-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
              <Layers className="h-3.5 w-3.5 text-emerald-600" />
              <span>Biaya Garap</span>
            </div>
            <div className="text-sm font-semibold text-emerald-700">
              {project.costType
                .replace("Free (Testnet)", "Gratis (Testnet)")
                .replace("Low Gas", "Gas Rendah")
                .replace("Medium Gas", "Gas Sedang")
                .replace("Capital / Staking", "Modal / Staking")}
            </div>
            <div className="text-[10px] text-slate-500">Modal partisipasi</div>
          </div>
        </div>

        {/* Lead Backers / VC Pedigree */}
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
            Investor Utama & VC
          </div>
          <div className="flex flex-wrap gap-1.5">
            {potential.leadBackers.map((backer, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 text-xs font-medium rounded-md bg-slate-100 text-slate-800 border border-slate-200"
              >
                {backer}
              </span>
            ))}
          </div>
        </div>

        {/* Executive Justification Summary */}
        <div className="rounded-lg border border-emerald-200/80 bg-emerald-50/40 p-4 space-y-2">
          <div className="flex items-center gap-2 text-emerald-900 font-semibold text-xs tracking-wider uppercase">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>Ringkasan Analisis Potensi</span>
          </div>
          <p className="text-xs text-slate-800 leading-relaxed font-normal">
            {potential.justificationSummary}
          </p>
        </div>

        {/* Bullish Factors & Sybil/Risk Factors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Bullish Catalysts */}
          <div className="rounded-lg border border-slate-200 bg-white p-4 space-y-2.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800 uppercase tracking-wider">
              <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
              <span>Faktor Pendorong Potensi</span>
            </div>
            <ul className="space-y-2">
              {potential.bullishFactors.map((factor, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-slate-600 leading-relaxed">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{factor}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Risk & Sybil Filtering */}
          <div className="rounded-lg border border-slate-200 bg-white p-4 space-y-2.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-800 uppercase tracking-wider">
              <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
              <span>Risiko & Filter Sybil</span>
            </div>
            <ul className="space-y-2">
              {potential.riskFactors.map((risk, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-slate-600 leading-relaxed">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                  <span>{risk}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Tokenomics Note */}
        {potential.tokenomicsNote && (
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600 flex items-start gap-2">
            <Coins className="h-4 w-4 text-slate-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-800">Catatan Tokenomics: </span>
              {potential.tokenomicsNote}
            </div>
          </div>
        )}

        {/* Quick Faucet Links */}
        {project.faucetLinks.length > 0 && (
          <div className="rounded-lg border border-slate-200 bg-white p-4 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 uppercase tracking-wider">
              <Droplets className="h-3.5 w-3.5 text-sky-600" />
              <span>Faucet Testnet Terkait</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {project.faucetLinks.map((faucet) => (
                <a
                  key={faucet.id}
                  href={faucet.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300 transition-colors text-xs"
                >
                  <div>
                    <div className="font-medium text-slate-900">{faucet.name}</div>
                    <div className="text-[11px] text-slate-500">{faucet.requirements}</div>
                  </div>
                  <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Official Links & Actions Footer */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
          <div className="flex items-center gap-3">
            <a
              href={project.links.website}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-emerald-700 hover:text-emerald-800 font-medium inline-flex items-center gap-1"
            >
              Website Resmi <ExternalLink className="h-3 w-3" />
            </a>
            {project.links.twitter && (
              <a
                href={project.links.twitter}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-slate-600 hover:text-slate-900 font-medium inline-flex items-center gap-1"
              >
                X / Twitter <ExternalLink className="h-3 w-3" />
              </a>
            )}
            {project.links.docs && (
              <a
                href={project.links.docs}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-slate-600 hover:text-slate-900 font-medium inline-flex items-center gap-1"
              >
                Docs <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {onEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onClose();
                  onEdit(project);
                }}
                className="w-full sm:w-auto"
              >
                Edit Proyek
              </Button>
            )}
            {onTrackToggle && (
              <Button
                variant={isTracking ? "secondary" : "primary"}
                size="sm"
                onClick={() => onTrackToggle(project.id)}
                className="w-full sm:w-auto"
              >
                {isTracking ? "Hapus dari Tracking" : "Mulai Track Project Ini"}
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={onClose} className="w-full sm:w-auto">
              Tutup
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
