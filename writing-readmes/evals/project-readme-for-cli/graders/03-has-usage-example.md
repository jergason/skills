---
type: regex
pattern: '(?:^|\n)(?:\$ )?(?:npx |npm exec |pnpm (?:dlx |exec )?|yarn (?:dlx )?)?(?:@acme-tools/)?envcheck(?:[ \t]|\n)'
match: contains
target: {source: file, path: README.md}
weight: 1
---

The README has a usage example with a line that runs envcheck, like `npx envcheck` or `envcheck --strict`. The install command alone doesn't count. A project README's reader often doesn't have the code open, so pointing at a source file isn't enough here.
