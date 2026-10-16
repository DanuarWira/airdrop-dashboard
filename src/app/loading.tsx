import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center text-center p-8">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 shadow-sm mb-3">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
      <p className="text-xs font-medium text-slate-500">
        Memuat data airdrop...
      </p>
    </div>
  );
}
