# Acme settings

Static settings page for Acme, a workspace tool that lets people connect third-party apps.

Run it from the repo root:

```sh
python3 -m http.server 4173
```

Then open <http://localhost:4173/>. No login. Reach other states with `?state=loading`, `?state=empty` or `?state=error`.

The design system lives in `ds/` (tokens and component classes). `marketing/` belongs to another team.
