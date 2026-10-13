import type { Character, CharacterProperties, PropertyKey, APCostBreakdown, PropertyMod } from '../types/character';
import { PROPERTY_KEYS } from '../types/character';
import { ERFAHRUNGSGRADE } from '../data/erfahrungsgrade';
import { SPECIES } from '../data/species';
import { CULTURES } from '../data/cultures';
import { PROFESSIONS } from '../data/professions';

export const BASE_PROPERTY_VALUE = 8;
export const START_PROPERTY_POINTS = BASE_PROPERTY_VALUE * PROPERTY_KEYS.length; // 64, kostenlos

/**
 * Cost to increase a single property from base (8) to a target value.
 * Up to 14: 15 AP per point
 * 15: 30 AP, 16: 45 AP, 17: 60 AP, etc.
 * Formula for value > 14: incremental cost = (value - 13) * 15
 */
export function getPropertyCostFromBase(targetValue: number): number {
  if (targetValue <= BASE_PROPERTY_VALUE) return 0;
  if (targetValue <= 14) {
    return (targetValue - BASE_PROPERTY_VALUE) * 15;
  }
  // Cost up to 14
  let cost = (14 - BASE_PROPERTY_VALUE) * 15; // = 90
  // Cost from 15 to targetValue
  for (let v = 15; v <= targetValue; v++) {
    cost += (v - 13) * 15;
  }
  return cost;
}

/**
 * AP cost of a property value. Only bought points cost AP: species mods are free,
 * so the price is taken for the value without the species modifier.
 */
export function getPropertyCost(value: number, speciesBaseValue: number): number {
  return getPropertyCostFromBase(BASE_PROPERTY_VALUE + value - speciesBaseValue);
}

/**
 * Calculate the total AP cost for all properties.
 */
export function calculatePropertyAP(properties: CharacterProperties, speciesBase: CharacterProperties): number {
  let total = 0;
  for (const key of PROPERTY_KEYS) {
    total += getPropertyCost(properties[key], speciesBase[key]);
  }
  return total;
}

/**
 * Calculate the sum of all property values.
 */
export function calculatePropertySum(properties: CharacterProperties): number {
  let sum = 0;
  for (const key of PROPERTY_KEYS) {
    sum += properties[key];
  }
  return sum;
}

/**
 * Key under which the player's pick for a CHOICE mod is stored in speciesChoice.propertyChoices.
 */
export function getChoiceKey(speciesId: string, mod: PropertyMod): string {
  return `${speciesId}_${mod.value > 0 ? 'pos' : 'neg'}_${[...(mod.choices ?? [])].sort().join('_')}`;
}

/**
 * Apply species property modifications to the base properties.
 */
export function applySpeciesMods(
  speciesId: string,
  propertyChoices: Record<string, PropertyKey>
): CharacterProperties {
  const props: CharacterProperties = {
    MU: BASE_PROPERTY_VALUE,
    KL: BASE_PROPERTY_VALUE,
    IN: BASE_PROPERTY_VALUE,
    CH: BASE_PROPERTY_VALUE,
    FF: BASE_PROPERTY_VALUE,
    GE: BASE_PROPERTY_VALUE,
    KO: BASE_PROPERTY_VALUE,
    KK: BASE_PROPERTY_VALUE,
  };

  const species = SPECIES.find(s => s.id === speciesId);
  if (!species) return props;

  for (const mod of species.propertyMods) {
    if (mod.property === 'CHOICE' && mod.choices) {
      const chosenProp = propertyChoices[getChoiceKey(speciesId, mod)];
      if (chosenProp) {
        props[chosenProp] += mod.value;
      }
    } else if (mod.property !== 'CHOICE') {
      props[mod.property as PropertyKey] += mod.value;
    }
  }

  return props;
}

/**
 * Get the species property mod choices that need to be made.
 */
export function getSpeciesChoices(speciesId: string): { choiceKey: string; options: PropertyKey[]; value: number }[] {
  const species = SPECIES.find(s => s.id === speciesId);
  if (!species) return [];

  const choices: { choiceKey: string; options: PropertyKey[]; value: number }[] = [];
  for (const mod of species.propertyMods) {
    if (mod.property === 'CHOICE' && mod.choices) {
      choices.push({ choiceKey: getChoiceKey(speciesId, mod), options: mod.choices, value: mod.value });
    }
  }
  return choices;
}

/**
 * Calculate the full AP cost breakdown for a character.
 */
export function calculateAPBreakdown(character: Character): APCostBreakdown {
  const { speciesId, propertyChoices } = character.speciesChoice;
  const eg = ERFAHRUNGSGRADE.find(e => e.id === character.erfahrungsgradId);
  const species = SPECIES.find(s => s.id === speciesId);
  const culture = CULTURES.find(c => c.id === character.cultureId);
  const profession = PROFESSIONS.find(p => p.id === character.professionId);

  const speciesAP = species?.apCost ?? 0;
  const propertyAP = calculatePropertyAP(character.properties, applySpeciesMods(speciesId, propertyChoices));
  const cultureAP = culture?.apCost ?? 0;
  const professionAP = profession?.apCost ?? 0;
  const total = speciesAP + propertyAP + cultureAP + professionAP;
  const maxAP = eg?.ap ?? 1100;
  const propertySum = calculatePropertySum(character.properties);
  const maxPropertySum = eg?.maxPropertySum ?? 100;

  return {
    species: speciesAP,
    properties: propertyAP,
    culture: cultureAP,
    profession: professionAP,
    total,
    maxAP,
    remaining: maxAP - total,
    propertySum,
    maxPropertySum,
  };
}

/**
 * Check if a property can be increased given the current state.
 */
export function canIncreaseProperty(
  prop: PropertyKey,
  character: Character,
): { allowed: boolean; reason?: string } {
  const eg = ERFAHRUNGSGRADE.find(e => e.id === character.erfahrungsgradId);
  if (!eg) return { allowed: false, reason: 'Ungültiger Erfahrungsgrad' };

  const currentValue = character.properties[prop];
  const maxProp = eg.maxProperty;

  // Check max value (species mods can push above this, but player can't increase beyond it)
  if (currentValue >= maxProp) {
    return { allowed: false, reason: `Maximalwert von ${maxProp} für EG ${eg.name} erreicht` };
  }

  // Check property sum
  const currentSum = calculatePropertySum(character.properties);
  if (currentSum >= eg.maxPropertySum) {
    return { allowed: false, reason: `Eigenschaftssumme von ${eg.maxPropertySum} erreicht` };
  }

  const after = calculateAPBreakdown({ ...character, properties: { ...character.properties, [prop]: currentValue + 1 } });
  if (after.remaining < 0) {
    return { allowed: false, reason: 'Nicht genügend AP' };
  }

  return { allowed: true };
}

/**
 * Check if a property can be decreased.
 */
export function canDecreaseProperty(
  prop: PropertyKey,
  properties: CharacterProperties,
  speciesId: string,
  propertyChoices: Record<string, PropertyKey>,
): { allowed: boolean; reason?: string } {
  const speciesBase = applySpeciesMods(speciesId, propertyChoices);
  if (properties[prop] <= speciesBase[prop]) {
    return { allowed: false, reason: 'Bereits auf Spezies-Basiswert' };
  }

  return { allowed: true };
}

/**
 * Check an imported file before it replaces the character. Each property must be at least
 * its species base and at most the EG maximum (plus a positive species mod, which may exceed it).
 */
export function isValidCharacter(data: unknown): data is Character {
  if (typeof data !== 'object' || data === null) return false;
  const c = data as Character;
  const eg = ERFAHRUNGSGRADE.find(e => e.id === c.erfahrungsgradId);
  const choice = c.speciesChoice;
  if (!eg || typeof c.name !== 'string' || typeof c.cultureId !== 'string' || typeof c.professionId !== 'string') return false;
  if (typeof choice !== 'object' || choice === null || typeof choice.propertyChoices !== 'object' || choice.propertyChoices === null) return false;
  if (choice.speciesId !== '' && !SPECIES.some(s => s.id === choice.speciesId)) return false;
  if (!Object.values(choice.propertyChoices).every(p => (PROPERTY_KEYS as readonly unknown[]).includes(p))) return false;
  if (typeof c.properties !== 'object' || c.properties === null) return false;

  const base = applySpeciesMods(choice.speciesId, choice.propertyChoices);
  return PROPERTY_KEYS.every(k => {
    const v = c.properties[k];
    return Number.isInteger(v) && v >= base[k] && v <= eg.maxProperty + Math.max(0, base[k] - BASE_PROPERTY_VALUE);
  });
}
