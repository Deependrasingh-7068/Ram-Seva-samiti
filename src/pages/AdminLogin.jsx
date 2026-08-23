import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  Calendar,
  CreditCard,
  AlertCircle,
  KeyRound,
} from "lucide-react";

export default function AdminLogin() {
  const [aadhaar, setAadhaar] = useState("");
  const [dob, setDob] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Quick fill helper to fetch demo admin credentials from backend
  const fillDemoAdmin = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin-auth/demo-admin`);
      const data = await res.json();
      if (data.success && data.admin) {
        setAadhaar(data.admin.aadhaar || "");
        setDob(data.admin.dob || "");
      }
    } catch {
      // Fallback demo values
      setAadhaar("123456789012");
      setDob("1995-01-01");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin-auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ aadhaar, dob }),
        }
      );
      const data = await res.json();

      if (data.success) {
        localStorage.setItem("adminInfo", JSON.stringify(data.admin));
        navigate("/admin");
      } else {
        setError(
          data.message || "Your Aadhaar number is not registered here, Sorry"
        );
      }
    } catch (err) {
      setError("Server error. Contact your senior.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center px-4 py-12 relative">
      {/* Quick Credentials Pop-up Badge on UI */}
      <div className="absolute top-6 right-6 bg-navy-2 border border-gold/30 p-3 rounded-2xl shadow-xl max-w-xs text-xs space-y-2 text-cream backdrop-blur-md hidden sm:block">
        <div className="flex items-center justify-between font-semibold text-saffron">
          <span className="flex items-center gap-1.5">
            <KeyRound size={14} /> Quick Demo Fill
          </span>
          <button
            type="button"
            onClick={fillDemoAdmin}
            className="px-2 py-0.5 rounded bg-saffron text-navy font-bold hover:bg-saffron-deep transition-all text-[10px] cursor-pointer"
          >
            Fill
          </button>
        </div>
        <p className="text-cream/70 text-[11px]">
          Click 'Fill' to instantly populate test admin details for quick verification.
        </p>
      </div>

      <div className="p-8 sm:p-10 rounded-3xl max-w-lg w-full bg-navy-2 border border-gold/20 shadow-2xl space-y-6 text-cream backdrop-blur-md">
        {/* Header Icon & Title */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-saffron/10 border border-saffron/30 flex items-center justify-center text-saffron shadow-inner">
            <ShieldCheck size={36} />
          </div>
          <h2 className="font-display text-3xl text-cream tracking-wide">
            Samiti Admin Portal
          </h2>
          <p className="text-xs text-cream/60 max-w-xs mx-auto">
            Enter your Aadhaar Number and Date of Birth to access the dashboard.
          </p>
        </div>

        {/* Error Notification Box */}
        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-3">
            <AlertCircle size={20} className="shrink-0" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        {/* Login Form with Aadhaar & DOB */}
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Aadhaar Number Field */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-gold/80 ml-1">
              Aadhaar Number
            </label>
            <div className="relative">
              <CreditCard
                className="absolute left-4 top-3.5 text-gold/60"
                size={18}
              />
              <input
                type="text"
                placeholder="Enter your Aadhaar number"
                value={aadhaar}
                onChange={(e) => setAadhaar(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-navy border border-gold/20 text-cream text-sm outline-none focus:border-saffron transition-all font-mono"
                required
              />
            </div>
          </div>

          {/* Date of Birth Field */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-gold/80 ml-1">
              Date of Birth (DOB)
            </label>
            <div className="relative">
              <Calendar
                className="absolute left-4 top-3.5 text-gold/60"
                size={18}
              />
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-navy border border-gold/20 text-cream text-sm outline-none focus:border-saffron transition-all cursor-pointer [color-scheme:dark]"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 rounded-full bg-saffron hover:bg-saffron-deep text-navy font-semibold transition-all shadow-lg text-sm tracking-wide disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Verifying Credentials..." : "Login to Dashboard"}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-gold/10">
          <p className="text-[11px] text-cream/50">
            Protected area. Authorized personnel only.
          </p>
        </div>
      </div>
    </div>
  );
}