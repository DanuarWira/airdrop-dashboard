"use client";

import * as React from "react";
import {
  ExternalLink,
  Coins,
  ShieldCheck,
  Check,
  Plus,
  Activity,
  Edit2,
} from "lucide-react";
import { AirdropProject } from "@/types/airdrop";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/lib/utils";

interface AirdropCardProps {
  project: AirdropProject;
  onOpenJustification: (project: AirdropProject) => void;
  isTracking: boolean;
  onToggleTrack: (projectId: string) => void;
  onEditProject?: (project: AirdropProject) => void;
}

export const AirdropCard: React.FC<AirdropCardProps> = ({
  project,
  onOpenJustification,
  isTracking,
  onToggleTrack,
  onEditProject,
}) => {
  const { potential } = project;

  const tierVariant =
    potential.tier === "Tier S"
      ? "tier-s"
      : potential.tier === "Tier A"
      ? "tier-a"
      : potential.tier === "Tier B"
      ? "tier-b"
      : "tier-c";

  return (
    <Card className="flex flex-col h-full hover:border-slate-300 transition-all duration-150 relative">
      <CardHeader className="pb-3.5">
        <div className="flex items-start justify-between gap-3">
          {/* Logo & Name */}
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-slate-100 border border-slate-200 text-slate-900 font-bold text-sm tracking-tight">
              {project.ticker || project.name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold text-slate-900 leading-tight">
                  {project.name}
                </h3>
                {project.ticker && (
                  <span className="text-[11px] font-mono font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                    ${project.ticker}
                  </span>
                )}
                {project.isUserCustom && (
                  <span className="text-[9px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded">
                    Kustom
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-slate-500 font-medium">
                  {project.category}
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-xs font-mono text-slate-600">
                  {project.status}
                </span>
              </div>
            </div>
          </div>

          {/* Potential Rating Pill & Edit */}
          <div className="text-right shrink-0 flex flex-col items-end gap-1">
            <Badge variant={tierVariant} size="sm">
              {potential.tier}
            </Badge>
            <div className="text-[11px] font-mono text-emerald-800 font-semibold">
              {potential.score}/100
            </div>
            {onEditProject && (
              <button
                onClick={() => onEditProject(project)}
                title="Edit airdrop ini"
                className="text-slate-400 hover:text-slate-700 p-0.5"
              >
                <Edit2 className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-3.5 pb-4">
        {/* Funding & Cost Row */}
        <div className="flex items-center justify-between text-xs py-1.5 px-3 rounded-lg bg-slate-50 border border-slate-200/80">
          <div className="flex items-center gap-1.5">
            <Coins className="h-3.5 w-3.5 text-emerald-600" />
            <span className="text-slate-500">Pendanaan:</span>
            <span className="font-semibold text-slate-900 font-mono">
              {formatCurrency(potential.fundingRaisedUsd)}
            </span>
          </div>
          <div className="text-[11px] font-medium text-slate-600">
            {project.costType}
          </div>
        </div>

        {/* Live TVL Indicator if available from DeFiLlama */}
        {typeof project.liveTvlUsd === "number" && (
          <div className="flex items-center justify-between text-[11px] py-1 px-3 rounded-lg bg-emerald-50/50 border border-emerald-200 text-emerald-900 font-mono">
            <div className="flex items-center gap-1.5">
              <Activity className="h-3 w-3 text-emerald-600" />
              <span>TVL (DeFiLlama):</span>
            </div>
            <span className="font-bold">
              {formatCurrency(project.liveTvlUsd)}
            </span>
          </div>
        )}

        {/* Lead Backers */}
        <div className="space-y-1.5">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider font-medium">
            Investor Utama
          </span>
          <div className="flex flex-wrap gap-1">
            {potential.leadBackers.slice(0, 3).map((backer, idx) => (
              <span
                key={idx}
                className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200/70"
              >
                {backer}
              </span>
            ))}
            {potential.leadBackers.length > 3 && (
              <span className="text-[11px] text-slate-400 px-1 py-0.5 font-mono">
                +{potential.leadBackers.length - 3}
              </span>
            )}
          </div>
        </div>

        {/* Justification snippet */}
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
          {potential.justificationSummary}
        </p>
      </CardContent>

      <CardFooter className="pt-3 flex items-center justify-between gap-2 border-t border-slate-100">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onOpenJustification(project)}
          className="flex-1 text-xs"
        >
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 mr-1" />
          Analisis Potensi
        </Button>

        <Button
          variant={isTracking ? "secondary" : "primary"}
          size="sm"
          onClick={() => onToggleTrack(project.id)}
          className="text-xs"
        >
          {isTracking ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-700 mr-1" />
              Ditrack
            </>
          ) : (
            <>
              <Plus className="h-3.5 w-3.5 mr-1" />
              Track
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};
