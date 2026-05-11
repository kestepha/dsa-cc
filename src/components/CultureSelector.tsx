import { useCharacterStore } from '../store/characterStore';
import { CULTURES } from '../data/cultures';
import { SPECIES } from '../data/species';

export default function CultureSelector() {
  const character = useCharacterStore(s => s.character);
  const setCultura = useCharacterStore(s => s.setCultura);

  const speciesId = character.speciesChoice.speciesId;
  const species = SPECIES.find(s => s.id === speciesId);

  // Filter cultures by species
  const availableCultures = speciesId
    ? CULTURES.filter(c => c.speciesIds.includes(speciesId))
    : [];

  if (!speciesId) {
    return (
      <div className="dark-panel opacity-60">
        <h3 className="section-title flex items-center gap-2">
          <span className="text-gold-400">🏰</span> Schritt 3: Kultur wählen
        </h3>
        <p className="text-abyss-300 text-sm italic">Bitte zuerst eine Spezies wählen.</p>
      </div>
    );
  }

  return (
    <div className="dark-panel">
      <h3 className="section-title flex items-center gap-2">
        <span className="text-gold-400">🏰</span> Schritt 3: Kultur wählen
      </h3>
      <p className="text-abyss-200 text-sm mb-4">
        Die Kultur bestimmt die gesellschaftliche Herkunft des Helden. Übliche Kulturen für <span className="text-gold-400">{species?.name}</span> werden angezeigt.
        Jede Kultur kostet <span className="text-gold-400">25 AP</span>.
      </p>

      {availableCultures.length === 0 ? (
        <p className="text-abyss-300 text-sm italic">Keine Kulturen für diese Spezies verfügbar.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {availableCultures.map(culture => {
            const isActive = character.cultureId === culture.id;
            const isUsual = species?.usualCultures.includes(culture.id);
            return (
              <div
                key={culture.id}
                onClick={() => setCultura(culture.id)}
                className={isActive ? 'selection-card-active' : 'selection-card'}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full border-2 ${isActive ? 'bg-gold-400 border-gold-400' : 'border-gold-500/50'}`} />
                    <span className="font-cinzel font-bold text-gold-300">{culture.name}</span>
                  </div>
                  <span className="ap-badge">{culture.apCost} AP</span>
                </div>
                <p className="text-xs text-abyss-200 mb-1">{culture.description}</p>
                {isUsual && (
                  <span className="inline-block text-xs text-green-400/70 border border-green-400/20 rounded px-1.5 py-0.5 mt-1">
                    Übliche Kultur
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
