import mongoose from "mongoose";

const AvailabilityAddressSchema = new mongoose.Schema(
  {
    formattedAddress: {
      type: String,
      required: [true, "Formatted address is required"],
      trim: true,
    },
    streetAddress: {
      type: String,
      default: "",
      trim: true,
    },
    unit: {
      type: String,
      default: "",
      trim: true,
    },
    city: {
      type: String,
      default: "",
      trim: true,
    },
    state: {
      type: String,
      default: "",
      trim: true,
    },
    zipCode: {
      type: String,
      default: "",
      trim: true,
    },
    country: {
      type: String,
      default: "USA",
      trim: true,
    },
    latitude: {
      type: Number,
      default: null,
    },
    longitude: {
      type: Number,
      default: null,
    },
    serviceType: {
      type: String,
      default: "home_internet",
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.AvailabilityAddress ||
  mongoose.model("AvailabilityAddress", AvailabilityAddressSchema);
