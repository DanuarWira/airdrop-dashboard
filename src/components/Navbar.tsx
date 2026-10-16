"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Compass,
  CheckSquare,
  CalendarDays,
  Droplets,
  Layers,
  Menu,
  X,
  ShieldCheck,
  Send,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  {
    href: "/",
    label: "Katalog",
    icon: Compass,
    description: "Katalog airdrop dan analisis potensi",
  },
  {
    href: "/tracker",
    label: "Task Tracker",
    icon: CheckSquare,
    description: "Pencatat progres dan task pribadi",
  },
  {
    href: "/daily",
    label: "Tugas Harian",
    icon: CalendarDays,
    description: "Checklist aktivitas berulang harian",
  },
  {
    href: "/faucets",
    label: "Faucet Hub",
    icon: Droplets,
    description: "Akses langsung faucet testnet",
  },
  {
    href: "/timeline",
    label: "Linimasa",
    icon: Layers,
    description: "Jadwal snapshot dan peluncuran token",
  },
  {
    href: "/telegram",
    label: "Telegram Feed",
    icon: Send,
    description: "Feed channel Telegram dan ekstraktor",
  },
];

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand identity */}
        <Link
          href="/"
          className="flex items-center gap-2.5 text-slate-900 group transition-opacity hover:opacity-90"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white font-semibold text-sm shadow-sm">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sm tracking-tight text-slate-900 leading-none">
              Airdrop<span className="text-emerald-600">Viewer</span>
            </span>
            <span className="text-[10px] text-slate-500 font-medium tracking-tight leading-tight mt-0.5">
              Katalog & Tracker Airdrop
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg transition-colors",
                  isActive
                    ? "bg-emerald-50 text-emerald-800 font-semibold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                )}
              >
                <Icon
                  className={cn(
                    "h-4 w-4",
                    isActive ? "text-emerald-700" : "text-slate-500"
                  )}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right side utilities */}
        <div className="hidden sm:flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-mono border border-slate-200">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span>UTC Live</span>
          </div>
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile navigation drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-emerald-50 text-emerald-800 font-semibold"
                    : "text-slate-700 hover:bg-slate-100"
                )}
              >
                <Icon
                  className={cn(
                    "h-4 w-4",
                    isActive ? "text-emerald-700" : "text-slate-500"
                  )}
                />
                <div>
                  <div>{item.label}</div>
                  <div className="text-[11px] font-normal text-slate-500">
                    {item.description}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
};
