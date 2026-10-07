import mongoose from "mongoose";

const diningReservationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    guests: {
      type: String,
      required: true,
      default: "2 Guests",
    },
    restaurant: {
      type: String,
      required: true,
    },
    request: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Cancelled"],
      default: "Confirmed",
    },
  },
  {
    timestamps: true,
  }
);

const DiningReservation =
  mongoose.models.DiningReservation ||
  mongoose.model("DiningReservation", diningReservationSchema);

export default DiningReservation;
