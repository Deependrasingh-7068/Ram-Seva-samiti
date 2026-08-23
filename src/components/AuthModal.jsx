import { useEffect, useState } from "react";
import { X, LogIn, UserPlus } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function AuthModal({ open, onClose }) {
  const { login, register } = useAuth();
  const [mode, setMode] = useState("login"); // 'login' | 'signup'
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setError("");
      setSubmitting(false);
    }
  }, [open, mode]);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      // handleSubmit ke andar:
      if (mode === "login") {
        await login(form.email, form.password);
      } else {
        await register(form.name, form.email, form.phone, form.password);
      }
      onClose();
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center px-4"
      role="dialog"
      aria-modal="true"
      aria-label={mode === "login" ? "Sign in" : "Create an account"}
    >
      <div
        className="absolute inset-0 bg-navy/90 backdrop-blur-md animate-fadeIn"
        onClick={onClose}
      />

      <div className="relative w-full max-w-sm premium-card rounded-2xl p-7 md:p-8 animate-scaleIn">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 text-cream/50 hover:text-cream transition-colors"
        >
          <X size={20} />
        </button>

        <p className="font-hindi text-xl text-gold text-center mb-1">
          ॥ श्री राम ॥
        </p>
        <h2 className="font-display text-2xl text-cream text-center mb-6">
          {mode === "login" ? "Welcome Back" : "Join Ram Sewa Samiti"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <div>
              <label
                htmlFor="auth-name"
                className="block text-sm text-cream/60 mb-1.5"
              >
                Name
              </label>
              <input
                id="auth-name"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-navy-2 border border-gold/20 text-cream placeholder:text-cream/30 focus:border-gold outline-none transition-colors"
                placeholder="Your name"
              />
            </div>
          )}
          <div>
            <label
              htmlFor="auth-email"
              className="block text-sm text-cream/60 mb-1.5"
            >
              Email
            </label>
            <input
              id="auth-email"
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl bg-navy-2 border border-gold/20 text-cream placeholder:text-cream/30 focus:border-gold outline-none transition-colors"
              placeholder="you@example.com"
            />
          </div>
          
          {mode === "signup" && (
            <div>
              <label
                htmlFor="auth-phone"
                className="block text-sm text-cream/60 mb-1.5"
              >
                Contact Number
              </label>
              <input
                id="auth-phone"
                name="phone"
                type="tel"
                required
                inputMode="numeric"
                pattern="^(\+91[\-\s]?)?[6-9]\d{9}$"
                value={form.phone}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-navy-2 border border-gold/20 text-cream placeholder:text-cream/30 focus:border-gold outline-none transition-colors"
                placeholder="10-digit mobile number"
              />
            </div>
          )}
          <div>
            <label
              htmlFor="auth-password"
              className="block text-sm text-cream/60 mb-1.5"
            >
              Password
            </label>
            <input
              id="auth-password"
              name="password"
              type="password"
              required
              minLength={6}
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl bg-navy-2 border border-gold/20 text-cream placeholder:text-cream/30 focus:border-gold outline-none transition-colors"
              placeholder="At least 6 characters"
            />
          </div>
          {error && <p className="text-sm text-saffron text-center">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-full bg-saffron hover:bg-saffron-deep disabled:opacity-60 text-navy font-semibold transition-colors"
          >
            {mode === "login" ? <LogIn size={17} /> : <UserPlus size={17} />}
            {submitting
              ? "Please wait…"
              : mode === "login"
                ? "Sign In"
                : "Create Account"}
          </button>
        </form>

        <p className="text-center text-sm text-cream/60 mt-5">
          {mode === "login"
            ? "Don't have an account? "
            : "Already have an account? "}
          <button
            type="button"
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
            className="text-gold hover:text-saffron transition-colors font-medium"
          >
            {mode === "login" ? "Sign up" : "Sign in"}
          </button>
        </p>

        <button
          type="button"
          onClick={onClose}
          className="w-full text-center text-xs text-cream/40 hover:text-cream/60 transition-colors mt-4"
        >
          Continue browsing without an account
        </button>
      </div>
    </div>
  );
}
