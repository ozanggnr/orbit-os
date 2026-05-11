# Orbit OS — Responsive Design Checklist
## Phase 4.5 — Layout & Overflow Fix Pass

> **Build:** ✅ `npm run build` passes — 0 TypeScript errors · All 16 routes compile

---

## Test Viewports

| Label | Width | Primary Device |
|-------|-------|---------------|
| Mobile S | **390px** | iPhone 14 |
| Mobile L | **430px** | iPhone 14 Pro Max |
| Tablet | **768px** | iPad Mini |
| Laptop | **1024px** | 13" MacBook |
| Desktop | **1280px** | Common desktop |
| Wide | **1440px** | Large monitor |

---

## Global Checklist

| # | Check | Tool |
|---|-------|------|
| G1 | No horizontal scroll on any page | browser resize |
| G2 | Body `overflow-x: hidden` set | CSS |
| G3 | `page-content` + `page-inner` have `max-width: 100%` | CSS |
| G4 | TopBar spans full width on mobile (left: 0) | CSS `.topbar-fixed` |
| G5 | Bottom nav visible & not overlapping content | visual |
| G6 | Safe bottom padding for bottom nav (72px + safe-area) | CSS |
| G7 | iPhone notch/home-indicator covered by safe-area CSS | `@supports` block |
| G8 | Long env var names wrap in code pills | CSS `.env-var-pill` |
| G9 | All GlassPanels have `w-full min-w-0` | primitives.tsx |
| G10 | SectionHeader title uses `clamp()` for responsive size | primitives.tsx |

---

## Page-by-Page Checklist

### 🪐 Orbit Page (`/orbit`)
- [ ] Header "Orbit" title + MoodSelector visible and not overflowing at 390px
- [ ] Metric pills (focus/streak/sessions) hidden below 1024px (already `hidden lg:flex`)
- [ ] Orbit rings scaled to fit viewport (CSS `.orbit-canvas-inner` scale: 0.52 on mobile)
- [ ] Central orb visible and centered at all sizes
- [ ] Weather beacon hidden on mobile (`hidden sm:block`) — prevents overlap
- [ ] Music player hidden on mobile (`hidden sm:block`) — saves vertical space
- [ ] Focus timer hidden on mobile (`hidden sm:block`)
- [ ] AI Insight panel uses `min(300px, calc(100vw - 32px))` — never overflows
- [ ] Event strip scrolls horizontally with touch (`event-strip` CSS class)
- [ ] Quick Actions row wraps cleanly on mobile
- [ ] Toast appears above bottom nav

### 📅 Timeline Page (`/timeline`)
- [ ] View tabs (Today/Week/Month) fit in `inline-flex` with `overflow-x-auto`
- [ ] Metrics grid is `2-col` on mobile, `4-col` on sm+
- [ ] Timeline nodes have `min-w-0` preventing text overflow
- [ ] Entry titles use `overflow:hidden + textOverflow:ellipsis`
- [ ] Tag pills wrap with `flex-wrap`
- [ ] Week day cards use `flex-wrap` for day+energy row
- [ ] Month summary cards readable at 390px

### 📡 Signals Page (`/signals`)
- [ ] Stats grid is `2-col` on mobile
- [ ] Filter pills scroll horizontally on mobile (no wrapping)
- [ ] Signal cards have `min-w-0` on content column
- [ ] Priority pill hidden on mobile (`hidden sm:inline-flex`)
- [ ] Action buttons (pin/read) remain accessible on 390px

### ✦ Constellations Page (`/constellations`)
- [ ] Main grid is `1-col` on mobile (< xl), `5-col` on xl+
- [ ] SVG maps wrapped in `.constellation-svg-wrap` — scale to 100% width
- [ ] SVG has `viewBox` set → scales correctly
- [ ] Habit list items have `min-w-0` → no text overflow
- [ ] Detail panels appear below map on mobile
- [ ] Pattern analysis tab readable on 390px

### ⚙️ Settings Page (`/settings`)
- [ ] API health badge "0/4 configured" fits on mobile
- [ ] API connection cards are single column on mobile
- [ ] Env var code pill uses `env-var-pill` class (word-break: break-all)
- [ ] Action button row wraps with `flex-wrap gap-2`
- [ ] Appearance toggles readable at 390px
- [ ] Privacy section fits on 390px

---

## Responsive Behavior Summary

### OrbitCanvas Scaling (CSS scale strategy)
| Viewport | Canvas Size (logical) | CSS Scale | Effective Size |
|----------|----------------------|-----------|---------------|
| < 640px | 960×960 | 0.52× | ~499px |
| 641–1023px | 960×960 | 0.72× | ~691px |
| ≥ 1024px | 960×960 | 1.00× | 960px |

The canvas uses a fixed logical size so orbit physics stay consistent. CSS transform scale is applied at the container level — no JS resize logic needed.

### Navigation Breakpoints
| Viewport | Nav Type | Position |
|----------|----------|----------|
| < 768px (md) | Bottom tab bar | Fixed bottom |
| ≥ 768px (md) | Vertical side nav | Fixed left (72px wide) |

---

## Known Acceptable Limitations

1. **Orbit interaction on mobile** — Planet nodes are small (30–56px) but remain tappable. The 52% scale means they're effectively 15–29px, which is tight but functional.
2. **Music player hidden on mobile** — Shown only on `sm:` and above. On mobile, music info is not displayed; consider a mini player for Phase 5.
3. **Focus timer hidden on mobile** — Similarly hidden on small screens. Phase 5 could add a compact bottom-sheet version.
4. **Weather beacon hidden on mobile** — The canvas overlay would overlap the central orb on 390px. Weather data could be added to the Today summary panel in Phase 5.
5. **Orbit on very small screens (< 360px)** — The 52% scale at 360px gives a ~499px logical canvas which still exceeds the viewport slightly. The `overflow:hidden` on `.orbit-scene` clips it cleanly.

---

## How to Test

```bash
# Dev server
npm run dev

# Then in Chrome DevTools:
# Toggle Device Toolbar (Ctrl+Shift+M)
# Test at: 390px, 430px, 768px, 1024px, 1280px, 1440px
# On each size, check all pages via the bottom nav (mobile) or side nav (desktop)
```

### Quick CLI test for build integrity
```bash
npm run build   # Must exit 0
npm run lint    # Should pass
```

---

*Orbit OS · Phase 4.5 · Responsive Fix Pass · May 2026*
