import { useState, useEffect } from "react";
import { api } from "../../services/api";
import {
  Plus,
  Pencil,
  Trash2,
  Check,
  X,
  AlertTriangle,
  RefreshCw,
  Image as ImageIcon,
} from "lucide-react";
import PageMeta from "../../components/PageMeta";

export default function AdminRooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Modal / Form state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [deletingRoom, setDeletingRoom] = useState(null);
  const [saving, setSaving] = useState(false);

  const initialForm = {
    name: "",
    category: "Luxury Suite",
    description: "",
    price: "",
    priceOnRequest: true,
    bedType: "King Bed",
    view: "City View",
    maxGuests: 2,
    amenities: "Free Wi-Fi, Air Conditioning, Smart TV, Luxury Bathroom",
    images: "/room.jpeg",
    available: true,
  };

  const [form, setForm] = useState(initialForm);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.rooms.getAll();
      if (res.success) {
        setRooms(res.rooms || []);
      }
    } catch (err) {
      setError(err.message || "Failed to load rooms.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const openAddModal = () => {
    setEditingRoom(null);
    setForm(initialForm);
    setModalOpen(true);
  };

  const openEditModal = (room) => {
    setEditingRoom(room);
    setForm({
      name: room.name,
      category: room.category,
      description: room.description,
      price: room.price !== null && room.price !== undefined ? String(room.price) : "",
      priceOnRequest: room.priceOnRequest || room.price === null || room.price === undefined,
      bedType: room.bedType || "King Bed",
      view: room.view || "City View",
      maxGuests: room.maxGuests || 2,
      amenities: Array.isArray(room.amenities) ? room.amenities.join(", ") : room.amenities || "",
      images: Array.isArray(room.images) ? room.images.join(", ") : room.images || "/room.jpeg",
      available: room.available !== undefined ? room.available : true,
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.name.trim() || !form.category.trim() || !form.description.trim()) {
      setError("Name, category, and description are required.");
      return;
    }

    const amenitiesList = form.amenities
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const imagesList = form.images
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      name: form.name.trim(),
      category: form.category.trim(),
      description: form.description.trim(),
      price: form.priceOnRequest ? null : form.price ? Number(form.price) : null,
      priceOnRequest: form.priceOnRequest || !form.price,
      bedType: form.bedType,
      view: form.view,
      maxGuests: Number(form.maxGuests) || 2,
      amenities: amenitiesList,
      images: imagesList.length > 0 ? imagesList : ["/room.jpeg"],
      available: form.available,
    };

    try {
      setSaving(true);
      if (editingRoom) {
        await api.admin.updateRoom(editingRoom._id, payload);
        setSuccess(`Room "${form.name}" updated successfully.`);
      } else {
        await api.admin.createRoom(payload);
        setSuccess(`New room "${form.name}" created successfully.`);
      }
      setModalOpen(false);
      await fetchRooms();
    } catch (err) {
      setError(err.message || "Failed to save room.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingRoom) return;
    try {
      setSaving(true);
      await api.admin.deleteRoom(deletingRoom._id);
      setSuccess(`Room "${deletingRoom.name}" has been deleted.`);
      setDeletingRoom(null);
      await fetchRooms();
    } catch (err) {
      setError(err.message || "Failed to delete room.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageMeta
        title="Room Inventory Management | Lumière Grand Hotel Admin"
        description="Add, modify, and manage suite availability, configurations, and amenities."
      />
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/10 gap-4">
        <div>
          <p className="text-amber-400 uppercase tracking-[3px] text-xs font-semibold">
            INVENTORY MANAGEMENT
          </p>
          <h1 className="font-serif text-3xl font-light text-white mt-1">
            Rooms &amp; Suites Management
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchRooms}
            className="p-2 border border-white/20 text-gray-400 hover:text-white transition cursor-pointer"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-400 text-black text-xs uppercase tracking-widest font-medium hover:bg-amber-300 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Room
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-6 bg-red-950/40 border border-red-500/40 text-red-300 text-sm p-4">
          {error}
        </div>
      )}
      {success && (
        <div className="mt-6 bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-sm p-4">
          {success}
        </div>
      )}

      {/* Rooms Table */}
      <div className="mt-8 bg-neutral-900/90 border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-300">
            <thead className="bg-black/60 uppercase tracking-widest text-gray-400 border-b border-white/10">
              <tr>
                <th className="py-4 px-6">Image</th>
                <th className="py-4 px-6">Name</th>
                <th className="py-4 px-6">Category</th>
                <th className="py-4 px-6">Rate</th>
                <th className="py-4 px-6">Bed / View</th>
                <th className="py-4 px-6">Capacity</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-gray-500">
                    Loading inventory...
                  </td>
                </tr>
              ) : rooms.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-gray-500">
                    No rooms listed yet. Click &quot;Add Room&quot; to create one.
                  </td>
                </tr>
              ) : (
                rooms.map((room) => (
                  <tr key={room._id || room.slug} className="hover:bg-white/[0.02] transition">
                    <td className="py-3 px-6">
                      <div className="w-12 h-10 bg-neutral-800 overflow-hidden rounded-sm border border-white/10">
                        <img
                          src={room.images?.[0] || "/room.jpeg"}
                          alt={room.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="py-3 px-6 font-medium text-white text-sm">
                      {room.name}
                    </td>
                    <td className="py-3 px-6 text-amber-400/90">{room.category}</td>
                    <td className="py-3 px-6">
                      {room.price ? (
                        <span className="text-amber-400 font-medium">${room.price} / night</span>
                      ) : (
                        <span className="text-gray-400 italic">Price on request</span>
                      )}
                    </td>
                    <td className="py-3 px-6 text-gray-400">
                      {room.bedType} • {room.view}
                    </td>
                    <td className="py-3 px-6 text-gray-400">
                      {room.maxGuests} Guests
                    </td>
                    <td className="py-3 px-6">
                      <span
                        className={`px-2 py-0.5 text-[10px] uppercase font-semibold border ${
                          room.available
                            ? "bg-emerald-950/60 text-emerald-400 border-emerald-500/30"
                            : "bg-red-950/60 text-red-400 border-red-500/30"
                        }`}
                      >
                        {room.available ? "Available" : "Unavailable"}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => openEditModal(room)}
                          className="p-1.5 text-gray-400 hover:text-amber-400 transition cursor-pointer"
                          title="Edit Room"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingRoom(room)}
                          className="p-1.5 text-gray-400 hover:text-red-400 transition cursor-pointer"
                          title="Delete Room"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD / EDIT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-neutral-950 border border-amber-400/30 max-w-2xl w-full p-6 sm:p-8 my-8 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-light text-white mb-6 border-b border-white/10 pb-4">
              {editingRoom ? "Edit Room Details" : "Add New Room / Suite"}
            </h2>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-400 uppercase tracking-wider mb-1">
                  Room Name *
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Royal Penthouse Suite"
                  className="w-full bg-black/70 border border-white/20 px-3 py-2 text-white outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 uppercase tracking-wider mb-1">
                    Category *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    placeholder="Luxury Suite / Luxury Room"
                    className="w-full bg-black/70 border border-white/20 px-3 py-2 text-white outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 uppercase tracking-wider mb-1">
                    Bed Type
                  </label>
                  <select
                    value={form.bedType}
                    onChange={(e) => setForm({ ...form, bedType: e.target.value })}
                    className="w-full bg-black/70 border border-white/20 px-3 py-2 text-white outline-none focus:border-amber-400"
                  >
                    <option>King Bed</option>
                    <option>Queen Bed</option>
                    <option>Twin Beds</option>
                  </select>
                </div>
              </div>

              {/* Price & Price on Request */}
              <div className="bg-white/[0.02] border border-white/10 p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="priceOnRequest"
                    checked={form.priceOnRequest}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        priceOnRequest: e.target.checked,
                        price: e.target.checked ? "" : form.price,
                      })
                    }
                    className="accent-amber-400"
                  />
                  <label htmlFor="priceOnRequest" className="text-gray-300">
                    Unconfirmed rate: display &quot;Price on request&quot;
                  </label>
                </div>

                {!form.priceOnRequest && (
                  <div>
                    <label className="block text-gray-400 uppercase tracking-wider mb-1">
                      Confirmed Rate ($ per night)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={form.price}
                      onChange={(e) => setForm({ ...form, price: e.target.value })}
                      placeholder="e.g. 890"
                      className="w-full bg-black/70 border border-white/20 px-3 py-2 text-white outline-none focus:border-amber-400"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 uppercase tracking-wider mb-1">
                    View
                  </label>
                  <select
                    value={form.view}
                    onChange={(e) => setForm({ ...form, view: e.target.value })}
                    className="w-full bg-black/70 border border-white/20 px-3 py-2 text-white outline-none focus:border-amber-400"
                  >
                    <option>City View</option>
                    <option>Garden View</option>
                    <option>Ocean View</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-400 uppercase tracking-wider mb-1">
                    Maximum Guests
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={form.maxGuests}
                    onChange={(e) => setForm({ ...form, maxGuests: e.target.value })}
                    className="w-full bg-black/70 border border-white/20 px-3 py-2 text-white outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-400 uppercase tracking-wider mb-1">
                  Description *
                </label>
                <textarea
                  rows="3"
                  required
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Describe the suite ambiance, luxury furnishings..."
                  className="w-full bg-black/70 border border-white/20 px-3 py-2 text-white outline-none focus:border-amber-400"
                ></textarea>
              </div>

              <div>
                <label className="block text-gray-400 uppercase tracking-wider mb-1">
                  Amenities (comma-separated)
                </label>
                <input
                  type="text"
                  value={form.amenities}
                  onChange={(e) => setForm({ ...form, amenities: e.target.value })}
                  placeholder="Free Wi-Fi, Air Conditioning, Smart TV, Mini Bar, Room Service, Luxury Bathroom"
                  className="w-full bg-black/70 border border-white/20 px-3 py-2 text-white outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-gray-400 uppercase tracking-wider mb-1">
                  Client Asset Images (comma-separated relative paths)
                </label>
                <input
                  type="text"
                  value={form.images}
                  onChange={(e) => setForm({ ...form, images: e.target.value })}
                  placeholder="/room.jpeg, /bathroom.jpeg, /roomsbg.png"
                  className="w-full bg-black/70 border border-white/20 px-3 py-2 text-white outline-none focus:border-amber-400"
                />
                <p className="text-[10px] text-gray-500 mt-1">
                  Use existing client files: /room.jpeg, /bathroom.jpeg, /roomsbg.png, /reception.jpeg
                </p>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="available"
                  checked={form.available}
                  onChange={(e) => setForm({ ...form, available: e.target.checked })}
                  className="accent-amber-400"
                />
                <label htmlFor="available" className="text-gray-300">
                  Room available for reservation
                </label>
              </div>

              <div className="pt-4 flex gap-3 border-t border-white/10">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-amber-400 text-black py-2.5 uppercase tracking-widest text-xs font-medium hover:bg-amber-300 transition cursor-pointer disabled:opacity-50"
                >
                  {saving ? "Saving..." : editingRoom ? "Update Room" : "Create Room"}
                </button>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-6 py-2.5 border border-white/20 text-gray-300 uppercase tracking-widest text-xs hover:border-white transition cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION DIALOG */}
      {deletingRoom && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-950 border border-red-500/40 max-w-md w-full p-6 sm:p-8 text-center">
            <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-xl font-light text-white mb-2">Delete Room</h3>
            <p className="text-sm text-gray-300 mb-6">
              Are you sure you want to delete{" "}
              <span className="text-amber-400 font-medium">{deletingRoom.name}</span>?
              This action cannot be undone.
            </p>

            <div className="flex gap-3 justify-center">
              <button
                disabled={saving}
                onClick={handleDelete}
                className="px-6 py-2.5 bg-red-600 text-white text-xs uppercase tracking-widest font-medium hover:bg-red-500 transition cursor-pointer disabled:opacity-50"
              >
                {saving ? "Deleting..." : "Yes, Delete Room"}
              </button>
              <button
                disabled={saving}
                onClick={() => setDeletingRoom(null)}
                className="px-6 py-2.5 border border-white/20 text-gray-300 text-xs uppercase tracking-widest hover:border-white transition cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
