import React, { useState, useEffect } from "react";
import { Activity, Sparkles, AlertCircle, RefreshCw, Send, FileText } from "lucide-react";
import VoiceInput from "../components/VoiceInput";
import SymptomCheckboxes from "../components/SymptomCheckboxes";
import ResultsCard from "../components/ResultsCard";
import { fetchAllSymptoms, predictDisease } from "../utils/api";
import { TRANSLATIONS } from "../utils/translations";

export default function SymptomCheckerPage({ onSaveHistory, language = "en" }) {
  const [text, setText] = useState("");
  const [symptomsList, setSymptomsList] = useState([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [nlpDetected, setNlpDetected] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingSymptoms, setLoadingSymptoms] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [results, setResults] = useState(null);

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  // Fetch 132 symptoms on mount
  useEffect(() => {
    async function loadData() {
      try {
        setLoadingSymptoms(true);
        const data = await fetchAllSymptoms();
        setSymptomsList(data.symptoms || []);
      } catch (err) {
        console.error("Failed to load symptoms:", err);
        setErrorMsg("Failed to connect to backend API. Please make sure the FastAPI server is running.");
      } finally {
        setLoadingSymptoms(false);
      }
    }
    loadData();
  }, []);

  // Client-side quick preview of NLP detection as user types
  useEffect(() => {
    if (!text.trim() || symptomsList.length === 0) {
      setNlpDetected([]);
      return;
    }

    const textLower = text.toLowerCase();
    const detected = [];

    for (const item of symptomsList) {
      const displayClean = item.display_name.toLowerCase();
      const keyClean = item.key.toLowerCase().replace(/_/g, " ");

      if (displayClean.length > 3 && textLower.includes(displayClean)) {
        detected.push(item.key);
      } else if (keyClean.length > 3 && textLower.includes(keyClean)) {
        detected.push(item.key);
      } else if (item.synonyms) {
        for (const syn of item.synonyms) {
          if (syn.length > 3 && textLower.includes(syn.toLowerCase())) {
            detected.push(item.key);
            break;
          }
        }
      }
    }

    setNlpDetected(detected);
  }, [text, symptomsList]);

  const handleVoiceTranscript = (transcript) => {
    setText((prev) => (prev ? `${prev} ${transcript}` : transcript));
  };

  const handlePredict = async (e) => {
    e.preventDefault();
    if (!text.trim() && selectedSymptoms.length === 0) {
      setErrorMsg("Please type your symptoms or select at least one symptom from the list.");
      return;
    }

    try {
      setLoading(true);
      setErrorMsg("");
      setResults(null);

      const response = await predictDisease(text, selectedSymptoms);
      setResults(response);

      // Scroll to results smooth
      setTimeout(() => {
        const el = document.getElementById("results-section");
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 100);

    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || "An error occurred during prediction.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 py-4">
      
      {/* Top Title Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-2">
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          AI Medical Symptom Analyzer
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Enter natural language symptoms below, use your voice, or select from the 132 symptom list.
        </p>
      </div>

      {/* Main Form */}
      <form onSubmit={handlePredict} className="space-y-6">
        
        {/* Natural Language Text Area Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between gap-2">
            <label className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              {t.typeSymptomsLabel}
            </label>

            <VoiceInput onTranscript={handleVoiceTranscript} language={language} />
          </div>

          <textarea
            rows={4}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t.typePlaceholder}
            className="w-full p-3.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-y transition-all"
          />

          {nlpDetected.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" />
                Live NLP Matches ({nlpDetected.length}):
              </span>
              {nlpDetected.map((key) => {
                const found = symptomsList.find((s) => s.key === key);
                return (
                  <span
                    key={key}
                    className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200"
                  >
                    {found ? found.display_name : key}
                  </span>
                );
              })}
            </div>
          )}
        </div>

        {/* 132 Symptom Checkbox Component */}
        {loadingSymptoms ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 text-center text-xs text-slate-500 dark:text-slate-400">
            <RefreshCw className="w-6 h-6 text-blue-600 animate-spin mx-auto mb-2" />
            Loading 132 clinical symptoms...
          </div>
        ) : (
          <SymptomCheckboxes
            symptomsList={symptomsList}
            selectedSymptoms={selectedSymptoms}
            setSelectedSymptoms={setSelectedSymptoms}
            nlpDetectedSymptoms={nlpDetected}
            language={language}
          />
        )}

        {/* Error Banner */}
        {errorMsg && (
          <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 text-xs sm:text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Predict Action Button */}
        <div className="flex justify-center pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white font-bold text-sm sm:text-base shadow-xl shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {loading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>{t.analyzing}</span>
              </>
            ) : (
              <>
                <Activity className="w-5 h-5" />
                <span>{t.predictBtn}</span>
                <Send className="w-4 h-4 ml-1" />
              </>
            )}
          </button>
        </div>

      </form>

      {/* Results Section */}
      <div id="results-section">
        {results && (
          <ResultsCard
            results={results}
            onSaveHistory={onSaveHistory}
            language={language}
          />
        )}
      </div>

    </div>
  );
}
