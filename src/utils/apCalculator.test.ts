import { beforeEach, describe, expect, it } from 'vitest';
import { calculateAPBreakdown, canIncreaseProperty, getPropertyCostFromBase, getSpeciesChoices, isValidCharacter } from './apCalculator';
import { useCharacterStore } from '../store/characterStore';
import { SPECIES } from '../data/species';
import type { Character } from '../types/character';

const store = () => useCharacterStore.getState();

describe('Eigenschaftskosten', () => {
  it('follows the cost curve: 15 AP per point up to 14, then 30, 45, ...', () => {
    expect(getPropertyCostFromBase(8)).toBe(0);
    expect(getPropertyCostFromBase(14)).toBe(90);
    expect(getPropertyCostFromBase(15)).toBe(120);
    expect(getPropertyCostFromBase(16)).toBe(165);
  });
});

describe('store', () => {
  beforeEach(() => store().resetCharacter());

  it('charges bought points but not species mods', () => {
    store().setSpecies('elf'); // KL -2 pre-selected
    expect(store().character.properties.KL).toBe(6);
    expect(store().getAPBreakdown().properties).toBe(0);
    store().increaseProperty('KL');
    store().increaseProperty('KL');
    expect(store().getAPBreakdown().properties).toBe(30);
  });

  it('keeps bought points when re-selecting or moving a species choice', () => {
    store().setSpecies('elf');
    store().setCultura('auelfen');
    store().increaseProperty('MU');
    const { choiceKey } = getSpeciesChoices('elf')[0];

    store().setErfahrungsgrad(store().character.erfahrungsgradId);
    store().setSpecies('elf');
    store().setSpeciesChoice(choiceKey, 'KK');
    expect(store().character.properties).toMatchObject({ MU: 9, KL: 8, KK: 6 });
    expect(store().character.cultureId).toBe('auelfen');
  });

  it('blocks increases the AP budget cannot pay for', () => {
    const c: Character = {
      ...store().character,
      erfahrungsgradId: 'unerfahren', // 900 AP
      cultureId: 'andergaster', // 25
      professionId: 'kriegerin', // 420
      properties: { MU: 12, KL: 12, IN: 12, CH: 12, FF: 12, GE: 12, KO: 9, KK: 8 }, // 6 x 60 + 15
    };
    expect(calculateAPBreakdown(c).remaining).toBe(80);
    expect(canIncreaseProperty('KK', { ...c, professionId: 'gildenmagier' })).toEqual({ allowed: false, reason: 'Nicht genügend AP' });
  });
});

it('does not reorder the species data', () => {
  const before = JSON.stringify(SPECIES);
  getSpeciesChoices('mensch');
  store().setSpecies('mensch');
  expect(JSON.stringify(SPECIES)).toBe(before);
});

describe('isValidCharacter', () => {
  it('accepts a fresh character and rejects broken or over-cap files', () => {
    store().resetCharacter();
    const ok = store().character;
    expect(isValidCharacter(ok)).toBe(true);
    expect(isValidCharacter(null)).toBe(false);
    expect(isValidCharacter({ erfahrungsgradId: 'erfahren', properties: {}, speciesChoice: { speciesId: 'mensch' } })).toBe(false);
    expect(isValidCharacter({ ...ok, properties: { ...ok.properties, MU: 25 } })).toBe(false);
  });
});
