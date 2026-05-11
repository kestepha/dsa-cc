import { useState } from 'react';
import { useCharacterStore } from '../store/characterStore';
import { PROFESSIONS } from '../data/professions';
import type { Profession } from '../types/character';

const CATEGORY_LABELS: Record<Profession['category'], { label: string; icon: string }> = {
  kämpfer: { label: 'Kämpfer', icon: '⚔' },
  profane: { label: 'Profane', icon: '⚒' },
  zauberer: { label: 'Zauberer', icon: '✦' },
  geweihte: { label: 'Geweihte', icon: '☀' },
};

export default function ProfessionSelector() {
  const character = useCharacterStore(s => s.character);
  const setProfession = useCharacterStore(s => s.setProfession);
  const [activeCategory, setActiveCategory] = useState<Profession['category'] | 'all'>('all');

  const speciesId = character.speciesChoice.speciesId;
  const cultureId = character.cultureId;

  if (!speciesId || !cultureId) {
    return (
      <div className="dark-panel opacity-60">
        <h3 className="section-title flex items-center gap-2">
          <span className="text-gold-400">⚒</span> Schritt 4: Profession wählen
        </h3>
        <p className="text-abyss-300 text-sm italic">Bitte zuerst Spezies und Kultur wählen.</p>
      </div>
    );
  }

  // Filter professions by species/culture constraints
  const availableProfessions = PROFESSIONS.filter(p => {
    if (p.speciesConstraint && !p.speciesConstraint.includes(speciesId)) return false;
    if (p.cultureConstraint && !p.cultureConstraint.includes(cultureId)) return false;
    return true;
  });

  const filteredProfessions = activeCategory === 'all'
    ? availableProfessions
    : availableProfessions.filter(p => p.category === activeCategory);

  const categories: (Profession['category'] | 'all')[] = ['all', 'kämpfer', 'profane', 'zauberer', 'geweihte'];

  return (
    <div className="dark-panel">
      <h3 className="section-title flex items-center gap-2">
        <span className="text-gold-400">⚒</span> Schritt 4: Profession wählen
      </h3>
      <p className="text-abyss-200 text-sm mb-4">
        Die Profession bestimmt den Werdegang des Helden und kostet unterschiedlich viele AP.
        Einige Professionen sind an bestimmte Spezies oder Kulturen gebunden.
      </p>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded text-sm font-cinzel transition-all ${
              activeCategory === cat
                ? 'bg-gold-500/20 text-gold-300 border border-gold-400'
                : 'bg-abyss-700/50 text-abyss-200 border border-abyss-400/30 hover:border-gold-500/50'
            }`}
          >
            {cat === 'all' ? 'Alle' : `${CATEGORY_LABELS[cat].icon} ${CATEGORY_LABELS[cat].label}`}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {filteredProfessions.map(prof => {
          const isActive = character.professionId === prof.id;
          const catInfo = CATEGORY_LABELS[prof.category];
          return (
            <div
              key={prof.id}
              onClick={() => setProfession(prof.id)}
              className={isActive ? 'selection-card-active' : 'selection-card'}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full border-2 ${isActive ? 'bg-gold-400 border-gold-400' : 'border-gold-500/50'}`} />
                  <span className="font-cinzel font-bold text-gold-300">{prof.name}</span>
                </div>
                <span className="ap-badge">{prof.apCost} AP</span>
              </div>
              <p className="text-xs text-abyss-200 mb-2">{prof.description}</p>
              <div className="flex items-center gap-2">
                <span className="text-xs text-abyss-300">
                  {catInfo.icon} {catInfo.label}
                </span>
                {prof.speciesConstraint && (
                  <span className="text-xs text-amber-400/60 border border-amber-400/20 rounded px-1">
                    Spezies-gebunden
                  </span>
                )}
                {prof.cultureConstraint && (
                  <span className="text-xs text-amber-400/60 border border-amber-400/20 rounded px-1">
                    Kultur-gebunden
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
