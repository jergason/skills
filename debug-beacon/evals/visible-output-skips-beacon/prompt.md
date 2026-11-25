---
tags: [debug-beacon, negative]
max_turns: 15
timeout_seconds: 300
allowed_tools: [Read, Glob, Grep, Skill, Write, Edit, Bash]
---

`node scripts/cart-total.js data/cart.json` prints 42.50 but the cart adds up to 50.00. why? fix it
