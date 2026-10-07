import express from "express";
import {
  createContactMessage,
  getAllContactMessages,
} from "../services/dataStore.js";
import { requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// POST /api/contact
router.post("/", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all required fields.",
      });
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    const contactMessage = await createContactMessage({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject,
      message: message.trim(),
    });

    return res.status(201).json({
      success: true,
      message: "Thank you for contacting us. Your message has been received.",
      contact: contactMessage,
    });
  } catch (error) {
    console.error("Contact error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send message. Please try again later.",
    });
  }
});

// GET /api/contact (admin only)
router.get("/", requireAdmin, async (req, res) => {
  try {
    const messages = await getAllContactMessages();
    return res.json({
      success: true,
      messages,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching contact messages.",
    });
  }
});

export default router;
