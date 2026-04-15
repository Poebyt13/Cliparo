import mongoose from "mongoose";

const waitlistEmailSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    referrer: {
      type: String,
      default: null,
      trim: true,
    },
  },
  {
    timestamps: true,
    collection: "waitlist_emails",
  }
);

export default mongoose.models.WaitlistEmail ||
  mongoose.model("WaitlistEmail", waitlistEmailSchema);
