import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const response = await API.post("/auth/register", formData);
      if (response.data.success) {
        login(
          { name: response.data.name, email: response.data.email },
          response.data.token,
        );
        navigate("/dashboard");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Registration failed. Please verify your entries and try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 sm:px-6 lg:px-8 font-sans text-slate-100 selection:bg-indigo-500/30 antialiased relative overflow-hidden">
      {/* 🌌 AMBIENT BACKGROUND CANVAS LAYER */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
        {/* Deep Field Aurora Glows */}
        <div className="absolute top-[-10%] left-[30%] w-[70vw] h-[70vw] bg-indigo-600/10 rounded-full blur-[140px]"></div>
        <div className="absolute bottom-[-10%] right-[20%] w-[50vw] h-[50vw] bg-violet-600/10 rounded-full blur-[120px]"></div>

        {/* Dynamic Vector Flight Paths Tracking Across Viewport */}
        <svg
          className="absolute inset-0 w-full h-full text-indigo-500/[0.03] stroke-slate-800/20"
          fill="none"
          stroke="currentColor"
        >
          <path
            d="M-100,700 Q 300,100 800,250"
            strokeWidth="1.5"
            strokeDasharray="8,8"
            className="text-indigo-500/[0.04]"
          />
          <path d="M 200,900 Q 750,200 1800,400" strokeWidth="2" />

          {/* Animated Ascending Jet Vector on Flight Track */}
          <g
            transform="translate(480, 245) rotate(-22) scale(0.9)"
            className="text-indigo-500/10"
          >
            <path
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </svg>

        {/* Large Geometric Compass Mesh Coordinates (Top Left Perimeter) */}
        <svg
          className="absolute -top-32 -left-32 w-[600px] h-[600px] text-slate-900/30 stroke-current opacity-40 transform rotate-45"
          fill="none"
          strokeWidth="0.5"
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="12" r="5" strokeDasharray="2,2" />
          <path d="M12 2v20M2 12h20M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707" />
        </svg>
      </div>

      {/* 🔲 PRECISE GLASSMORPHIC INTERACTIVE CARD */}
      <div className="max-w-md w-full space-y-6 bg-slate-900/25 backdrop-blur-2xl p-8 rounded-2xl border border-slate-800/50 shadow-2xl relative z-10">
        {/* Core Identity Branding */}
        <div className="flex flex-col items-center space-y-3">
          <div className="h-12 w-12 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/10 border border-indigo-400/20">
            {/* Minimalist Wing Component */}
            <svg
              className="w-6 h-6 text-white transform -rotate-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </div>
          <div className="text-center space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight">
              Create an account
            </h2>
            <p className="text-xs text-slate-400 font-medium tracking-wide">
              Start mapping out your next temporal itinerary vector with AI
            </p>
          </div>
        </div>

        {/* Error Notification Alert */}
        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 px-4 py-3 rounded-xl flex items-center space-x-2.5 motion-safe:animate-[shake_0.4s_ease-in-out]">
            <span className="text-sm shrink-0">⚠️</span>
            <p className="text-xs text-rose-400 font-medium tracking-wide">
              {error}
            </p>
          </div>
        )}

        {/* Node Generation Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-3.5">
            {/* Field: Operator Name */}
            <div>
              <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400 mb-1.5">
                Operator Identity Designation
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="block w-full px-4 py-3 bg-slate-950/40 border border-slate-800/80 rounded-xl text-slate-200 placeholder-slate-700 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-sans"
                placeholder="John Doe"
              />
            </div>

            {/* Field: Corporate Email */}
            <div>
              <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400 mb-1.5">
                Corporate Email Address
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="block w-full px-4 py-3 bg-slate-950/40 border border-slate-800/80 rounded-xl text-slate-200 placeholder-slate-700 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-sans"
                placeholder="operator@domain.com"
              />
            </div>

            {/* Field: Passkey Matrix */}
            <div>
              <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400 mb-1.5">
                Secure Session Passkey
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className={`block w-full pl-4 pr-11 py-3 bg-slate-950/40 border border-slate-800/80 rounded-xl text-slate-200 placeholder-slate-700 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-sans ${!showPassword && "tracking-widest"}`}
                  placeholder="••••••••"
                />

                {/* Tactical Visibility Toggle */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 transition-colors focus:outline-none cursor-pointer"
                >
                  {showPassword ? (
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-2 py-3 px-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-[10px] font-mono font-bold uppercase tracking-widest rounded-xl text-white shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20 active:scale-[0.99] transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            {submitting ? "Initializing Node Access..." : "Generate Account"}
          </button>
        </form>

        {/* Lower Node Entry Directory */}
        <p className="text-center text-xs text-slate-500 pt-3.5 border-t border-slate-800/40 font-medium tracking-wide">
          Already verified?{" "}
          <Link
            to="/login"
            className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            Login Here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
