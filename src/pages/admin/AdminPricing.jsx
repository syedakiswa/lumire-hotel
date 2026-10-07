import { useState, useEffect } from "react";
import { api } from "../../services/api";
import { DollarSign, Save, RefreshCw, CheckCircle2 } from "lucide-react";

export default function AdminPricing() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  // Local draft price inputs: { [roomId]: { price: string, priceOnRequest: boolean } }
  const [priceDrafts, setPriceDrafts] = useState({});

  const fetchRooms = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.rooms.getAll();
      if (res.success) {
        setRooms(res.rooms || []);
        const drafts = {};
        (res.rooms || []).forEach((r) => {
          drafts[r._id] = {
            price: r.price !== null && r.price !== undefined ? String(r.price) : "",
            priceOnRequest: r.priceOnRequest || r.price === null || r.price === undefined,
          };
        });
        setPriceDrafts(drafts);
      }
    } catch (err) {
      setError(err.message || "Failed to load rooms for pricing.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleUpdatePrice = async (room) => {
    const draft = priceDrafts[room._id];
    if (!draft) return;

    try {
      setUpdatingId(room._id);
      setError("");
      setSuccess("");

      const payload = {
        price: draft.priceOnRequest ? null : draft.price ? Number(draft.price) : null,
        priceOnRequest: draft.priceOnRequest,
      };

      const res = await api.admin.updateRoomPrice(room._id, payload);
      if (res.success) {
        setSuccess(`Pricing updated for ${room.name}.`);
        await fetchRooms();
      }
    } catch (err) {
      setError(err.message || "Failed to update room price.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/10 gap-4">
        <div>
          <p className="text-amber-400 uppercase tracking-[3px] text-xs font-semibold">
            RATE MANAGEMENT &amp; TARIFFS
          </p>
          <h1 className="font-serif text-3xl font-light text-white mt-1">
            Pricing Management
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Configure confirmed nightly rates in the database. Unconfirmed suites display &quot;Price on request&quot;.
          </p>
        </div>

        <button
          onClick={fetchRooms}
          className="inline-flex items-center gap-2 px-4 py-2 border border-white/20 text-xs uppercase tracking-widest text-gray-300 hover:text-amber-400 hover:border-amber-400 transition cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh Tariffs
        </button>
      </div>

      {error && (
        <div className="mt-6 bg-red-950/40 border border-red-500/40 text-red-300 text-sm p-4">
          {error}
        </div>
      )}
      {success && (
        <div className="mt-6 bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-sm p-4 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{success}</span>
        </div>
      )}

      {/* Pricing Cards */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-16 text-center text-gray-500">
            Loading suite tariffs...
          </div>
        ) : (
          rooms.map((room) => {
            const draft = priceDrafts[room._id] || {
              price: "",
              priceOnRequest: true,
            };

            return (
              <div
                key={room._id}
                className="bg-neutral-900/90 border border-white/10 hover:border-amber-400/30 p-6 flex flex-col justify-between transition"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] uppercase tracking-widest text-amber-400">
                      {room.category}
                    </span>
                    <span className="text-xs text-gray-500 font-mono">
                      {room.bedType}
                    </span>
                  </div>

                  <h3 className="text-xl font-light text-white mb-2">
                    {room.name}
                  </h3>

                  <div className="mb-6 bg-black/50 border border-white/10 p-3">
                    <span className="text-[10px] uppercase tracking-wider text-gray-400 block mb-1">
                      Current Live Tariff:
                    </span>
                    {room.price ? (
                      <span className="text-xl text-amber-400 font-medium">
                        ${room.price} <span className="text-xs text-gray-400 font-normal">/ night</span>
                      </span>
                    ) : (
                      <span className="text-sm text-gray-400 italic">
                        Price on request (Unconfirmed)
                      </span>
                    )}
                  </div>

                  {/* Form input */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`req-${room._id}`}
                        checked={draft.priceOnRequest}
                        onChange={(e) =>
                          setPriceDrafts({
                            ...priceDrafts,
                            [room._id]: {
                              ...draft,
                              priceOnRequest: e.target.checked,
                              price: e.target.checked ? "" : draft.price,
                            },
                          })
                        }
                        className="accent-amber-400"
                      />
                      <label htmlFor={`req-${room._id}`} className="text-xs text-gray-300">
                        Mark as &quot;Price on request&quot;
                      </label>
                    </div>

                    {!draft.priceOnRequest && (
                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-gray-400 mb-1">
                          New Nightly Rate ($ USD)
                        </label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 text-xs">
                            $
                          </span>
                          <input
                            type="number"
                            min="1"
                            value={draft.price}
                            onChange={(e) =>
                              setPriceDrafts({
                                ...priceDrafts,
                                [room._id]: {
                                  ...draft,
                                  price: e.target.value,
                                },
                              })
                            }
                            placeholder="e.g. 890"
                            className="w-full bg-black/80 border border-white/20 pl-7 pr-3 py-2 text-white text-xs outline-none focus:border-amber-400 font-medium"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  disabled={updatingId === room._id}
                  onClick={() => handleUpdatePrice(room)}
                  className="mt-6 w-full py-2.5 bg-amber-400 text-black text-xs uppercase tracking-widest font-medium hover:bg-amber-300 transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Save className="w-3.5 h-3.5" />
                  {updatingId === room._id ? "Saving..." : "Update Rate"}
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
