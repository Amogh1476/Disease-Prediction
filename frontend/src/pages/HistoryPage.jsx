import React, { useState } from "react";
import { History, Trash2, Calendar, Stethoscope, ChevronDown, ChevronUp, AlertCircle, CheckCircle2 } from "lucide-react";
import { TRANSLATIONS } from "../utils/translations";

export default function HistoryPage({ history = [], onClearHistory, onDeleteItem, language = "en" }) {
  const [expandedId, setExpandedId] = useState(null);
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-6 py-4">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <History className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            {t.history} ({history.length})
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Review your saved medical symptom evaluation records and diagnostic outcomes.
          </p>
        </div>

        {history.length > 0 && (
          <button
            onClick={onClearHistory}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-950/60 dark:text-red-400 border border-red-200 dark:border-red-800 flex items-center gap-1.5 transition-colors self-start sm:self-auto"
          >
            <Trash2 className="w-3.5 h-3.5" />
            {t.clearHistory}
          </button>
        )}
      </div>

      {/* History Items List */}
      {history.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
            <History className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">
            {t.noHistory}
          </h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 max-w-sm mx-auto">
            When you run a symptom analysis on the Symptom Checker page, click "Save to History" to archive your diagnostic report here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((item) => {
            const isExpanded = expandedId === item.id;
            const topPrediction = item.results?.predictions?.[0];

            return (
              <div
                key={item.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm transition-all"
              >
                {/* Summary Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
                      <Calendar className="w-3.5 h-3.5 text-blue-500" />
                      <span>{new Date(item.timestamp).toLocaleString()}</span>
                    </div>

                    {topPrediction && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                          Top Condition:
                        </span>
                        <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                          {topPrediction.disease} ({topPrediction.percentage})
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                          {topPrediction.severity}
                        </span>
                      </div>
                    )}

                    {item.text && (
                      <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-1 italic">
                        "{item.text}"
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleExpand(item.id)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center gap-1 transition-colors"
                    >
                      {isExpanded ? (
                        <>
                          <span>Hide Details</span>
                          <ChevronUp className="w-3.5 h-3.5" />
                        </>
                      ) : (
                        <>
                          <span>{t.viewDetails}</span>
                          <ChevronDown className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => onDeleteItem(item.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                      title={t.delete}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                </div>

                {/* Expanded Details */}
                {isExpanded && item.results && (
                  <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
                    
                    {/* Detected Symptoms */}
                    <div>
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                        Evaluated Symptoms ({item.results.symptom_count || item.results.detected_symptoms?.length || 0}):
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {(item.results.detected_symptoms || []).map((sym) => (
                          <span
                            key={sym}
                            className="text-[11px] font-medium px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                          >
                            {sym.replace(/_/g, ' ')}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Top 3 Predictions */}
                    <div>
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                        {t.topDiseases}:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {item.results.predictions.map((p, idx) => (
                          <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/70 text-xs">
                            <div className="font-bold text-slate-900 dark:text-white">
                              #{idx + 1} {p.disease}
                            </div>
                            <div className="text-blue-600 dark:text-blue-400 font-semibold mt-0.5">
                              {p.percentage} ({p.severity})
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
