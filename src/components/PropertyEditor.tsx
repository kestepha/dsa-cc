import { useCharacterStore } from '../store/characterStore';
import { PROPERTY_KEYS, PROPERTY_NAMES, type PropertyKey } from '../types/character';
import { canIncreaseProperty, canDecreaseProperty, getPropertyCostFromBase, getPropertyIncrementCost } from '../utils/apCalculator';
import { ERFAHRUNGSGRADE } from '../data/erfahrungsgrade';

export default function PropertyEditor() {
  const character = useCharacterStore(s => s.character);
  const increaseProperty = useCharacterStore(s => s.increaseProperty);
  const decreaseProperty = useCharacterStore(s => s.decreaseProperty);
  const getSpeciesBaseProperties = useCharacterStore(s => s.getSpeciesBaseProperties);
  const getAPBreakdown = useCharacterStore(s => s.getAPBreakdown);

  const speciesBase = getSpeciesBaseProperties();
  const breakdown = getAPBreakdown();
  const eg = ERFAHRUNGSGRADE.find(e => e.id === character.erfahrungsgradId);

  if (!character.speciesChoice.speciesId) {
    return (
      <div className="dark-panel opacity-60">
        <h3 className="section-title flex items-center gap-2">
          <span className="text-gold-400">📊</span> Schritt 5: Eigenschaften verteilen
        </h3>
        <p className="text-abyss-300 text-sm italic">Bitte zuerst eine Spezies wählen, um Eigenschaften zu verteilen.</p>
      </div>
    );
  }

  return (
    <div className="dark-panel">
      <h3 className="section-title flex items-center gap-2">
        <span className="text-gold-400">📊</span> Schritt 5: Eigenschaften verteilen
      </h3>
      <p className="text-abyss-200 text-sm mb-2">
        Verteile Eigenschaftspunkte auf die acht Eigenschaften. Der Basiswert ist 8, modifiziert durch die Spezies.
        Jeder Punkt bis 14 kostet <span className="text-gold-400">15 AP</span>, darüber steigt der Preis
        (15→<span className="text-gold-400">30 AP</span>, 16→<span className="text-gold-400">45 AP</span>, etc.).
      </p>
      <p className="text-abyss-200 text-sm mb-4">
        Eigenschaftssumme: <span className={`font-bold ${breakdown.propertySum > breakdown.maxPropertySum ? 'text-red-400' : 'text-gold-400'}`}>
          {breakdown.propertySum} / {breakdown.maxPropertySum}
        </span>
        {eg && <> | Max. Wert: <span className="text-gold-400">{eg.maxProperty}</span></>}
      </p>

      <div className="space-y-3">
        {PROPERTY_KEYS.map(key => {
          const value = character.properties[key];
          const baseValue = speciesBase[key];
          const diff = value - baseValue;
          const increaseCheck = canIncreaseProperty(key, character.properties, character.erfahrungsgradId);
          const decreaseCheck = canDecreaseProperty(key, character.properties, character.speciesChoice.speciesId, character.speciesChoice.propertyChoices);
          const nextCostUp = getPropertyIncrementCost(value, value + 1);
          const nextCostDown = getPropertyIncrementCost(value, value - 1);
          const totalCost = getPropertyCostFromBase(value);
          const isAtMax = eg ? value >= eg.maxProperty : false;
          const isAtBase = value <= baseValue;

          return (
            <div key={key} className="flex items-center gap-3 p-3 rounded-lg bg-abyss-800/50 border border-gold-500/10 hover:border-gold-500/30 transition-all">
              {/* Property Name */}
              <div className="w-36 flex-shrink-0">
                <div className="font-cinzel font-bold text-gold-300 text-sm">{key}</div>
                <div className="text-xs text-abyss-300">{PROPERTY_NAMES[key]}</div>
              </div>

              {/* Species Base */}
              <div className="w-20 text-xs text-abyss-200 flex-shrink-0">
                Basis: <span className={baseValue !== 8 ? (baseValue > 8 ? 'text-green-400' : 'text-red-400') : 'text-abyss-100'}>
                  {baseValue}
                </span>
              </div>

              {/* Decrease Button */}
              <button
                onClick={() => decreaseProperty(key)}
                disabled={!decreaseCheck.allowed}
                className={`property-btn-decrease ${!decreaseCheck.allowed ? 'opacity-30 cursor-not-allowed' : ''}`}
                title={decreaseCheck.reason || `Senken (gibt ${Math.abs(nextCostDown)} AP)`}
              >
                −
              </button>

              {/* Value Display */}
              <div className={`w-12 text-center font-cinzel font-bold text-2xl ${
                isAtMax ? 'text-red-400' : diff > 0 ? 'text-gold-400' : diff < 0 ? 'text-blue-400' : 'text-abyss-100'
              }`}>
                {value}
              </div>

              {/* Increase Button */}
              <button
                onClick={() => increaseProperty(key)}
                disabled={!increaseCheck.allowed}
                className={`property-btn-increase ${!increaseCheck.allowed ? 'opacity-30 cursor-not-allowed' : ''}`}
                title={increaseCheck.reason || `Steigern (kostet ${nextCostUp} AP)`}
              >
                +
              </button>

              {/* Diff indicator */}
              <div className="w-16 text-xs flex-shrink-0">
                {diff !== 0 && (
                  <span className={diff > 0 ? 'text-green-400' : 'text-red-400'}>
                    ({diff > 0 ? '+' : ''}{diff})
                  </span>
                )}
              </div>

              {/* AP Cost */}
              <div className="w-20 text-xs flex-shrink-0">
                <span className="ap-badge">{totalCost} AP</span>
              </div>

              {/* Next cost hint */}
              <div className="text-xs text-abyss-300 flex-shrink-0">
                {increaseCheck.allowed && <span>→+1: {nextCostUp} AP</span>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Property Sum Warning */}
      {breakdown.propertySum > breakdown.maxPropertySum && (
        <div className="mt-4 p-3 rounded-lg bg-red-900/20 border border-red-500/30 text-red-300 text-sm">
          ⚠ Eigenschaftssumme überschreitet das Maximum von {breakdown.maxPropertySum}! Senke Eigenschaften, um fortzufahren.
        </div>
      )}

      {/* Cost explanation */}
      <div className="mt-4 p-3 rounded-lg bg-abyss-700/30 border border-gold-500/10 text-xs text-abyss-200">
        <span className="font-cinzel text-gold-400">Kostenberechnung:</span> Bis Wert 14 kostet jeder Punkt 15 AP.
        Ab 15 steigt der Preis: Wert 15 = 30 AP, Wert 16 = 45 AP, Wert 17 = 60 AP, usw.
        (Der Preis für Wert N &gt; 14 beträgt (N−13)×15 AP pro Punkt.)
      </div>
    </div>
  );
}
