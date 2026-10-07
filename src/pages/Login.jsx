import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Lock, Mail, AlertCircle, ArrowLeft } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // If redirected from a specific page (e.g. booking flow)
  const from = location.state?.from?.pathname || location.state?.redirectTo || "/account";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please fill in both email and password.");
      return;
    }

    try {
      setLoading(true);
      const user = await login(email, password);
      if (user.role === "admin" && !location.state?.from) {
        navigate("/admin/dashboard");
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
      setError(err.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background visual accents */}
      <div className="absolute inset-0 bg-radial from-amber-500/5 via-transparent to-transparent pointer-events-none"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        {/* Back Link */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-gray-400 hover:text-amber-400 transition mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Return to Lumière
        </Link>

        {/* Brand header */}
        <div className="text-center">
          <Link to="/" className="inline-block">
            <h1 className="font-light text-3xl tracking-[8px] text-amber-400">
              LUMIÈRE
            </h1>
          </Link>
          <div className="w-12 h-px bg-amber-400/50 mx-auto my-3"></div>
          <h2 className="text-xl sm:text-2xl font-light tracking-wide text-stone-200">
            Welcome Back
          </h2>
          <p className="mt-2 text-xs text-gray-400 tracking-wider">
            Sign in to manage your luxury reservations &amp; privileges
          </p>
        </div>

        {/* Card */}
        <div className="mt-8 bg-neutral-950/90 border border-white/10 p-7 sm:p-9 shadow-2xl backdrop-blur-md">
          {error && (
            <div className="mb-6 bg-red-950/40 border border-red-500/40 text-red-300 text-xs p-3.5 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2">
                Email Address
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
                  placeholder="guest@example.com"
                  className="w-full bg-black/60 border border-white/20 text-white pl-10 pr-4 py-3 text-sm outline-none focus:border-amber-400 transition placeholder:text-gray-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2">
                Password
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
                  className="w-full bg-black/60 border border-white/20 text-white pl-10 pr-4 py-3 text-sm outline-none focus:border-amber-400 transition placeholder:text-gray-600"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 bg-amber-400 text-black py-3.5 uppercase tracking-widest text-xs font-medium hover:bg-amber-300 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? "Authenticating..." : "Login"}
            </button>
          </form>

          <div className="mt-6 border-t border-white/10 pt-5 text-center">
            <p className="text-xs text-gray-400">
              Don&apos;t have an account?{" "}
              <Link
                to="/signup"
                state={location.state}
                className="text-amber-400 hover:text-amber-300 underline underline-offset-4 ml-1 transition"
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>

        {/* Portal Notice */}
        <p className="mt-6 text-center text-[11px] text-gray-500">
          Hotel Administrator?{" "}
          <Link to="/admin/login" className="text-gray-400 hover:text-amber-400 underline transition">
            Admin Portal
          </Link>
        </p>
      </div>
    </div>
  );
}
