import { useCharacterStore } from '../store/characterStore';
import { getPropertyCostFromBase } from '../utils/apCalculator';
import { PROPERTY_KEYS, PROPERTY_NAMES } from '../types/character';
import { ERFAHRUNGSGRADE } from '../data/erfahrungsgrade';

export default function APCostSummary() {
  const character = useCharacterStore(s => s.character);
  const getAPBreakdown = useCharacterStore(s => s.getAPBreakdown);
  const getSpeciesBaseProperties = useCharacterStore(s => s.getSpeciesBaseProperties);
  const breakdown = getAPBreakdown();
  const speciesBase = getSpeciesBaseProperties();
  const eg = ERFAHRUNGSGRADE.find(e => e.id === character.erfahrungsgradId);

  const isOverBudget = breakdown.remaining < 0;
  const isPropertySumOver = breakdown.propertySum > breakdown.maxPropertySum;

  return (
    <div className="dark-panel">
      <h3 className="section-title flex items-center gap-2">
        <span className="text-gold-400">⚜</span> Abenteuerpunkte-Bilanz
      </h3>

      {/* AP Budget Bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <span className="font-cinzel text-sm text-gold-400">AP-Konto</span>
          <span className={`font-cinzel text-lg font-bold ${isOverBudget ? 'text-red-400' : 'text-green-400'}`}>
            {breakdown.remaining} / {breakdown.maxAP} AP
          </span>
        </div>
        <div className="w-full bg-abyss-900 rounded-full h-4 border border-gold-500/30 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isOverBudget
                ? 'bg-gradient-to-r from-red-700 to-red-500'
                : 'bg-gradient-to-r from-gold-700 to-gold-400'
            }`}
            style={{ width: `${Math.min(100, Math.max(0, (breakdown.total / breakdown.maxAP) * 100))}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-abyss-200 mt-1">
          <span>{breakdown.total} AP verbraucht</span>
          <span>{breakdown.maxAP} AP verfügbar</span>
        </div>
      </div>

      {/* Property Sum Bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <span className="font-cinzel text-sm text-gold-400">Eigenschaftssumme</span>
          <span className={`font-cinzel text-lg font-bold ${isPropertySumOver ? 'text-red-400' : 'text-green-400'}`}>
            {breakdown.propertySum} / {breakdown.maxPropertySum}
          </span>
        </div>
        <div className="w-full bg-abyss-900 rounded-full h-3 border border-gold-500/30 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isPropertySumOver
                ? 'bg-gradient-to-r from-red-700 to-red-500'
                : 'bg-gradient-to-r from-forest-600 to-forest-500'
            }`}
            style={{ width: `${Math.min(100, (breakdown.propertySum / breakdown.maxPropertySum) * 100)}%` }}
          />
        </div>
      </div>

      <div className="gold-divider" />

      {/* Cost Breakdown */}
      <div className="space-y-2 text-sm">
        <CostLine label="Spezies" cost={breakdown.species} />
        <CostLine label="Kultur" cost={breakdown.culture} />
        <CostLine label="Profession" cost={breakdown.profession} />

        <div className="gold-divider" />

        {/* Property costs detail */}
        <div className="font-cinzel text-sm text-gold-400 mb-1">Eigenschaftskosten</div>
        {PROPERTY_KEYS.map(key => {
          const baseVal = speciesBase[key];
          const finalVal = character.properties[key];
          const cost = getPropertyCostFromBase(finalVal);
          const diff = finalVal - baseVal;
          return (
            <div key={key} className="flex justify-between items-center pl-2">
              <span className="text-abyss-100">
                {PROPERTY_NAMES[key]} ({key})
                {diff !== 0 && (
                  <span className={`ml-1 text-xs ${diff > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    ({diff > 0 ? '+' : ''}{diff} von Basis {baseVal})
                  </span>
                )}
              </span>
              <span className="ap-badge">{cost} AP</span>
            </div>
          );
        })}

        <div className="gold-divider" />

        <div className="flex justify-between items-center font-cinzel font-bold text-base">
          <span className="text-gold-400">Gesamt</span>
          <span className={isOverBudget ? 'ap-badge-danger' : 'ap-badge-success'}>
            {breakdown.total} AP
          </span>
        </div>
      </div>

      {/* Experience Level Info */}
      {eg && (
        <>
          <div className="gold-divider" />
          <div className="text-xs text-abyss-200 space-y-1">
            <div>Erfahrungsgrad: <span className="text-gold-400">{eg.name}</span></div>
            <div>Max. Eigenschaft: <span className="text-gold-400">{eg.maxProperty}</span></div>
            <div>Max. Fertigkeit: <span className="text-gold-400">{eg.maxSkill}</span></div>
            <div>Max. Kampftechnik: <span className="text-gold-400">{eg.maxCombatTechnique}</span></div>
            <div>Schicksalspunkte: <span className="text-gold-400">{eg.fatePoints}</span></div>
          </div>
        </>
      )}
    </div>
  );
}

function CostLine({ label, cost }: { label: string; cost: number }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-abyss-100">{label}</span>
      <span className="ap-badge">{cost} AP</span>
    </div>
  );
}
