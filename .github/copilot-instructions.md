You are working on the **Cookest Landing Page** (Next.js 16, TailwindCSS 4, TypeScript, i18n).

## Mandatory Startup — Run Before Anything Else

Call these MCP tools at the start of every session, in order:

1. `vault_read("Agents/context.md")` — live project memory
2. `vault_read("Errors/error-log.md")` — past mistakes to avoid
3. `vault_read("Learnings/learning-log.md")` — past discoveries
4. `get_project_context()` — live system snapshot

Do not skip. These 4 calls take seconds and prevent hours of repeated mistakes.

## Mandatory — Use Context7 Before Writing Library Code

Before writing code that uses any package, call Context7:

```
query-docs({ libraryId: "/vercel/next.js", query: "your question" })
query-docs({ libraryId: "/tailwindcss/tailwindcss", query: "your question" })
query-docs({ libraryId: "/framer/motion", query: "your question" })
```

Pre-resolved IDs for all libraries: `vault/Learnings/library-ids.md`

## Web / TypeScript Rules (enforced)

1. Server Components by default — `'use client'` only for event handlers or browser APIs.
2. Next.js `Image` component always — never raw `<img>` for user-facing images.
3. Design tokens as CSS variables — never hardcode brand colours.
4. `get_design_tokens()` to get current token values.
5. TailwindCSS utility classes — no inline `style={{}}` for themeable values.
6. i18n: every string through the i18n system — no hardcoded copy in components.
7. No `any` in TypeScript — use `unknown` + type guards.
8. Check `vault/Patterns/coding-guidelines.md` for full TS/React best practices.
9. Check `vault/Patterns/anti-patterns.md` for things that caused bugs in this codebase.

## Mandatory Shutdown — Run at End of Every Session

1. `vault_append("Changes/changelog.md", "## [YYYY-MM-DD] ...\nWhat was done and why")` — append only
2. `vault_write("Sessions/YYYY-MM-DD-topic.md", fullSessionLog)` — session log
3. If a pattern was discovered or a bug was fixed: `vault_append("Learnings/learning-log.md", ...)` or `vault_append("Errors/error-log.md", ...)`

## Project Context

@AGENTS.md
