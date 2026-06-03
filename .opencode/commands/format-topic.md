Convert raw markdown files from `input/` into polished topic files.

Usage: `/format-topic` — scans all raw files, converts unconverted ones, skips existing targets.

Format detection (first line emoji):
- `🔧` → Regular technical article → uses `convert-raw-topic` skill → `<TopicLayout>`
- `🥃` → After Hours Architecture briefing → uses `convert-after-hours` skill → `<AfterHoursLayout>`

Triggers the `convert-raw-topic` skill which auto-routes based on format.
