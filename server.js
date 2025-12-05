// server.js - Cakeopera Razorpay backend (CommonJS version)
const express = require("express");
const cors = require("cors");
const Razorpay = require("razorpay");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Razorpay instance with keys from .env
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Simple health route
app.get("/", (req, res) => {
  res.send("Cakeopera Backend Running Successfully!");
});

// Create order route
// NOTE: client will send amount in *paise* (already ×100), so we use it directly.
app.post("/create-order", async (req, res) => {
  try {
    const { amount, currency = "INR", receipt } = req.body;

    const options = {
      amount,                       // already in paise
      currency,
      receipt: receipt || "receipt_order_" + Date.now(),
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Order creation failed:", error);
    res.status(500).json({
      success: false,
      message: "Server error while creating order",
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✔ Cakeopera backend running on port ${PORT}`);
});
