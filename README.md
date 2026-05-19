# Cookest — Landing Page

Marketing landing page for the Cookest smart cooking assistant app.

## Stack

| | |
|---|---|
| Framework | Next.js 16 (App Router) |
| Styling | TailwindCSS 4 |
| Animations | Framer Motion 12 |
| i18n | Custom `TranslationProvider` — 5 locales |
| Effects | WebGL shader canvas (`ShaderCanvas`) |

## Quick Start

```bash
npm install && npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

No required environment variables — the site is fully static/SSG. Add a `.env.local` if you need to override build-time values in future.

## Project Structure

```
app/
├── layout.tsx              Root layout (ThemeProvider, TranslationProvider)
├── page.tsx                Home page — composes all sections
├── globals.css             Global styles / Tailwind base
├── components/
│   ├── Nav.tsx             Navigation bar
│   ├── Hero.tsx            Hero section
│   ├── Features.tsx        Features grid
│   ├── HowItWorks.tsx      Step-by-step tutorial
│   ├── Showcase.tsx        Product showcase / screenshots
│   ├── ScrollStory.tsx     Scroll-driven narrative section
│   ├── Sustainability.tsx  Sustainability message
│   ├── Download.tsx        App Store / Google Play links
│   ├── Footer.tsx          Footer
│   ├── ThemeProvider.tsx   Dark/light mode context
│   ├── TranslationProvider.tsx  i18n context + useTranslation hook
│   └── ShaderCanvas.tsx    WebGL background effects
└── messages/               Translation JSON files
    ├── en.json, pt.json, fr.json, de.json, es.json
```

## i18n

Supported locales: `en` · `pt` · `fr` · `de` · `es`

Translation files live in `app/messages/`. All user-visible strings must go through the `useTranslation()` hook — no hardcoded strings.

To add a new string:
1. Add the key to `en.json`
2. Add matching keys to all other locale files
3. Use `const t = useTranslation()` → `t('your.key')` in the component

## Deployment

Deployed on **Vercel**. Every push to `main` triggers a production deploy automatically via the Vercel GitHub integration.
