import React, { useState, useEffect } from "react";
import { Mic, MicOff, AlertCircle } from "lucide-react";
import { TRANSLATIONS } from "../utils/translations";

export default function VoiceInput({ onTranscript, language = "en" }) {
  const [isListening, setIsListening] = useState(false);
  const [supported, setSupported] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      setSupported(false);
    }
  }, []);

  const handleToggleListen = () => {
    if (!supported) {
      setErrorMsg("Voice speech recognition is not supported in this browser.");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      
      // Set language code
      const langMap = { en: "en-US", es: "es-ES", hi: "hi-IN", fr: "fr-FR" };
      recognition.lang = langMap[language] || "en-US";

      recognition.onstart = () => {
        setIsListening(true);
        setErrorMsg("");
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          onTranscript(transcript);
        }
        setIsListening(false);
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        if (event.error !== "no-speech") {
          setErrorMsg(`Voice input error: ${event.error}`);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.error(err);
      setErrorMsg("Unable to access microphone.");
      setIsListening(false);
    }
  };

  return (
    <div className="flex flex-col items-start gap-1">
      <button
        type="button"
        onClick={handleToggleListen}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
          isListening
            ? "bg-red-500 text-white recording-pulse shadow-lg shadow-red-500/30"
            : "bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/60 border border-blue-200 dark:border-blue-800"
        }`}
        title="Dictate symptoms using your microphone"
      >
        {isListening ? (
          <>
            <MicOff className="w-3.5 h-3.5 animate-spin" />
            <span>{t.stopListening}</span>
          </>
        ) : (
          <>
            <Mic className="w-3.5 h-3.5" />
            <span>{t.voiceInput}</span>
          </>
        )}
      </button>

      {errorMsg && (
        <span className="text-[11px] text-red-500 dark:text-red-400 flex items-center gap-1 mt-1">
          <AlertCircle className="w-3 h-3" />
          {errorMsg}
        </span>
      )}
    </div>
  );
}
