// controllers/paymentController.js
import Stripe from 'stripe';
const stripe = new Stripe('sk_test_51QvMemIx4VrJr5SYp6V4BfWjnWJkToO40WWa0qTiPEEYRxWQSXjvNuapOsYLPRtfoSg5ucmvbSP3zcRbR1CzsCoC00pUoDRYHo');

export const createPaymentIntent = async (req, res) => {
  try {
    const { amount, currency } = req.body;
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
    });
    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('PaymentIntent yaradılarkən xəta:', error);
    res.status(500).json({ error: error.message });
  }
};
