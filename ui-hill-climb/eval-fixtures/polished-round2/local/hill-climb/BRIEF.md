# Connected apps UI design pass: shared brief

Acme is a workspace tool. The Connected apps page lets a workspace admin see which third-party apps can reach the workspace, what each can do, and cut off access. People land here when something looks wrong, so they're cautious.

| Surface        | URL / route                       | Files                                      |
| -------------- | --------------------------------- | ------------------------------------------ |
| Apps list      | http://localhost:4173/            | `index.html`, `app.js`, `styles.css`       |
| Revoke confirm | click Revoke on any row           | `index.html` (`#confirm`), `app.js`        |
| Policy card    | http://localhost:4173/ (top card) | `index.html`, `app.js`                     |
| Settings nav   | left of every settings page       | `index.html`, `styles.css` (shared shell)  |
| Design system  | n/a                               | `ds/tokens.css`, `ds/components.css`       |

Audience: workspace admins at 20-500 person companies. Comfortable with SaaS settings, not developers. Copy must be plain, calm and precise.

## Running app

- App: http://localhost:4173/ (`python3 -m http.server 4173` from the repo root). No login.
- Open your OWN browser page in an isolated context named after you. Viewport `1440x1000x1`; also `390x844`. Save screenshots under `local/hill-climb/shots/`.
- States: `?state=loading`, `?state=empty`, `?state=error`. The confirm opens from any Revoke button. Untick the policy switch to see the paused state.
- Revoking a seeded app is fine; reload restores the seed data.

## Product facts the copy must stay true to

- Revoking takes effect right away.
- Access lasts a per-workspace number of days (`config.js`); never hardcode it.
- Unverified apps haven't been reviewed by Acme.
- The workspace name is whatever the admin typed in General settings.

## Constraints

- Stay inside the design system in `ds/`: its tokens, `.btn*`, `.chip*`, `.card`, `.type-*`, `.visually-hidden`. No new libraries.
- Off-limits: `marketing/` has another team's uncommitted work. Don't commit, stash or reset.
- Out of scope: new features; the content of the sibling settings pages the nav links to.
