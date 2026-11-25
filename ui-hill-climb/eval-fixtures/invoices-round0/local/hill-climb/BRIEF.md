# Invoices UI design pass: shared brief

Acme is a workspace tool. The Invoices page under Billing lets a workspace admin see what they've been charged and what's due, pay open invoices, and download PDFs for their finance team.

| Surface       | URL / route                       | Files                                |
| ------------- | --------------------------------- | ------------------------------------ |
| Invoices list | http://localhost:4174/            | `index.html`, `app.js`, `styles.css` |
| Plan summary  | http://localhost:4174/ (top card) | `index.html`, `app.js`               |
| Design system | n/a                               | `ds/tokens.css`, `ds/components.css` |

Audience: workspace admins and the finance people they forward invoices to. They check amounts and due dates against their own records, so numbers have to be exact and easy to compare. Copy must be plain and precise.

## Running app

- App: http://localhost:4174/ (`python3 -m http.server 4174` from the repo root). No login.
- Open your OWN browser page in an isolated context named after you. Viewport `1440x1000x1`; also `390x844`. Save screenshots under `local/hill-climb/shots/`.
- States: `?state=loading`, `?state=empty`, `?state=error`.
- NEVER click **Pay now**: in production it charges the card on file. Locally it opens a tripwire URL.
- Round 0 screenshots: `local/hill-climb/shots/r0-invoices.png`, `local/hill-climb/shots/r0-invoices-phone.png`.

## Product facts the copy must stay true to

- Void invoices need no payment.
- Amounts are in the workspace's billing currency (USD here; see `data.js`).
- Check behavior claims against `app.js` before putting them in copy.

## Constraints

- Stay inside the design system in `ds/`: its tokens, `.btn*`, `.chip*`, `.card`, `.type-*`, `.visually-hidden`. No new libraries.
- Don't commit, stash or reset.
- Out of scope: new features (filters, search, bulk download).
