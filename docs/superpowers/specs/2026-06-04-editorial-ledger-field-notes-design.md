# Editorial Ledger Field Notes Design

## Intent

Engineering Field Notes should feel like a technical magazine built from practical field observations, not a generic dashboard. The redesign will apply one consistent Editorial Ledger visual language to the homepage and topic pages while preserving the existing VitePress architecture and topic Markdown workflow.

The immediate UI failure is a build-blocking Vue expression in `docs/topics/distributed-systems/lease-based-distributed-locks.md`. That fix is part of the work because the site cannot render reliably until the build succeeds.

## Scope

- Redesign the homepage rendered by `docs/index.md` and `FieldJournalHome.vue`.
- Redesign the shared article shell in `TopicLayout.vue`.
- Tune global theme CSS only where it supports the field-note article experience.
- Fix the invalid `CodeRunner` prop expression in the lease-based locks topic.
- Verify with `npm run docs:build`.

Out of scope:

- Rewriting topic content.
- Replacing VitePress routing or sidebar generation.
- Adding new persisted data sources or dynamic topic ingestion behavior.
- Refactoring unrelated interactive components.

## Visual Direction

Use the selected Technical Magazine direction, specifically the Editorial Ledger variant.

Characteristics:

- Dark editorial palette with restrained blue and indigo accents.
- Large, high-contrast headline typography with tight letter spacing.
- Thin rules, compact metadata, and strong section hierarchy.
- Content surfaces that feel like article modules rather than app widgets.
- Technical density without dashboard clutter.

## Homepage Design

`FieldJournalHome.vue` becomes a magazine front page.

Structure:

- Editorial hero with site title, thesis line, featured note, and primary action.
- Latest-notes rail next to the hero for quick scanning.
- Latest Field Notes section using compact article cards.
- Systems Index section for categories.
- Upcoming Field Notes section as a secondary editorial module.

Behavior:

- Keep links as normal VitePress-compatible anchors.
- Avoid introducing client-side routing state.
- Keep static arrays local to the component for now, matching the current implementation.
- Ensure the layout collapses cleanly to one column on mobile.

## Topic Page Design

`TopicLayout.vue` remains the shared wrapper used by generated Markdown topics.

Structure:

- Category eyebrow above the headline.
- Large article headline from the `title` prop.
- Subtitle deck from the `subtitle` prop.
- Metadata/tag row from `level` and `tags`.
- Sharp Takeaway pull quote from the `takeaway` prop.
- Default Markdown slot rendered as the main article body.
- Optional interactive and related slots restyled as editorial modules.

Behavior:

- Preserve the existing prop names and slot names.
- Do not require changes to existing topic frontmatter or Markdown wrappers.
- Use CSS classes instead of expanding inline styles.

## Build Fix

`docs/topics/distributed-systems/lease-based-distributed-locks.md` currently passes raw Python code directly to `:initial-code`, causing Vue to parse invalid JavaScript during build.

Fix:

- Wrap the `initial-code` value as a valid JavaScript template literal expression, matching the working pattern in `docs/topics/distributed-systems/vector-clocks.md`.
- Keep the displayed code content unchanged except for escaping required by the Vue attribute.

## Error Handling

- The redesign should not hide build errors or route errors.
- Broken content links may remain visible if they already existed, but new links should target existing pages where possible.
- If a topic lacks optional props, `TopicLayout` should render gracefully using its current defaults.

## Testing

Primary verification:

- Run `npm run docs:build` and require it to pass.

Optional visual verification:

- Run `npm run docs:dev` or `npm run docs:preview` and inspect homepage and at least one topic page on desktop and mobile widths.

## Implementation Notes

- Prefer minimal changes to existing architecture.
- Keep component state static unless a real dynamic source is introduced later.
- Avoid unrelated cleanup in generated sidebars or topic files.
- Preserve user or concurrent work already present in the worktree.
