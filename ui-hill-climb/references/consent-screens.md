# Permission and consent screens

Extra patterns for screens where someone grants, reviews or revokes access: OAuth consent, connected apps, API tokens, sharing settings. Read with `taste.md`. They came out of real hill-climbs on these screens.

- **Follow the standard order.** GitHub's and Google's OAuth consent screens set it: who is asking, as which account, what it can do, how long it lasts, how to undo it. Departures from this order cost trust.
- **Lead with the name, then its trust signal.** Put provenance right after the name as its own quiet element ("by claude.ai" in muted text, or an "Unverified app" chip), not in a caption two lines down.
- **Access level is a chip with an icon**, beside the name: an eye for view, a pencil for edit.
- **Buttons say what they grant.** "Allow viewing and changes", "Don't allow".
- **List every capability in one bordered box**, one row each with an icon column, including how long access lasts. "Always included" marks the rows you can't turn off.
- **People are neutral, apps are colored.** Fallback avatars for people are grey, so they can't be confused with app avatars.
- **Show the paused state.** When an org-wide setting caps an individual's choice, show both: a "Can view" chip and a separate "Changes paused" chip, with an explanation reachable by keyboard.
