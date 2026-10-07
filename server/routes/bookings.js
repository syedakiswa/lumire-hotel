import express from "express";
import {
  createBooking,
  getUserBookings,
  getBookingById,
  cancelBooking,
} from "../services/dataStore.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

// POST /api/bookings - Create new booking
router.post("/", authenticate, async (req, res) => {
  try {
    const { roomId, checkIn, checkOut, guests, specialRequests } = req.body;

    if (!roomId || !checkIn || !checkOut) {
      return res.status(400).json({
        success: false,
        message: "Room ID, check-in date, and check-out date are required.",
      });
    }

    const booking = await createBooking({
      userId: req.user.id,
      roomId,
      checkIn,
      checkOut,
      guests,
      specialRequests,
    });

    return res.status(201).json({
      success: true,
      message: "Booking successfully created and confirmed.",
      booking,
    });
  } catch (error) {
    console.error("Create booking error:", error);
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to create booking.",
    });
  }
});

// GET /api/bookings/my - Get user's bookings
router.get("/my", authenticate, async (req, res) => {
  try {
    const bookings = await getUserBookings(req.user.id);
    return res.json({
      success: true,
      bookings,
    });
  } catch (error) {
    console.error("Get my bookings error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch bookings.",
    });
  }
});

// GET /api/bookings/:id - Get specific booking
router.get("/:id", authenticate, async (req, res) => {
  try {
    const booking = await getBookingById(req.params.id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      });
    }

    const bookingUserId = booking.user?._id || booking.user;
    if (req.user.role !== "admin" && String(bookingUserId) !== String(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You can only view your own bookings.",
      });
    }

    return res.json({
      success: true,
      booking,
    });
  } catch (error) {
    console.error("Get booking error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve booking.",
    });
  }
});

// PUT /api/bookings/:id/cancel - Cancel booking
router.put("/:id/cancel", authenticate, async (req, res) => {
  try {
    const isAdmin = req.user.role === "admin";
    const updated = await cancelBooking(req.params.id, req.user.id, isAdmin);

    return res.json({
      success: true,
      message: "Booking has been successfully cancelled.",
      booking: updated,
    });
  } catch (error) {
    console.error("Cancel booking error:", error);
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to cancel booking.",
    });
  }
});

export default router;
