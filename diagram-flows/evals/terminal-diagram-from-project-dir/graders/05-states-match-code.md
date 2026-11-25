---
type: llm
focus: trace
weight: 1
---

The diagram shows the six states in src/order.ts (pending, paid, shipped, delivered, cancelled, refunded) and only the transitions the code allows: pending to paid or cancelled, paid to shipped or refunded, shipped to delivered, delivered to refunded. Cancelled and refunded are terminal.
