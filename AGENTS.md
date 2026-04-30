<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# Cookest Landing Page — Agent Instructions

You are working on the **Cookest Landing Page**, a Next.js marketing site with i18n support.

## Quick Reference

| Attribute | Value |
|-----------|-------|
| Language | TypeScript 5 |
| Framework | Next.js 16 (App Router) |
| Styling | TailwindCSS 4 |
| Animations | Framer Motion 12 |
| i18n | Custom TranslationProvider (5 languages) |

## Documentation

📖 **Full documentation**: https://cookest-docs.vercel.app/docs (or run locally from `../docs/`)

Key pages:
- [Architecture Overview](../docs/content/docs/architecture/overview.mdx)
- [Repository Guide](../docs/content/docs/architecture/repositories.mdx)
- [Best Practices](../docs/content/docs/contributing/best-practices.mdx)
- [Agent Instructions](../docs/content/docs/ai/instructions.mdx)

## Architecture

```
app/
├── (home)/                 ← Root landing page
├── components/
│   ├── Nav.tsx             ← Navigation bar
│   ├── Hero.tsx            ← Hero section
│   ├── Features.tsx        ← Features grid
│   ├── Showcase.tsx        ← Product showcase
│   ├── HowItWorks.tsx      ← Tutorial section
│   ├── Sustainability.tsx  ← Sustainability message
│   ├── Download.tsx        ← App store links
│   ├── Footer.tsx          ← Footer
│   ├── ThemeProvider.tsx   ← Dark/light mode
│   ├── TranslationProvider.tsx ← i18n context
│   └── ShaderCanvas.tsx    ← WebGL effects
└── messages/               ← Translation JSON files
    ├── en.json, pt.json, fr.json, de.json, es.json
```

## Key Rules

1. **All text via translation system** — use `useTranslation()` hook, no hardcoded strings
2. **TailwindCSS only** — no CSS modules or inline styles
3. **Framer Motion** for all animations
4. **Responsive** — mobile-first design
5. **One component per file**, PascalCase names

## Commit Format

```
<type>(<scope>): <description>
```

Scopes: `hero`, `features`, `nav`, `i18n`, `seo`, `download`, `footer`

## MCP Server

For programmatic documentation access, use the MCP server at `../docs/mcp/`.
