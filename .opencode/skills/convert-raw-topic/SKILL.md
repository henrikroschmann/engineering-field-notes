# Convert Raw Topic

Convert raw markdown files from `input/` into polished VitePress topic files.

## Format Detection

Check the first line of each raw file to determine format:

| First Line Starts With | Format | Skill to Use | Output Category |
|---|---|---|---|
| `🔧` | Regular technical article | This skill | Auto-detected from content |
| `🥃` | After Hours Architecture briefing | `convert-after-hours` skill | `after-hours` |

If first line starts with `🥃`, **delegate to `convert-after-hours` skill** and stop. Do not process After Hours files with this skill.

## When to Use

- User asks to convert, ingest, or process raw topic files
- User runs `/format-topic` command
- New `raw-*.md` files appear in `input/`
- First line starts with `🔧` (not `🥃`)

## Workflow

1. **Scan** `input/` for `raw-*.md` files
2. For each file:
   a. Check first line — if `🥃`, delegate to `convert-after-hours` and skip
   b. Parse the raw markdown to extract title and sections
   c. Derive slug from title (kebab-case)
   d. Detect category from content keywords
   e. Check if `docs/topics/<category-slug>/<slug>.md` already exists → **skip if yes**
   f. Fill the template from `TEMPLATE.md` with extracted content
   g. Generate a quiz question from the content
   h. Auto-inject components based on topic keywords
   i. Write output to `docs/topics/<category-slug>/<slug>.md`
3. Run `npm run topic:sidebar` to regenerate the sidebar
4. Report which files were converted and which were skipped

## Parsing Rules

### Title Extraction
- First line of the file is the title
- Strip leading emoji (e.g., `🔧`, `⚡`, `📦`)
- Use everything after the emoji as the title string
- If no emoji, use the first line as-is

### Slug Generation
- Convert title to kebab-case: lowercase, replace spaces/special chars with hyphens, trim trailing hyphens
- Example: "Vector Clocks: How Systems Track Causality" → `vector-clocks`

### Section Header Mapping

Map raw section headers to canonical template sections:

| Raw Header | Template Section |
|---|---|
| `The abstraction:` | `## The False Abstraction` |
| `What happens underneath:` | `## What Actually Happens Underneath` |
| `Tiny example:` | `## Minimal Example` |
| `Why this matters:` | `## Why This Matters` |
| `One sharp takeaway:` | `## Sharp Takeaway` |
| `Rabbit hole:` | `## Rabbit Holes` |

Content between headers belongs to that section. Content before the first header is part of the title/summary area.

### Category Detection

Scan content for keywords and assign category:

| Category Slug | Keywords |
|---|---|
| `distributed-systems` | causality, vector clock, lamport, consensus, replica, partition, CRDT, message ordering, logical clock, happens-before, concurrent |
| `web-performance` | render, paint, layout, critical path, bundle, hydration, SSR, CLS, FCP, LCP |
| `databases` | query, index, transaction, isolation, ACID, WAL, B-tree, LSM, replication |
| `networking` | TCP, UDP, HTTP, DNS, TLS, handshake, latency, throughput, CDN |
| `algorithms` | sorting, searching, graph, tree, complexity, Big-O, dynamic programming |

If no keywords match, default to `general`.

### Summary Generation

Use the content from `The abstraction:` section as the basis for both:
- `description` in frontmatter (truncate to 160 chars)
- `subtitle` prop on `<TopicLayout>`

## Quiz Generation

Generate a `<MiniQuiz />` component from the content:
- Create a multiple-choice question that tests understanding of the core concept
- Provide 4 options, one correct answer
- Include an explanation
- Place it at the end of the file before `</TopicLayout>`

Format:
```
<MiniQuiz
  question="..."
  :options="['A', 'B', 'C', 'D']"
  :answer=N
  explanation="..."
/>
```

## Component Injection Rules

Auto-inject components based on content keywords:

| Keywords in Content | Components to Inject | Placement |
|---|---|---|
| "vector clock", "causal" | `<VectorClockSimulator />` + `<CausalCompare :initial-a="[1,2,0]" :initial-b="[0,0,2]" />` | After `## Minimal Example` |
| Code examples (code blocks) | `<CodeRunner :initial-code="..." />` | After interactive components |
| "mermaid", "diagram" | `<MermaidDiagram />` | After relevant section |

For `<CodeRunner>`, extract the most relevant code snippet from the raw file and inject it as the `:initial-code` prop.

## Level Detection

- If content mentions foundational concepts, definitions → `"beginner"`
- Default → `"intermediate"`
- If content assumes deep prior knowledge → `"advanced"`

## Tags Generation

Derive 3-5 tags from the title and content keywords. Use lowercase, kebab-case format.

## Output Format

Use `TEMPLATE.md` as the layout reference. Fill all `{{variable}}` placeholders. The output file must:
1. Have valid YAML frontmatter
2. Wrap all content in `<TopicLayout>` with appropriate props
3. Include all mapped sections (even if brief)
4. End with `<MiniQuiz />` before closing `</TopicLayout>`

## Skip Logic

Before writing, check if `docs/topics/<category-slug>/<slug>.md` exists. If it does, skip the file and report it as already converted.
