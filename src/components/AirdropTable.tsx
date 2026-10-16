"use client";

import * as React from "react";
import { AirdropProject } from "@/types/airdrop";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/lib/utils";
import { ShieldCheck, Plus, Check, Edit2, Activity } from "lucide-react";

interface AirdropTableProps {
  projects: AirdropProject[];
  onOpenJustification: (project: AirdropProject) => void;
  isProjectTracked: (projectId: string) => boolean;
  onToggleTrack: (projectId: string) => void;
  onEditProject?: (project: AirdropProject) => void;
}

export const AirdropTable: React.FC<AirdropTableProps> = ({
  projects,
  onOpenJustification,
  isProjectTracked,
  onToggleTrack,
  onEditProject,
}) => {
  return (
    <div className="w-full overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
      <table className="w-full text-left text-xs border-collapse">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-500 font-medium">
            <th className="py-3 px-4">Proyek</th>
            <th className="py-3 px-4">Potensi & Skor</th>
            <th className="py-3 px-4">Pendanaan & TVL</th>
            <th className="py-3 px-4 hidden md:table-cell">Investor Utama</th>
            <th className="py-3 px-4 hidden lg:table-cell">Biaya Garap</th>
            <th className="py-3 px-4 hidden sm:table-cell">Status</th>
            <th className="py-3 px-4 text-right">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {projects.map((project) => {
            const { potential } = project;
            const isTracking = isProjectTracked(project.id);
            const tierVariant =
              potential.tier === "Tier S"
                ? "tier-s"
                : potential.tier === "Tier A"
                ? "tier-a"
                : "tier-b";

            return (
              <tr
                key={project.id}
                className="hover:bg-slate-50/70 transition-colors"
              >
                {/* Project */}
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 border border-slate-200 text-slate-800 font-bold text-xs">
                      {project.ticker || project.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                        <span>{project.name}</span>
                        {project.ticker && (
                          <span className="text-[10px] text-slate-500 font-mono">
                            ${project.ticker}
                          </span>
                        )}
                        {project.isUserCustom && (
                          <span className="text-[9px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-1 py-0.2 rounded">
                            Custom
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {project.category}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Potential Tier & Score */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <Badge variant={tierVariant} size="sm">
                      {potential.tier}
                    </Badge>
                    <span className="font-mono font-semibold text-emerald-800">
                      {potential.score}
                    </span>
                  </div>
                </td>

                {/* Total Funding & Live TVL */}
                <td className="py-3.5 px-4 whitespace-nowrap font-mono">
                  <div className="font-semibold text-slate-900">
                    {formatCurrency(potential.fundingRaisedUsd)}
                  </div>
                  {typeof project.liveTvlUsd === "number" && (
                    <div className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1 mt-0.5">
                      <Activity className="h-2.5 w-2.5" />
                      <span>TVL: {formatCurrency(project.liveTvlUsd)}</span>
                    </div>
                  )}
                </td>

                {/* Lead Backers */}
                <td className="py-3.5 px-4 hidden md:table-cell">
                  <div className="flex flex-wrap gap-1 max-w-xs">
                    {potential.leadBackers.slice(0, 2).map((backer, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200"
                      >
                        {backer}
                      </span>
                    ))}
                    {potential.leadBackers.length > 2 && (
                      <span className="text-[10px] text-slate-400 font-mono">
                        +{potential.leadBackers.length - 2}
                      </span>
                    )}
                  </div>
                </td>

                {/* Cost */}
                <td className="py-3.5 px-4 hidden lg:table-cell whitespace-nowrap text-slate-600">
                  {project.costType}
                </td>

                {/* Status */}
                <td className="py-3.5 px-4 hidden sm:table-cell whitespace-nowrap">
                  <span className="text-slate-600 font-medium">
                    {project.status}
                  </span>
                </td>

                {/* Actions */}
                <td className="py-3.5 px-4 text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-1.5">
                    {onEditProject && (
                      <button
                        onClick={() => onEditProject(project)}
                        title="Edit airdrop ini"
                        className="p-1.5 text-slate-400 hover:text-slate-700 rounded-md transition-colors"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onOpenJustification(project)}
                      className="text-xs"
                    >
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 sm:mr-1" />
                      <span className="hidden sm:inline">Analisis</span>
                    </Button>
                    <Button
                      variant={isTracking ? "secondary" : "primary"}
                      size="sm"
                      onClick={() => onToggleTrack(project.id)}
                      className="text-xs"
                    >
                      {isTracking ? (
                        <Check className="h-3.5 w-3.5 text-emerald-700" />
                      ) : (
                        <Plus className="h-3.5 w-3.5" />
                      )}
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
