import { useCharacterStore } from '../store/characterStore';
import { ERFAHRUNGSGRADE } from '../data/erfahrungsgrade';

export default function ErfahrungsgradSelector() {
  const character = useCharacterStore(s => s.character);
  const setErfahrungsgrad = useCharacterStore(s => s.setErfahrungsgrad);

  return (
    <div className="dark-panel">
      <h3 className="section-title flex items-center gap-2">
        <span className="text-gold-400">⚔</span> Schritt 1: Erfahrungsgrad wählen
      </h3>
      <p className="text-abyss-200 text-sm mb-4">
        Der Erfahrungsgrad bestimmt, wie viele Abenteuerpunkte (AP) für die Heldenerschaffung zur Verfügung stehen
        und welche Maximalwerte für Eigenschaften, Fertigkeiten und Kampftechniken gelten.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {ERFAHRUNGSGRADE.map(eg => {
          const isActive = character.erfahrungsgradId === eg.id;
          return (
            <div
              key={eg.id}
              onClick={() => setErfahrungsgrad(eg.id)}
              className={isActive ? 'selection-card-active' : 'selection-card'}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-3 h-3 rounded-full border-2 ${isActive ? 'bg-gold-400 border-gold-400' : 'border-gold-500/50'}`} />
                <span className="font-cinzel font-bold text-gold-300">{eg.name}</span>
              </div>
              <div className="space-y-1 text-xs text-abyss-100">
                <div>AP: <span className="text-gold-400 font-semibold">{eg.ap}</span></div>
                <div>Max Eigenschaft: <span className="text-gold-400">{eg.maxProperty}</span></div>
                <div>Max Fertigkeit: <span className="text-gold-400">{eg.maxSkill}</span></div>
                <div>Max Kampftechnik: <span className="text-gold-400">{eg.maxCombatTechnique}</span></div>
                <div>Eigenschaftssumme: <span className="text-gold-400">{eg.maxPropertySum}</span></div>
                <div>Schicksalspunkte: <span className="text-gold-400">{eg.fatePoints}</span></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
