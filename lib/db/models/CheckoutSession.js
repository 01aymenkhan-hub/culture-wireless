import mongoose from "mongoose";

// Stores only the server-derived Clerk identity and Zoho checkout reference.
// It lets post-payment endpoints verify that a Hosted Page belongs to the
// signed-in customer without trusting a browser-supplied user ID.
const CheckoutSessionSchema = new mongoose.Schema(
  {
    clerkUserId: {
      type: String,
      required: true,
      index: true,
    },
    hostedPageId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
  },
  { timestamps: true },
);

export default mongoose.models.CheckoutSession ||
  mongoose.model("CheckoutSession", CheckoutSessionSchema);
