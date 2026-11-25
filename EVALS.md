# Evals

Each skill keeps its cases in `<skill>/evals/<case>/` (`case.yaml`, `prompt.md`, `graders/`, optional `place-files.sh` and `files/`) and a trigger set in `<skill>/eval-fixtures/trigger-queries.json`. They run with `claude plugin eval`.

## Running

From a skill's folder:

```sh
claude plugin eval . --scaffold --allow-tools Write Edit Bash Agent SendMessage --runs 1 --ablation none
```

- Add `WebFetch WebSearch` to `--allow-tools` for read-first.
- Drop `--ablation none` to get with-skill vs without-skill scores. That's the number that says whether a section earns its tokens.
- Add `--keep-temp` when a grader fails and you need to see what the run actually wrote. The run's files are sealed: `chmod 700` the kept dir and its `sealed/` folder, as the runner's message says, and don't run git inside it.
- `--case <name>` and `--tag <tag>` narrow the run. `--max-cost-usd` caps spend.

Two local snags stop every case that grants Bash:

- Every directory on `PATH` must be readable. A root-only `/usr/local/bin` (`drwx------`) fails with "a PATH directory could not be examined for keychain credential helpers (EACCES)".
- A shell function wrapping `claude` that sets `CLAUDE_CONFIG_DIR` has to work in non-interactive shells, or child runs come back "Not logged in". `command claude` skips the wrapper.

## Writing graders

Check what the run produced, not the story of how it got there. In order of preference:

1. **Deterministic graders.** `regex` on a file the run wrote, `file_exists`, `tool_used` (with `max: 0` to forbid a call), `tool_order`.
2. **An `llm` grader on one named artifact.** Use `focus: {source: file, path: ...}` or `focus: last_message`. If the run picks its own file names, have the prompt name the file instead ("write it to local/hill-climb/synthesis-r2.md").
3. **`focus: trace` only for the start or end of a run**: which skill loaded first, whether it committed or published at the end.

Why: the runner shortens long traces before an `llm` grader sees them. It keeps the start and end and replaces the middle with "[…N messages elided…]". The judge doesn't abstain. It votes PASS or FAIL on whatever it was shown, so mid-run checks quietly turn into guesses. Multi-agent runs lose hundreds of messages this way.

Other runner behavior to know:

- `focus: files` gives the judge a list of the file names the run created, not their contents, and it doesn't include modified files.
- The default judge is haiku, which reads grader text literally and misses things in long files (the runner warns past roughly 8k characters). For long artifacts, prefer regex graders, point the judge at a smaller file (a manifest instead of the page it built), or pass `--judge-model sonnet`. Say exactly what passes, and say which honest caveats are fine ("read via a summary" shouldn't fail a reading check).
- Runs can't bind local ports, and no case setting changes that. Test servers outside evals.
- Runs don't load your CLAUDE.md, memory, settings or other skills. Put everything the case needs in the prompt and the scaffold.

When a grader fails, look at its `evidence` in the `--json` output before changing the skill. Failures in this repo have usually been one of three things: the grader couldn't see the content, the grader was stricter than the skill, or the fixture had a real bug the judges were right about. Only the rest are skill problems.
