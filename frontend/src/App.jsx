import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import SymptomCheckerPage from "./pages/SymptomCheckerPage";
import HistoryPage from "./pages/HistoryPage";
import { fetchHealthStatus } from "./utils/api";

export default function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("medicheck_theme");
    if (saved !== null) return saved === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("medicheck_lang") || "en";
  });

  const [apiConnected, setApiConnected] = useState(false);
  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem("medicheck_history");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Apply Dark Mode class to html document element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("medicheck_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("medicheck_theme", "light");
    }
  }, [darkMode]);

  // Persist language selection
  useEffect(() => {
    localStorage.setItem("medicheck_lang", language);
  }, [language]);

  // Persist history
  useEffect(() => {
    localStorage.setItem("medicheck_history", JSON.stringify(history));
  }, [history]);

  // Check backend health periodically
  useEffect(() => {
    async function checkHealth() {
      const res = await fetchHealthStatus();
      if (res && res.message) {
        setApiConnected(true);
      } else {
        setApiConnected(false);
      }
    }
    checkHealth();
    const interval = setInterval(checkHealth, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleSaveHistory = (resultsPayload) => {
    const newItem = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      results: resultsPayload
    };
    setHistory((prev) => [newItem, ...prev]);
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  const handleDeleteHistoryItem = (id) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-300">
      
      {/* Header Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        language={language}
        setLanguage={setLanguage}
        apiConnected={apiConnected}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === "home" && (
          <HomePage
            onStart={() => setActiveTab("checker")}
            language={language}
          />
        )}

        {activeTab === "checker" && (
          <SymptomCheckerPage
            onSaveHistory={handleSaveHistory}
            language={language}
          />
        )}

        {activeTab === "history" && (
          <HistoryPage
            history={history}
            onClearHistory={handleClearHistory}
            onDeleteItem={handleDeleteHistoryItem}
            language={language}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm py-6 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4">
          <p>© 2026 MediCheck AI — Educational Medical Symptom Diagnostic Tool</p>
          <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">
            Powered by Scikit-Learn Random Forest Classifier & FastAPI Backend
          </p>
        </div>
      </footer>

    </div>
  );
}
