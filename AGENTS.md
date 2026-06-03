# Engineering Field Notes

VitePress documentation site with custom Vue components and an automated topic ingestion pipeline.

## Commands

| Command | Description |
|---------|-------------|
| `npm run docs:dev` | Start dev server at localhost |
| `npm run docs:build` | Build static site to `docs/.vitepress/dist` |
| `npm run docs:preview` | Preview local build |
| `npm run topic:validate <file.json>` | Validate a topic JSON file |
| `npm run topic:ingest <file.json>` | Ingest topic JSON into `docs/topics/<category>/<slug>.md` |
| `npm run topic:sidebar` | Regenerate sidebar from `docs/topics/` files |

All scripts are TypeScript, run via `tsx` (no separate build step). The package uses ES modules (`"type": "module"`).

## Content Workflow

New topics are authored as JSON, not markdown directly. The ingestion pipeline:

1. Write a topic JSON with fields: `title`, `slug` (kebab-case), `category`, `summary`, `sections[]` (each with `key` and `content`), optional `tags[]`, `level`, `quiz`, `interactive[]`
2. Validate: `npm run topic:validate path/to/topic.json`
3. Ingest: `npm run topic:ingest path/to/topic.json` — creates `docs/topics/<category-slug>/<slug>.md`
4. Regenerate sidebar: `npm run topic:sidebar`

Section keys recognized by the ingestor (in order): `false-abstraction`, `what-happens-underneath`, `minimal-example`, `interactive-section`, `why-this-matters`, `failure-modes`, `sharp-takeaway`, `rabbit-holes`. Unknown keys are appended as extra sections.

The `interactive` array in the JSON references component names: `vector-clock-simulator`, `causal-compare`.

## Architecture

- **Config**: `docs/.vitepress/config.ts` — sidebar is currently hardcoded; `sidebar.generated.ts` exists but isn't wired in yet
- **Custom components** (globally registered in `theme/index.ts`): `VectorClockSimulator`, `CausalCompare`, `MiniQuiz`, `CodeRunner`, `MermaidDiagram`
- **Dependencies**: `vitepress`, `mermaid`, `tsx`

## Deployment

Pushes to `main` trigger GitHub Pages deploy via `.github/workflows/deploy.yml`. The build output path is `docs/.vitepress/dist`.
