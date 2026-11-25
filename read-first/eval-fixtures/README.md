# read-first eval notes

`archive-direction-cites-what-it-read` needs `--allow-tools Write WebFetch WebSearch`.

The skill's most important rule is "only list things you actually opened". No grader checks it directly: the eval runner shortens long traces before an `llm` grader sees them, and the `WebFetch` calls land in the elided middle. `02-fetched-sources` counts the fetches and `03-notes-show-reading` checks that each note has content only reading would give. To check the rule itself, run the case with `--keep-temp` and compare the reply's links against the `WebFetch` URLs in `out/trace.jsonl`.
