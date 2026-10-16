"use client";

import * as React from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    // Log client error to console
    console.error("AirdropViewer Runtime Error:", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 mb-4 shadow-sm">
        <AlertTriangle className="h-8 w-8" />
      </div>

      <span className="font-mono text-xs font-semibold uppercase tracking-wider text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded border border-rose-200">
        Terjadi Kesalahan
      </span>

      <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
        Gagal Memuat Halaman
      </h1>

      <p className="mt-2 text-xs sm:text-sm text-slate-500 max-w-md">
        Terjadi kendala teknis saat memproses permintaan ini. Silakan coba muat ulang atau kembali ke halaman utama.
      </p>

      {error.message && (
        <div className="mt-3 p-3 rounded-lg bg-slate-100 border border-slate-200 text-xs font-mono text-slate-700 max-w-lg truncate">
          {error.message}
        </div>
      )}

      <div className="mt-6 flex items-center gap-3">
        <button
          onClick={() => reset()}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm transition-colors"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Coba Muat Ulang</span>
        </button>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm transition-colors"
        >
          <Home className="h-3.5 w-3.5" />
          <span>Halaman Utama</span>
        </Link>
      </div>
    </div>
  );
}
