# Convert After Hours Architecture

Convert "After Hours Architecture" raw briefing files from `input/` into polished, opinionated topic files with a fun, conversational tone.

## When to Use

- Raw file starts with `🥃` emoji (not `🔧`)
- File contains "After Hours Architecture" in the title
- User explicitly asks to convert an After Hours briefing

## Format Differences from Regular Topics

| Aspect | Regular (`🔧`) | After Hours (`🥃`) |
|---|---|---|
| Tone | Technical, educational | Conversational, opinionated, witty |
| Structure | Single deep-dive | Multiple curated articles + commentary |
| Components | `<VectorClockSimulator>`, etc. | `<QuoteBlock>`, `<SmellBadge>` |
| Layout | `<TopicLayout>` | `<AfterHoursLayout>` |
| Level | beginner/intermediate/advanced | Always `"casual"` |

## Parsing Rules

### Title Extraction
- First line starting with `🥃` is the title
- Strip emoji, keep everything after
- Format: `After Hours Architecture — [Theme]`
- Slug: `after-hours-[week-identifier]` or `after-hours-[date]`

### Date Detection
- Look for date references in the title or first few lines
- If not found, use today's date
- Format: ISO date `YYYY-MM-DD`

### Article Sections

Each numbered article (1️⃣, 2️⃣, etc.) contains:
- **Title**: Line after the number emoji
- **Summary**: Under `Summary:` header
- **Why it matters**: Under `Why it matters:` header
- **Discussion starters**: Bullet points under `Discussion starters:`
- **Contrarian angle**: Under `Contrarian angle:` header
- **Practical takeaway**: Under `Practical takeaway:` header
- **Sources**: URLs under `Sources:` header

### Special Sections

| Raw Header | Template Section |
|---|---|
| `🏗️ Architecture Smell of the Week:` | `<SmellBadge>` block |
| `Smell:` | Description of the smell |
| `Risk:` | Why it matters |
| `Question:` | Provocative question |
| `🥃 Whisky-Grade Take:` | Quote block with takeaway |
| `🎯 Final Obnoxious Take:` | Bold closing statement |

### Category Detection

After Hours files always go to category `after-hours`.

### Tags Generation

Derive tags from article topics. Always include `"after-hours"`. Add 3-5 topic-specific tags.

## Quiz Generation

Generate a lighter, opinionated quiz:
- Question should be provocative or humorous
- Options can include funny wrong answers
- The "correct" answer is the one that matches the briefing's stance

## Component Injection

| Content | Component |
|---|---|
| Each article with a source URL | `<SourceLink url="..." title="..." />` |
| Contrarian angle sections | `<QuoteBlock type="contrarian">` |
| Architecture Smell section | `<SmellBadge level="high" />` |
| Whisky-Grade Take | `<QuoteBlock type="takeaway">` |
| Discussion starters | Render as interactive poll if applicable |

## Output Format

Use `TEMPLATE.md` as the layout reference. The output:
1. Has YAML frontmatter with `category: "after-hours"` and `level: "casual"`
2. Uses `<AfterHoursLayout>` wrapper
3. Each article gets its own section with source links
4. Architecture Smell gets special badge treatment

## Skip Logic

Same as regular topics: check if target file exists before writing.
