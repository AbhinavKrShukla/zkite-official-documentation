# ZKite Documentation Website

Official developer documentation for **ZKite 1.2.1** (with 1.2.0, 1.1.2, 1.1.1, 1.1.0, and 1.0.0 multi-version switching) — Build native Android apps using modern Python with instant hot reload.

Built with [Astro](https://astro.build) and [Starlight](https://starlight.astro.build).

---

## 🚀 Getting Started Locally

```bash
# Install dependencies
npm install

# Start local dev server with hot reload
npm run dev
```

Visit `http://localhost:4321` in your browser.

---

## 📦 Production Build

```bash
# Build static production site to ./dist
npm run build

# Preview production build locally
npm run preview
```

---

## ☁️ Deploying to Cloudflare Pages

This site is statically pre-rendered with zero runtime server requirements.

1. Connect your repository to **Cloudflare Pages**.
2. Set the following build settings:
   - **Framework preset**: `Astro`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Node.js version**: `20` or higher (e.g. set environment variable `NODE_VERSION = 20`)
3. Click **Save and Deploy**.

Cloudflare Pages will serve all static HTML, CSS, JavaScript, and the Pagefind offline search index with instant global edge caching.

---

## 📁 Content Structure

All documentation pages are written in standard Markdown and MDX located in `src/content/docs/`:

* `src/content/docs/getting-started/`: Architecture, support matrix, OS installation tabs, 1.2.1 migration, device connectivity, starter template, hot reload.
* `src/content/docs/core-concepts/`: Declarative UI tree, state stores, layout and styling tokens, lifecycle and SQLite data.
* `src/content/docs/widgets/`: Dedicated individual pages for every native widget (`Column`, `Row`, `Grid`, `Stack`, `ScrollView`, `Tabs`, `Text`, `Image`, `Icon`, `Button`, `TextField`, `Switch`, `Checkbox`, `Radio`, `Slider`, `Select`, `List`, `SystemBars`, `Nav`, `Overlay`).
* `src/content/docs/device-services/`: Device integration guides covering overview & permissions, async handlers & errors, files & uploads, camera & microphone, audio & video playback, deep links & URL schemes, sensors, system integrations, and device lab testing.
* `src/content/docs/features/`: Motion/animation physics, pure-Python dependencies, HTTPS networking.
* `src/content/docs/build/`: `app.json` and `pyproject.toml` configuration references, CLI reference, and APK/AAB release signing.
* `src/content/docs/guides/`: Windows setup, troubleshooting matrix, mobile performance & accessibility, practical exercises, FAQ, glossary, and official platform references.
