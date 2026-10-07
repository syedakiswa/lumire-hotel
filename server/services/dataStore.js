import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Room from "../models/Room.js";
import Booking from "../models/Booking.js";
import DiningReservation from "../models/DiningReservation.js";
import ContactMessage from "../models/ContactMessage.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, "../data");

// Safely ensure data directory exists in environments where disk write is permitted
try {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
} catch {
  // Read-only filesystem in serverless environments (e.g. Vercel)
}

const FILES = {
  users: path.join(DATA_DIR, "users.json"),
  rooms: path.join(DATA_DIR, "rooms.json"),
  bookings: path.join(DATA_DIR, "bookings.json"),
  dining: path.join(DATA_DIR, "dining.json"),
  contacts: path.join(DATA_DIR, "contacts.json"),
};

function readJsonFile(filePath, defaultValue = []) {
  try {
    if (!fs.existsSync(filePath)) {
      return defaultValue;
    }
    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data || "[]");
  } catch {
    return defaultValue;
  }
}

function writeJsonFile(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
  } catch {
    // In serverless read-only environments, disk writes are ignored.
    // MongoDB / Mongoose is the persistent database.
  }
}

export function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}

// Initial default seed dataset
export async function seedInitialData() {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@lumierehotel.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
  const salt = await bcrypt.genSalt(10);
  const adminPasswordHash = await bcrypt.hash(adminPassword, salt);

  const initialRooms = [
    {
      _id: "660000000000000000000001",
      name: "Presidential Suite",
      slug: "presidential-suite",
      category: "Luxury Suite",
      description:
        "An extraordinary suite designed for the ultimate luxury experience with elegant interiors and exceptional comfort.",
      price: 890,
      priceOnRequest: false,
      images: ["/room.jpeg", "/bathroom.jpeg", "/roomsbg.png"],
      amenities: [
        "Free Wi-Fi",
        "Air Conditioning",
        "Smart TV",
        "Mini Bar",
        "Room Service",
        "Luxury Bathroom",
        "24/7 Concierge",
        "City View",
      ],
      bedType: "King Bed",
      view: "City View",
      maxGuests: 2,
      available: true,
      createdAt: new Date().toISOString(),
    },
    {
      _id: "660000000000000000000002",
      name: "Deluxe King",
      slug: "deluxe-king",
      category: "Luxury Room",
      description:
        "A beautifully appointed room offering modern comfort, sophisticated design, and a peaceful atmosphere.",
      price: null,
      priceOnRequest: true,
      images: ["/room.jpeg", "/bathroom.jpeg"],
      amenities: [
        "Free Wi-Fi",
        "Air Conditioning",
        "Smart TV",
        "Room Service",
        "Luxury Bathroom",
      ],
      bedType: "King Bed",
      view: "Garden View",
      maxGuests: 2,
      available: true,
      createdAt: new Date().toISOString(),
    },
    {
      _id: "660000000000000000000003",
      name: "Executive Suite",
      slug: "executive-suite",
      category: "Luxury Suite",
      description:
        "Sophisticated interiors, generous space, and refined amenities designed for an elevated stay.",
      price: null,
      priceOnRequest: true,
      images: ["/room.jpeg", "/bathroom.jpeg", "/roomsbg.png"],
      amenities: [
        "Free Wi-Fi",
        "Air Conditioning",
        "Smart TV",
        "Mini Bar",
        "Room Service",
        "Luxury Bathroom",
        "24/7 Concierge",
      ],
      bedType: "King Bed",
      view: "City View",
      maxGuests: 3,
      available: true,
      createdAt: new Date().toISOString(),
    },
  ];

  const initialAdmin = {
    _id: "660000000000000000000000",
    name: "Lumière Hotel Administrator",
    email: adminEmail.toLowerCase(),
    phone: "+1 (800) 586-4373",
    passwordHash: adminPasswordHash,
    role: "admin",
    createdAt: new Date().toISOString(),
  };

  // If Mongo is connected, seed into MongoDB
  if (isMongoConnected()) {
    try {
      const existingAdmin = await User.findOne({ email: adminEmail.toLowerCase() });
      if (!existingAdmin) {
        await User.create(initialAdmin);
        console.log("Admin seeded in MongoDB");
      }
      for (const room of initialRooms) {
        const existing = await Room.findOne({ slug: room.slug });
        if (!existing) {
          await Room.create(room);
        }
      }
      console.log("Rooms verified in MongoDB");
    } catch (err) {
      console.error("Error seeding in MongoDB:", err);
    }
  }

  // Ensure JSON files also have initial data
  const fileUsers = readJsonFile(FILES.users, []);
  if (!fileUsers.some((u) => u.email === adminEmail.toLowerCase())) {
    fileUsers.push(initialAdmin);
    writeJsonFile(FILES.users, fileUsers);
  }

  const fileRooms = readJsonFile(FILES.rooms, []);
  if (fileRooms.length === 0) {
    writeJsonFile(FILES.rooms, initialRooms);
  } else {
    // Ensure presidential suite price is $890
    const pres = fileRooms.find((r) => r.slug === "presidential-suite");
    if (pres && pres.price !== 890) {
      pres.price = 890;
      pres.priceOnRequest = false;
      writeJsonFile(FILES.rooms, fileRooms);
    }
  }
}

// ---------------- USER OPERATIONS ----------------
export async function findUserByEmail(email) {
  const normalized = email.toLowerCase().trim();
  if (isMongoConnected()) {
    return await User.findOne({ email: normalized });
  }
  const users = readJsonFile(FILES.users);
  return users.find((u) => u.email.toLowerCase() === normalized) || null;
}

export async function findUserById(id) {
  if (isMongoConnected()) {
    return await User.findById(id).select("-passwordHash");
  }
  const users = readJsonFile(FILES.users);
  const user = users.find((u) => String(u._id) === String(id));
  if (!user) return null;
  const copy = { ...user };
  delete copy.passwordHash;
  return copy;
}

export async function createUser({ name, email, phone, passwordHash, role = "user" }) {
  const normalizedEmail = email.toLowerCase().trim();
  if (isMongoConnected()) {
    const user = new User({
      name,
      email: normalizedEmail,
      phone,
      passwordHash,
      role: "user", // Forced 'user' role
    });
    return await user.save();
  }

  const users = readJsonFile(FILES.users);
  if (users.some((u) => u.email.toLowerCase() === normalizedEmail)) {
    throw new Error("Email already registered");
  }

  const newUser = {
    _id: new mongoose.Types.ObjectId().toString(),
    name,
    email: normalizedEmail,
    phone: phone || "",
    passwordHash,
    role: "user", // Safe default
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  writeJsonFile(FILES.users, users);
  const result = { ...newUser };
  delete result.passwordHash;
  return result;
}

export async function getAllUsers() {
  if (isMongoConnected()) {
    return await User.find({ role: "user" }).select("-passwordHash").sort({ createdAt: -1 });
  }
  const users = readJsonFile(FILES.users);
  return users
    .filter((u) => u.role === "user")
    .map((u) => {
      const copy = { ...u };
      delete copy.passwordHash;
      return copy;
    });
}

// ---------------- ROOM OPERATIONS ----------------
export async function getAllRooms(filters = {}) {
  let rooms = [];
  if (isMongoConnected()) {
    rooms = await Room.find().lean();
  } else {
    rooms = readJsonFile(FILES.rooms);
  }

  if (filters.bed && filters.bed !== "All Types") {
    rooms = rooms.filter((r) => r.bedType === filters.bed);
  }
  if (filters.view && filters.view !== "All Views") {
    rooms = rooms.filter((r) => r.view === filters.view);
  }
  if (filters.price && filters.price !== "all") {
    const [min, max] = filters.price.split("-").map(Number);
    rooms = rooms.filter((r) => r.price !== null && r.price >= min && r.price <= max);
  }

  return rooms;
}

export async function getRoomByIdOrSlug(idOrSlug) {
  if (isMongoConnected()) {
    if (mongoose.Types.ObjectId.isValid(idOrSlug)) {
      const room = await Room.findById(idOrSlug).lean();
      if (room) return room;
    }
    return await Room.findOne({ slug: idOrSlug }).lean();
  }

  const rooms = readJsonFile(FILES.rooms);
  return (
    rooms.find(
      (r) => String(r._id) === String(idOrSlug) || r.slug === idOrSlug
    ) || null
  );
}

export async function createRoom(data) {
  const slug =
    data.slug ||
    data.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  const roomData = {
    ...data,
    slug,
    price: data.price !== undefined && data.price !== "" && data.price !== null ? Number(data.price) : null,
    priceOnRequest: data.price === null || data.price === "" || data.price === undefined,
  };

  if (isMongoConnected()) {
    return await Room.create(roomData);
  }

  const rooms = readJsonFile(FILES.rooms);
  const newRoom = {
    ...roomData,
    _id: new mongoose.Types.ObjectId().toString(),
    createdAt: new Date().toISOString(),
  };
  rooms.push(newRoom);
  writeJsonFile(FILES.rooms, rooms);
  return newRoom;
}

export async function updateRoom(id, data) {
  if (isMongoConnected()) {
    return await Room.findByIdAndUpdate(id, data, { new: true });
  }

  const rooms = readJsonFile(FILES.rooms);
  const index = rooms.findIndex((r) => String(r._id) === String(id) || r.slug === id);
  if (index === -1) return null;

  rooms[index] = { ...rooms[index], ...data, updatedAt: new Date().toISOString() };
  writeJsonFile(FILES.rooms, rooms);
  return rooms[index];
}

export async function updateRoomPrice(id, price, priceOnRequest = false) {
  const numericPrice = price !== null && price !== "" && !priceOnRequest ? Number(price) : null;
  const isPriceOnRequest = numericPrice === null || priceOnRequest;

  if (isMongoConnected()) {
    return await Room.findByIdAndUpdate(
      id,
      { price: numericPrice, priceOnRequest: isPriceOnRequest },
      { new: true }
    );
  }

  const rooms = readJsonFile(FILES.rooms);
  const index = rooms.findIndex((r) => String(r._id) === String(id) || r.slug === id);
  if (index === -1) return null;

  rooms[index].price = numericPrice;
  rooms[index].priceOnRequest = isPriceOnRequest;
  writeJsonFile(FILES.rooms, rooms);
  return rooms[index];
}

export async function deleteRoom(id) {
  if (isMongoConnected()) {
    return await Room.findByIdAndDelete(id);
  }

  const rooms = readJsonFile(FILES.rooms);
  const filtered = rooms.filter((r) => String(r._id) !== String(id) && r.slug !== id);
  const deleted = rooms.length !== filtered.length;
  writeJsonFile(FILES.rooms, filtered);
  return deleted;
}

// ---------------- AVAILABILITY CHECK ----------------
export async function checkRoomAvailability(roomId, checkIn, checkOut, excludeBookingId = null) {
  const start = new Date(checkIn);
  const end = new Date(checkOut);

  if (isNaN(start.getTime()) || isNaN(end.getTime()) || end <= start) {
    throw new Error("Invalid check-in or check-out dates");
  }

  let bookings = [];
  if (isMongoConnected()) {
    const query = {
      room: roomId,
      status: { $ne: "Cancelled" },
      // Check for overlap: checkIn < end AND checkOut > start
      checkIn: { $lt: end },
      checkOut: { $gt: start },
    };
    if (excludeBookingId) {
      query._id = { $ne: excludeBookingId };
    }
    const overlapping = await Booking.find(query);
    return overlapping.length === 0;
  } else {
    bookings = readJsonFile(FILES.bookings);
    const overlapping = bookings.filter((b) => {
      if (String(b.room?._id || b.room) !== String(roomId)) return false;
      if (b.status === "Cancelled") return false;
      if (excludeBookingId && String(b._id) === String(excludeBookingId)) return false;

      const bStart = new Date(b.checkIn);
      const bEnd = new Date(b.checkOut);
      return bStart < end && bEnd > start;
    });
    return overlapping.length === 0;
  }
}

// ---------------- BOOKINGS OPERATIONS ----------------
export async function createBooking({
  userId,
  roomId,
  checkIn,
  checkOut,
  guests,
  specialRequests,
}) {
  const room = await getRoomByIdOrSlug(roomId);
  if (!room) {
    throw new Error("Room not found");
  }

  const start = new Date(checkIn);
  const end = new Date(checkOut);
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    throw new Error("Invalid booking dates");
  }
  if (end <= start) {
    throw new Error("Check-out date must be strictly after check-in date");
  }

  const msPerDay = 1000 * 60 * 60 * 24;
  const numberOfNights = Math.round((end - start) / msPerDay);
  if (numberOfNights < 1) {
    throw new Error("Booking must be for at least one night");
  }

  // Prevent double booking for overlapping dates
  const isAvailable = await checkRoomAvailability(room._id, checkIn, checkOut);
  if (!isAvailable) {
    throw new Error("Selected room is not available for these dates. Please choose another date or suite.");
  }

  // Calculate total amount on backend (never trust frontend)
  const pricePerNight = room.price || 0;
  const totalAmount = numberOfNights * pricePerNight;

  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const bookingId = `LMG-${new Date().getFullYear()}-${randomSuffix}`;

  if (isMongoConnected()) {
    const booking = new Booking({
      bookingId,
      user: userId,
      room: room._id,
      checkIn: start,
      checkOut: end,
      guests: guests || "2 Guests",
      numberOfNights,
      pricePerNight,
      totalAmount,
      status: "Confirmed",
      specialRequests: specialRequests || "",
      bookingDate: new Date(),
    });
    const saved = await booking.save();
    return await Booking.findById(saved._id).populate("room").populate("user", "-passwordHash");
  }

  const bookings = readJsonFile(FILES.bookings);
  const user = await findUserById(userId);

  const newBooking = {
    _id: new mongoose.Types.ObjectId().toString(),
    bookingId,
    user: {
      _id: String(user._id),
      name: user.name,
      email: user.email,
      phone: user.phone || "",
    },
    room: {
      _id: String(room._id),
      name: room.name,
      slug: room.slug,
      category: room.category,
      price: room.price,
      images: room.images,
    },
    checkIn: start.toISOString(),
    checkOut: end.toISOString(),
    guests: guests || "2 Guests",
    numberOfNights,
    pricePerNight,
    totalAmount,
    status: "Confirmed",
    specialRequests: specialRequests || "",
    bookingDate: new Date().toISOString(),
  };

  bookings.unshift(newBooking);
  writeJsonFile(FILES.bookings, bookings);
  return newBooking;
}

export async function getUserBookings(userId) {
  if (isMongoConnected()) {
    return await Booking.find({ user: userId })
      .populate("room")
      .sort({ createdAt: -1 });
  }

  const bookings = readJsonFile(FILES.bookings);
  return bookings.filter(
    (b) => String(b.user?._id || b.user) === String(userId)
  );
}

export async function getBookingById(bookingId) {
  if (isMongoConnected()) {
    if (mongoose.Types.ObjectId.isValid(bookingId)) {
      const b = await Booking.findById(bookingId).populate("room").populate("user", "-passwordHash");
      if (b) return b;
    }
    return await Booking.findOne({ bookingId }).populate("room").populate("user", "-passwordHash");
  }

  const bookings = readJsonFile(FILES.bookings);
  return (
    bookings.find(
      (b) => String(b._id) === String(bookingId) || b.bookingId === bookingId
    ) || null
  );
}

export async function cancelBooking(idOrBookingId, userId, isAdmin = false) {
  if (isMongoConnected()) {
    const booking = await getBookingById(idOrBookingId);
    if (!booking) throw new Error("Booking not found");

    if (!isAdmin && String(booking.user?._id || booking.user) !== String(userId)) {
      throw new Error("Unauthorized to cancel this booking");
    }

    booking.status = "Cancelled";
    await booking.save();
    return booking;
  }

  const bookings = readJsonFile(FILES.bookings);
  const booking = bookings.find(
    (b) => String(b._id) === String(idOrBookingId) || b.bookingId === idOrBookingId
  );
  if (!booking) throw new Error("Booking not found");

  if (!isAdmin && String(booking.user?._id || booking.user) !== String(userId)) {
    throw new Error("Unauthorized to cancel this booking");
  }

  booking.status = "Cancelled";
  writeJsonFile(FILES.bookings, bookings);
  return booking;
}

export async function getAllBookings() {
  if (isMongoConnected()) {
    return await Booking.find()
      .populate("room")
      .populate("user", "-passwordHash")
      .sort({ createdAt: -1 });
  }

  return readJsonFile(FILES.bookings);
}

export async function updateBookingStatus(idOrBookingId, status) {
  const allowed = ["Pending", "Confirmed", "Cancelled", "Completed"];
  if (!allowed.includes(status)) {
    throw new Error(`Invalid status. Must be one of: ${allowed.join(", ")}`);
  }

  if (isMongoConnected()) {
    const booking = await getBookingById(idOrBookingId);
    if (!booking) throw new Error("Booking not found");
    booking.status = status;
    await booking.save();
    return booking;
  }

  const bookings = readJsonFile(FILES.bookings);
  const booking = bookings.find(
    (b) => String(b._id) === String(idOrBookingId) || b.bookingId === idOrBookingId
  );
  if (!booking) throw new Error("Booking not found");

  booking.status = status;
  writeJsonFile(FILES.bookings, bookings);
  return booking;
}

// ---------------- DINING OPERATIONS ----------------
export async function createDiningReservation(data) {
  if (isMongoConnected()) {
    return await DiningReservation.create(data);
  }

  const reservations = readJsonFile(FILES.dining);
  const newReservation = {
    ...data,
    _id: new mongoose.Types.ObjectId().toString(),
    status: "Confirmed",
    createdAt: new Date().toISOString(),
  };
  reservations.unshift(newReservation);
  writeJsonFile(FILES.dining, reservations);
  return newReservation;
}

export async function getAllDiningReservations() {
  if (isMongoConnected()) {
    return await DiningReservation.find().sort({ createdAt: -1 });
  }
  return readJsonFile(FILES.dining);
}

// ---------------- CONTACT OPERATIONS ----------------
export async function createContactMessage(data) {
  if (isMongoConnected()) {
    return await ContactMessage.create(data);
  }

  const contacts = readJsonFile(FILES.contacts);
  const newContact = {
    ...data,
    _id: new mongoose.Types.ObjectId().toString(),
    status: "Unread",
    createdAt: new Date().toISOString(),
  };
  contacts.unshift(newContact);
  writeJsonFile(FILES.contacts, contacts);
  return newContact;
}

export async function getAllContactMessages() {
  if (isMongoConnected()) {
    return await ContactMessage.find().sort({ createdAt: -1 });
  }
  return readJsonFile(FILES.contacts);
}

// ---------------- ADMIN DASHBOARD & REPORTS ----------------
export async function getAdminDashboardStats() {
  const rooms = await getAllRooms();
  const bookings = await getAllBookings();
  const customers = await getAllUsers();

  const totalRooms = rooms.length;
  const totalBookings = bookings.length;
  const totalCustomers = customers.length;

  const validBookings = bookings.filter((b) => b.status !== "Cancelled");
  const totalRevenue = validBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);

  // Status breakdown
  const statusCounts = {
    Confirmed: bookings.filter((b) => b.status === "Confirmed").length,
    Pending: bookings.filter((b) => b.status === "Pending").length,
    Cancelled: bookings.filter((b) => b.status === "Cancelled").length,
    Completed: bookings.filter((b) => b.status === "Completed").length,
  };

  // Occupancy rate calculation (active bookings / rooms)
  const activeBookings = bookings.filter((b) => b.status === "Confirmed");
  const occupancyRate =
    totalRooms > 0
      ? Math.min(100, Math.round((activeBookings.length / totalRooms) * 100))
      : 0;

  const recentBookings = bookings.slice(0, 5);

  return {
    totalRooms,
    totalBookings,
    totalCustomers,
    totalRevenue,
    occupancyRate,
    statusCounts,
    recentBookings,
  };
}

export async function getAdminReports() {
  const rooms = await getAllRooms();
  const bookings = await getAllBookings();
  const customers = await getAllUsers();

  const confirmedBookings = bookings.filter((b) => b.status === "Confirmed");
  const cancelledBookings = bookings.filter((b) => b.status === "Cancelled");
  const completedBookings = bookings.filter((b) => b.status === "Completed");
  const totalRevenue = bookings
    .filter((b) => b.status !== "Cancelled")
    .reduce((sum, b) => sum + (b.totalAmount || 0), 0);

  // Most booked room calculation
  const roomCountMap = {};
  bookings
    .filter((b) => b.status !== "Cancelled")
    .forEach((b) => {
      const roomName = b.room?.name || "Room";
      roomCountMap[roomName] = (roomCountMap[roomName] || 0) + 1;
    });

  let mostBookedRoom = "Presidential Suite";
  let maxCount = 0;
  for (const [rName, count] of Object.entries(roomCountMap)) {
    if (count > maxCount) {
      maxCount = count;
      mostBookedRoom = rName;
    }
  }

  // Monthly breakdown for current year
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  const monthlyData = months.map((m) => ({ month: m, revenue: 0, bookings: 0 }));

  bookings.forEach((b) => {
    const date = new Date(b.bookingDate || b.createdAt);
    if (!isNaN(date.getTime())) {
      const mIdx = date.getMonth();
      monthlyData[mIdx].bookings += 1;
      if (b.status !== "Cancelled") {
        monthlyData[mIdx].revenue += b.totalAmount || 0;
      }
    }
  });

  return {
    totalRevenue,
    totalBookings: bookings.length,
    confirmedBookings: confirmedBookings.length,
    cancelledBookings: cancelledBookings.length,
    completedBookings: completedBookings.length,
    occupancyRate: rooms.length > 0 ? Math.min(100, Math.round((confirmedBookings.length / rooms.length) * 100)) : 0,
    mostBookedRoom,
    monthlyData,
  };
}
