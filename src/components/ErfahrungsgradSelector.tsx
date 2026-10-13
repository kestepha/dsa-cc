import { useCharacterStore } from '../store/characterStore';
import { ERFAHRUNGSGRADE, MAX_ADVANTAGE_AP, MAX_DISADVANTAGE_AP, MAX_UNSPENT_AP } from '../data/erfahrungsgrade';

const COLUMNS = ['AP-Konto', 'Eigenschaft', 'Fertigkeit', 'Kampftechnik', 'Eigenschafts­summe', 'Zauber / Liturgien (davon Fremdzauber)'];

export default function ErfahrungsgradSelector() {
  const erfahrungsgradId = useCharacterStore(s => s.character.erfahrungsgradId);
  const setErfahrungsgrad = useCharacterStore(s => s.setErfahrungsgrad);
  const fatePoints = ERFAHRUNGSGRADE.find(e => e.id === erfahrungsgradId)?.fatePoints;

  return (
    <div className="dark-panel">
      <h3 className="section-title flex items-center gap-2">
        <span className="text-gold-400">⚔</span> Schritt 1: Erfahrungsgrad wählen
      </h3>
      <p className="text-abyss-200 text-sm mb-4">
        Der Erfahrungsgrad legt das AP-Konto fest und begrenzt während der Heldenerschaffung die Höchstwerte von
        Eigenschaften, Fertigkeiten und Kampftechniken, die Eigenschaftssumme sowie die Zahl der Zauber und Liturgien.
        Nach der Erschaffung gelten diese Höchstwerte nicht mehr.
      </p>

      <div className="overflow-x-auto mb-4">
        <table className="w-full text-sm text-abyss-100 border-collapse">
          <thead>
            <tr className="font-cinzel text-xs text-gold-400 text-left border-b border-gold-500/30">
              <th className="p-2">Erfahrungsgrad</th>
              {COLUMNS.map(c => <th key={c} className="p-2 text-right">{c}</th>)}
            </tr>
          </thead>
          <tbody>
            {ERFAHRUNGSGRADE.map(eg => {
              const isActive = erfahrungsgradId === eg.id;
              return (
                <tr
                  key={eg.id}
                  onClick={() => setErfahrungsgrad(eg.id)}
                  className={`cursor-pointer border-b border-gold-500/10 transition-all ${isActive ? 'bg-gold-500/20' : 'hover:bg-abyss-700/50'}`}
                >
                  <td className="p-2">
                    <label className="flex items-center gap-2 cursor-pointer font-cinzel font-bold text-gold-300">
                      <input
                        type="radio"
                        name="erfahrungsgrad"
                        checked={isActive}
                        onChange={() => setErfahrungsgrad(eg.id)}
                        className="accent-gold-400"
                      />
                      {eg.name}
                    </label>
                  </td>
                  <td className="p-2 text-right text-gold-400 font-semibold">{eg.ap.toLocaleString('de-DE')}</td>
                  <td className="p-2 text-right">{eg.maxProperty}</td>
                  <td className="p-2 text-right">{eg.maxSkill}</td>
                  <td className="p-2 text-right">{eg.maxCombatTechnique}</td>
                  <td className="p-2 text-right">{eg.maxPropertySum}</td>
                  <td className="p-2 text-right">{eg.maxSpells} ({eg.maxForeignSpells})</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="p-3 rounded-lg bg-abyss-700/30 border border-gold-500/10 text-xs text-abyss-200 space-y-1">
        <div className="font-cinzel text-gold-400">Für alle Erfahrungsgrade gilt:</div>
        <div>Jeder Held startet mit <span className="text-gold-400">{fatePoints} Schicksalspunkten</span> (Vor- und Nachteile können das ändern).</div>
        <div>Höchstens <span className="text-gold-400">{MAX_ADVANTAGE_AP} AP</span> für Vorteile und höchstens <span className="text-gold-400">{MAX_DISADVANTAGE_AP} AP</span> aus Nachteilen.</div>
        <div>Das AP-Konto darf während der Erschaffung ins Minus gehen, muss am Ende aber bei 0 oder darüber liegen. Bis zu <span className="text-gold-400">{MAX_UNSPENT_AP} AP</span> dürfen übrig bleiben.</div>
      </div>
    </div>
  );
}
