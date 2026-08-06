import React, { useState } from "react";
import { AlertTriangle, ShieldAlert, CheckCircle2, BookmarkPlus, Check, Info, Droplet, Bed, Activity, Stethoscope } from "lucide-react";
import { TRANSLATIONS } from "../utils/translations";

export default function ResultsCard({ results, onSaveHistory, language = "en" }) {
  const [saved, setSaved] = useState(false);
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  if (!results || !results.predictions || results.predictions.length === 0) {
    return null;
  }

  const handleSave = () => {
    onSaveHistory(results);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const getSeverityBadgeClass = (severity) => {
    const sev = (severity || "").toLowerCase();
    if (sev.includes("critical")) {
      return "bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border-rose-300 dark:border-rose-800";
    }
    if (sev.includes("high")) {
      return "bg-orange-100 text-orange-800 dark:bg-orange-950/80 dark:text-orange-300 border-orange-300 dark:border-orange-800";
    }
    if (sev.includes("moderate")) {
      return "bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border-amber-300 dark:border-amber-800";
    }
    return "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800";
  };

  const getProgressBarColor = (index, severity) => {
    if (index === 0) return "bg-gradient-to-r from-blue-600 to-teal-400";
    if (index === 1) return "bg-gradient-to-r from-teal-500 to-emerald-400";
    return "bg-gradient-to-r from-indigo-500 to-purple-400";
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header Card */}
      <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-teal-600 rounded-2xl p-6 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold mb-2">
            <Activity className="w-3.5 h-3.5" />
            Analysis Complete
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            {t.resultsTitle}
          </h2>
          <p className="text-xs sm:text-sm text-blue-100 mt-1">
            Based on {results.symptom_count || results.detected_symptoms?.length || 0} evaluated symptoms.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saved}
          className={`px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md ${
            saved
              ? "bg-emerald-500 text-white"
              : "bg-white text-blue-900 hover:bg-blue-50 hover:scale-105 active:scale-95"
          }`}
        >
          {saved ? (
            <>
              <Check className="w-4 h-4" />
              {t.historySaved}
            </>
          ) : (
            <>
              <BookmarkPlus className="w-4 h-4 text-blue-600" />
              {t.saveHistory}
            </>
          )}
        </button>
      </div>

      {/* Top 3 Predictions Section */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
          <Stethoscope className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          {t.topDiseases}
        </h3>

        <div className="space-y-4">
          {results.predictions.map((item, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl border transition-all ${
                idx === 0
                  ? "bg-blue-50/50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800/80"
                  : "bg-slate-50/50 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-800"
              }`}
            >
              {/* Disease Title + Rank Badge + Percentage */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                    #{idx + 1}
                  </span>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">
                    {item.disease}
                  </h4>
                  <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${getSeverityBadgeClass(item.severity)}`}>
                    {item.severity}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-lg font-extrabold text-blue-600 dark:text-blue-400">
                    {item.percentage}
                  </span>
                  <span className="text-xs text-slate-400 dark:text-slate-500 ml-1">probability</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mb-3">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${getProgressBarColor(idx, item.severity)}`}
                  style={{ width: `${Math.max(item.probability * 100, 3)}%` }}
                />
              </div>

              {/* Description */}
              {item.description && (
                <p className="text-xs text-slate-600 dark:text-slate-300 mb-3 leading-relaxed">
                  {item.description}
                </p>
              )}

              {/* Precautions */}
              {item.precautions && item.precautions.length > 0 && (
                <div className="mt-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    {t.precautions}:
                  </span>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                    {item.precautions.map((p, pIdx) => (
                      <li key={pIdx} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-teal-500 mt-0.5 shrink-0" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            </div>
          ))}
        </div>
      </div>

      {/* General Recommendations */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
          <Info className="w-5 h-5 text-teal-600 dark:text-teal-400" />
          {t.recommendations}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {(results.recommendations || []).map((rec, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/70">
              <div className="w-8 h-8 rounded-lg bg-teal-100 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <span className="text-xs font-medium text-slate-700 dark:text-slate-200">
                {rec}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer Box */}
      <div className="bg-amber-50 dark:bg-amber-950/40 rounded-2xl border border-amber-200 dark:border-amber-800/80 p-5 flex items-start gap-3.5">
        <ShieldAlert className="w-6 h-6 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-sm font-bold text-amber-900 dark:text-amber-200">
            {t.disclaimerTitle}
          </h4>
          <p className="text-xs text-amber-800/90 dark:text-amber-300/90 mt-1 leading-relaxed">
            {results.disclaimer || t.disclaimerNotice}
          </p>
        </div>
      </div>

    </div>
  );
}
