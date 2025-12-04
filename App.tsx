import React, { useState, useEffect } from 'react';
import { SmartTextarea } from './components/SmartTextarea';
import { SERVICE_TYPES } from './constants';
import { Scale, FileText, Clock, Save, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function App() {
  const [fileId, setFileId] = useState('');
  const [hours, setHours] = useState('');
  const [description, setDescription] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  // Load state from URL on mount (functionality kept for incoming links, even if button is removed)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('fileId')) setFileId(params.get('fileId') || '');
    if (params.get('hours')) setHours(params.get('hours') || '');
    if (params.get('service')) setSelectedService(params.get('service') || '');
    if (params.get('description')) setDescription(params.get('description') || '');
  }, []);

  const handleServiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedLabel = e.target.value;
    setSelectedService(selectedLabel);
    
    const service = SERVICE_TYPES.find(s => s.label === selectedLabel);
    if (service) {
      setDescription(service.description);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API save
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
    console.log({ fileId, hours, description });
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        
        {/* Header */}
        <div className="mb-10 text-center relative">
          <div className="flex justify-center mb-4">
            <div className="h-14 w-14 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
              <Scale className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Leistungserfassung
          </h1>
          <p className="mt-2 text-lg text-slate-600">
            Effiziente Zeiterfassung für anwaltliche Tätigkeiten.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 overflow-hidden border border-slate-100 relative">
          
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              
              <div className="grid grid-cols-1 gap-y-6 gap-x-6 sm:grid-cols-2">
                
                {/* File ID */}
                <div className="sm:col-span-1">
                  <label htmlFor="file-id" className="block text-sm font-medium leading-6 text-slate-900">
                    Aktenzeichen / Mandats-ID
                  </label>
                  <div className="relative mt-2 rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <span className="text-slate-500 sm:text-sm">#</span>
                    </div>
                    <input
                      type="text"
                      name="file-id"
                      id="file-id"
                      className="block w-full rounded-md border-0 py-2.5 pl-7 text-slate-900 bg-white ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                      placeholder="M-2024-001"
                      value={fileId}
                      onChange={(e) => setFileId(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Hours */}
                <div className="sm:col-span-1">
                  <label htmlFor="hours" className="block text-sm font-medium leading-6 text-slate-900">
                    Dauer (Stunden)
                  </label>
                  <div className="relative mt-2 rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Clock className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                      type="number"
                      name="hours"
                      id="hours"
                      step="0.1"
                      className="block w-full rounded-md border-0 py-2.5 pl-10 text-slate-900 bg-white ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                      placeholder="0.0"
                      value={hours}
                      onChange={(e) => setHours(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Service Type Dropdown */}
                <div className="sm:col-span-2">
                  <label htmlFor="service-type" className="block text-sm font-medium leading-6 text-slate-900">
                    Leistungstyp (Vorlage)
                  </label>
                  <div className="relative mt-2">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <FileText className="h-4 w-4 text-slate-400" />
                    </div>
                    <select
                      id="service-type"
                      name="service-type"
                      className="block w-full rounded-md border-0 py-2.5 pl-10 pr-10 text-slate-900 bg-white ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 appearance-none"
                      value={selectedService}
                      onChange={handleServiceChange}
                    >
                      <option value="">Bitte wählen Sie einen Typ...</option>
                      {SERVICE_TYPES.map((type) => (
                        <option key={type.label} value={type.label}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                        <svg className="h-5 w-5 text-slate-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                        </svg>
                    </div>
                  </div>
                </div>

                {/* Description (Smart Textarea) */}
                <div className="sm:col-span-2">
                  <label htmlFor="description" className="block text-sm font-medium leading-6 text-slate-900 mb-2">
                    Leistungsbeschreibung
                    <span className="ml-2 inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                      <ShieldCheck className="w-3 h-3 mr-1" />
                      DSGVO-konform
                    </span>
                  </label>
                  <SmartTextarea 
                    value={description} 
                    onChange={setDescription} 
                  />
                  <p className="mt-2 text-sm text-slate-500">
                    Geben Sie Ihre Beschreibung auf Deutsch oder Englisch ein. Das System prüft die Rechtschreibung automatisch (LanguageTool).
                  </p>
                </div>

              </div>

              {/* Submit Button */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                {isSaved ? (
                  <div className="flex items-center text-green-600 font-medium animate-pulse">
                    <CheckCircle2 className="h-5 w-5 mr-2" />
                    Leistung erfolgreich gespeichert!
                  </div>
                ) : (
                  <div></div>
                )}
                
                <button
                  type="submit"
                  className="flex items-center justify-center rounded-md bg-blue-600 px-8 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Leistung erstellen
                </button>
              </div>

            </form>
          </div>
        </div>
        
        {/* Footer info */}
        <div className="mt-8 text-center text-xs text-slate-400">
            Powered by LanguageTool • DSGVO-konforme Rechtschreibprüfung
        </div>

      </div>
    </div>
  );
}