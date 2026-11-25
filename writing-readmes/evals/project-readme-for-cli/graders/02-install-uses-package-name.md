---
type: regex
pattern: '^(?![\s\S]*(?:npm (?:i|install)|pnpm add|yarn add)(?: -g| --global)? envcheck\b)[\s\S]*(?:npm (?:i|install)|npx|pnpm add|pnpm dlx|yarn add|yarn global add)[^\n]*@acme-tools/envcheck'
match: contains
target: {source: file, path: README.md}
weight: 1
---

The install command uses the published package name, @acme-tools/envcheck, and never tells the reader to install the bare name envcheck (which is only the command's name).
