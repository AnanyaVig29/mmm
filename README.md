# 💸 ExpenseFlow — Vault Edition

A high-performance, fully responsive personal finance application built with **React**, **Vite**, **GSAP**, and **Framer Motion**. Designed with a premium "Vault" aesthetic, it features real-time currency conversion, interactive charts, sound effects, text-to-speech feedback, and complex animations.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite)
![GSAP](https://img.shields.io/badge/GSAP-3-88CE02?logo=greensock)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-0055FF?logo=framer)
![Recharts](https://img.shields.io/badge/Recharts-2.15-22B5BF?logo=recharts)

---

## ✨ Features

- **The Vault Theme** — A high-security, industrial aesthetic with dark/light variations and a unique realistic pendant-lamp theme toggle.
- **Advanced Animations** 
  - **GSAP:** Scroll-triggered reveals, viewport parallax, timeline staggers, and mechanical interactions.
  - **Framer Motion:** Micro-interactions, staggered layout entries, page transitions, and a coin-rain effect.
- **Savings Vault** — Deposit and withdraw funds with physical vault lock animations, sound effects (SFX), and Web Speech API voice synthesis.
- **Live Bank Feed** — Simulated real-time transaction streaming with realistic network delays.
- **Interactive Tracking** — Add, view, and delete expenses (categorized as Food, Travel, Utilities, Marketing, Other) tracked natively in **INR (₹)**.
- **Interactive Data Viz** — Live sector breakdown using `Recharts` (Pie) and a 7-day spending trend Area Chart.
- **Accolades System** — Unlock animated vault badges as your savings grow.
- **Responsive Layout** — Mobile-first fluid grid, complete with a slide-in sidebar navigation for smaller screens.
- **Local Persistence** — All state (expenses, savings, linked cards, theme, unlocked badges) survives browser refreshes via `localStorage`.

---

## 🏗️ Project Structure

```text
src/
├── api/
│   └── currencyApi.js          # Frankfurter API helpers for live exchange rates
├── components/
│   ├── ui/
│   │   ├── Icon.jsx            # Reusable Google Material Symbols wrapper
│   │   └── ThemeToggle.jsx     # Complex pendulum lamp animation component
│   ├── BankLink.jsx            # Plaid-style card linking UI
│   ├── CurrencyConverter.jsx   # Live FX conversion widget
│   ├── ExpenseForm.jsx         # Add expense form with validation
│   ├── ExpenseList.jsx         # List of added expenses
│   ├── Footer.jsx              # Global footer
│   ├── LiveBankFeed.jsx        # Simulated real-time transaction ticker
│   ├── Login.jsx / Signup.jsx  # Auth layouts
│   ├── Navbar.jsx              # Fixed top nav + mobile slide-in sidebar
│   ├── Profile.jsx             # User profile, unlocked badges, linked cards
│   ├── SavingsPage.jsx         # Full-page animated vault reveal layout
│   ├── SavingsVault.jsx        # The core deposit/withdraw vault component
│   ├── SummaryPanel.jsx        # Recharts Pie Chart breakdown
│   ├── TrendsGraph.jsx         # Recharts Area Chart (7-day history)
│   ├── VaultBadgePopup.jsx     # Animated achievement unlock modal
│   └── VaultMonthlyReport.jsx  # Summary report card
├── hooks/
│   ├── useAuth.jsx             # Auth, User, and global Savings state context
│   ├── useCursor.js            # Custom glow-following cursor hook
│   └── useVaultFeatures.js     # Web Audio API (SFX) & Web Speech API integration
├── styles/
│   ├── tokens.css              # Global design tokens (variables)
│   └── globals.css             # Base resets, typography, global utilities
├── utils/
│   └── helpers.js              # Formatting, ID generation, category coloring
├── App.jsx                     # Root application + Routing + Dashboard layout
└── main.jsx                    # React entry point
```

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server
# NOTE: vite is configured to bind to 0.0.0.0, so you can test on your mobile device!
npm run dev

# Build for production
npm run build
```

---

## 🎨 Vault Design System

The application uses custom CSS variables to handle the complex Vault aesthetic across Day and Night modes.

| Variable | Night / Vault Mode | Day / Light Mode |
|----------|--------------------|------------------|
| `--primary` | `#C1FF00` (Neon Lime) | `#4F46E5` (Indigo) |
| `--accent` | `#38BDF8` (Sky) | `#0EA5E9` (Ocean) |
| `--bg-deep` | `#07070A` (Pitch) | `#EEF0F7` (Soft Gray) |
| `--bg-card` | `rgba(18, 18, 24, 0.92)` | `rgba(255, 255, 255, 0.96)` |

**Iconography:** The project strictly uses scalable **Google Material Symbols Rounded** for a uniform, premium look.

---

## 🔄 Integrations & Web APIs

- **Frankfurter API:** Live currency data (`GET /latest?from=USD&to=INR`). No API keys required.
- **Web Audio API:** High-fidelity lock, click, error, and success sound effects built straight into `useVaultFeatures.js`.
- **Web Speech API:** Generates native text-to-speech context reading (e.g., "Secured! You added 500 rupees to your savings").

---

## 📱 Responsiveness

| Breakpoint | Behavior Adjustments |
|------------|----------|
| **≤ 480px** | Tighter padding, single-column charts, compact Vault interface. |
| **≤ 768px** | Dashboard grid collapses. Navbar links disappear in favor of the **slide-in right Sidebar**. |
| **≤ 1080px** | Hero sections stack. Sidebars drop to the bottom of the content flow. |
| **≥ 1280px** | Fluid max-width 1600px grids, advanced hover interactions. |

---

## ⚡ Performance Optimizations

- **Animation offloading:** GSAP strictly manipulates `transform` and `opacity` properties to ensure 60fps rendering without paint thrashing.
- **Memoization:** `useMemo` caching is utilized for chart aggregation logic (Pie limits, 7-day Area chart rollups) so data is only re-calculated when `expenses` change.
- **Cleanup:** All GSAP ScrollTriggers and timelines use `gsap.context()` for instant, memory-leak-free unmounting. All Web Speech instances cancel themselves upon unmount.
