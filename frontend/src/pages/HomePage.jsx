import React from "react";
import { Activity, Stethoscope, Sparkles, Shield, Cpu, Mic, ChevronRight, CheckCircle2 } from "lucide-react";
import { TRANSLATIONS } from "../utils/translations";

export default function HomePage({ onStart, language = "en" }) {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  return (
    <div className="space-y-12 py-4">
      
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-700 via-indigo-700 to-teal-700 p-8 sm:p-12 text-white shadow-2xl">
        <div className="relative z-10 max-w-3xl space-y-6">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold text-blue-100 border border-white/20">
            <Sparkles className="w-4 h-4 text-teal-300" />
            Random Forest Machine Learning Engine
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            {t.heroTitle}
          </h1>

          <p className="text-sm sm:text-lg text-blue-100/90 font-normal leading-relaxed max-w-2xl">
            {t.heroDesc}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={onStart}
              className="px-6 py-3.5 rounded-xl bg-white text-blue-900 font-bold text-sm sm:text-base hover:bg-blue-50 transition-all shadow-lg hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              <Activity className="w-5 h-5 text-blue-600" />
              {t.startAnalysis}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Decorative ambient background blur shapes */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-teal-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-12 w-80 h-80 bg-indigo-500/30 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Feature Grid */}
      <div>
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Designed for Instant & Reliable Assessment
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Leveraging machine-learning models trained on clinical datasets covering 41 disease prognoses.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              132 Symptoms Vector
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Comprehensive clinical symptom coverage mapped to a 132-dimensional binary vector.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-950/80 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-4">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Real-time NLP Extraction
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Automatically parses natural language text and matches symptom synonyms seamlessly.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4">
              <Mic className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Voice Dictation
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Hands-free microphone dictation powered by Web Speech API for quick voice symptom input.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              41 Disease Prognoses
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Predicts top 3 disease candidates with probabilities, severity levels, and care guidelines.
            </p>
          </div>

        </div>
      </div>

      {/* Safety Banner */}
      <div className="p-6 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/80 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
          <Stethoscope className="w-6 h-6" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
            Educational Purpose Disclaimer
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
            {t.disclaimerNotice}
          </p>
        </div>
      </div>

    </div>
  );
}
