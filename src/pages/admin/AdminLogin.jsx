import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Lock, Mail, ShieldAlert, ArrowLeft } from "lucide-react";
import PageMeta from "../../components/PageMeta";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/admin/dashboard";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please enter administrator credentials.");
      return;
    }

    try {
      setLoading(true);
      const user = await login(email, password);
      if (user.role !== "admin") {
        setError("Access denied. These credentials do not have administrative privileges.");
        return;
      }
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || "Invalid administrator credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative">
      <PageMeta
        title="Admin Portal Login | Lumière Grand Hotel"
        description="Secure administrative access for Lumière Grand Hotel staff, management, and operations."
      />
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-gray-500 hover:text-amber-400 transition mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Return to Guest Site
        </Link>

        <div className="text-center">
          <h1 className="font-light text-3xl tracking-[8px] text-amber-400">
            LUMIÈRE
          </h1>
          <div className="w-16 h-px bg-amber-400/50 mx-auto my-3"></div>
          <p className="text-xs uppercase tracking-[4px] text-amber-500/90 font-medium">
            ADMIN PORTAL
          </p>
          <p className="mt-2 text-xs text-gray-400">
            Secure administrative control &amp; hotel management
          </p>
        </div>

        <div className="mt-8 bg-neutral-950 border border-amber-400/30 p-8 shadow-2xl">
          {error && (
            <div className="mb-6 bg-red-950/40 border border-red-500/40 text-red-300 text-xs p-3.5 flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2">
                Admin Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@lumierehotel.com"
                  className="w-full bg-black/80 border border-white/20 text-white pl-10 pr-4 py-3 text-sm outline-none focus:border-amber-400 transition placeholder:text-gray-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2">
                Admin Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-black/80 border border-white/20 text-white pl-10 pr-4 py-3 text-sm outline-none focus:border-amber-400 transition placeholder:text-gray-600"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 bg-amber-400 text-black py-3.5 uppercase tracking-widest text-xs font-medium hover:bg-amber-300 transition duration-300 disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Verifying..." : "Access Admin Portal"}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-gray-600">
          Lumière Grand Hotel • Internal Staff Only
        </p>
      </div>
    </div>
  );
}
