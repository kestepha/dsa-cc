import { useCharacterStore } from '../store/characterStore';
import { SPECIES } from '../data/species';
import { getSpeciesChoices, getPropertyCostFromBase } from '../utils/apCalculator';
import { PROPERTY_NAMES, type PropertyKey } from '../types/character';

export default function SpeciesSelector() {
  const character = useCharacterStore(s => s.character);
  const setSpecies = useCharacterStore(s => s.setSpecies);
  const setSpeciesChoice = useCharacterStore(s => s.setSpeciesChoice);
  const getSpeciesBaseProperties = useCharacterStore(s => s.getSpeciesBaseProperties);

  const speciesId = character.speciesChoice.speciesId;
  const choices = speciesId ? getSpeciesChoices(speciesId) : [];
  const speciesBase = getSpeciesBaseProperties();

  return (
    <div className="dark-panel">
      <h3 className="section-title flex items-center gap-2">
        <span className="text-gold-400">🐉</span> Schritt 2: Spezies wählen
      </h3>
      <p className="text-abyss-200 text-sm mb-4">
        Die Spezies bestimmt Eigenschaftsänderungen, automatische Vor- und Nachteile sowie die verfügbaren Kulturen.
        Die AP-Kosten der Spezies beinhalten alle Modifikationen.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 mb-4">
        {SPECIES.map(sp => {
          const isActive = speciesId === sp.id;
          return (
            <div
              key={sp.id}
              onClick={() => setSpecies(sp.id)}
              className={isActive ? 'selection-card-active' : 'selection-card'}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full border-2 ${isActive ? 'bg-gold-400 border-gold-400' : 'border-gold-500/50'}`} />
                  <span className="font-cinzel font-bold text-gold-300">{sp.name}</span>
                </div>
                <span className="ap-badge">{sp.apCost} AP</span>
              </div>
              <p className="text-xs text-abyss-200 mb-2">{sp.description}</p>
              <div className="space-y-1 text-xs">
                <div className="text-abyss-100">
                  LE-Grundwert: <span className="text-gold-400">{sp.leGrundwert}</span> |
                  SK: <span className="text-gold-400">{sp.skGrundwert}</span> |
                  ZÄ: <span className="text-gold-400">{sp.zaGrundwert}</span> |
                  GS: <span className="text-gold-400">{sp.geGrundwert}</span>
                </div>
                <div className="text-abyss-100">
                  Eigenschaftsänderungen:
                  {sp.propertyMods.map((mod, i) => (
                    <span key={i} className="ml-1">
                      {mod.property === 'CHOICE'
                        ? `${mod.choices?.join('/')} ${mod.value > 0 ? '+' : ''}${mod.value}`
                        : `${mod.property} ${mod.value > 0 ? '+' : ''}${mod.value}`}
                      {i < sp.propertyMods.length - 1 ? ',' : ''}
                    </span>
                  ))}
                </div>
                {sp.automaticAdvantages.length > 0 && (
                  <div className="text-green-400/80">
                    Vorteile: {sp.automaticAdvantages.join(', ')}
                  </div>
                )}
                {sp.automaticDisadvantages.length > 0 && (
                  <div className="text-red-400/80">
                    Nachteile: {sp.automaticDisadvantages.join(', ')}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Species Property Choices */}
      {choices.length > 0 && (
        <div className="mt-4 p-4 bg-abyss-700/40 rounded-lg border border-gold-500/20">
          <h4 className="subsection-title">Spezies-Entscheidungen</h4>
          <p className="text-abyss-200 text-xs mb-3">
            Wähle, auf welche Eigenschaft die Modifikationen angewendet werden sollen.
          </p>
          {choices.map(choice => {
            const currentChoice = character.speciesChoice.propertyChoices[choice.choiceKey] ?? choice.options[0];
            return (
              <div key={choice.choiceKey} className="mb-3">
                <label className="block text-sm text-abyss-100 mb-1">
                  Eigenschaft {choice.value > 0 ? 'erhöhen' : 'senken'} um {choice.value > 0 ? '+' : ''}{choice.value}:
                </label>
                <div className="flex flex-wrap gap-2">
                  {choice.options.map(opt => (
                    <button
                      key={opt}
                      onClick={() => setSpeciesChoice(choice.choiceKey, opt as PropertyKey)}
                      className={`px-3 py-1.5 rounded text-sm font-cinzel transition-all ${
                        currentChoice === opt
                          ? 'bg-gold-500/30 text-gold-300 border border-gold-400'
                          : 'bg-abyss-600/50 text-abyss-200 border border-abyss-400/30 hover:border-gold-500/50'
                      }`}
                    >
                      {PROPERTY_NAMES[opt]} ({opt})
                    </button>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Show resulting base values */}
          <div className="gold-divider" />
          <div className="text-xs text-abyss-200">
            <span className="font-cinzel text-gold-400">Resultierende Basiswerte nach Spezies:</span>
            <div className="flex flex-wrap gap-3 mt-2">
              {(Object.entries(speciesBase) as [PropertyKey, number][]).map(([key, val]) => (
                <span key={key} className={`px-2 py-0.5 rounded ${val !== 8 ? (val > 8 ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400') : 'bg-abyss-600/30 text-abyss-200'}`}>
                  {key}: {val} {val !== 8 && `(${val > 8 ? '+' : ''}${val - 8})`}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
