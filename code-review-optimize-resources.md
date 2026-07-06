# Code Review: `optimize-resources` branch (vs `master`)

High-effort review: 8 finder angles → 8 candidates verified individually → 7 findings survived.

## Correctness (4 — all CONFIRMED)

### 1. Race condition on rapid language toggle clicks
**File:** `src/App.tsx:106`

`switchTo` has no request-sequencing guard, so rapid clicks on opposite language buttons can leave the UI on the language the user did *not* click last.

**Failure scenario:** User clicks NL (triggers a slow dynamic `import('./translations/nl')` in `loadLanguage`), then quickly clicks EN before it resolves. EN's resources are already loaded so its `switchTo` call finishes first (`changeLanguage('en')`, `setLang('en')`, URL → `/`). Shortly after, the pending NL call resolves and continues executing, overwriting state back to `lang='nl'` and URL `/nl/`. Final state shows Dutch content/URL even though the user's last click was English. React's automatic batching doesn't prevent this since the two calls are separate, unsynchronized async chains.

### 2. Unhandled promise rejection on language switch failure
**File:** `src/components/common/language_selector.tsx:26`

`switchTo`'s returned promise is never awaited or caught in the button `onClick` handlers (or in `App.tsx`'s `?lang=` backward-compat effect), so a rejected dynamic import silently fails with no user feedback.

**Failure scenario:** After a new deploy replaces content-hashed chunk files on GitHub Pages, a client with a stale cached page clicks the language toggle; `loadLanguage`'s dynamic `import('./translations/nl')` 404s (ChunkLoadError) and rejects. `switchTo` throws before reaching `changeLanguage`/`setLang`/`history.replaceState`. The click produces no visible effect and only an unhandled promise rejection in the console — the user has no indication the switch failed.

### 3. English fallback silently lost for `/nl/`
**File:** `src/i18n.ts:24`

`i18n` now initializes with empty resources and each page only loads its own language, so `fallbackLng: 'en'` has no English data to fall back to on a fresh page load — a regression from the old shared-instance architecture that always had both languages loaded.

**Failure scenario:** Previously the deleted `src/translations/index.ts` eagerly loaded both `en` and `nl` into the one shared i18next instance at import time, so any key missing/untranslated in `nl/*.json` would transparently render the English text via fallback, on any page. Now `src/app/nl/page.tsx` passes only `nl` resources via `createLangInstance`, and English is only ever added via `loadLanguage`, which only runs if the user manually toggles languages. The next time a translator adds an English string without the Dutch equivalent (or vice versa), visitors landing directly on `/nl/` will see a raw i18next key or blank text instead of a graceful English fallback.

*Note: verified — no such missing key exists in the current content today (checked every en/nl namespace pair). This is a latent/dormant regression, not a currently-visible bug.*

### 4. Shared i18next resource store across clones
**File:** `src/i18n.ts:39`

`createLangInstance` clones i18next via `cloneInstance({ lng: lang })` without `forkResourceStore: true`, so all clones share one mutable resource store by reference instead of getting an isolated copy.

**Failure scenario:** In `src/app.test.tsx`, multiple `it()` blocks run in the same module instance with no vitest module reset. Once an earlier test renders `PortfolioApp` with `initialLang="nl"` (populating the shared store's `nl` bundle), a later test's `loadLanguage(instance, 'nl')` call finds `instance.hasResourceBundle('nl', 'common')` already `true` (leaked from the earlier test) and skips the dynamic `import('./translations/nl')` entirely — the test still passes but silently stops exercising the lazy-load code path it's nominally testing, masking a regression if `LANGUAGE_LOADERS.nl` were ever broken.

## Efficiency (1)

### 5. Re-clicking the active language forces a full re-render
**File:** `src/App.tsx:106`

`switchTo` has no early return when `next` equals the already-active language, so re-clicking the current language button triggers a full i18next `languageChanged` emission and re-renders every translated component for zero actual change.

**Failure scenario:** Neither `LanguageSelector` button is disabled based on active state (only `aria-pressed` differs visually), so a user re-clicking the already-selected EN/NL pill runs `instance.changeLanguage(next)` — confirmed i18next has no same-language short-circuit — which bumps react-i18next's revision counter and force re-renders Introduction, Employments, LicensesCertifications, Presentations, Languages, and Education, plus a redundant `history.replaceState` call, all for no visible change.

## Cleanup (2 — both PLAUSIBLE, minor)

### 6. `en.ts`/`nl.ts` duplicate assembly boilerplate
**File:** `src/translations/nl.ts:1`

`en.ts` and `nl.ts` duplicate the same ~30-line import/`employmentItems`/resources-assembly boilerplate with no shared factory, despite `buildEmployments` already having been extracted one level up.

**Cost:** Adding an 8th employer, renaming a namespace, or adding a new top-level resource key requires editing both files in lockstep with the identical shape; the two files already show one piece of drift (the `dates` explanatory comment exists only in `nl.ts`). The per-file static JSON imports are structurally required for code-splitting and can't be parameterized, but the `employmentItems` map construction and final `resources` object assembly could still be factored into a shared `buildLanguageResources()` helper taking the pre-imported JSON as arguments.

### 7. Lazy-load attributes copy-pasted across 5 components
**File:** `src/components/employments/employment_item.tsx:28`

`loading="lazy" decoding="async"` is copy-pasted onto 5 separate `<img>` tags across 5 different files instead of factored into a shared icon/image component.

**Cost:** If the lazy-loading strategy ever needs to change (e.g. add `fetchPriority`, switch to `next/image`, add an `onError` fallback), it must be updated in all 5 files (`employment_item.tsx`, `education_item.tsx`, `license_certification_item.tsx`, `presentation_item.tsx`, `language_item.tsx`); missing one silently reintroduces eager-loading for just that section.

*Note: `profile_item.tsx`'s header `<img>` was correctly left untouched since it's above-the-fold content (consistent with the sibling `next/image priority` usage) — that omission is intentional, not an inconsistency. Only the 5-file duplication itself is the actionable finding, and it's a minor stylistic cost for a small site.*

## Refuted (not included above)

- **`images: { unoptimized: true }` in `next.config.js`** — flagged as a "blanket, undocumented" config change, but verified as a genuinely necessary, hard requirement for `next/image` under `output: 'export'`, with an already-adequate explanatory comment. Not a defect.
