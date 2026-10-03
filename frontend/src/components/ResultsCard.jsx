import React, { useState } from "react";
import {
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  BookmarkPlus,
  Check,
  Info,
  Activity,
  Stethoscope,
  ChevronDown,
  ChevronUp,
  BarChart2,
  PieChart as PieChartIcon,
  Gauge,
  UserCheck,
  Binary,
  Cpu,
  ArrowDown,
  Sparkles,
  HelpCircle
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { TRANSLATIONS } from "../utils/translations";

/**
 * Format raw symptom column key to readable title
 */
const formatSymptomName = (key) => {
  if (!key) return "";
  return key
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

export default function ResultsCard({ results, onSaveHistory, language = "en" }) {
  const [saved, setSaved] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  const [showFullVector, setShowFullVector] = useState(false);

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  if (!results || !results.predictions || results.predictions.length === 0) {
    return null;
  }

  const handleSave = () => {
    onSaveHistory(results);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  // Severity badge classes
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

  const getProgressBarColor = (index) => {
    if (index === 0) return "bg-gradient-to-r from-blue-600 to-teal-400";
    if (index === 1) return "bg-gradient-to-r from-teal-500 to-emerald-400";
    return "bg-gradient-to-r from-indigo-500 to-purple-400";
  };

  // Prepare data for Recharts
  const chartData = results.predictions.map((p) => ({
    name: p.disease.length > 18 ? `${p.disease.substring(0, 18)}...` : p.disease,
    fullName: p.disease,
    probability: roundToTwoDecimals(p.probability * 100)
  }));

  function roundToTwoDecimals(val) {
    return Math.round(val * 10) / 10;
  }

  const PIE_COLORS = ["#2563eb", "#0d9488", "#7c3aed"];

  // Confidence level meter calculation
  const topProb = results.predictions[0]?.probability || 0;
  let confidenceLabel = "High Confidence";
  let confidenceColor = "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300";
  let confidencePercentage = Math.round(topProb * 100);

  if (topProb < 0.4) {
    confidenceLabel = "Low Confidence";
    confidenceColor = "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300";
  } else if (topProb < 0.7) {
    confidenceLabel = "Moderate Confidence";
    confidenceColor = "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-300";
  }

  // Recommended Specialist
  const recommendedSpecialist =
    results.recommended_specialist ||
    results.predictions[0]?.recommended_specialist ||
    "General Physician";

  // Debug payload
  const debugData = results.debug || {};
  const userInput = debugData.user_input || "";
  const correctedSentence = debugData.corrected_sentence || userInput;
  const extractedSymptoms = debugData.extracted_symptoms || results.detected_symptoms || [];
  const symptomVector = debugData.symptom_vector || [];

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

      {/* FEATURE 2: VISUALIZATIONS SECTION */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            Disease Probability & Model Visualizations
          </h3>

          {/* Confidence Meter Badge */}
          <div className="flex items-center gap-2">
            <Gauge className="w-4 h-4 text-slate-500" />
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Confidence Meter:</span>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${confidenceColor}`}>
              {confidenceLabel} ({confidencePercentage}%)
            </span>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Horizontal Bar Chart */}
          <div className="bg-slate-50/70 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200/60 dark:border-slate-800">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-1.5">
              <BarChart2 className="w-4 h-4 text-teal-500" />
              Probability Bar Chart (Top 3 Predictions)
            </h4>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={chartData}
                  margin={{ top: 10, right: 20, left: 10, bottom: 5 }}
                >
                  <XAxis type="number" domain={[0, 100]} unit="%" tick={{ fontSize: 11 }} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={110}
                    tick={{ fontSize: 11, fill: "currentColor" }}
                  />
                  <Tooltip
                    formatter={(value) => [`${value}%`, "Probability"]}
                    contentStyle={{
                      backgroundColor: "rgba(15, 23, 42, 0.9)",
                      borderColor: "#334155",
                      borderRadius: "8px",
                      color: "#fff",
                      fontSize: "12px"
                    }}
                  />
                  <Bar dataKey="probability" radius={[0, 6, 6, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Circular Donut Pie Chart */}
          <div className="bg-slate-50/70 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200/60 dark:border-slate-800 flex flex-col justify-between">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
              <PieChartIcon className="w-4 h-4 text-indigo-500" />
              Circular Probability Distribution
            </h4>
            <div className="h-44 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={4}
                    dataKey="probability"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`pie-cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [`${value}%`, "Probability"]}
                    contentStyle={{
                      backgroundColor: "rgba(15, 23, 42, 0.9)",
                      borderColor: "#334155",
                      borderRadius: "8px",
                      color: "#fff",
                      fontSize: "12px"
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            {/* Custom Pie Legend */}
            <div className="flex flex-wrap justify-center gap-3 pt-2 text-[11px]">
              {chartData.map((item, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <span
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }}
                  />
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {item.fullName}:
                  </span>
                  <span className="text-slate-500 dark:text-slate-400">{item.probability}%</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Top 3 Predictions Cards */}
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
              {/* Disease Title + Rank Badge + Severity + Percentage */}
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
                  className={`h-full rounded-full transition-all duration-700 ${getProgressBarColor(idx)}`}
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

      {/* FEATURE 3: EXPLANATION PANEL */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-5">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Info className="w-5 h-5 text-teal-600 dark:text-teal-400" />
          Explanation Panel & Clinical Summary
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Detected Symptoms Box */}
          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200/70 dark:border-slate-700/70">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Detected Symptoms ({results.detected_symptoms?.length || 0})
            </h4>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {(results.detected_symptoms || []).length > 0 ? (
                results.detected_symptoms.map((symptomKey, sIdx) => (
                  <span
                    key={sIdx}
                    className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                  >
                    <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                    {formatSymptomName(symptomKey)}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-400 italic">No symptoms detected</span>
              )}
            </div>
          </div>

          {/* Recommended Specialist Box */}
          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200/70 dark:border-slate-700/70 flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-blue-500" />
                Recommended Specialist
              </h4>
              <div className="mt-2 inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-100/80 text-blue-900 dark:bg-blue-950 dark:text-blue-200 border border-blue-300 dark:border-blue-800 font-bold text-sm">
                <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                {recommendedSpecialist}
              </div>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-3">
              Consult this medical specialist for thorough clinical evaluation and accurate diagnosis.
            </p>
          </div>

        </div>

        {/* Recommendations Grid */}
        <div className="pt-2">
          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-teal-500" />
            General Recommendations
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {(results.recommendations || []).map((rec, i) => (
              <div
                key={i}
                className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/70 text-xs font-medium text-slate-700 dark:text-slate-200"
              >
                <Check className="w-4 h-4 text-teal-500 shrink-0" />
                <span>{rec}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* FEATURE 4: DEBUG SECTION */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <button
          onClick={() => setShowDebug((prev) => !prev)}
          className="w-full p-4 bg-slate-50/80 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-between text-left"
        >
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              How was this prediction made? (Debug Section)
            </span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
              Pipeline Trace
            </span>
          </div>

          <div className="flex items-center gap-1 text-xs text-slate-500 font-semibold">
            {showDebug ? "Hide Details" : "Show Details"}
            {showDebug ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        {showDebug && (
          <div className="p-6 border-t border-slate-200 dark:border-slate-800 space-y-4">
            
            <p className="text-xs text-slate-500 dark:text-slate-400">
              This panel shows the internal step-by-step pipeline execution for this prediction:
            </p>

            <div className="space-y-3">
              
              {/* Step 1 */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                <div className="text-[11px] font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                  Step 1: User Input
                </div>
                <div className="text-xs font-mono text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                  {userInput ? `"${userInput}"` : "[No direct text input provided; manual checkboxes selected]"}
                </div>
              </div>

              <div className="flex justify-center text-slate-400">
                <ArrowDown className="w-4 h-4 animate-bounce" />
              </div>

              {/* Step 2 */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="text-[11px] font-extrabold text-teal-600 dark:text-teal-400 uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    Step 2: RapidFuzz Corrected Sentence (Spelling Preprocessing)
                  </div>
                  <span className="text-[10px] text-teal-600 dark:text-teal-300 bg-teal-50 dark:bg-teal-950 px-2 py-0.5 rounded font-semibold">
                    Similarity Threshold: 90%
                  </span>
                </div>
                <div className="text-xs font-mono text-emerald-700 dark:text-emerald-300 bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-emerald-200 dark:border-emerald-900">
                  {correctedSentence ? `"${correctedSentence}"` : "[N/A]"}
                </div>
              </div>

              <div className="flex justify-center text-slate-400">
                <ArrowDown className="w-4 h-4 animate-bounce" />
              </div>

              {/* Step 3 */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                <div className="text-[11px] font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                  Step 3: Extracted Symptoms ({extractedSymptoms.length} matched)
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {extractedSymptoms.length > 0 ? (
                    extractedSymptoms.map((k, i) => (
                      <span
                        key={i}
                        className="text-xs font-mono px-2 py-1 rounded bg-indigo-100 text-indigo-900 dark:bg-indigo-950 dark:text-indigo-200 border border-indigo-200 dark:border-indigo-800"
                      >
                        {k}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400 italic">No symptoms extracted</span>
                  )}
                </div>
              </div>

              <div className="flex justify-center text-slate-400">
                <ArrowDown className="w-4 h-4 animate-bounce" />
              </div>

              {/* Step 4 */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-[11px] font-extrabold text-purple-600 dark:text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Binary className="w-4 h-4" />
                    Step 4: 132-Dimensional Vector
                  </div>
                  <button
                    onClick={() => setShowFullVector((prev) => !prev)}
                    className="text-[11px] text-purple-600 dark:text-purple-300 font-semibold hover:underline"
                  >
                    {showFullVector ? "Hide Raw Array" : "View Raw 132-Bit Array"}
                  </button>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Vector size: <strong className="font-mono text-purple-600 dark:text-purple-400">132 features</strong> | Active symptom bits (1s):{" "}
                  <strong className="font-mono text-emerald-600 dark:text-emerald-400">
                    {symptomVector.filter((v) => v === 1).length}
                  </strong>
                </p>

                {showFullVector && (
                  <div className="max-h-48 overflow-y-auto p-3 bg-slate-900 text-slate-200 font-mono text-[11px] rounded-lg border border-slate-800 space-y-1">
                    <div className="text-slate-400 text-[10px]">
                      // 132-dimensional binary vector passed to Scikit-Learn Random Forest model:
                    </div>
                    <div>[{symptomVector.join(", ")}]</div>
                  </div>
                )}
              </div>

              <div className="flex justify-center text-slate-400">
                <ArrowDown className="w-4 h-4 animate-bounce" />
              </div>

              {/* Step 5 */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                <div className="text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                  Step 5: Random Forest Model Prediction
                </div>
                <ul className="text-xs space-y-1 font-mono text-slate-700 dark:text-slate-300 pt-1">
                  {results.predictions.map((p, i) => (
                    <li key={i} className="flex justify-between border-b border-slate-200/50 dark:border-slate-700/50 py-1">
                      <span>#{i + 1} {p.disease}</span>
                      <span className="font-bold text-blue-600 dark:text-blue-400">{p.percentage} ({p.probability})</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

          </div>
        )}
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
