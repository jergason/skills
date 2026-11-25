---
type: regex
pattern: '^(?=[\s\S]*\bduration)(?=[\s\S]*\berror(?:Name|.s `?name|`? `?name)\b)'
flags: i
match: not_contains
target: {source: file, path: src/jobs/README.md}
weight: 1
---

The README doesn't list the fields runJob logs when an attempt fails (the job, the attempt, the duration and the error name). Naming the 'runJob() failed' message and pointing at runJob.ts for the fields passes.
