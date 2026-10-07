import express from "express";
import {
  createDiningReservation,
  getAllDiningReservations,
} from "../services/dataStore.js";
import { requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// POST /api/dining/reservations
router.post("/reservations", async (req, res) => {
  try {
    const { name, email, phone, date, time, guests, restaurant, request } = req.body;

    if (!name || !email || !phone || !date || !time || !restaurant) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all required fields for the table reservation.",
      });
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    const reservation = await createDiningReservation({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      date,
      time,
      guests: guests || "2 Guests",
      restaurant,
      request: request || "",
    });

    return res.status(201).json({
      success: true,
      message: "Table reservation successfully received.",
      reservation,
    });
  } catch (error) {
    console.error("Dining reservation error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create dining reservation.",
    });
  }
});

// GET /api/dining/reservations (admin only)
router.get("/reservations", requireAdmin, async (req, res) => {
  try {
    const reservations = await getAllDiningReservations();
    return res.json({
      success: true,
      reservations,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching dining reservations.",
    });
  }
});

export default router;
