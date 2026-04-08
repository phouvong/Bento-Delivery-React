# Cutlery Switch Dark Mode Fix

## Task
Fix two dark-mode UX issues:
- The `Cutlery` switch was hard to see in dark mode.
- On page reload, UI briefly showed light theme before switching to dark theme.

## Problems
1. **Switch visibility**
- `Cutlery` uses `CustomSwitch` from `NavBar.style`.
- In dark mode, thumb/track contrast was low for this checkout section.

2. **Theme flash on reload (FOUC)**
- App settings started with `theme: "light"` in `SettingsProvider`.
- Saved theme was restored later in `useEffect`, so first paint could be light.

## Root Cause
- Theme was resolved **after** initial render.
- No pre-hydration theme bootstrap was applied in `_document`.
- The specific `Cutlery` switch needed stronger contrast in dark mode.

## Implementation

### 1) Cutlery switch contrast (component-level override)
File: `src/components/checkout/item-checkout/Cutlery.js`
- Added `useTheme`.
- Added `sx` override on `CustomSwitch`:
  - Dark mode thumb -> white.
  - Dark mode track -> border with `theme.palette.neutral[500]`.

### 2) Early theme initialization
File: `src/contexts/settings-context.js`
- `restoreSettings()` now safely returns `initialSettings` on server.
- `useState(() => restoreSettings())` is used so theme is restored immediately on client render.
- Added effect to keep `data-theme`, `color-scheme`, and page background synced with `settings.theme`.

### 3) Pre-hydration theme bootstrap
File: `pages/_document.js`
- Added a small inline script in `<Head>` to read `localStorage.settings.theme` (or system dark preference fallback).
- Script sets:
  - `document.documentElement.dataset.theme`
  - `document.documentElement.style.colorScheme`
  - `document.documentElement.style.backgroundColor`

### 4) Global CSS support for `data-theme`
File: `src/styles/globals.css`
- Added:
  - `html[data-theme="dark"]` and `body` dark background/color.
  - `html[data-theme="light"]` and `body` light background.
- Updated `prefers-color-scheme: dark` block to run only when `data-theme` is not set.

## Validation
- `npm run lint -- --file src/components/checkout/item-checkout/Cutlery.js` -> pass.
- `npm run lint -- --file src/contexts/settings-context.js --file pages/_document.js` -> pass (existing non-blocking warning remains for analytics inline script style).

## Expected Result
- In dark mode, cutlery switch is clearly visible.
- On reload with dark mode enabled, page renders dark immediately (no white flash).
