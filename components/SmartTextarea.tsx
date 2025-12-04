import React, { useState, useEffect, useRef, useCallback } from 'react';
import { checkSpelling } from '../services/geminiService';
import { SpellCheckResponse, SpellCheckCorrection } from '../types';
import { Loader2, Check, Wand2, AlertCircle } from 'lucide-react';

interface SmartTextareaProps {
  value: string;
  onChange: (value: string) => void;
}

export const SmartTextarea: React.FC<SmartTextareaProps> = ({ value, onChange }) => {
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<SpellCheckResponse | null>(null);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastCheckedTextRef = useRef<string>('');

  // Function to perform the API call
  const performCheck = useCallback(async (textToCheck: string) => {
    if (!textToCheck.trim()) {
      setResult(null);
      return;
    }
    
    // Avoid re-checking same text
    if (textToCheck === lastCheckedTextRef.current) return;

    setIsChecking(true);
    try {
      const data = await checkSpelling(textToCheck);
      setResult(data);
      lastCheckedTextRef.current = textToCheck;
    } catch (error) {
      console.error("Failed to check spelling", error);
    } finally {
      setIsChecking(false);
    }
  }, []);

  // Debounce logic
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Reset result if user clears text
    if (!value) {
      setResult(null);
      return;
    }

    // Wait 1.5s after typing stops to avoid too many API calls
    debounceTimerRef.current = setTimeout(() => {
      performCheck(value);
    }, 1500);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [value, performCheck]);

  // Apply a correction
  const applyCorrection = (original: string, suggestion: string) => {
    // Simple replace - in a production app use indices for better accuracy
    const newValue = value.replace(original, suggestion);
    onChange(newValue);
    
    // Optimistically update local result to remove the fixed item
    if (result) {
      setResult({
        ...result,
        corrections: result.corrections.filter(c => c.original !== original)
      });
    }
  };

  // Render text with interactive highlights
  const renderHighlightedText = () => {
    if (!result || result.corrections.length === 0) return null;

    let parts: React.ReactNode[] = [];
    let lastIndex = 0;
    
    // We need to match the corrections to the current text.
    // Note: This is a simplified matching strategy. 
    // It finds the first occurrence of the 'original' word after the last processed index.
    
    // Sort corrections by position would be ideal, but Gemini returns a list without indices often.
    // We will iterate through the text and find matches.
    
    // For this demo, we will use a simpler approach: 
    // We construct the preview by splitting the text, but since we can't easily rely on split with duplicates,
    // we iterate over corrections and find them in the text.
    
    // Robust Approach for Demo:
    // Just display the list of suggestions below. The "Inline Highlighting" can be simulated 
    // by rendering the text in a div and using regex to wrap known bad words.
    
    const text = value;
    const errors = result.corrections;
    
    // Create a map for fast lookup
    const errorMap = new Map<string, SpellCheckCorrection>();
    errors.forEach(e => errorMap.set(e.original, e));

    // Regex to split by word boundaries but keep delimiters to reconstruct text
    // This is a naive tokenizer
    const tokens = text.split(/(\b|\s+|[.,;!?])/);

    return (
      <div className="p-4 bg-white border border-slate-200 rounded-md shadow-sm mt-2 text-sm leading-relaxed text-slate-800">
        <div className="flex justify-between items-center mb-2 border-b border-slate-100 pb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                {result.language} Detected <Wand2 className="w-3 h-3" />
            </span>
            <span className="text-xs text-slate-400">
                Klicken Sie auf rot markierte Wörter, um sie zu korrigieren.
            </span>
        </div>
        <div>
        {tokens.map((token, index) => {
          const correction = errorMap.get(token);
          if (correction) {
            return (
              <span key={index} className="relative group inline-block">
                <span className="cursor-pointer text-slate-900 decoration-red-500 underline decoration-wavy decoration-2 bg-red-50/50 rounded px-0.5">
                  {token}
                </span>
                
                {/* Tooltip */}
                <div className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 hidden group-hover:block">
                  <div className="bg-slate-800 text-white text-xs rounded py-2 px-3 shadow-xl">
                    <p className="font-semibold text-red-300 line-through mb-1">{correction.original}</p>
                    <p className="font-bold text-green-300 mb-1">{correction.suggestion}</p>
                    <p className="text-slate-400 italic mb-2">{correction.reason}</p>
                    <button 
                      onClick={() => applyCorrection(correction.original, correction.suggestion)}
                      className="w-full bg-slate-700 hover:bg-slate-600 text-white py-1 px-2 rounded transition-colors"
                    >
                      Übernehmen
                    </button>
                    {/* Tooltip arrow */}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
                  </div>
                </div>
              </span>
            );
          }
          return <span key={index}>{token}</span>;
        })}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="relative">
        <textarea
          id="description"
          rows={5}
          className="block w-full rounded-md border-0 py-2.5 px-3 text-slate-900 bg-white shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 transition-all"
          placeholder="Detaillierte Beschreibung der Tätigkeit..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <div className="absolute bottom-3 right-3 flex items-center gap-2 pointer-events-none">
          {isChecking && (
             <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur px-2 py-1 rounded-full shadow-sm border border-slate-100">
                <Loader2 className="h-3 w-3 animate-spin text-blue-600" />
                <span className="text-xs text-blue-600 font-medium">Prüfe...</span>
             </div>
          )}
          {!isChecking && result && result.corrections.length === 0 && value.length > 5 && (
              <div className="flex items-center gap-1.5 bg-green-50/90 backdrop-blur px-2 py-1 rounded-full shadow-sm border border-green-100">
                <Check className="h-3 w-3 text-green-600" />
                <span className="text-xs text-green-600 font-medium">Alles korrekt</span>
              </div>
          )}
          {!isChecking && result && result.corrections.length > 0 && (
              <div className="flex items-center gap-1.5 bg-red-50/90 backdrop-blur px-2 py-1 rounded-full shadow-sm border border-red-100">
                <AlertCircle className="h-3 w-3 text-red-600" />
                <span className="text-xs text-red-600 font-medium">{result.corrections.length} Fehler</span>
              </div>
          )}
        </div>
      </div>

      {/* Render the spell check result below the textarea if there are errors */}
      {renderHighlightedText()}
    </div>
  );
};