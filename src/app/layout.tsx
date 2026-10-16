import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { AirdropProvider } from "@/context/AirdropContext";

export const metadata: Metadata = {
  metadataBase: new URL("https://airdrop-viewer.vercel.app"),
  title: {
    default: "AirdropViewer - Web3 Airdrop Potential & Task Tracker",
    template: "%s | AirdropViewer",
  },
  description:
    "Direktori & Tracker Airdrop Web3 terkurasi dengan analisis potensi berbasis data pendanaan riil, pelacak tugas personal, rutinitas harian, faucet testnet, dan linimasa peluncuran.",
  keywords: [
    "Airdrop Crypto",
    "Web3 Airdrop Tracker",
    "Monad Testnet",
    "Berachain Faucet",
    "DeFi Airdrop",
    "Crypto Task Tracker",
    "Airdrop Alpha Hub",
  ],
  authors: [{ name: "AirdropViewer Contributors" }],
  openGraph: {
    title: "AirdropViewer - Web3 Airdrop Potential & Task Tracker",
    description:
      "Direktori & Tracker Airdrop Web3 terkurasi dengan analisis potensi berbasis data pendanaan riil, pelacak tugas personal, rutinitas harian, faucet testnet, dan linimasa peluncuran.",
    url: "https://airdrop-viewer.vercel.app",
    siteName: "AirdropViewer",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AirdropViewer - Web3 Airdrop Potential & Task Tracker",
    description:
      "Direktori & Tracker Airdrop Web3 terkurasi dengan analisis potensi berbasis data pendanaan riil, pelacak tugas personal, rutinitas harian, faucet testnet, dan linimasa peluncuran.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased selection:bg-emerald-100 selection:text-emerald-900 flex flex-col">
        <AirdropProvider>
          <Navbar />
          <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            {children}
          </main>
          <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-700">AirdropViewer</span>
                <span>•</span>
                <span>Direktori & Tracker Airdrop Web3</span>
              </div>
              <div className="text-[11px] text-slate-500 font-mono">
                Selalu verifikasi tautan resmi dan jangan pernah membagikan private key
              </div>
            </div>
          </footer>
        </AirdropProvider>
      </body>
    </html>
  );
}
