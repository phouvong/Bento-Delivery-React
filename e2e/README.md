# End-to-end tests

Playwright specs for the customer web app.

## Running

```bash
yarn test:e2e            # headless, boots `yarn dev` automatically
yarn test:e2e:ui         # interactive UI mode
yarn test:e2e:headed     # watch the browser
yarn test:e2e:report     # open the last HTML report
```

Target a deployed environment instead of localhost:

```bash
PLAYWRIGHT_BASE_URL=https://6ammart-react.6amtech.com yarn test:e2e
```

## Conventions

- One spec file per feature area (`smoke.spec.ts`, `checkout.spec.ts`, ...).
- Prefer role/label selectors (`getByRole`, `getByLabel`) over CSS classes —
  MUI class names are generated and change between builds.
- Cases from `qa-web-test-suite.md` that depend on admin-configured zones or
  stores need the QA environment; guard them with `test.skip()` plus a comment
  rather than letting them fail on dev.
- Only Chromium is installed by default. Enable the other projects in
  `playwright.config.ts` after `npx playwright install firefox webkit`.
