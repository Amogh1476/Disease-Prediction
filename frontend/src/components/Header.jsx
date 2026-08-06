import React from "react";
import { Activity, Moon, Sun, Globe, Stethoscope, History, Home, CheckCircle2, AlertCircle } from "lucide-react";
import { TRANSLATIONS } from "../utils/translations";

export default function Header({
  activeTab,
  setActiveTab,
  darkMode,
  setDarkMode,
  language,
  setLanguage,
  apiConnected
}) {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div 
            onClick={() => setActiveTab("home")}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-teal-400 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Stethoscope className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent dark:from-blue-400 dark:to-teal-300">
                  {t.appTitle}
                </span>
                <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full ${
                  apiConnected 
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800" 
                    : "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-800"
                }`}>
                  {apiConnected ? (
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  ) : (
                    <AlertCircle className="w-3 h-3 text-amber-500" />
                  )}
                  {apiConnected ? "API Live" : "Connecting..."}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                {t.subTitle}
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-xl border border-slate-200/80 dark:border-slate-700/60">
            <button
              onClick={() => setActiveTab("home")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === "home"
                  ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Home className="w-4 h-4" />
              {t.home}
            </button>
            <button
              onClick={() => setActiveTab("checker")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === "checker"
                  ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Activity className="w-4 h-4" />
              {t.checker}
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === "history"
                  ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <History className="w-4 h-4" />
              {t.history}
            </button>
          </nav>

          {/* Right Controls: Language & Theme */}
          <div className="flex items-center gap-3">
            {/* Language Dropdown */}
            <div className="relative flex items-center">
              <Globe className="w-4 h-4 text-slate-400 absolute left-2.5 pointer-events-none" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="en">English (EN)</option>
                <option value="es">Español (ES)</option>
                <option value="hi">हिंदी (HI)</option>
                <option value="fr">Français (FR)</option>
              </select>
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors"
              title="Toggle Dark/Light Mode"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>
          </div>

        </div>

        {/* Mobile Navigation Row */}
        <div className="flex md:hidden border-t border-slate-200 dark:border-slate-800 py-2 justify-around">
          <button
            onClick={() => setActiveTab("home")}
            className={`flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-md ${
              activeTab === "home" ? "bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400" : "text-slate-600 dark:text-slate-400"
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            {t.home}
          </button>
          <button
            onClick={() => setActiveTab("checker")}
            className={`flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-md ${
              activeTab === "checker" ? "bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400" : "text-slate-600 dark:text-slate-400"
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            {t.checker}
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-md ${
              activeTab === "history" ? "bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400" : "text-slate-600 dark:text-slate-400"
            }`}
          >
            <History className="w-3.5 h-3.5" />
            {t.history}
          </button>
        </div>

      </div>
    </header>
  );
}
