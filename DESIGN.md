# Design System: Web3 Airdrop Tracker & Curation Hub

Documented per `/antislop-ui` standards based on user direction.

---

## 1. Direction & Brand Identity

- **Theme Mode**: **Light Mode Default** (Clean, crisp, high contrast, non-generic)
- **Mood / Character**: **Modern Web3 Dashboard** (Clear data hierarchy, actionable tracking, crisp table/card views, zero decorative fluff)
- **Dials**:
  - `ENERGY`: 2 (Focused, professional, confident)
  - `RHYTHM`: 2 (Varied card and list compositions suited for data density)
  - `MOTION`: 1 (Purposeful transitions only: tab switches, modal fades, checkmark toggles; no continuous looping animations)

---

## 2. Color Palette & Semantic Tokens

### Base & Surfaces (Light Mode)
- **Background Root (`bg-root`)**: `#f8fafc` (Slate 50 - clean neutral canvas, not sterile blinding white)
- **Surface / Card (`bg-card`)**: `#ffffff` (Pure White - crisp separation from background)
- **Surface Secondary (`bg-muted`)**: `#f1f5f9` (Slate 100 - search inputs, pill backgrounds, table header rows)
- **Surface Hover (`bg-hover`)**: `#e2e8f0` (Slate 200 - subtle interactive states)
- **Border Default (`border-default`)**: `#e2e8f0` (Slate 200 - clean 1px hairline structural lines)
- **Border Subtle (`border-subtle`)**: `#cbd5e1` (Slate 300 - focused inputs and active card outlines)

### Typography & Text Hierarchy
- **Text Primary (`text-primary`)**: `#0f172a` (Slate 900 - high contrast, comfortable reading, AA/AAA compliance)
- **Text Secondary (`text-secondary`)**: `#475569` (Slate 600 - metadata, subtitles, table columns)
- **Text Muted (`text-muted`)**: `#64748b` (Slate 500 - timestamps, helper labels)

### Emerald / Green Semantic Accent System
- **Accent Primary (`emerald-600`)**: `#059669` (Active buttons, primary badges, high potential highlights)
- **Accent Hover (`emerald-700`)**: `#047857` (Interactive active states)
- **Accent Subtle (`emerald-50`)**: `#ecfdf5` (Badge backgrounds, checklist row highlights)
- **Accent Border (`emerald-200`)**: `#a7f3d0` (Active borders, verified tags)
- **Accent Text (`emerald-800`)**: `#065f46` (High contrast text on emerald-50 backgrounds)

### Semantic Status Badges
- **Tier S / High Potential**: Emerald (`bg-emerald-50 text-emerald-800 border-emerald-200`)
- **Tier A / Medium Potential**: Sky / Blue (`bg-sky-50 text-sky-800 border-sky-200`)
- **Tier B & C / Speculative**: Amber (`bg-amber-50 text-amber-800 border-amber-200`)
- **Deadline / Urgent**: Rose (`bg-rose-50 text-rose-800 border-rose-200`)

---

## 3. Typography Rules

- **Font Family**:
  - Primary UI: System Sans-Serif stack (`Inter`, `system-ui`, `-apple-system`, `BlinkMacSystemFont`, `Segoe UI`, `sans-serif`) - Simple, minimalist, highly legible.
  - Numbers, Addresses, Tx Hashes: Monospace stack (`ui-monospace`, `SFMono-Regular`, `Menlo`, `Monaco`, `Consolas`, `monospace`) - Tabular numbers for clean financial alignment.
- **Weights**: Regular (400) for body, Medium (500) for metadata & labels, Semibold (600) for titles and primary headers. Bold (700) is reserved only for major page numbers and hero titles.
- **Rule Compliance**: NO wide letter-spacing uppercase gimmicks (`tracking-widest` only on tiny labels if purposeful), NO fake terminal facades.

---

## 4. Geometry, Radii & Elevation

- **Border Radius**: **Strict 8px (`rounded-lg` / `0.5rem`)** across cards, modal containers, inputs, buttons, and popovers.
  - Micro-elements (pills, tags): 6px (`rounded-md`).
  - NO excessive pill shapes everywhere.
- **Shadows**:
  - Cards & Panels: Subtle elevation `shadow-sm` (`0 1px 2px 0 rgb(0 0 0 / 0.05)`).
  - Floating Modals & Dropdowns: `shadow-md` / `shadow-lg` with soft boundary.
  - NO giant blurry neon glow or floating shadows.

---

## 5. Anti-Slop Strict Guardrails (UI Skill Checklist)

- [x] **No Generic Gradients**: No purple-to-blue or cyber-glow gradients. Crisp, solid light backgrounds with emerald accents.
- [x] **No Emoji as Decoration**: No rocket emoji (🚀), fire emoji (🔥), or checkmark emoji (✅) in titles or buttons. Use crisp semantic Lucide SVG icons.
- [x] **No Decorative Pulsing Dots**: Status dots mark real active states only (e.g. "Testnet Live" vs "Snapshot Ended"), with no endless infinite animations.
- [x] **Real Data & Justifications**: No filler lorem ipsum or fake `$12,483 (+12%)` metrics. Real funding numbers, real venture capital firms (Paradigm, Polychain, a16z), real faucets, and verified tasks.
- [x] **No Dead Controls**: Every button, tab, and link has functional behavior or an explicit status indicator.
