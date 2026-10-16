import Link from "next/link";
import { Compass, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 mb-4 shadow-sm">
        <Compass className="h-8 w-8 animate-pulse" />
      </div>

      <span className="font-mono text-xs font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
        Error 404
      </span>

      <h1 className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
        Halaman Tidak Ditemukan
      </h1>

      <p className="mt-2 text-sm text-slate-500 max-w-md">
        Halaman yang Anda cari tidak tersedia atau alamat URL telah dipindahkan.
      </p>

      <div className="mt-6 flex items-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Kembali ke Katalog Utama</span>
        </Link>
      </div>
    </div>
  );
}
