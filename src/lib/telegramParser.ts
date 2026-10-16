import {
  AirdropProject,
  ProjectCategory,
  ProjectStatus,
  CostType,
  PotentialTier,
  MilestoneTask,
  DailyTask,
  FaucetLink,
} from "@/types/airdrop";

export interface ParsedTelegramAirdrop {
  name: string;
  ticker?: string;
  category: ProjectCategory;
  chains: string[];
  status: ProjectStatus;
  costType: CostType;
  shortDescription: string;
  potential: {
    tier: PotentialTier;
    score: number;
    fundingRaisedUsd: number;
    leadBackers: string[];
    justificationSummary: string;
    bullishFactors: string[];
    riskFactors: string[];
    estimatedTGE: string;
    expectedRewardTier: "Massive ($1,500+)" | "Substantial ($500-$1,500)" | "Moderate ($150-$500)" | "Speculative";
  };
  links: {
    website: string;
    twitter: string;
    docs?: string;
  };
  milestoneTasks: MilestoneTask[];
  dailyTasks: DailyTask[];
  faucetLinks: FaucetLink[];
  rawText: string;
}

const TOP_VCS = [
  "Paradigm",
  "a16z crypto",
  "a16z",
  "Polychain Capital",
  "Polychain",
  "Binance Labs",
  "Dragonfly Capital",
  "Dragonfly",
  "Electric Capital",
  "Framework Ventures",
  "Coinbase Ventures",
  "Pantera Capital",
  "Multicoin Capital",
  "Robot Ventures",
  "Hack VC",
  "Brevan Howard",
  "Delphi Digital",
  "Founders Fund",
  "Vitalik Buterin",
  "HashKey Capital",
];

export function parseTelegramText(rawText: string): ParsedTelegramAirdrop {
  const clean = rawText.replace(/\r\n/g, "\n");
  const lines = clean
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  // 1. Detect URLs
  const urlRegex = /(https?:\/\/[^\s"'<>]+)/gi;
  const allUrls = clean.match(urlRegex) || [];

  let websiteUrl = "https://";
  let twitterUrl = "https://x.com/";
  let docsUrl: string | undefined = undefined;
  const faucetLinks: FaucetLink[] = [];

  allUrls.forEach((url) => {
    const lower = url.toLowerCase();
    if (lower.includes("twitter.com") || lower.includes("x.com")) {
      twitterUrl = url;
    } else if (lower.includes("faucet") || lower.includes("claim")) {
      faucetLinks.push({
        id: `faucet-${Date.now()}-${faucetLinks.length}`,
        name: "Testnet Faucet Link",
        url,
        network: "Testnet",
        requirements: "Web3 wallet claim",
        dripAmount: "Testnet Tokens",
      });
    } else if (lower.includes("gitbook.io") || lower.includes("docs.")) {
      docsUrl = url;
    } else if (websiteUrl === "https://" && !lower.includes("t.me")) {
      websiteUrl = url;
    }
  });

  // 2. Detect Project Name
  let name = "";
  const namePatterns = [
    /(?:airdrop|project|token|garapan)\s*[:\-–]\s*([a-zA-Z0-9\s]+?)(?:\s*(?:\(|$|\n|testnet|mainnet))/i,
    /#([a-zA-Z0-9]+)/,
  ];

  for (const pattern of namePatterns) {
    const match = clean.match(pattern);
    if (match && match[1] && match[1].trim().length > 2) {
      name = match[1].trim();
      break;
    }
  }

  // Fallback: Check first non-empty line
  if (!name && lines.length > 0) {
    const firstLine = lines[0]
      .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, "")
      .replace(/^(airdrop|new airdrop|garapan|update|testnet|confirmed)[:\s\-]*/i, "")
      .trim();
    name = firstLine.split(/[\(\[\n:–\-]/)[0].trim();
  }

  if (!name) name = "New Web3 Airdrop";

  // 3. Detect Ticker
  let ticker: string | undefined = undefined;
  const tickerMatch = clean.match(/\$([A-Z0-9]{2,8})\b/) || clean.match(/\(([A-Z0-9]{2,8})\)/);
  if (tickerMatch && tickerMatch[1]) {
    ticker = tickerMatch[1].toUpperCase();
  }

  // 4. Detect Funding Amount
  let fundingRaisedUsd = 0;
  const fundingMatch =
    clean.match(/\$([0-9.]+)\s*(m|million|b|billion|k)/i) ||
    clean.match(/raised\s*\$?([0-9.]+)\s*(m|million|b|billion|k)?/i);

  if (fundingMatch) {
    const num = parseFloat(fundingMatch[1]);
    const unit = (fundingMatch[2] || "m").toLowerCase();
    if (unit.startsWith("b")) fundingRaisedUsd = num * 1_000_000_000;
    else if (unit.startsWith("k")) fundingRaisedUsd = num * 1_000;
    else fundingRaisedUsd = num * 1_000_000;
  }

  // 5. Detect Backers
  const backersFound: string[] = [];
  TOP_VCS.forEach((vc) => {
    if (new RegExp(`\\b${vc}\\b`, "i").test(clean)) {
      backersFound.push(vc);
    }
  });

  // 6. Detect Category
  let category: ProjectCategory = "Layer 1";
  const lower = clean.toLowerCase();
  if (lower.includes("layer 2") || lower.includes(" l2 ") || lower.includes("rollup")) {
    category = "Layer 2";
  } else if (lower.includes("restak") || lower.includes("eigenlayer") || lower.includes("babylon")) {
    category = "Restaking";
  } else if (lower.includes("defi") || lower.includes("dex") || lower.includes("lending")) {
    category = "DeFi";
  } else if (lower.includes("prediction") || lower.includes("betting") || lower.includes("market")) {
    category = "Prediction Market";
  } else if (lower.includes("depin")) {
    category = "DePIN";
  } else if (lower.includes("ai ") || lower.includes("artificial intelligence")) {
    category = "AI x Web3";
  }

  // 7. Detect Cost Type
  let costType: CostType = "Free (Testnet)";
  if (lower.includes("mainnet") || lower.includes("gas fee") || lower.includes("bridge fee")) {
    costType = "Low Gas (< $5)";
  }
  if (lower.includes("stake") || lower.includes("deposit $") || lower.includes("capital")) {
    costType = "Capital / Staking";
  }

  // 8. Detect Potential Tier
  let tier: PotentialTier = "Tier B";
  let score = 75;
  if (fundingRaisedUsd >= 100_000_000 || backersFound.some((b) => ["Paradigm", "a16z", "Polychain"].includes(b))) {
    tier = "Tier S";
    score = 95;
  } else if (fundingRaisedUsd >= 20_000_000 || backersFound.length > 0) {
    tier = "Tier A";
    score = 88;
  }

  // 9. Extract Tasks from numbered lines
  const milestoneTasks: MilestoneTask[] = [];
  const taskRegex = /^(?:[0-9]+[.)\]\-]|step\s*[0-9]+[:.\-]|[-*•])\s*(.+)/gim;
  let taskMatch: RegExpExecArray | null;
  while ((taskMatch = taskRegex.exec(clean)) !== null) {
    const taskLine = taskMatch[1].trim();
    if (taskLine.length > 5 && !taskLine.startsWith("http")) {
      const lineUrlMatch = taskLine.match(urlRegex);
      milestoneTasks.push({
        id: `task-${Date.now()}-${milestoneTasks.length}`,
        title: taskLine.replace(urlRegex, "").slice(0, 80).trim(),
        description: taskLine,
        category: taskLine.toLowerCase().includes("faucet")
          ? "Testnet"
          : taskLine.toLowerCase().includes("swap")
          ? "Volume / Swap"
          : taskLine.toLowerCase().includes("discord")
          ? "Community"
          : "Setup",
        actionUrl: lineUrlMatch ? lineUrlMatch[0] : undefined,
      });
    }
  }

  // Default tasks if none extracted
  if (milestoneTasks.length === 0) {
    milestoneTasks.push({
      id: `task-${Date.now()}-1`,
      title: "Hubungkan Wallet & Mulai Garap",
      description: "Akses website resmi atau dApp untuk memulai interaksi pertama.",
      category: "Setup",
      actionUrl: websiteUrl !== "https://" ? websiteUrl : undefined,
    });
  }

  // Extract daily routine tasks (faucet, daily check-in, claim)
  const dailyTasks: DailyTask[] = [];
  milestoneTasks.forEach((t) => {
    const tLower = (t.title + " " + t.description).toLowerCase();
    if (
      tLower.includes("faucet") ||
      tLower.includes("daily") ||
      tLower.includes("claim") ||
      tLower.includes("check-in") ||
      tLower.includes("check in") ||
      tLower.includes("gm")
    ) {
      dailyTasks.push({
        id: `daily-${Date.now()}-${dailyTasks.length}`,
        title: t.title,
        description: t.description || `Aktivitas harian untuk ${name}`,
        actionUrl: t.actionUrl || websiteUrl,
        estimatedMinutes: 2,
      });
    }
  });

  // If faucet links exist but no daily task was created, create a default daily faucet task
  if (dailyTasks.length === 0 && faucetLinks.length > 0) {
    dailyTasks.push({
      id: `daily-${Date.now()}-faucet`,
      title: `Klaim Faucet Harian ${name}`,
      description: "Klaim gas token testnet setiap 24 jam untuk menjaga keaktifan dompet.",
      actionUrl: faucetLinks[0].url,
      estimatedMinutes: 2,
    });
  }

  return {
    name,
    ticker,
    category,
    chains: ["EVM"],
    status: lower.includes("confirmed") ? "Confirmed" : "Testnet Live",
    costType,
    shortDescription: `Airdrop ${name} didapatkan dari informasi channel Telegram.`,
    potential: {
      tier,
      score,
      fundingRaisedUsd: fundingRaisedUsd || 10_000_000,
      leadBackers: backersFound.length > 0 ? backersFound : ["Venture Backers"],
      justificationSummary: `Proyek ${name} diposting di channel Telegram dengan potensi airdrop komunitas.${
        fundingRaisedUsd ? ` Memiliki pendanaan sekitar $${(fundingRaisedUsd / 1_000_000).toFixed(0)}M.` : ""
      }`,
      bullishFactors: [
        "Direkomendasikan oleh komunitas airdrop Telegram.",
        fundingRaisedUsd > 0
          ? `Tercatat memiliki pendanaan sebesar $${(fundingRaisedUsd / 1_000_000).toFixed(0)}M.`
          : "Fase partisipasi awal dengan rasio reward menjanjikan.",
      ],
      riskFactors: [
        "Pastikan selalu memverifikasi ulang link resmi untuk menghindari link phishing.",
      ],
      estimatedTGE: "Q4 2026",
      expectedRewardTier: tier === "Tier S" ? "Massive ($1,500+)" : "Substantial ($500-$1,500)",
    },
    links: {
      website: websiteUrl,
      twitter: twitterUrl,
      docs: docsUrl,
    },
    milestoneTasks,
    dailyTasks,
    faucetLinks,
    rawText,
  };
}
