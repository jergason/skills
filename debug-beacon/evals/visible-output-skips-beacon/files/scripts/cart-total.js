import fs from "node:fs";

const cart = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
const items = cart.items;

let cents = 0;
for (let i = 0; i < items.length - 1; i++) {
  cents += Math.round(items[i].price * 100) * items[i].qty;
}

console.log((cents / 100).toFixed(2));
