---
type: llm
focus: {source: file, path: src/webhooks/README.md}
weight: 1
---

The README doesn't walk through the fields of a provider definition (name, secretEnvVar, signatureHeader, verify, toEvent) one by one, such as a list or table that says what each field is. ProviderDefinition in defineProvider.ts already shows them. Mentioning a field where a step or a piece of advice needs it passes, for example "add the variable its secretEnvVar names to .env.example" or advice on how to write verify.
