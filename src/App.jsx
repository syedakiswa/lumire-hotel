import { Routes, Route, Navigate } from "react-router-dom";

// Public Guest Components & Pages
import Hero from "./components/Hero";
import FeaturedRooms from "./components/FeaturedRooms";
import Rooms from "./pages/Rooms";
import RoomDetails from "./pages/RoomDetails";
import Amenities from "./pages/Amenitiess";
import Aboutus from "./pages/Aboutus";
import GalleryPage from "./pages/GalleryPage";
import DiningArea from "./pages/DiningArea";
import Contact from "./pages/Contact";

// User Authentication & Account
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import UserAccount from "./pages/UserAccount";
import ProtectedRoute from "./components/ProtectedRoute";

// Admin Portal
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminRooms from "./pages/admin/AdminRooms";
import AdminBookings from "./pages/admin/AdminBookings";
import AdminCustomers from "./pages/admin/AdminCustomers";
import AdminPricing from "./pages/admin/AdminPricing";
import AdminReports from "./pages/admin/AdminReports";
import AdminRoute from "./components/AdminRoute";

function App() {
  return (
    <Routes>
      {/* 1. Home */}
      <Route
        path="/"
        element={
          <>
            <Hero />
            <FeaturedRooms />
          </>
        }
      />

      {/* 2. Rooms & Suites */}
      <Route path="/rooms" element={<Rooms />} />

      {/* 3. Single Room Detail / Booking */}
      <Route path="/rooms/:slug" element={<RoomDetails />} />
      <Route path="/rooms/id/:id" element={<RoomDetails />} />

      {/* 4. Amenities */}
      <Route path="/amenities" element={<Amenities />} />

      {/* 5. Dining */}
      <Route path="/dining" element={<DiningArea />} />
      <Route path="/diningarea" element={<DiningArea />} />

      {/* 6. About Us */}
      <Route path="/about" element={<Aboutus />} />
      <Route path="/aboutus" element={<Aboutus />} />

      {/* 7. Gallery */}
      <Route path="/gallery" element={<GalleryPage />} />
      <Route path="/gallerypage" element={<GalleryPage />} />

      {/* 8. Contact Us */}
      <Route path="/contact" element={<Contact />} />

      {/* 9. User Authentication */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* 10. User Account & Management (Protected) */}
      <Route
        path="/account"
        element={
          <ProtectedRoute>
            <UserAccount />
          </ProtectedRoute>
        }
      />
      <Route
        path="/account/bookings"
        element={
          <ProtectedRoute>
            <UserAccount />
          </ProtectedRoute>
        }
      />
      <Route
        path="/account/invoices"
        element={
          <ProtectedRoute>
            <UserAccount />
          </ProtectedRoute>
        }
      />

      {/* 11. Admin Authentication */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* 12. Admin Portal (Protected by AdminRoute) */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="rooms" element={<AdminRooms />} />
        <Route path="bookings" element={<AdminBookings />} />
        <Route path="customers" element={<AdminCustomers />} />
        <Route path="pricing" element={<AdminPricing />} />
        <Route path="reports" element={<AdminReports />} />
      </Route>

      {/* Fallback Catch-All */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;