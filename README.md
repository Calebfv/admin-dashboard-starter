# Admin Dashboard Starter

Admin dashboard template: **React + TypeScript + Tailwind CSS + Lucide Icons**, with light/dark mode and a minimalist style inspired by Shadcn UI / Vercel.

## Option A — Use this project as is

```bash
npm install
npm run dev
```

## Option B — Copy it into an existing Vite project

```bash
npm create vite@latest my-dashboard -- --template react-ts
cd my-dashboard
npm install lucide-react
npm install -D tailwindcss@3 postcss autoprefixer
```

Then:

1. Replace the `src/` folder with this template's (delete `App.css` and the sample assets).
2. Copy to the root: `tailwind.config.ts`, `postcss.config.js` and `index.html` (it includes the theme anti-flicker script).
3. In `tsconfig.node.json`, add `"tailwind.config.ts"` to the `include` array.
4. `npm run dev`.

> The template uses **Tailwind v3** (`tailwind.config.ts` + `postcss`). The code works with React 18 and 19.

## Structure

```
src/
├── App.tsx                  # Shell, global state (active view, user, settings, session) and navigation
├── main.tsx                 # Mounts <ToastProvider><App/></ToastProvider>
├── index.css                # Color tokens (light/dark) + Tailwind + reduced motion
├── types.ts                 # All shared types (ViewId, filters, toasts, settings…)
├── views/                   # One view per sidebar section
│   ├── DashboardView.tsx    # KPIs, recent activity and status breakdown
│   ├── TransactionsView.tsx # Filters + advanced table
│   ├── CustomersView.tsx    # Customer list (search, sorting, jump to their transactions)
│   ├── AnalyticsView.tsx    # Metrics, daily chart and breakdown by payment method
│   └── SettingsView.tsx     # Profile (with validation), appearance and notifications
├── components/
│   ├── Sidebar.tsx, Header.tsx, ThemeToggle.tsx, StatCard.tsx, StatusBadge.tsx
│   ├── NotificationBell.tsx # Presentational panel; state lives in App
│   ├── UserMenu.tsx         # Reports the chosen option via onAction
│   ├── ToastProvider.tsx    # Context + alerts viewport
│   ├── SignedOutScreen.tsx  # Screen after "Sign out" (demo)
│   ├── FilterBar.tsx, DataTable.tsx
│   └── PageHeader, MetricCard, BarChart, SegmentedControl, Switch
├── hooks/
│   ├── useTheme.ts, useDismiss.ts, useNotifications.ts
│   ├── useToast.ts          # Toast context and hook
│   └── useTransactionFilters.ts
├── data/                    # mock.ts, navigation.ts, notifications.ts
└── lib/                     # filters, customers, analytics, validation, format, utils
```

## Quick customization

- **Colors / theme:** edit the CSS variables in `src/index.css` (`:root` and `.dark`).
- **Navigation:** `src/data/navigation.ts`.
- **Real data:** replace `STATS` and `TRANSACTIONS` in `src/data/mock.ts` with your API; components only depend on the types in `types.ts`.
- **New transaction status:** add it to `TransactionStatus` in `types.ts` and to `STATUS_CONFIG` in `StatusBadge.tsx`.
- **New section:** add its id to `ViewId` (`types.ts`), an item in `navigation.ts` and a `case` in `renderView` of `App.tsx`; the compiler warns if any is missing (`assertNever`).
- **Routes:** the active view lives in state. For real URLs, add `react-router-dom` and turn the Sidebar `<button>`s into `<NavLink>`s.
