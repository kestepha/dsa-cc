import type { Erfahrungsgrad } from '../types/character';

// Quelle: https://dsa.ulisses-regelwiki.de/Heldenerschaffung/schritt-2-erfahrungsgrad-waehlen.html
// Die Höchstwerte gelten nur während der Heldenerschaffung.
export const ERFAHRUNGSGRADE: Erfahrungsgrad[] = [
  { id: 'unerfahren', name: 'Unerfahren', ap: 900, maxProperty: 12, maxSkill: 10, maxCombatTechnique: 8, maxPropertySum: 95, maxSpells: 8, maxForeignSpells: 0, fatePoints: 3 },
  { id: 'durchschnittlich', name: 'Durchschnittlich', ap: 1000, maxProperty: 13, maxSkill: 10, maxCombatTechnique: 10, maxPropertySum: 98, maxSpells: 10, maxForeignSpells: 1, fatePoints: 3 },
  { id: 'erfahren', name: 'Erfahren', ap: 1100, maxProperty: 14, maxSkill: 10, maxCombatTechnique: 12, maxPropertySum: 100, maxSpells: 12, maxForeignSpells: 2, fatePoints: 3 },
  { id: 'kompetent', name: 'Kompetent', ap: 1200, maxProperty: 15, maxSkill: 13, maxCombatTechnique: 14, maxPropertySum: 102, maxSpells: 14, maxForeignSpells: 3, fatePoints: 3 },
  { id: 'meisterlich', name: 'Meisterlich', ap: 1400, maxProperty: 16, maxSkill: 16, maxCombatTechnique: 16, maxPropertySum: 105, maxSpells: 16, maxForeignSpells: 4, fatePoints: 3 },
  { id: 'brillant', name: 'Brillant', ap: 1700, maxProperty: 17, maxSkill: 19, maxCombatTechnique: 18, maxPropertySum: 109, maxSpells: 18, maxForeignSpells: 5, fatePoints: 3 },
  { id: 'legendär', name: 'Legendär', ap: 2100, maxProperty: 18, maxSkill: 20, maxCombatTechnique: 20, maxPropertySum: 114, maxSpells: 20, maxForeignSpells: 6, fatePoints: 3 },
];

export const DEFAULT_ERFAHRUNGSGRAD = 'erfahren';

// Für alle Erfahrungsgrade gleich
export const MAX_ADVANTAGE_AP = 80;
export const MAX_DISADVANTAGE_AP = 80;
export const MAX_UNSPENT_AP = 10;
