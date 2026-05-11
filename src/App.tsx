import { useRef, useState } from 'react';
import { useCharacterStore } from './store/characterStore';
import ErfahrungsgradSelector from './components/ErfahrungsgradSelector';
import SpeciesSelector from './components/SpeciesSelector';
import CultureSelector from './components/CultureSelector';
import ProfessionSelector from './components/ProfessionSelector';
import PropertyEditor from './components/PropertyEditor';
import APCostSummary from './components/APCostSummary';
import type { Character } from './types/character';

const STEPS = [
  { title: 'Erfahrungsgrad', icon: '⚔' },
  { title: 'Spezies', icon: '🐉' },
  { title: 'Kultur', icon: '🏰' },
  { title: 'Profession', icon: '⚒' },
  { title: 'Eigenschaften', icon: '📊' },
];

function App() {
  const currentStep = useCharacterStore(s => s.currentStep);
  const setStep = useCharacterStore(s => s.setStep);
  const character = useCharacterStore(s => s.character);
  const setName = useCharacterStore(s => s.setName);
  const resetCharacter = useCharacterStore(s => s.resetCharacter);
  const loadCharacter = useCharacterStore(s => s.loadCharacter);
  const getAPBreakdown = useCharacterStore(s => s.getAPBreakdown);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);

  const breakdown = getAPBreakdown();

  const handleExport = () => {
    const data = JSON.stringify(character, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${character.name || 'held'}_dsa_character.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportError(null);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = JSON.parse(evt.target?.result as string) as Character;
        // Basic validation
        if (!data.erfahrungsgradId || !data.properties || !data.speciesChoice) {
          throw new Error('Ungültiges Character-Format');
        }
        loadCharacter(data);
        setStep(0);
      } catch (err) {
        setImportError(err instanceof Error ? err.message : 'Fehler beim Laden der Datei');
      }
    };
    reader.readAsText(file);
    // Reset input so same file can be re-imported
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="min-h-screen bg-dark-gradient">
      {/* Header */}
      <header className="bg-abyss-900/80 backdrop-blur-md border-b-2 border-gold-500/30 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-3xl animate-shimmer">⚜</div>
              <div>
                <h1 className="font-decorative text-2xl md:text-3xl text-gold-400 tracking-wider">
                  Heldenerschaffung
                </h1>
                <p className="font-lora text-xs text-abyss-200 tracking-wide">
                  Das Schwarze Auge — Charaktererschaffungstool
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={() => setShowExportModal(true)} className="fantasy-btn text-xs">
                💾 Speichern
              </button>
              <button onClick={() => fileInputRef.current?.click()} className="fantasy-btn-outline text-xs">
                📂 Laden
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
              <button onClick={resetCharacter} className="fantasy-btn-danger text-xs">
                🗑 Neu
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Name Input */}
      <div className="max-w-7xl mx-auto px-4 mt-4">
        <div className="dark-panel flex flex-col sm:flex-row items-center gap-4">
          <label className="font-cinzel text-gold-400 text-sm tracking-wide">Name des Helden:</label>
          <input
            type="text"
            value={character.name}
            onChange={e => setName(e.target.value)}
            placeholder="Trage den Namen deines Helden ein..."
            className="flex-1 bg-abyss-900/50 border border-gold-500/30 rounded px-4 py-2 text-parchment-100 font-lora placeholder-abyss-400 focus:outline-none focus:border-gold-400 focus:shadow-gold transition-all"
          />
          <div className="flex items-center gap-3">
            <span className={`font-cinzel text-sm ${breakdown.remaining < 0 ? 'text-red-400' : 'text-gold-400'}`}>
              AP: {breakdown.remaining}/{breakdown.maxAP}
            </span>
          </div>
        </div>
      </div>

      {/* Import Error */}
      {importError && (
        <div className="max-w-7xl mx-auto px-4 mt-2">
          <div className="p-3 rounded-lg bg-red-900/20 border border-red-500/30 text-red-300 text-sm">
            ⚠ Fehler beim Import: {importError}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Step Navigation */}
            <div className="flex flex-wrap gap-2 mb-6">
              {STEPS.map((step, i) => (
                <button
                  key={i}
                  onClick={() => setStep(i)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-cinzel transition-all ${
                    currentStep === i
                      ? 'bg-gold-500/20 text-gold-300 border border-gold-400 shadow-gold'
                      : i < currentStep
                      ? 'bg-abyss-700/50 text-gold-400/70 border border-gold-500/20 hover:border-gold-500/40'
                      : 'bg-abyss-800/30 text-abyss-400 border border-abyss-500/20 hover:border-gold-500/20'
                  }`}
                >
                  <span>{step.icon}</span>
                  <span className="hidden sm:inline">{step.title}</span>
                  <span className="sm:hidden">{i + 1}</span>
                </button>
              ))}
            </div>

            {/* Step Content */}
            <div>
              {currentStep === 0 && <ErfahrungsgradSelector />}
              {currentStep === 1 && <SpeciesSelector />}
              {currentStep === 2 && <CultureSelector />}
              {currentStep === 3 && <ProfessionSelector />}
              {currentStep === 4 && <PropertyEditor />}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-6">
              <button
                onClick={() => setStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
                className={`fantasy-btn-outline ${currentStep === 0 ? 'opacity-30 cursor-not-allowed' : ''}`}
              >
                ← Zurück
              </button>
              <button
                onClick={() => setStep(Math.min(STEPS.length - 1, currentStep + 1))}
                disabled={currentStep === STEPS.length - 1}
                className={`fantasy-btn ${currentStep === STEPS.length - 1 ? 'opacity-30 cursor-not-allowed' : ''}`}
              >
                Weiter →
              </button>
            </div>
          </div>

          {/* Sidebar - AP Summary */}
          <div className="w-full lg:w-80 flex-shrink-0">
            <div className="lg:sticky lg:top-24">
              <APCostSummary />
            </div>
          </div>
        </div>
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-abyss-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowExportModal(false)}>
          <div className="dark-panel max-w-lg w-full" onClick={e => e.stopPropagation()}>
            <h3 className="section-title">Charakter exportieren</h3>
            <p className="text-abyss-200 text-sm mb-4">
              Exportiere deinen Charakter als JSON-Datei, um ihn später wieder zu laden.
            </p>
            <pre className="bg-abyss-900 rounded-lg p-4 text-xs text-abyss-100 overflow-auto max-h-60 border border-abyss-600/30 mb-4">
              {JSON.stringify(character, null, 2)}
            </pre>
            <div className="flex gap-3">
              <button onClick={handleExport} className="fantasy-btn">
                ⬇ Als JSON-Datei herunterladen
              </button>
              <button onClick={() => setShowExportModal(false)} className="fantasy-btn-outline">
                Schließen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-gold-500/20 mt-8 py-4 text-center text-xs text-abyss-400">
        <p className="font-cinzel">DSA Heldenerschaffungstool — Das Schwarze Auge</p>
        <p className="font-lora mt-1">Basiert auf den Regeln des Regelwerks von Ulisses Spiele</p>
      </footer>
    </div>
  );
}

export default App;
