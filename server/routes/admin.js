import express from "express";
import {
  getAdminDashboardStats,
  getAllBookings,
  updateBookingStatus,
  getAllUsers,
  getAdminReports,
  createRoom,
  updateRoom,
  updateRoomPrice,
  deleteRoom,
  getAllRooms,
} from "../services/dataStore.js";
import { requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// Apply requireAdmin to all admin endpoints
router.use(requireAdmin);

// GET /api/admin/dashboard
router.get("/dashboard", async (req, res) => {
  try {
    const stats = await getAdminDashboardStats();
    return res.json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error("Admin dashboard error:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching dashboard statistics.",
    });
  }
});

// GET /api/admin/bookings
router.get("/bookings", async (req, res) => {
  try {
    const bookings = await getAllBookings();
    return res.json({
      success: true,
      bookings,
    });
  } catch (error) {
    console.error("Admin bookings error:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching bookings.",
    });
  }
});

// PUT /api/admin/bookings/:id
router.put("/bookings/:id", async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Booking status is required.",
      });
    }

    const updated = await updateBookingStatus(req.params.id, status);
    return res.json({
      success: true,
      message: `Booking status updated to ${status}.`,
      booking: updated,
    });
  } catch (error) {
    console.error("Admin update booking error:", error);
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to update booking status.",
    });
  }
});

// GET /api/admin/customers
router.get("/customers", async (req, res) => {
  try {
    const users = await getAllUsers();
    const bookings = await getAllBookings();

    const customersWithStats = users.map((u) => {
      const userBookings = bookings.filter(
        (b) => String(b.user?._id || b.user) === String(u._id)
      );
      const totalBookings = userBookings.length;
      const totalSpent = userBookings
        .filter((b) => b.status !== "Cancelled")
        .reduce((sum, b) => sum + (b.totalAmount || 0), 0);

      return {
        id: u._id,
        name: u.name,
        email: u.email,
        phone: u.phone || "—",
        registrationDate: u.createdAt,
        totalBookings,
        totalSpent,
      };
    });

    return res.json({
      success: true,
      customers: customersWithStats,
    });
  } catch (error) {
    console.error("Admin customers error:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching customer list.",
    });
  }
});

// GET /api/admin/reports
router.get("/reports", async (req, res) => {
  try {
    const reports = await getAdminReports();
    return res.json({
      success: true,
      reports,
    });
  } catch (error) {
    console.error("Admin reports error:", error);
    return res.status(500).json({
      success: false,
      message: "Error generating reports.",
    });
  }
});

// POST /api/admin/rooms
router.post("/rooms", async (req, res) => {
  try {
    const { name, category, description, price, bedType, view, maxGuests, amenities, images, available } = req.body;
    if (!name || !category || !description) {
      return res.status(400).json({
        success: false,
        message: "Name, category, and description are required.",
      });
    }

    const newRoom = await createRoom({
      name,
      category,
      description,
      price,
      bedType,
      view,
      maxGuests: Number(maxGuests) || 2,
      amenities: Array.isArray(amenities) ? amenities : [],
      images: Array.isArray(images) && images.length > 0 ? images : ["/room.jpeg"],
      available: available !== undefined ? available : true,
    });

    return res.status(201).json({
      success: true,
      message: "Room created successfully.",
      room: newRoom,
    });
  } catch (error) {
    console.error("Admin create room error:", error);
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to create room.",
    });
  }
});

// PUT /api/admin/rooms/:id
router.put("/rooms/:id", async (req, res) => {
  try {
    const updated = await updateRoom(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Room not found.",
      });
    }

    return res.json({
      success: true,
      message: "Room updated successfully.",
      room: updated,
    });
  } catch (error) {
    console.error("Admin update room error:", error);
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to update room.",
    });
  }
});

// PUT /api/admin/rooms/:id/price
router.put("/rooms/:id/price", async (req, res) => {
  try {
    const { price, priceOnRequest } = req.body;
    const updated = await updateRoomPrice(req.params.id, price, priceOnRequest);

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Room not found.",
      });
    }

    return res.json({
      success: true,
      message: "Room pricing updated successfully.",
      room: updated,
    });
  } catch (error) {
    console.error("Admin update room price error:", error);
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to update room price.",
    });
  }
});

// DELETE /api/admin/rooms/:id
router.delete("/rooms/:id", async (req, res) => {
  try {
    const deleted = await deleteRoom(req.params.id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Room not found.",
      });
    }

    return res.json({
      success: true,
      message: "Room deleted successfully.",
    });
  } catch (error) {
    console.error("Admin delete room error:", error);
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to delete room.",
    });
  }
});

export default router;
