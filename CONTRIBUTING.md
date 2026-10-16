# Panduan Kontribusi (Contributing Guide)

Terima kasih atas ketertarikan Anda untuk berkontribusi pada **AirdropViewer**! Proyek ini bersifat sumber terbuka (open source) dan bertujuan membantu komunitas Web3 melacak, mengevaluasi potensi secara objektif, serta mencatat tugas airdrop terkurasi.

---

## Cara Berkontribusi

Anda dapat berkontribusi dalam berbagai bentuk:
1. Menambahkan proyek airdrop baru ke dataset bawaan (`src/data/airdrops.ts`).
2. Melaporkan kutu (bug) atau celah keamanan.
3. Mengusulkan atau mengimplementasikan fitur baru.
4. Memperbaiki dokumentasi atau teks antarmuka (UX writing).

---

## Panduan Penyiapan Lingkungan Lokal

### Prasyarat
- **Node.js** v18.18+ atau v20+ (disarankan Node.js v20 LTS atau v22)
- **npm**, **pnpm**, atau **yarn**

### Langkah-langkah:
1. **Fork** repositori ini di GitHub.
2. **Clone** hasil fork ke komputer lokal Anda:
   ```bash
   git clone https://github.com/username-anda/airdrop-viewer.git
   cd airdrop-viewer
   ```
3. **Pasang Dependensi**:
   ```bash
   npm install
   ```
4. **Jalankan Server Pengembangan**:
   ```bash
   npm run dev
   ```
   Buka [http://localhost:3000](http://localhost:3000) di peramban Anda.

5. **Verifikasi Build Produksi**:
   Sebelum membuat pull request, pastikan build berjalan tanpa error:
   ```bash
   npm run build
   ```

---

## Menambahkan Proyek Airdrop Baru

Untuk menambahkan airdrop terverifikasi ke dataset bawaan:
1. Buka file [`src/data/airdrops.ts`](file:///src/data/airdrops.ts).
2. Tambahkan objek proyek baru sesuai antarmuka `AirdropProject`:
   - `id`: slug unik dalam huruf kecil (contoh: `"monad"`).
   - `name`: nama resmi proyek.
   - `potential`: data pendanaan riil, tier (`Tier S`, `Tier A`, `Tier B`, atau `Tier C`), skor (0-100), investor utama, faktor pendorong, dan risiko Sybil.
   - `chains`, `category`, `status`, dan `costType`.
   - `milestoneTasks`: daftar langkah terverifikasi.
   - `dailyTasks`: tugas harian (jika relevan).
   - `faucetLinks`: tautan faucet resmi.
   - `timeline`: jadwal estimasi snapshot atau peluncuran token.
3. Pastikan data pendanaan dan investor dapat diverifikasi dari sumber terpercaya (misal: CryptoRank, RootData, atau DeFiLlama).

---

## Standar Kode & Desain

- **TypeScript Strict**: Hindari penggunaan tipe `any` sebisa mungkin.
- **Tailwind CSS**: Gunakan sistem palet Slate + Emerald (`#059669`) dengan radius konsisten `rounded-lg` (8px).
- **UX Writing**: Ikuti pedoman bebas slop (tanpa em dash `—`, tanpa buzzwords hampa seperti *"revolutionary"*, dan gunakan bahasa Indonesia yang natural).

---

## Mengajukan Pull Request (PR)

1. Buat branch baru dari `main`:
   ```bash
   git checkout -b feat/tambah-proyek-baru
   ```
2. Commit perubahan Anda dengan pesan yang jelas:
   ```bash
   git commit -m "feat(data): tambahkan proyek baru dengan justifikasi pendanaan"
   ```
3. Push ke fork Anda:
   ```bash
   git push origin feat/tambah-proyek-baru
   ```
4. Buat Pull Request di repositori utama dan jelaskan perubahan yang Anda buat.
