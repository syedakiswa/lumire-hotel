const API_BASE = "/api";

function getHeaders() {
  const token = localStorage.getItem("lumiere_token");
  const headers = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

async function handleResponse(response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const errorMsg = data.message || `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }
  return data;
}

export const api = {
  // Auth
  auth: {
    register: (payload) =>
      fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).then(handleResponse),

    login: (payload) =>
      fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).then(handleResponse),

    getMe: () =>
      fetch(`${API_BASE}/auth/me`, {
        headers: getHeaders(),
      }).then(handleResponse),
  },

  // Rooms
  rooms: {
    getAll: (params = {}) => {
      const query = new URLSearchParams();
      if (params.bed && params.bed !== "All Types") query.append("bed", params.bed);
      if (params.view && params.view !== "All Views") query.append("view", params.view);
      if (params.price && params.price !== "all") query.append("price", params.price);
      const url = `${API_BASE}/rooms${query.toString() ? `?${query.toString()}` : ""}`;
      return fetch(url).then(handleResponse);
    },

    getById: (idOrSlug) =>
      fetch(`${API_BASE}/rooms/${idOrSlug}`).then(handleResponse),

    checkAvailability: (idOrSlug, checkIn, checkOut) =>
      fetch(
        `${API_BASE}/rooms/${idOrSlug}/availability?checkIn=${encodeURIComponent(
          checkIn
        )}&checkOut=${encodeURIComponent(checkOut)}`
      ).then(handleResponse),
  },

  // Bookings
  bookings: {
    create: (payload) =>
      fetch(`${API_BASE}/bookings`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(payload),
      }).then(handleResponse),

    getMyBookings: () =>
      fetch(`${API_BASE}/bookings/my`, {
        headers: getHeaders(),
      }).then(handleResponse),

    getById: (id) =>
      fetch(`${API_BASE}/bookings/${id}`, {
        headers: getHeaders(),
      }).then(handleResponse),

    cancel: (id) =>
      fetch(`${API_BASE}/bookings/${id}/cancel`, {
        method: "PUT",
        headers: getHeaders(),
      }).then(handleResponse),
  },

  // Dining
  dining: {
    reserve: (payload) =>
      fetch(`${API_BASE}/dining/reservations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).then(handleResponse),

    getAll: () =>
      fetch(`${API_BASE}/dining/reservations`, {
        headers: getHeaders(),
      }).then(handleResponse),
  },

  // Contact
  contact: {
    send: (payload) =>
      fetch(`${API_BASE}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).then(handleResponse),

    getAll: () =>
      fetch(`${API_BASE}/contact`, {
        headers: getHeaders(),
      }).then(handleResponse),
  },

  // Admin
  admin: {
    getDashboard: () =>
      fetch(`${API_BASE}/admin/dashboard`, {
        headers: getHeaders(),
      }).then(handleResponse),

    getBookings: () =>
      fetch(`${API_BASE}/admin/bookings`, {
        headers: getHeaders(),
      }).then(handleResponse),

    updateBookingStatus: (id, status) =>
      fetch(`${API_BASE}/admin/bookings/${id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify({ status }),
      }).then(handleResponse),

    getCustomers: () =>
      fetch(`${API_BASE}/admin/customers`, {
        headers: getHeaders(),
      }).then(handleResponse),

    getReports: () =>
      fetch(`${API_BASE}/admin/reports`, {
        headers: getHeaders(),
      }).then(handleResponse),

    createRoom: (payload) =>
      fetch(`${API_BASE}/admin/rooms`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(payload),
      }).then(handleResponse),

    updateRoom: (id, payload) =>
      fetch(`${API_BASE}/admin/rooms/${id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(payload),
      }).then(handleResponse),

    updateRoomPrice: (id, payload) =>
      fetch(`${API_BASE}/admin/rooms/${id}/price`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(payload),
      }).then(handleResponse),

    deleteRoom: (id) =>
      fetch(`${API_BASE}/admin/rooms/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      }).then(handleResponse),
  },
};
