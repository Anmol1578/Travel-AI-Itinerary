import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const SharedItinerary = () => {
  const { token } = useParams();
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSharedData = async () => {
      try {
        setLoading(true);
        // Direct public HTTP get request to your backend node bypasses client tokens
        const response = await axios.get(
          `http://localhost:5000/api/itinerary/share/${token}`,
        );
        setItinerary(response.data);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to sync with layout array.",
        );
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchSharedData();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center space-y-4">
        <div className="animate-spin rounded-full h-6 w-6 border-2 border-indigo-500 border-t-transparent"></div>
        <p className="text-xs text-slate-500 font-mono tracking-widest uppercase animate-pulse">
          Resolving Nodes...
        </p>
      </div>
    );
  }

  if (error || !itinerary) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-center p-6">
        <span className="text-4xl mb-3">🛸</span>
        <h3 className="text-sm font-mono font-bold text-slate-400 uppercase tracking-wider">
          Timeline Link Unresolved
        </h3>
        <p className="text-xs text-slate-600 mt-2 max-w-xs mx-auto leading-relaxed">
          {error}
        </p>
      </div>
    );
  }

  const plan = itinerary.structuredPlan || itinerary;
  const targetDays = plan.days || [];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8 antialiased relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-indigo-600/[0.03] rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-3xl mx-auto space-y-8 relative z-10 pt-8">
        <header className="bg-slate-900/20 backdrop-blur-md border border-slate-900 rounded-2xl p-6 shadow-2xl">
          <div className="inline-block px-2 py-0.5 rounded-sm bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-mono text-emerald-400 uppercase tracking-widest font-bold mb-3">
            Shared Profile Map
          </div>
          <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-100">
            {itinerary.title}
          </h1>
        </header>

        <main className="space-y-4">
          {targetDays.map((day, idx) => (
            <div
              key={idx}
              className="bg-slate-900/30 border border-slate-800/50 p-5 rounded-2xl space-y-2 hover:border-slate-700/50 transition-all group"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-mono font-bold uppercase text-indigo-400">
                  Day {day.dayNumber || idx + 1}
                </h3>
                {day.title && (
                  <span className="text-[10px] font-semibold text-slate-500 bg-slate-950 px-2 py-0.5 rounded border border-slate-900">
                    {day.title}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                {day.description}
              </p>
            </div>
          ))}
        </main>
      </div>
    </div>
  );
};

export default SharedItinerary;
