import client from "../Database/db.js";
import dotenv from "dotenv";
import { payInvoice } from "./vehicleBookingController.js";
import Stripe from "stripe";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const payForBooking = async (req, res) => {
  try {
    const { amount } = req.body;
    // Create a customer
    const customer = await stripe.customers.create();

    // // Create an ephemeral key for that customer
    // const ephemeralKey = await stripe.ephemeralKeys.create(
    //   { customer: customer.id },
    //   { apiVersion: "2025-01-27" } // use the latest API version
    // );

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: "zar",
      customer: customer.id,
      automatic_payment_methods: { enabled: true },
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
      customer: customer.id,
    });
  } catch (error) {
    console.error("Error creating payment intent: ", error);
  }
};

export { payForBooking };
