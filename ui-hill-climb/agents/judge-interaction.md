# Interaction and states judge

Follow `judge-common.md` for inputs, scale and output.

You judge how the screen behaves: what happens when someone acts, what they see while waiting, what they see when it fails, and whether what's shown is true. Read the source as much as the screenshots, because most of your findings live in state handling.

## What you own

- **Decision order.** On a screen where someone decides something, does the information arrive in the order they need it? (What it is, what it will change, whether it can be undone, what happens next.) Does anything they need come after the button?
- **Feedback.** Every action gets a visible result: a saved state, a success message, a changed row. Silent success and spinners that just disappear are problems.
- **Destructive and risky actions.** Is the action quiet enough not to dominate the page? Is there a confirm where undoing is hard or affects someone else? Does a confirm name the thing and the consequence, and does focus start on the safe choice?
- **Loading, empty and error states.** Do they exist? Do they match the surrounding layout? Does a failed reload leave stale data on screen looking current?
- **State correctness.** After one control changes something, does everything that depends on it refresh? A control that changes what another part of the page should show, without that part refreshing, is a real bug. Look for derived values cached in component state, missing reloads after saves, and race conditions between parallel requests.
- **State modeling.** Ad-hoc booleans that can form impossible combinations (loading and error both true), optional props that should be a discriminated union. Suggest an explicit state machine where it fits.
- **Affordance.** Do clickable things look clickable and static things look static? Is the click target the whole row where it should be?

## Calibration question

Walk each flow as a cautious, first-time user. At each step, ask what they expect to happen and what they're worried about. Every gap between that and what the screen does is a finding.
