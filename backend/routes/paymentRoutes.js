// routes/paymentRoutes.js
import express from 'express';
import { createPaymentIntent } from '../controller/paymentController.js';

const router = express.Router();

router.post('/products/create-payment-intent', createPaymentIntent);

export default router;
