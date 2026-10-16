import { NextRequest, NextResponse } from "next/server";

export interface LiveMarketData {
  prices: {
    btc: number;
    eth: number;
    sol: number;
  };
  tvlMap: Record<string, number>; // slug -> tvl USD
  updatedAt: string;
}

// In-memory server-side cache for 3 minutes
let cachedData: LiveMarketData | null = null;
let lastCacheTime = 0;
const CACHE_DURATION_MS = 3 * 60 * 1000;

const DEFAULT_SLUGS = [
  "babylon-protocol",
  "polymarket-international",
  "fuel-bridge",
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const extraSlugsParam = searchParams.get("slugs");

  const slugsToFetch = new Set(DEFAULT_SLUGS);
  if (extraSlugsParam) {
    extraSlugsParam
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean)
      .forEach((s) => slugsToFetch.add(s));
  }

  const now = Date.now();
  // Return cached data if still fresh and no new custom slugs requested
  if (
    cachedData &&
    now - lastCacheTime < CACHE_DURATION_MS &&
    Array.from(slugsToFetch).every((s) => s in cachedData!.tvlMap)
  ) {
    return NextResponse.json(cachedData);
  }

  try {
    // 1. Fetch benchmark coin prices (~150 bytes)
    const pricesPromise = fetch(
      "https://coins.llama.fi/prices/current/coingecko:bitcoin,coingecko:ethereum,coingecko:solana",
      { cache: "no-store" }
    )
      .then((res) => (res.ok ? res.json() : null))
      .catch(() => null);

    // 2. Fetch specific protocol TVLs via lightweight endpoint (~20 bytes each instead of 12MB full catalog)
    const tvlPromises = Array.from(slugsToFetch).map(async (slug) => {
      try {
        const res = await fetch(`https://api.llama.fi/tvl/${slug}`, {
          cache: "no-store",
        });
        if (res.ok) {
          const text = await res.text();
          const tvl = parseFloat(text);
          return { slug, tvl: isNaN(tvl) ? 0 : tvl };
        }
      } catch {
        // Fallback silently if individual slug not found
      }
      return { slug, tvl: 0 };
    });

    const [pricesData, tvlResults] = await Promise.all([
      pricesPromise,
      Promise.all(tvlPromises),
    ]);

    const btc = pricesData?.coins?.["coingecko:bitcoin"]?.price || 82000;
    const eth = pricesData?.coins?.["coingecko:ethereum"]?.price || 2450;
    const sol = pricesData?.coins?.["coingecko:solana"]?.price || 106;

    const tvlMap: Record<string, number> = {};
    tvlResults.forEach(({ slug, tvl }) => {
      if (tvl > 0) {
        tvlMap[slug] = tvl;
      }
    });

    cachedData = {
      prices: { btc, eth, sol },
      tvlMap,
      updatedAt: new Date().toISOString(),
    };
    lastCacheTime = now;

    return NextResponse.json(cachedData);
  } catch (error) {
    console.error("Failed to fetch lightweight DeFiLlama data:", error);
    const fallback: LiveMarketData = {
      prices: { btc: 82000, eth: 2450, sol: 106 },
      tvlMap: {
        "babylon-protocol": 3340000000,
        "polymarket-international": 342000000,
        "fuel-bridge": 10200000,
      },
      updatedAt: new Date().toISOString(),
    };
    return NextResponse.json(fallback);
  }
}
