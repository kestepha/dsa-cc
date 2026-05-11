import type { CharacterProperties, PropertyKey, APCostBreakdown, PropertyMod } from '../types/character';
import { PROPERTY_KEYS } from '../types/character';
import { ERFAHRUNGSGRADE } from '../data/erfahrungsgrade';
import { SPECIES } from '../data/species';
import { CULTURES } from '../data/cultures';
import { PROFESSIONS } from '../data/professions';

const BASE_PROPERTY_VALUE = 8;

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
 * Get the incremental cost to go from currentVal to nextVal (nextVal = currentVal + 1 or currentVal - 1)
 */
export function getPropertyIncrementCost(currentVal: number, nextVal: number): number {
  return getPropertyCostFromBase(nextVal) - getPropertyCostFromBase(currentVal);
}

/**
 * Calculate the total AP cost for all properties from base 8.
 */
export function calculatePropertyAP(properties: CharacterProperties): number {
  let total = 0;
  for (const key of PROPERTY_KEYS) {
    total += getPropertyCostFromBase(properties[key]);
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
 * Apply species property modifications to the base properties.
 * Returns the modified properties and tracks which choices need to be made.
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
      const choiceKey = `${speciesId}_${mod.value > 0 ? 'pos' : 'neg'}_${mod.choices.sort().join('_')}`;
      const chosenProp = propertyChoices[choiceKey];
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
      const choiceKey = `${speciesId}_${mod.value > 0 ? 'pos' : 'neg'}_${mod.choices.sort().join('_')}`;
      choices.push({ choiceKey, options: mod.choices as PropertyKey[], value: mod.value });
    }
  }
  return choices;
}

/**
 * Calculate the full AP cost breakdown for a character.
 */
export function calculateAPBreakdown(
  erfahrungsgradId: string,
  speciesId: string,
  cultureId: string,
  professionId: string,
  properties: CharacterProperties,
): APCostBreakdown {
  const eg = ERFAHRUNGSGRADE.find(e => e.id === erfahrungsgradId);
  const species = SPECIES.find(s => s.id === speciesId);
  const culture = CULTURES.find(c => c.id === cultureId);
  const profession = PROFESSIONS.find(p => p.id === professionId);

  const speciesAP = species?.apCost ?? 0;
  const propertyAP = calculatePropertyAP(properties);
  const cultureAP = culture?.apCost ?? 0;
  const professionAP = profession?.apCost ?? 0;
  const total = speciesAP + propertyAP + cultureAP + professionAP;
  const maxAP = eg?.ap ?? 1100;
  const propertySum = calculatePropertySum(properties);
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
  properties: CharacterProperties,
  erfahrungsgradId: string,
): { allowed: boolean; reason?: string } {
  const eg = ERFAHRUNGSGRADE.find(e => e.id === erfahrungsgradId);
  if (!eg) return { allowed: false, reason: 'Ungültiger Erfahrungsgrad' };

  const currentValue = properties[prop];
  const maxProp = eg.maxProperty;

  // Check max value (species mods can push above this, but player can't increase beyond it)
  if (currentValue >= maxProp) {
    return { allowed: false, reason: `Maximalwert von ${maxProp} für EG ${eg.name} erreicht` };
  }

  // Check property sum
  const currentSum = calculatePropertySum(properties);
  if (currentSum >= eg.maxPropertySum) {
    return { allowed: false, reason: `Eigenschaftssumme von ${eg.maxPropertySum} erreicht` };
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
  const currentValue = properties[prop];
  const baseValue = speciesBase[prop];

  if (currentValue <= baseValue) {
    return { allowed: false, reason: 'Bereits auf Spezies-Basiswert' };
  }

  if (currentValue <= 1) {
    return { allowed: false, reason: 'Wert kann nicht unter 1 sinken' };
  }

  return { allowed: true };
}
