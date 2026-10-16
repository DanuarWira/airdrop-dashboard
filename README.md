# AirdropViewer

> **Direktori & Tracker Airdrop Web3 Terkurasi dengan Analisis Potensi Berbasis Data, Pelacak Tugas Personal, dan Integrasi DeFiLlama.**

[![Next.js](https://img.shields.io/badge/Next.js-15.1.7-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0.0-blue?style=flat&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38bdf8?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)
[![Production Ready](https://img.shields.io/badge/Status-Production_Ready-emerald)](https://github.com/rssa/airdrop-viewer)

AirdropViewer adalah aplikasi web sumber terbuka (open source) yang dirancang untuk pemburu airdrop Web3. Aplikasi ini mengkombinasikan kurasi proyek berbasis data pendanaan riil (VC tier-1, valuasi, alokasi komunitas), pelacak tugas personal dengan log hash transaksi, checklist harian dengan hitung mundur reset UTC 00:00, direktori faucet testnet, linimasa roadmap, serta ekstraktor otomatis dari kanal Telegram.

---

## Fitur Utama

- **Katalog Airdrop Berbasis Data (Tier S ke C)**: Dilengkapi data awal 11 proyek berprofil tinggi (Monad, Berachain, Story Protocol, MegaETH, Babylon, Movement, Eclipse, Polymarket, Initia, Fuel, Sonic) dengan modal justifikasi mendalam: total pendanaan, lead VC, faktor pendorong, dan analisis risiko Sybil.
- **Harga Pasar & TVL Terkini (DeFiLlama)**: Integrasi API ringan ke DeFiLlama untuk benchmark harga (BTC, ETH, SOL) dan sinkronisasi TVL protokol secara real-time.
- **Pencatat Progres Tugas (Task Tracker)**: Kelola banyak dompet garapan (burner wallets), catat tautan atau transaction hash (TX Hash) on-chain sebagai bukti garap, dan pantau persentase progres secara instan.
- **Daftar Tugas Harian & Hitung Mundur UTC**: Rutinitas klaim faucet harian dan interaksi dApp dengan hitung mundur otomatis menuju reset pukul 00:00 UTC serta perayaan konfeti saat semua tugas selesai.
- **Direktori Faucet Testnet**: Kumpulan tautan faucet resmi (Monad, Berachain, Sepolia, Holesky, Base, Arbitrum) lengkap dengan fitur salin alamat dompet aktif dalam 1 klik.
- **Jadwal & Linimasa Roadmap**: Kalender visual yang memetakan fase peluncuran testnet, estimasi snapshot saldo/poin, dan tanggal klaim token (TGE).
- **Feed & Ekstraktor Telegram**: Pantau postingan dari kanal Telegram publik (`t.me/s/[channel]`) atau tempel pesan garapan untuk diekstrak otomatis (nama proyek, ticker, pendanaan, tugas, dan link).
- **Privasi Penuh (Local-First)**: Seluruh data dompet, centang tugas, dan catatan TX disimpan secara lokal di peramban (`localStorage`) dengan fitur Ekspor & Impor cadangan JSON.
- **Desain Modern & Ringan**: Tampilan light-mode bersih (`#f8fafc`), kartu putih (`#ffffff`), aksen warna emerald (`#059669`), sudut halus 8px (`rounded-lg`), dan tata bahasa UX yang alami bebas dari kata-kata klise AI.

---

## Teknologi yang Digunakan

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v3](https://tailwindcss.com/)
- **Ikon**: [Lucide React](https://lucide.dev/)
- **Animasi Efek**: [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)
- **Container**: Docker multi-stage build (Standalone Node.js runner)

---

## Panduan Memulai Cepat

### Prasyarat
- [Node.js](https://nodejs.org/) v18.18+ atau v20+ (disarankan Node.js v20 LTS)
- npm, pnpm, atau yarn

### 1. Kloning Repositori
```bash
git clone https://github.com/rssa/airdrop-viewer.git
cd airdrop-viewer
```

### 2. Pasang Dependensi
```bash
npm install
```

### 3. Jalankan Mode Pengembangan
```bash
npm run dev
```
Buka [http://localhost:3000](http://localhost:3000) di peramban Anda.

### 4. Build untuk Produksi
```bash
npm run build
npm run start
```

---

## Menjalankan dengan Docker

Aplikasi ini sudah dilengkapi konfigurasi multi-stage Dockerfile yang memproduksi container berukuran sangat ringkas (output standalone):

```bash
# Jalankan container di latar belakang
docker compose up -d --build

# Buka http://localhost:3000 di peramban
```

Untuk menghentikan container:
```bash
docker compose down
```

---

## Struktur Direktori

```
airdrop-viewer/
├── .github/
│   ├── ISSUE_TEMPLATE/       # Template laporan bug & usulan airdrop baru
│   ├── workflows/ci.yml      # CI GitHub Actions (Lint, Typecheck, Build)
│   └── PULL_REQUEST_TEMPLATE.md
├── src/
│   ├── app/                  # Next.js 15 App Router
│   │   ├── api/
│   │   │   ├── live-data/     # Endpoint harga & TVL DeFiLlama
│   │   │   └── telegram-feed/ # Scraper publik web preview Telegram
│   │   ├── daily/            # Halaman checklist harian & reset UTC
│   │   ├── faucets/          # Direktori shortcut faucet testnet
│   │   ├── telegram/         # Feed kanal & ekstraktor teks Telegram
│   │   ├── timeline/         # Jadwal linimasa & estimasi snapshot
│   │   ├── tracker/          # Pencatat tugas & manajemen dompet
│   │   ├── error.tsx         # Client-side Error Boundary
│   │   ├── loading.tsx       # Loading skeleton rute
│   │   ├── not-found.tsx     # Halaman 404
│   │   ├── manifest.ts       # Web App Manifest (PWA ready)
│   │   ├── robots.ts         # Robots.txt generator
│   │   ├── sitemap.ts        # Sitemap generator
│   │   ├── layout.tsx        # Root layout, navbar, footer, provider
│   │   └── page.tsx          # Halaman katalog utama & metrik
│   ├── components/           # Komponen UI modular
│   │   ├── ui/               # Badge, Button, Card, Modal
│   │   ├── AddEditAirdropModal.tsx
│   │   ├── AirdropCard.tsx
│   │   ├── AirdropTable.tsx
│   │   ├── DirectoryToolbar.tsx
│   │   ├── JustificationModal.tsx
│   │   ├── LiveMarketBar.tsx
│   │   └── Navbar.tsx
│   ├── context/
│   │   └── AirdropContext.tsx # State manajemen & localStorage persisten
│   ├── data/
│   │   └── airdrops.ts       # Dataset kurasi 11 proyek airdrop awal
│   ├── lib/
│   │   ├── telegramParser.ts # Parser berbasis aturan untuk teks airdrop
│   │   └── utils.ts
│   └── types/
│       └── airdrop.ts        # Deklarasi tipe TypeScript
├── Dockerfile                # Multi-stage production container
├── docker-compose.yml        # One-command self-hosting
├── CONTRIBUTING.md           # Panduan kontribusi open source
├── CODE_OF_CONDUCT.md        # Pedoman perilaku komunitas
├── LICENSE                   # Lisensi MIT
└── package.json
```

---

## Cara Menambah atau Mengubah Data Airdrop

Ada dua cara untuk memperbarui data airdrop:

1. **Melalui Antarmuka Aplikasi (UI)**:
   - Klik tombol **"+ Tambah Airdrop"** pada navigasi atas atau katalog.
   - Masukkan informasi proyek atau gunakan tombol **"Isi Otomatis dari Teks Telegram"** untuk ekstraksi cepat.
   - Proyek akan tersimpan langsung ke `localStorage` Anda dan diberi label *Kustom*.

2. **Melalui Kode Sumber (Menjadi Data Bawaan)**:
   - Buka file [`src/data/airdrops.ts`](src/data/airdrops.ts).
   - Tambahkan entri baru mengikuti interface `AirdropProject`.
   - Ajukan Pull Request agar proyek tersebut masuk ke repositori resmi.

---

## Pencadangan Data (Backup & Restore)

Data Anda (proyek kustom, dompet, catatan TX hash, dan progres tugas) tersimpan secara privat di peramban Anda. Anda dapat mencadangkan atau memindahkannya ke perangkat lain kapan saja:
1. Buka menu **Task Tracker** (`/tracker`).
2. Klik tombol **"Cadangkan / Pulihkan"**.
3. Pilih **"Unduh Cadangan JSON"** untuk menyimpan berkas `.json`.
4. Untuk memulihkan, pilih **"Unggah Berkas Cadangan"** pada perangkat baru.

---

## Keamanan & Penafian (Disclaimer)

> [!IMPORTANT]
> **Bukan Nasihat Finansial (DYOR)**: Seluruh informasi, perkiraan reward, dan skor potensi disajikan untuk tujuan edukasi dan pelacakan pribadi.
> 
> **Keamanan Dompet**:
> - Selalu gunakan dompet khusus garapan (*burner wallet*) untuk testnet.
> - Jangan pernah menghubungkan dompet utama yang menyimpan aset bernilai tinggi ke dApp testnet yang belum diaudit.
> - Jangan pernah membagikan *Private Key* atau *Seed Phrase* kepada siapa pun.

---

## Berkontribusi

Kontribusi dari komunitas sangat diterima! Silakan baca [CONTRIBUTING.md](CONTRIBUTING.md) untuk panduan penyiapan lokal, konvensi kode, dan alur pengajuan Pull Request.

---

## Lisensi

Didistribusikan di bawah lisensi **MIT**. Lihat berkas [LICENSE](LICENSE) untuk informasi lebih lanjut.
