import { NextRequest, NextResponse } from "next/server";
import { parseTelegramText } from "@/lib/telegramParser";

export interface TelegramPost {
  id: string;
  channel: string;
  text: string;
  date: string;
  views?: string;
  links: string[];
  parsedAirdrop?: ReturnType<typeof parseTelegramText>;
}

// In-memory cache per channel (3 minutes)
const cache: Record<string, { posts: TelegramPost[]; timestamp: number }> = {};
const CACHE_MS = 3 * 60 * 1000;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const rawChannel = searchParams.get("channel") || "airdropfind";
  const channel = rawChannel.replace(/^@/, "").replace(/https?:\/\/t\.me\//, "").trim();

  if (!channel) {
    return NextResponse.json({ error: "Channel username required" }, { status: 400 });
  }

  const now = Date.now();
  if (cache[channel] && now - cache[channel].timestamp < CACHE_MS) {
    return NextResponse.json({ channel, posts: cache[channel].posts, cached: true });
  }

  try {
    const telegramUrl = `https://t.me/s/${channel}`;
    const res = await fetch(telegramUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Gagal membaca channel @${channel}. Pastikan channel publik.` },
        { status: res.status }
      );
    }

    const html = await res.text();

    // Check if channel exists or private
    if (html.includes("tgme_channel_info_header") && html.includes("channel not found")) {
      return NextResponse.json(
        { error: `Channel @${channel} tidak ditemukan atau bersifat privat.` },
        { status: 404 }
      );
    }

    // Extract message blocks using regex
    const posts: TelegramPost[] = [];
    const messageBlockRegex =
      /<div class="tgme_widget_message_wrap[\s\S]*?<div class="tgme_widget_message_text[^"]*"[^>]*>([\s\S]*?)<\/div>[\s\S]*?<time datetime="([^"]*)"/g;

    let match: RegExpExecArray | null;
    let count = 0;

    while ((match = messageBlockRegex.exec(html)) !== null && count < 20) {
      count++;
      const rawHtmlText = match[1];
      const date = match[2];

      // Convert <br/> to newline and strip HTML tags
      const cleanText = rawHtmlText
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/<a\s+(?:[^>]*?\s+)?href="([^"]*)"[^>]*>(.*?)<\/a>/gi, "$2 ($1)")
        .replace(/<[^>]+>/g, "")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .trim();

      // Extract URLs from post
      const urlRegex = /(https?:\/\/[^\s"'<>]+)/gi;
      const links = cleanText.match(urlRegex) || [];

      // Auto-parse airdrop structure from the post
      const parsedAirdrop = cleanText.length > 20 ? parseTelegramText(cleanText) : undefined;

      posts.push({
        id: `tg-${channel}-${count}-${Date.now()}`,
        channel: `@${channel}`,
        text: cleanText,
        date: date || new Date().toISOString(),
        links: Array.from(new Set(links)),
        parsedAirdrop,
      });
    }

    // Sort newest first
    posts.reverse();

    cache[channel] = { posts, timestamp: now };

    return NextResponse.json({ channel: `@${channel}`, posts, total: posts.length });
  } catch (error) {
    console.error("Failed to scrape telegram channel:", error);
    return NextResponse.json(
      { error: "Gagal menghubungkan ke Telegram. Periksa koneksi internet." },
      { status: 500 }
    );
  }
}
