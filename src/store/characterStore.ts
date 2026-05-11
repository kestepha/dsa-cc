import { create } from 'zustand';
import type { Character, CharacterProperties, PropertyKey, SpeciesChoice } from '../types/character';
import { PROPERTY_KEYS } from '../types/character';
import { DEFAULT_ERFAHRUNGSGRAD } from '../data/erfahrungsgrade';
import { SPECIES } from '../data/species';
import { applySpeciesMods, calculateAPBreakdown, canIncreaseProperty, canDecreaseProperty, getPropertyIncrementCost } from '../utils/apCalculator';

const DEFAULT_PROPERTIES: CharacterProperties = {
  MU: 8, KL: 8, IN: 8, CH: 8, FF: 8, GE: 8, KO: 8, KK: 8,
};

interface CharacterState {
  character: Character;
  currentStep: number;

  // Actions
  setName: (name: string) => void;
  setErfahrungsgrad: (id: string) => void;
  setSpecies: (speciesId: string) => void;
  setSpeciesChoice: (choiceKey: string, property: PropertyKey) => void;
  setCultura: (cultureId: string) => void;
  setProfession: (professionId: string) => void;
  increaseProperty: (prop: PropertyKey) => void;
  decreaseProperty: (prop: PropertyKey) => void;
  setStep: (step: number) => void;
  resetCharacter: () => void;
  loadCharacter: (character: Character) => void;
  getAPBreakdown: () => ReturnType<typeof calculateAPBreakdown>;
  getSpeciesBaseProperties: () => CharacterProperties;
}

const createDefaultCharacter = (): Character => ({
  name: '',
  erfahrungsgradId: DEFAULT_ERFAHRUNGSGRAD,
  speciesChoice: { speciesId: '', propertyChoices: {} },
  cultureId: '',
  professionId: '',
  properties: { ...DEFAULT_PROPERTIES },
});

export const useCharacterStore = create<CharacterState>((set, get) => ({
  character: createDefaultCharacter(),
  currentStep: 0,

  setName: (name) => set(s => ({ character: { ...s.character, name } })),

  setErfahrungsgrad: (id) => set(s => {
    const newProps = { ...DEFAULT_PROPERTIES };
    if (s.character.speciesChoice.speciesId) {
      const adjusted = applySpeciesMods(s.character.speciesChoice.speciesId, s.character.speciesChoice.propertyChoices);
      for (const key of PROPERTY_KEYS) {
        newProps[key] = adjusted[key];
      }
    }
    return { character: { ...s.character, erfahrungsgradId: id, properties: newProps } };
  }),

  setSpecies: (speciesId) => set(s => {
    const species = SPECIES.find(sp => sp.id === speciesId);
    const newPropertyChoices: Record<string, PropertyKey> = {};

    // Pre-select first option for each choice
    if (species) {
      for (const mod of species.propertyMods) {
        if (mod.property === 'CHOICE' && mod.choices && mod.choices.length > 0) {
          const choiceKey = `${speciesId}_${mod.value > 0 ? 'pos' : 'neg'}_${[...mod.choices].sort().join('_')}`;
          newPropertyChoices[choiceKey] = mod.choices[0] as PropertyKey;
        }
      }
    }

    const newSpeciesChoice: SpeciesChoice = { speciesId, propertyChoices: newPropertyChoices };
    const newProps = speciesId ? applySpeciesMods(speciesId, newPropertyChoices) : { ...DEFAULT_PROPERTIES };

    return {
      character: {
        ...s.character,
        speciesChoice: newSpeciesChoice,
        properties: newProps,
        cultureId: '',
        professionId: '',
      },
    };
  }),

  setSpeciesChoice: (choiceKey, property) => set(s => {
    const newPropertyChoices = { ...s.character.speciesChoice.propertyChoices, [choiceKey]: property };
    const newSpeciesChoice = { ...s.character.speciesChoice, propertyChoices: newPropertyChoices };
    const newProps = applySpeciesMods(s.character.speciesChoice.speciesId, newPropertyChoices);
    return { character: { ...s.character, speciesChoice: newSpeciesChoice, properties: newProps } };
  }),

  setCultura: (cultureId) => set(s => ({ character: { ...s.character, cultureId } })),

  setProfession: (professionId) => set(s => ({ character: { ...s.character, professionId } })),

  increaseProperty: (prop) => set(s => {
    const check = canIncreaseProperty(prop, s.character.properties, s.character.erfahrungsgradId);
    if (!check.allowed) return s;

    const newProps = { ...s.character.properties, [prop]: s.character.properties[prop] + 1 };
    const breakdown = calculateAPBreakdown(
      s.character.erfahrungsgradId,
      s.character.speciesChoice.speciesId,
      s.character.cultureId,
      s.character.professionId,
      newProps,
    );

    if (breakdown.remaining < 0) return s;

    return { character: { ...s.character, properties: newProps } };
  }),

  decreaseProperty: (prop) => set(s => {
    const check = canDecreaseProperty(prop, s.character.properties, s.character.speciesChoice.speciesId, s.character.speciesChoice.propertyChoices);
    if (!check.allowed) return s;

    const newProps = { ...s.character.properties, [prop]: s.character.properties[prop] - 1 };
    return { character: { ...s.character, properties: newProps } };
  }),

  setStep: (step) => set({ currentStep: step }),

  resetCharacter: () => set({ character: createDefaultCharacter(), currentStep: 0 }),

  loadCharacter: (character) => set({ character, currentStep: 0 }),

  getAPBreakdown: () => {
    const { character } = get();
    return calculateAPBreakdown(
      character.erfahrungsgradId,
      character.speciesChoice.speciesId,
      character.cultureId,
      character.professionId,
      character.properties,
    );
  },

  getSpeciesBaseProperties: () => {
    const { character } = get();
    if (!character.speciesChoice.speciesId) return { ...DEFAULT_PROPERTIES };
    return applySpeciesMods(character.speciesChoice.speciesId, character.speciesChoice.propertyChoices);
  },
}));
