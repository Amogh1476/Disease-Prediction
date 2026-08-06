import React, { useState, useMemo } from "react";
import { Search, CheckSquare, Square, Filter, Sparkles, X, RotateCcw } from "lucide-react";
import { TRANSLATIONS } from "../utils/translations";

export default function SymptomCheckboxes({
  symptomsList = [],
  selectedSymptoms = [],
  setSelectedSymptoms,
  nlpDetectedSymptoms = [],
  language = "en"
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set(symptomsList.map((s) => s.category));
    return ["All", ...Array.from(set)];
  }, [symptomsList]);

  // Filtered symptoms list based on search and category
  const filteredSymptoms = useMemo(() => {
    return symptomsList.filter((item) => {
      const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
      const matchesSearch =
        item.display_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.key.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [symptomsList, searchTerm, selectedCategory]);

  const toggleSymptom = (key) => {
    if (selectedSymptoms.includes(key)) {
      setSelectedSymptoms(selectedSymptoms.filter((k) => k !== key));
    } else {
      setSelectedSymptoms([...selectedSymptoms, key]);
    }
  };

  const handleClearAll = () => {
    setSelectedSymptoms([]);
  };

  const handleSelectFiltered = () => {
    const filteredKeys = filteredSymptoms.map((s) => s.key);
    const combined = Array.from(new Set([...selectedSymptoms, ...filteredKeys]));
    setSelectedSymptoms(combined);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm transition-all">
      
      {/* Header & Counters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Filter className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            Clinical Symptoms Selector ({symptomsList.length} total)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Search or select individual symptoms to combine with your natural language text description.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
            {selectedSymptoms.length} {t.selectCheckedCount}
          </span>
          {selectedSymptoms.length > 0 && (
            <button
              onClick={handleClearAll}
              className="text-xs font-medium text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              {t.clearAll}
            </button>
          )}
        </div>
      </div>

      {/* NLP Auto-detected Symptoms Banner */}
      {nlpDetectedSymptoms.length > 0 && (
        <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 rounded-xl">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-800 dark:text-amber-300 mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            {t.detectedSymptoms}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {nlpDetectedSymptoms.map((key) => {
              const item = symptomsList.find((s) => s.key === key);
              const label = item ? item.display_name : key;
              return (
                <span
                  key={key}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-amber-200/70 text-amber-900 dark:bg-amber-900/60 dark:text-amber-200 border border-amber-300 dark:border-amber-700"
                >
                  {label}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Search Input & Category Pills */}
      <div className="space-y-3 mb-4">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t.searchSymptoms}
            className="w-full pl-10 pr-9 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              {cat === "All" ? t.allCategories : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Symptom Grid list */}
      {filteredSymptoms.length === 0 ? (
        <div className="py-8 text-center text-xs text-slate-500 dark:text-slate-400">
          No matching symptoms found for "{searchTerm}".
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-72 overflow-y-auto pr-1">
          {filteredSymptoms.map((item) => {
            const isSelected = selectedSymptoms.includes(item.key);
            const isNlpDetected = nlpDetectedSymptoms.includes(item.key);

            return (
              <div
                key={item.key}
                onClick={() => toggleSymptom(item.key)}
                className={`flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer select-none transition-all ${
                  isSelected
                    ? "bg-blue-50/80 dark:bg-blue-950/50 border-blue-300 dark:border-blue-800 text-blue-950 dark:text-blue-100 shadow-sm"
                    : isNlpDetected
                    ? "bg-amber-50/60 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800"
                    : "bg-slate-50/50 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/80"
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {isSelected ? (
                    <CheckSquare className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-400 dark:text-slate-600" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs font-semibold truncate">
                      {item.display_name}
                    </span>
                    {isNlpDetected && (
                      <span className="text-[10px] bg-amber-200 text-amber-900 dark:bg-amber-900 dark:text-amber-200 px-1.5 py-0.2 rounded font-medium shrink-0">
                        NLP
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 block truncate mt-0.5">
                    {item.category}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Select Filtered Action */}
      {filteredSymptoms.length > 0 && filteredSymptoms.length < symptomsList.length && (
        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={handleSelectFiltered}
            className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
          >
            + Select all {filteredSymptoms.length} visible results
          </button>
        </div>
      )}

    </div>
  );
}
