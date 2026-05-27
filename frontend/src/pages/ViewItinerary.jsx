import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";

const ViewItinerary = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  // Component States
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch the shared itinerary data safely on load
  useEffect(() => {
    const fetchSharedPlan = async () => {
      try {
        setLoading(true);
        const response = await API.get(`/itinerary/share/${token}`);
        setItinerary(response.data.itinerary || response.data);
      } catch (err) {
        console.error("Fetch share plan error:", err);
        setError(
          err.response?.data?.message ||
            "This travel link has expired or doesn’t exist.",
        );
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchSharedPlan();
  }, [token]);

  // Handle Flawless Browser-Native PDF Export (Optimized for print media contrast)
  const exportToPDF = () => {
    window.print();
  };

  // Handle iCalendar (.ics) Sync File Generation
  const exportToICS = () => {
    if (!itinerary) return;
    const plan = itinerary.structuredPlan || itinerary;
    const daysArray = plan.days || [];
    const details = plan.extractedDetails || {};

    // Fallback base date if AI didn't catch a start date (Format: YYYYMMDD)
    let baseDateStr = details.startDate
      ? details.startDate.replace(/[^0-9]/g, "")
      : "";
    if (baseDateStr.length !== 8) {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, "0");
      const dd = String(today.getDate()).padStart(2, "0");
      baseDateStr = `${yyyy}${mm}${dd}`;
    }

    let icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//AI Travel Planner//Itinerary App//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
    ];

    // Loop through days and activities to build separate calendar event blocks
    daysArray.forEach((day, dIdx) => {
      const currentEventDate = new Date(
        baseDateStr.substring(0, 4),
        parseInt(baseDateStr.substring(4, 6)) - 1,
        parseInt(baseDateStr.substring(6, 8)) + dIdx,
      );

      const yyyy = currentEventDate.getFullYear();
      const mm = String(currentEventDate.getMonth() + 1).padStart(2, "0");
      const dd = String(currentEventDate.getDate()).padStart(2, "0");
      const dateStamp = `${yyyy}${mm}${dd}`;

      day.activities?.forEach((act, aIdx) => {
        const summary = `${day.title || `Day ${dIdx + 1}`} - ${act.time || "Activity"}`;
        const description = (act.activity || "")
          .replace(/,/g, "\\,")
          .replace(/;/g, "\\;");

        icsContent.push("BEGIN:VEVENT");
        icsContent.push(`UID:${token}-${dIdx}-${aIdx}@aitravel.com`);
        icsContent.push(`DTSTAMP:${dateStamp}T000000Z`);
        icsContent.push(`DTSTART;VALUE=DATE:${dateStamp}`);
        icsContent.push(`SUMMARY:${summary}`);
        icsContent.push(`DESCRIPTION:${description}`);
        icsContent.push("END:VEVENT");
      });
    });

    icsContent.push("END:VCALENDAR");

    const blob = new Blob([icsContent.join("\r\n")], {
      type: "text/calendar;charset=utf-8;",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);

    const filename = (itinerary.title || plan.tripName || "travel-plan")
      .toLowerCase()
      .replace(/\s+/g, "-");
    link.setAttribute("download", `${filename}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Loading Framework Layout View
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute top-[35%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[30vw] h-[30vw] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-indigo-500 border-t-transparent mb-4"></div>
        <p className="text-slate-500 font-medium font-mono text-xs tracking-wider animate-pulse">
          ASSEMBLING CUSTOM TRAVEL TIMELINE...
        </p>
      </div>
    );
  }

  // Error/Fallback Framework Layout View
  if (error || !itinerary) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
        <div className="absolute top-[35%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[30vw] h-[30vw] bg-rose-600/5 rounded-full blur-[100px] pointer-events-none"></div>
        <span className="text-4xl mb-4 filter grayscale opacity-40">🛸</span>
        <h3 className="text-sm font-bold text-slate-400 tracking-tight">
          Adventure Not Found
        </h3>
        <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto font-sans leading-relaxed">
          {error || "Unable to load structural details."}
        </p>
        <button
          onClick={() => navigate("/dashboard")}
          className="mt-6 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 font-semibold rounded-xl text-xs transition-all tracking-wide cursor-pointer shadow-md"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  // Safe Variable Deconstruction Mapping
  const plan = itinerary.structuredPlan || itinerary;
  const daysArray = plan.days || [];
  const details =
    itinerary.extractedDetails ||
    plan.extractedDetails ||
    plan.ticketInfo ||
    {};
  const hasVoucher =
    details.confirmationNumber && details.confirmationNumber !== "N/A";

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 selection:bg-indigo-500/30 selection:text-indigo-200 antialiased relative overflow-x-hidden">
      {/* High-Contrast Injection for Print Handlers */}
      <style>{`
        @media print {
          header, button, nav, .deco-aurora {
            display: none !important;
          }
          body, html, main {
            background: #ffffff !important;
            color: #000000 !important;
            padding: 0 !important;
            margin: 0 !important;
            width: 100% !important;
          }
          .print-container {
            box-shadow: none !important;
            border: none !important;
            padding: 0 !important;
            margin: 0 !important;
            max-width: 100% !important;
          }
          .print-card {
            background: #ffffff !important;
            border: 1px solid #e2e8f0 !important;
            color: #000000 !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            margin-bottom: 1.5rem !important;
          }
          .print-header {
            background: #f1f5f9 !important;
            color: #000000 !important;
            border-bottom: 1px solid #cbd5e1 !important;
          }
          .print-text {
            color: #1e293b !important;
          }
        }
      `}</style>

      {/* Decorative AI Aurora Mesh Glow Backgrounds */}
      <div className="deco-aurora absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="deco-aurora absolute top-[30%] right-[-10%] w-[40vw] h-[40vw] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Glassmorphic Navbar Header */}
      <header className="bg-slate-950/70 backdrop-blur-xl border-b border-slate-900 sticky top-0 z-50 px-4 sm:px-6 py-4 flex justify-between items-center transition-all">
        <div
          className="flex items-center space-x-3 cursor-pointer"
          onClick={() => navigate("/dashboard")}
        >
          <div className="h-9 w-9 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <span className="text-white font-black text-lg tracking-tight">
              ✈
            </span>
          </div>
          <h1 className="text-sm sm:text-md font-bold text-slate-50 tracking-tight flex items-center gap-2 hover:text-indigo-400 transition-colors">
            Travel AI Timeline
          </h1>
        </div>

        {/* Responsive Control Panel Triggers */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            onClick={exportToPDF}
            className="px-3 py-1.5 bg-slate-900/80 hover:bg-slate-800 text-xs font-semibold text-slate-300 border border-slate-800 rounded-lg shadow-xs transition-all flex items-center space-x-1.5 cursor-pointer"
          >
            <span>📥</span>
            <span className="hidden sm:inline">Export PDF</span>
          </button>

          <button
            onClick={exportToICS}
            className="px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-xs font-semibold text-white rounded-lg shadow-md shadow-indigo-600/10 transition-all flex items-center space-x-1.5 cursor-pointer"
          >
            <span>📅</span>
            <span>Sync Calendar</span>
          </button>

          <button
            onClick={() => navigate("/dashboard")}
            className="px-2.5 py-1.5 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
          >
            Back
          </button>
        </div>
      </header>

      {/* Main Container Workspace */}
      <main className="max-w-4xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 relative z-10 print-container">
        {/* Banner Summary Header Card */}
        <div className="bg-slate-900/40 backdrop-blur-md p-5 sm:p-6 rounded-2xl border border-slate-800/80 shadow-xs flex flex-col md:flex-row md:justify-between md:items-center gap-4 print-card">
          <div className="space-y-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-mono border border-indigo-500/20 bg-indigo-500/10 text-indigo-400 font-bold uppercase tracking-wider">
              ✨ Travel Ai Tailored Experience
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
              {itinerary.title || plan.tripName || "Custom Timeline Matrix"}
            </h2>
            <p className="text-xs text-slate-400 font-medium flex items-center gap-1.5 print-text">
              <span className="text-slate-500 uppercase font-bold tracking-wider text-[10px]">
                Temporal Scope:
              </span>
              <span className="text-slate-300 font-semibold font-mono">
                {itinerary.duration || plan.duration || "Custom Plan"}
              </span>
            </p>
          </div>

          {/* Extracted Voucher Details Block */}
          {hasVoucher && (
            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 text-xs text-slate-400 space-y-1.5 md:min-w-[240px] shrink-0 print-card">
              <p className="uppercase font-bold text-slate-500 tracking-wider text-[9px] font-mono">
                Registry Voucher Vector
              </p>
              <div className="flex items-center justify-between gap-4">
                <span className="text-slate-500">Document Class:</span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-purple-500/10 text-purple-400 border border-purple-500/20 font-mono">
                  {details.type || "Booking"}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-slate-500">Confirmation:</span>
                <code className="text-slate-200 font-mono text-[11px] bg-slate-950 px-1 py-0.5 rounded border border-slate-800">
                  {details.confirmationNumber}
                </code>
              </div>
              {details.startDate && (
                <div className="flex items-center justify-between gap-4">
                  <span className="text-slate-500">Milestone Start:</span>
                  <span className="text-slate-300 font-mono font-medium">
                    {details.startDate}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Daily Schedule Timeline Stream */}
        <div className="space-y-6 sm:space-y-8">
          {daysArray.length === 0 ? (
            <div className="bg-slate-900/30 rounded-xl border border-dashed border-slate-800 p-12 text-center print-card">
              <span className="text-2xl block opacity-40 mb-2">🛸</span>
              <p className="text-xs text-slate-500 font-medium font-mono">
                No tracking segments resolved inside this timeline entity.
              </p>
            </div>
          ) : (
            daysArray.map((day, dIdx) => (
              <div
                key={dIdx}
                className="bg-slate-900/20 backdrop-blur-md rounded-2xl border border-slate-800/80 shadow-2xl overflow-hidden day-card print-card"
              >
                {/* Day Banner Header Element */}
                <div className="bg-slate-950/40 border-b border-slate-800 px-5 py-4 flex justify-between items-center print-header">
                  <div className="flex items-center space-x-2.5">
                    <div className="h-6 w-6 rounded-md bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-mono font-bold text-xs border border-indigo-500/10">
                      {day.dayNumber || dIdx + 1}
                    </div>
                    <h3 className="font-bold text-sm tracking-tight text-slate-200 print-text">
                      Day Matrix {day.dayNumber || dIdx + 1}
                    </h3>
                  </div>
                  <span className="text-xs font-semibold text-slate-400 bg-slate-900/60 border border-slate-800 px-2.5 py-1 rounded-lg tracking-tight font-sans print-text">
                    {day.title || "Exploration Stop"}
                  </span>
                </div>

                {/* Vertical Node Line Connectors */}
                <div className="p-5 sm:p-6 relative">
                  <div className="absolute left-[29px] top-8 bottom-8 w-px bg-slate-800 hidden sm:block"></div>

                  <div className="space-y-6">
                    {day.activities?.map((act, aIdx) => (
                      <div
                        key={aIdx}
                        className="relative flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-6 group"
                      >
                        {/* Time Vector Node Indicator */}
                        <div className="flex items-center gap-3 sm:w-28 shrink-0">
                          <div className="h-2.5 w-2.5 rounded-full border-2 border-slate-950 bg-indigo-500 group-hover:bg-violet-400 transition-colors shadow-xs hidden sm:block z-10 ring-4 ring-indigo-500/10"></div>
                          <span className="text-xs font-bold font-mono text-indigo-400 bg-indigo-500/5 sm:bg-transparent px-2 py-0.5 rounded border border-indigo-500/10 sm:border-0 print-text">
                            {act.time || "Flexible"}
                          </span>
                        </div>

                        {/* Activity Context Output Card */}
                        <div className="flex-1 bg-slate-950/40 sm:bg-transparent p-3.5 sm:p-0 rounded-xl border border-slate-900 sm:border-0 print-text">
                          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium font-sans group-hover:text-slate-100 transition-colors print-text">
                            {act.activity}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default ViewItinerary;
