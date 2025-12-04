import { SpellCheckResponse } from '../types';

// LanguageTool API Endpoint
// For production use with strict GDPR requirements, you would typically host this yourself 
// or use the premium enterprise endpoint.
const LANGUAGE_TOOL_URL = 'https://api.languagetool.org/v2/check';

export const checkSpelling = async (text: string): Promise<SpellCheckResponse> => {
  if (!text || text.trim().length < 3) {
    return { language: 'Unknown', corrections: [] };
  }

  try {
    // Prepare form data for LanguageTool API
    const params = new URLSearchParams();
    params.append('text', text);
    params.append('language', 'auto'); // Auto-detect language
    params.append('enabledOnly', 'false');

    const response = await fetch(LANGUAGE_TOOL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
      body: params,
    });

    if (!response.ok) {
      throw new Error(`LanguageTool API Error: ${response.statusText}`);
    }

    const data = await response.json();

    // Map LanguageTool response to our app's format
    const detectedLanguage = data.language?.name || 'Detected';
    
    const corrections = data.matches.map((match: any) => {
      // Extract the original text using offset and length
      const originalText = text.substring(match.offset, match.offset + match.length);
      
      return {
        original: originalText,
        suggestion: match.replacements && match.replacements.length > 0 
          ? match.replacements[0].value 
          : '',
        reason: match.message || match.rule?.description || 'Fehler',
      };
    }).filter((c: any) => c.suggestion !== ''); // Filter out items with no suggestions

    return {
      language: detectedLanguage,
      corrections: corrections
    };

  } catch (error) {
    console.error("Spell Check Error:", error);
    // Return empty result on error to not block UI
    return { language: 'Error', corrections: [] };
  }
};