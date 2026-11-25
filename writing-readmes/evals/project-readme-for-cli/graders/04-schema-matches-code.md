---
type: llm
focus: {source: file, path: README.md}
weight: 1
---

Anything the README says about the schema file matches the code. The allowed types are exactly string, number, boolean and url (no others, such as integer or email). A variable is required unless its entry sets "optional": true. There is no "required" field, so a README that shows or describes a "required" field fails. A README that points at examples/env.schema.json instead of describing the format passes, as does one that says nothing about the schema format.
