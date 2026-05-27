import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";

const Dashboard = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  // Application States
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [validationError, setValidationError] = useState("");

  // ✨ AI Generation States (Split Core Architectures)
  const [tripTitle, setTripTitle] = useState("Custom AI Strategy");
  const [aiPrompt, setAiPrompt] = useState("");
  const [file, setFile] = useState(null);
  const [isDragActive, setIsDragActive] = useState(false);

  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  // Fetch saved user trips on load
  useEffect(() => {
    const fetchUserTrips = async () => {
      try {
        setLoading(true);
        const response = await API.get("/itinerary/history");
        const data =
          response.data.itineraries ||
          response.data.history ||
          response.data.data ||
          [];
        setItineraries(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error retrieving dashboard itineraries:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserTrips();
  }, []);

  // Handle Drag Events for File Upload
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  // Handle Drop Event
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  // Handle File Input Selection
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  // Execution Pipeline 1: Document Parsing Engine
  const handleExecuteFileParsing = async (e) => {
    e.preventDefault();
    if (!file) {
      setValidationError("Please drop or upload a voucher document first.");
      return;
    }

    try {
      setUploading(true);
      setValidationError("");

      const formData = new FormData();
      // ✨ FIXED: Key changed from "file" to "document" to match backend expectations!
      formData.append("document", file);
      formData.append("title", "Extracted Asset Log");

      const response = await API.post("/itinerary/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const savedData = response.data.itinerary || response.data;
      if (savedData && savedData.shareToken) {
        navigate(`/itinerary/share/${savedData.shareToken}`);
      } else {
        window.location.reload();
      }
    } catch (err) {
      console.error("Document Pipeline Error:", err);
      setValidationError(
        err.response?.data?.message || "Failed to process document voucher.",
      );
    } finally {
      setUploading(false);
    }
  };

  // Execution Pipeline 2: Pure Text Prompt Synthesis Engine
  const handleExecutePromptSynthesis = async (e) => {
    e.preventDefault();
    if (!aiPrompt.trim()) {
      setValidationError(
        "Please select a quick generator or enter custom synthesis parameters.",
      );
      return;
    }

    try {
      setUploading(true);
      setValidationError("");

      const response = await API.post("/itinerary/generate-prompt", {
        title: tripTitle.trim(),
        prompt: aiPrompt.trim(),
      });

      const savedData = response.data.itinerary || response.data;
      if (savedData && savedData.shareToken) {
        navigate(`/itinerary/share/${savedData.shareToken}`);
      } else {
        window.location.reload();
      }
    } catch (err) {
      console.error("AI Generation Engine Failure:", err);
      setValidationError(
        err.response?.data?.message ||
          "Failed to process directive via Gemini.",
      );
    } finally {
      setUploading(false);
    }
  };

  // Compute Live Metrics Aggregations
  const totalTrips = itineraries.length;

  const totalDaysMapped = itineraries.reduce((sum, item) => {
    const plan = item.structuredPlan || item;
    const dayCount =
      plan.days?.length ||
      (plan.itinerary && typeof plan.itinerary === "object"
        ? Object.keys(plan.itinerary).length
        : 0);
    return sum + (Number(dayCount) || 0);
  }, 0);

  const extractedVouchers = itineraries.filter((item) => {
    const plan = item.structuredPlan || item;
    const details =
      item.extractedDetails || plan.extractedDetails || plan.ticketInfo || {};
    const confirmation =
      details.confirmationNumber ||
      details.pnr ||
      details.bookingReference ||
      details.ticketNumber;
    return !!(confirmation && confirmation !== "N/A");
  }).length;

  // Filter & Sort Logic Pipelines
  const filteredItineraries = itineraries
    .filter((item) => {
      const plan = item.structuredPlan || item;
      const details = item.extractedDetails || plan.extractedDetails || {};

      const titleMatch = (
        item.title ||
        plan.tripName ||
        "My Generated Trip"
      ).toLowerCase();
      const typeMatch = (details.type || "").toLowerCase();
      const confMatch = (details.confirmationNumber || "").toLowerCase();
      const searchLower = searchTerm.toLowerCase();

      return (
        titleMatch.includes(searchLower) ||
        typeMatch.includes(searchLower) ||
        confMatch.includes(searchLower)
      );
    })
    .sort((a, b) => {
      if (sortBy === "newest")
        return (
          new Date(b.createdAt || Date.now()) -
          new Date(a.createdAt || Date.now())
        );
      if (sortBy === "oldest")
        return (
          new Date(a.createdAt || Date.now()) -
          new Date(b.createdAt || Date.now())
        );
      return 0;
    });

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 selection:bg-indigo-500/30 selection:text-indigo-200 antialiased relative overflow-x-hidden">
      <style>{`
        .spline-flight-element {
          offset-path: path('M -40,160 C 40,60 120,20 200,80 C 280,140 360,140 440,40');
          offset-rotate: 0deg;
          animation: spline-travel 3.2s infinite cubic-bezier(0.45, 0.05, 0.55, 0.95);
        }
        @keyframes spline-travel {
          0% { offset-distance: 0%; opacity: 0; scale: 0.7; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { offset-distance: 100%; opacity: 0; scale: 1.1; }
        }
        @keyframes pulse-radar {
          0% { transform: scale(0.95); opacity: 0.3; }
          50% { opacity: 0.6; }
          100% { transform: scale(1.05); opacity: 0.1; }
        }
      `}</style>

      {/* Generation Loader Screen Overlay */}
      {uploading && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-xl z-50 flex flex-col items-center justify-center p-6 select-none">
          <div className="relative w-full max-w-md h-56 flex flex-col items-center justify-center border border-slate-900 bg-slate-950/40 rounded-3xl p-6 shadow-2xl overflow-hidden">
            <svg
              className="absolute inset-0 w-full h-full text-slate-900 stroke-current"
              viewBox="0 0 400 200"
              fill="none"
            >
              <circle
                cx="200"
                cy="90"
                r="80"
                strokeWidth="0.5"
                className="text-slate-900/40"
              />
              <circle
                cx="200"
                cy="90"
                r="50"
                strokeWidth="0.5"
                strokeDasharray="3,6"
                className="text-slate-900/30 animate-[spin_40s_linear_infinite]"
              />
              <circle
                cx="200"
                cy="90"
                r="110"
                strokeWidth="0.5"
                className="text-indigo-500/[0.02]"
                style={{ animation: "pulse-radar 3s infinite ease-in-out" }}
              />
              <path
                d="M -40,160 C 40,60 120,20 200,80 C 280,140 360,140 440,40"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeDasharray="4,6"
                className="text-indigo-500/[0.08]"
              />
            </svg>
            <div className="absolute inset-0 pointer-events-none">
              <div className="spline-flight-element absolute w-10 h-10 flex items-center justify-center text-indigo-400 filter drop-shadow-[0_0_15px_rgba(99,102,241,0.6)]">
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-8 h-8 transform rotate-90"
                >
                  <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L14 19v-5.5l8 2.5z" />
                </svg>
              </div>
            </div>
            <div className="mt-auto text-center space-y-1.5 relative z-10">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-indigo-500/5 border border-indigo-500/10 font-mono text-[9px] font-bold text-indigo-400 uppercase tracking-widest animate-pulse">
                Telemetry Link Secure
              </div>
              <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-200">
                AI Synthesizer Routing
              </h3>
              <p className="text-[11px] text-slate-500 font-medium max-w-xs mx-auto">
                Travel is compiling your variables and documents into clean
                code...
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Glow Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute top-[20%] right-[-10%] w-[40vw] h-[40vw] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Navbar Header */}
      <header className="bg-slate-950/70 backdrop-blur-xl border-b border-slate-900 sticky top-0 z-50 px-4 sm:px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="h-9 w-9 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <span className="text-white font-black text-lg tracking-tight">
              ✈
            </span>
          </div>
          <div>
            <h1 className="text-sm sm:text-md font-bold text-slate-50 tracking-tight flex items-center gap-2">
              Travel AI Workspace{" "}
              <span className="text-[10px] bg-indigo-500/10 text-indigo-400 px-1.5 py-0.5 rounded-md font-mono border border-indigo-500/20">
                v2.5
              </span>
            </h1>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right hidden sm:block">
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
              Active Terminal
            </p>
            <p className="text-xs font-medium text-slate-300">
              {user?.email || "explorer@ai-travel.internal"}
            </p>
          </div>
          <button
            onClick={logout}
            className="px-3 py-1.5 text-xs font-semibold text-slate-400 hover:text-rose-400 bg-slate-900/50 hover:bg-rose-950/30 rounded-lg transition-all border border-slate-800 hover:border-rose-900/50 cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Viewport Dashboard Content */}
      <main className="max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 relative z-10">
        {/* Metrics Displays */}
        {/* ... component stats layout ... */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
          <div className="bg-slate-900/40 backdrop-blur-md p-5 rounded-2xl border border-slate-800/80 shadow-xs flex items-center space-x-4 group hover:border-slate-700/80 transition-all duration-300">
            <div className="text-2xl bg-indigo-500/10 text-indigo-400 p-2.5 rounded-xl border border-indigo-500/10">
              🗺️
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Total Timelines
              </p>
              <h3 className="text-xl font-bold text-slate-100 mt-0.5 tracking-tight">
                {totalTrips}
              </h3>
            </div>
          </div>
          <div className="bg-slate-900/40 backdrop-blur-md p-5 rounded-2xl border border-slate-800/80 shadow-xs flex items-center space-x-4 group hover:border-slate-700/80 transition-all duration-300">
            <div className="text-2xl bg-violet-500/10 text-violet-400 p-2.5 rounded-xl border border-violet-500/10">
              📅
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Total Days Mapped
              </p>
              <h3 className="text-xl font-bold text-slate-100 mt-0.5 tracking-tight">
                {totalDaysMapped}
              </h3>
            </div>
          </div>
          <div className="bg-slate-900/40 backdrop-blur-md p-5 rounded-2xl border border-slate-800/80 shadow-xs flex items-center space-x-4 group hover:border-slate-700/80 transition-all duration-300">
            <div className="text-2xl bg-emerald-500/10 text-emerald-400 p-2.5 rounded-xl border border-emerald-500/10">
              🎟️
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Extracted Vouchers
              </p>
              <h3 className="text-xl font-bold text-slate-100 mt-0.5 tracking-tight">
                {extractedVouchers}
              </h3>
            </div>
          </div>
        </section>

        {/* Dashboard Operational Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-start">
          {/* 🛠️ LEFT SIDEBAR: Split Operations Deck */}
          <section className="space-y-6 lg:sticky lg:top-24">
            {/* Global Errors Panel */}
            {validationError && (
              <div className="bg-rose-500/10 border border-rose-500/20 px-4 py-3 rounded-xl flex items-center space-x-2.5">
                <span className="text-sm shrink-0">⚠️</span>
                <p className="text-xs text-rose-400 font-medium leading-relaxed">
                  {validationError}
                </p>
              </div>
            )}

            {/* 📦 SEPARATE BOX 1: File Analysis Core */}
            <div className="bg-slate-900/30 backdrop-blur-md p-5 sm:p-6 rounded-2xl border border-slate-800/80 shadow-xs space-y-4">
              <div>
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">
                  || Document Extraction
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Parse live reservation confirmations or flight structures.
                </p>
              </div>

              <form onSubmit={handleExecuteFileParsing} className="space-y-4">
                <div
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-xl p-4 text-center transition-all relative cursor-pointer ${
                    isDragActive
                      ? "border-indigo-500 bg-indigo-500/5"
                      : file
                        ? "border-emerald-500/50 bg-emerald-500/[0.02]"
                        : "border-slate-800 hover:border-slate-700 bg-slate-950/40"
                  }`}
                >
                  <input
                    type="file"
                    id="dashboard-file-input"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handleFileChange}
                    accept=".pdf,image/*"
                  />
                  <div className="space-y-1.5 pointer-events-none">
                    <div className="text-xl">{file ? "📄" : "📥"}</div>
                    <p className="text-xs font-semibold text-slate-200">
                      {file ? file.name : "Upload Ticket Voucher PDF or Image"}
                    </p>
                    <p className="text-[10px] text-slate-500">
                      {file
                        ? `${(file.size / 1024 / 1024).toFixed(2)} MB`
                        : "Drag file here or click to browse files"}
                    </p>
                  </div>
                  {file && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setFile(null);
                      }}
                      className="absolute top-2 right-2 text-[10px] bg-slate-900 hover:bg-rose-950 border border-slate-800 hover:border-rose-900/50 text-slate-400 hover:text-rose-400 px-1.5 py-0.5 rounded"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={uploading || !file}
                  className="w-full py-2 px-4 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 disabled:text-slate-600 font-semibold rounded-xl text-xs transition-all tracking-wide flex justify-center items-center space-x-2 disabled:cursor-not-allowed cursor-pointer"
                >
                  <span>📂</span>
                  <span>Analyze Booking Vector</span>
                </button>
              </form>
            </div>

            {/* ⚡ SEPARATE BOX 2: Strategic Prompt Core */}
            <div className="bg-slate-900/30 backdrop-blur-md p-5 sm:p-6 rounded-2xl border border-slate-800/80 shadow-xs space-y-4">
              <div>
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">
                  || Text Prompt Synthesis
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Generate customized timeline structures using regional
                  vectors.
                </p>
              </div>

              {/* Quick Prompt Presets Matrix Layout */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">
                  Quick Prompt Generators
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    {
                      label: "🍵 Kyoto Culture",
                      text: "Map a 4-day culture tour through Kyoto with focus on temples, tea rooms, and historical preservation zones.",
                    },
                    {
                      label: "🍕 Rome Express",
                      text: "3 days in Rome focusing heavily on authentic local street food, hidden nonna-owned trattorias, and architectural highlights.",
                    },
                    {
                      label: "🏙️ Tokyo Neon",
                      text: "A rapid 48-hour futuristic immersion in Tokyo focusing on electronics, gaming, and nightlife districts.",
                    },
                    {
                      label: "🏔️ Swiss Alps",
                      text: "5-day scenic railway itinerary through the Swiss Alps including hiking paths and glacier viewpoints.",
                    },
                  ].map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setTripTitle(
                          preset.label.split(" ").slice(1).join(" ") + " Run",
                        );
                        setAiPrompt(preset.text);
                      }}
                      className="text-[11px] font-medium bg-slate-950 hover:bg-indigo-950/40 text-slate-400 hover:text-indigo-300 border border-slate-800 hover:border-indigo-500/30 px-2.5 py-1 rounded-lg transition-all cursor-pointer"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Input Directives and Action Form */}
              <form
                onSubmit={handleExecutePromptSynthesis}
                className="space-y-4"
              >
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                    Custom Synthesis Directives
                  </label>
                  <textarea
                    value={aiPrompt}
                    onChange={(e) => {
                      setAiPrompt(e.target.value);
                      if (tripTitle === "Custom AI Strategy")
                        setTripTitle("Custom AI Strategy");
                    }}
                    placeholder="Select a generator preset above or type custom parameters here..."
                    rows={4}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs font-medium placeholder-slate-700 text-slate-100 focus:outline-hidden focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/30 transition-all resize-none leading-relaxed"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={uploading || !aiPrompt.trim()}
                  className="w-full py-2.5 px-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:from-slate-900 disabled:to-slate-900 text-white disabled:text-slate-600 font-semibold rounded-xl text-xs transition-all tracking-wide flex justify-center items-center space-x-2 disabled:cursor-not-allowed cursor-pointer shadow-lg shadow-indigo-600/10"
                >
                  <span>✨</span>
                  <span>Generate Strategy Map</span>
                </button>
              </form>
            </div>
          </section>

          {/* RIGHT SIDEBAR: History Records Registration Deck */}
          <section className="lg:col-span-2 space-y-4">
            <div className="bg-slate-900/30 backdrop-blur-md p-3 rounded-xl border border-slate-800/80 shadow-xs flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
              <div className="relative flex-1">
                <span className="absolute left-3 top-2.5 text-slate-500 text-xs">
                  🔍
                </span>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search destination, voucher type, or confirmation code..."
                  className="w-full pl-8 pr-3 py-1.5 bg-slate-950/50 text-xs text-slate-200 placeholder-slate-600 border border-slate-800 rounded-lg focus:outline-hidden focus:border-slate-700"
                />
              </div>
              <div className="flex items-center space-x-2 shrink-0 self-end sm:self-auto">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                  Sort Index
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-slate-950/50 text-[11px] font-semibold text-slate-300 border border-slate-800 p-1.5 rounded-lg focus:outline-hidden cursor-pointer hover:border-slate-700 transition-colors"
                >
                  <option value="newest">Recent Actions</option>
                  <option value="oldest">Historical Archives</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="bg-slate-900/20 rounded-xl border border-slate-800/80 p-16 text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-indigo-500 border-t-transparent mx-auto mb-4"></div>
                <p className="text-xs text-slate-500 font-medium font-mono">
                  Synchronizing workspace record states...
                </p>
              </div>
            ) : filteredItineraries.length === 0 ? (
              <div className="bg-slate-900/30 rounded-xl border border-dashed border-slate-800 p-12 text-center shadow-2xl">
                <span className="text-3xl block filter grayscale opacity-40 mb-3">
                  🛸
                </span>
                <h3 className="text-sm font-bold text-slate-400 tracking-tight">
                  System Index Empty
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                  No tracking vectors matching parameters were resolved on this
                  profile directory.
                </p>
              </div>
            ) : (
              <div className="bg-slate-900/20 backdrop-blur-md rounded-xl border border-slate-800/80 shadow-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-950/40 border-b border-slate-800 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        <th className="py-3.5 px-4">
                          Entity & First Milestone
                        </th>
                        <th className="py-3.5 px-4 hidden sm:table-cell">
                          Ticket / Confirmation Info
                        </th>
                        <th className="py-3.5 px-4 hidden md:table-cell">
                          Scope
                        </th>
                        <th className="py-3.5 px-4">Compiled</th>
                        <th className="py-3.5 px-4 text-right">Operation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900 text-xs font-medium">
                      {filteredItineraries.map((item) => {
                        const plan = item.structuredPlan || item;
                        const durationText =
                          item.duration ||
                          plan.duration ||
                          `${plan.days?.length || 1} Days`;

                        const details =
                          item.extractedDetails || plan.extractedDetails || {};
                        const confirmation =
                          details.confirmationNumber &&
                          details.confirmationNumber !== "N/A"
                            ? details.confirmationNumber
                            : null;
                        const typeLabel =
                          details.type && details.type !== "Booking Document"
                            ? details.type
                            : "AI Generated";
                        const ticketName =
                          item.title ||
                          item.destination ||
                          plan.tripName ||
                          "Unlabeled Reservation";

                        return (
                          <tr
                            key={item._id}
                            className="hover:bg-slate-800/40 transition-all duration-150 ease-out group"
                          >
                            <td className="py-4 px-4 max-w-[160px] sm:max-w-[200px]">
                              <div className="font-semibold text-slate-200 truncate group-hover:text-indigo-400 transition-colors tracking-tight text-sm">
                                {ticketName}
                              </div>
                              <div className="text-[11px] text-slate-500 truncate mt-0.5 font-normal">
                                {plan.days?.[0]?.title ||
                                  plan.days?.[0]?.description ||
                                  "Multi-stop transit matrix"}
                              </div>
                            </td>

                            <td className="py-4 px-4 hidden sm:table-cell whitespace-nowrap">
                              <div className="space-y-1">
                                <div className="flex items-center gap-1.5">
                                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-purple-500/10 text-purple-400 border border-purple-500/20 font-mono">
                                    {typeLabel}
                                  </span>
                                  {confirmation ? (
                                    <code className="text-slate-300 font-mono text-[11px] bg-slate-950 px-1 py-0.5 rounded border border-slate-800">
                                      {confirmation}
                                    </code>
                                  ) : (
                                    <span className="text-[11px] text-slate-600 italic font-normal">
                                      No code parsed
                                    </span>
                                  )}
                                </div>
                                <p className="text-[10px] text-slate-400 font-normal">
                                  Active Date:{" "}
                                  <span className="text-slate-500 font-mono">
                                    {details.startDate || "—"}
                                  </span>
                                </p>
                              </div>
                            </td>

                            <td className="py-4 px-4 hidden md:table-cell text-slate-400 font-mono text-[11px]">
                              {durationText}
                            </td>

                            <td className="py-4 px-4 text-slate-500 whitespace-nowrap font-normal font-mono text-[11px]">
                              {item.createdAt
                                ? new Date(item.createdAt).toLocaleDateString(
                                    undefined,
                                    {
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric",
                                    },
                                  )
                                : "—"}
                            </td>

                            <td className="py-4 px-4 text-right whitespace-nowrap">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => {
                                    if (item.shareToken) {
                                      navigate(
                                        `/itinerary/share/${item.shareToken}`,
                                      );
                                    } else {
                                      navigate(`/itinerary/view/${item._id}`);
                                    }
                                  }}
                                  className="px-2.5 py-1 bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-300 hover:text-slate-100 font-semibold rounded-md text-[11px] cursor-pointer transition-colors"
                                >
                                  View
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
