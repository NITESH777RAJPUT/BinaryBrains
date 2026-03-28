import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    client: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      trim: true,
    },
    pricingType: {
      type: String,
      enum: ["Fixed", "Hourly"],
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    estimatedHours: {
      type: Number,
      required: true,
      min: 0,
    },
    thresholdRate: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Project", projectSchema);

