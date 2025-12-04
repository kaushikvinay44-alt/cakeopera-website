// server.js
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const key_id = process.env.RAZORPAY_KEY_ID;
const key_secret = process.env.RAZORPAY_KEY_SECRET;

if(!key_id || !key_secret){
  console.error('RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET must be set');
  process.exit(1);
}

const razorpay = new Razorpay({ key_id, key_secret });

app.get('/', (req, res) => res.json({ ok: true, msg: 'Razorpay server running' }));

app.post('/create-order', async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt } = req.body;
    const order = await razorpay.orders.create({
      amount: Math.round(amount),
      currency,
      receipt: receipt || `rcpt_${Date.now()}`,
      payment_capture: 1
    });
    res.json({ ok: true, order });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

app.post('/verify-payment', (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const hmac = crypto.createHmac('sha256', key_secret);
  hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
  const generated = hmac.digest('hex');

  if (generated === razorpay_signature) {
    res.json({ ok: true, verified: true });
  } else {
    res.status(400).json({ ok: false, verified: false });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> console.log("Server listening on", PORT));
