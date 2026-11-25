export type OrderState =
  | { kind: "pending"; createdAt: Date }
  | { kind: "paid"; paidAt: Date; paymentId: string }
  | { kind: "shipped"; shippedAt: Date; trackingNumber: string }
  | { kind: "delivered"; deliveredAt: Date }
  | { kind: "cancelled"; cancelledAt: Date; reason: string }
  | { kind: "refunded"; refundedAt: Date; refundId: string };

export type OrderEvent =
  | { type: "pay"; paymentId: string }
  | { type: "ship"; trackingNumber: string }
  | { type: "deliver" }
  | { type: "cancel"; reason: string }
  | { type: "refund"; refundId: string };

export function transition(state: OrderState, event: OrderEvent, now = new Date()): OrderState {
  switch (state.kind) {
    case "pending":
      if (event.type === "pay") return { kind: "paid", paidAt: now, paymentId: event.paymentId };
      if (event.type === "cancel") return { kind: "cancelled", cancelledAt: now, reason: event.reason };
      break;
    case "paid":
      if (event.type === "ship") return { kind: "shipped", shippedAt: now, trackingNumber: event.trackingNumber };
      if (event.type === "refund") return { kind: "refunded", refundedAt: now, refundId: event.refundId };
      break;
    case "shipped":
      if (event.type === "deliver") return { kind: "delivered", deliveredAt: now };
      break;
    case "delivered":
      if (event.type === "refund") return { kind: "refunded", refundedAt: now, refundId: event.refundId };
      break;
    case "cancelled":
    case "refunded":
      break;
  }
  throw new Error(`can't ${event.type} an order that is ${state.kind}`);
}
