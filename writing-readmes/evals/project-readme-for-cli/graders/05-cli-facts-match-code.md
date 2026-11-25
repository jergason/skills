---
type: llm
focus: {source: file, path: README.md}
weight: 1
---

Every command-line fact the README states matches the code. The only flags are -s/--schema, -e/--env, --strict and -h/--help; a README that names any other flag fails. If it states defaults, --schema defaults to env.schema.json and --env defaults to .env. If it states exit codes, 0 means no problems, 1 means problems were found, and 2 means bad arguments or an unreadable or invalid file. A README that leaves some of these out and points at `envcheck --help` passes.
