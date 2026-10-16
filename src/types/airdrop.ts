export type PotentialTier = 'Tier S' | 'Tier A' | 'Tier B' | 'Tier C';

export type ProjectCategory =
  | 'Layer 1'
  | 'Layer 2'
  | 'DeFi'
  | 'DePIN'
  | 'AI x Web3'
  | 'Restaking'
  | 'SocialFi'
  | 'Prediction Market'
  | 'Interoperability';

export type ProjectStatus =
  | 'Confirmed'
  | 'Speculative'
  | 'Testnet Live'
  | 'Mainnet / Points'
  | 'Snapshot Soon';

export type CostType =
  | 'Free (Testnet)'
  | 'Low Gas (< $5)'
  | 'Medium Gas ($5-$30)'
  | 'Capital / Staking';

export interface MilestoneTask {
  id: string;
  title: string;
  description: string;
  category: 'Setup' | 'Testnet' | 'Volume / Swap' | 'Contract' | 'Community' | 'NFT';
  actionUrl?: string;
  isOptional?: boolean;
}

export interface DailyTask {
  id: string;
  title: string;
  description: string;
  actionUrl: string;
  estimatedMinutes: number;
}

export interface FaucetLink {
  id: string;
  name: string;
  url: string;
  network: string;
  requirements: string; // e.g. "Mainnet balance > 0.001 ETH" or "No login required"
  dripAmount: string; // e.g. "0.05 MON / 24h"
}

export interface TimelineMilestone {
  id: string;
  date: string; // ISO date or "Q3 2026"
  title: string;
  description: string;
  type: 'testnet_launch' | 'points_season' | 'snapshot_expected' | 'tge_claim';
  isCompleted: boolean;
}

export interface AirdropProject {
  id: string;
  name: string;
  slug: string;
  ticker?: string;
  shortDescription: string;
  logo: string;
  category: ProjectCategory;
  chains: string[];
  status: ProjectStatus;
  costType: CostType;
  isUserCustom?: boolean;
  defiLlamaSlug?: string;
  liveTvlUsd?: number;

  // Potential evaluation & Justification Breakdown
  potential: {
    tier: PotentialTier;
    score: number; // 0 - 100
    fundingRaisedUsd: number; // in USD
    valuationUsd?: number;
    leadBackers: string[];
    justificationSummary: string;
    bullishFactors: string[];
    riskFactors: string[];
    estimatedTGE: string;
    expectedRewardTier: 'Massive ($1,500+)' | 'Substantial ($500-$1,500)' | 'Moderate ($150-$500)' | 'Speculative';
    tokenomicsNote?: string;
  };

  // Associated external URLs
  links: {
    website: string;
    twitter: string;
    discord?: string;
    docs?: string;
    explorer?: string;
  };

  // Tasks, Faucets & Timeline
  milestoneTasks: MilestoneTask[];
  dailyTasks: DailyTask[];
  faucetLinks: FaucetLink[];
  timeline: TimelineMilestone[];
}

export type SortField = 'potential' | 'funding' | 'alphabetical' | 'score';
export type SortOrder = 'asc' | 'desc';
