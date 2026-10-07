import express from "express";
import {
  getAllRooms,
  getRoomByIdOrSlug,
  checkRoomAvailability,
} from "../services/dataStore.js";

const router = express.Router();

// GET /api/rooms
router.get("/", async (req, res) => {
  try {
    const { bed, view, price } = req.query;
    const rooms = await getAllRooms({ bed, view, price });
    return res.json({
      success: true,
      rooms,
    });
  } catch (error) {
    console.error("Get rooms error:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching rooms.",
    });
  }
});

// GET /api/rooms/:id/availability
router.get("/:id/availability", async (req, res) => {
  try {
    const { checkIn, checkOut } = req.query;
    if (!checkIn || !checkOut) {
      return res.status(400).json({
        success: false,
        message: "Check-in and check-out dates are required.",
      });
    }

    const room = await getRoomByIdOrSlug(req.params.id);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found.",
      });
    }

    const isAvailable = await checkRoomAvailability(room._id, checkIn, checkOut);
    return res.json({
      success: true,
      available: isAvailable,
      room: {
        id: room._id,
        name: room.name,
        price: room.price,
        priceOnRequest: room.priceOnRequest,
      },
      checkIn,
      checkOut,
    });
  } catch (error) {
    console.error("Availability error:", error);
    return res.status(400).json({
      success: false,
      message: error.message || "Error checking room availability.",
    });
  }
});

// GET /api/rooms/:id
router.get("/:id", async (req, res) => {
  try {
    const room = await getRoomByIdOrSlug(req.params.id);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found.",
      });
    }
    return res.json({
      success: true,
      room,
    });
  } catch (error) {
    console.error("Get room error:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching room details.",
    });
  }
});

export default router;
