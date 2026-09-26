// server/routes/user.js
const express = require("express");
const router = express.Router();
const Razorpay = require("razorpay");

const Buyer = require("../models/Buyer");
const Time = require("../models/Time");
const Order = require("../models/Order");

const { validatePaymentVerification } = require("razorpay/dist/utils/razorpay-utils");

// Helpers
function toNumber(n, fallback = 0) {
  const x = Number(n);
  return Number.isFinite(x) ? x : fallback;
}
function calculateTotalFromSelection(selected, costsByMeal) {
  let total = 0;
  for (const val of Object.values(selected || {})) {
    if (val?.breakfast) total += costsByMeal.breakfast || 0;
    if (val?.lunch)     total += costsByMeal.lunch || 0;
    if (val?.dinner)    total += costsByMeal.dinner || 0;
  }
  return total;
}

// Basic endpoints (unchanged)
router.get("/data", async (req, res) => {
  try { res.send(await Buyer.getBuyer(req.user?.email)); }
  catch (e) { console.error(e); res.status(500).send({ error: "Failed to fetch buyer data" }); }
});
router.get("/resetSecret", async (req, res) => {
  try { res.send(await Buyer.resetSecret(req.user?.email)); }
  catch (e) { console.error(e); res.status(500).send({ error: "Failed to reset secret" }); }
});
router.post("/checkCoupon", async (req, res) => {
  try { res.send(await Buyer.checkCoupon(req.body)); }
  catch (e) { console.error(e); res.status(500).send({ error: "Failed to check coupon" }); }
});
router.get("/boughtNextWeek", async (req, res) => {
  try { res.send(await Buyer.boughtNextWeek(req.user?.email)); }
  catch (e) { console.error(e); res.status(500).send({ error: "Failed to fetch next week status" }); }
});

// Create order
router.post("/createOrder", async (req, res) => {
  try {
    if (!process.env.PAY_ID || !process.env.PAY_SECRET) {
      return res.status(503).send({ error: "Payment processing is not configured" });
    }

    const costs = await Time.getTimes(); // [{ meal, cost }]
    const priceByMeal = {};
    for (const c of costs) priceByMeal[c.meal] = toNumber(c.cost, 0);

    const selected = req.body?.selected || {};
    const total = calculateTotalFromSelection(selected, priceByMeal);
    const paise = Math.round(toNumber(total, 0) * 100);
    if (!Number.isFinite(paise) || paise <= 0) {
      return res.status(400).send({ error: "Invalid total amount" });
    }

    const keyId = process.env.PAY_ID;
    const instance = new Razorpay({ key_id: keyId, key_secret: process.env.PAY_SECRET });

    const order = await instance.orders.create({
      amount: paise,
      currency: "INR",
      notes: { source: "GLA UNIVERSITY MATHURA MESS PORTAL" },
    });

    await Order.saveOrder(order.id, selected);

    console.log("createOrder", {
      env: keyId?.startsWith("rzp_test_") ? "TEST" : "LIVE",
      id: order.id, amount: order.amount
    });

    res.send({ id: order.id, amount: order.amount, currency: order.currency, key: keyId });
  } catch (e) {
    console.error("createOrder error:", e);
    res.status(500).send({ error: "Failed to create order" });
  }
});

// Verify
router.post("/checkOrder", async (req, res) => {
  try {
    if (!process.env.PAY_SECRET) {
      return res.status(503).send({ ok: false, error: "Payment processing is not configured" });
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body || {};
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).send({ ok: false, error: "Missing payment fields" });
    }

    const isValid = validatePaymentVerification(
      { order_id: razorpay_order_id, payment_id: razorpay_payment_id },
      razorpay_signature,
      process.env.PAY_SECRET
    );
    if (!isValid) return res.send(false);

    const orderObj = await Order.getOrder(razorpay_order_id);
    if (!orderObj) return res.status(404).send({ ok: false, error: "Order not found" });

    await Buyer.saveOrder(req.user?.email, orderObj.selected);
    // Optional cleanup: await Order.deleteOrder(razorpay_order_id);

    res.send(true);
  } catch (e) {
    console.error("checkOrder error:", e);
    res.status(500).send({ ok: false, error: "Failed to verify order" });
  }
});

module.exports = router;
