import { create } from 'zustand';
import type { Character, CharacterProperties, PropertyKey, SpeciesChoice } from '../types/character';
import { PROPERTY_KEYS } from '../types/character';
import { DEFAULT_ERFAHRUNGSGRAD, ERFAHRUNGSGRADE } from '../data/erfahrungsgrade';
import { SPECIES } from '../data/species';
import { applySpeciesMods, calculateAPBreakdown, calculatePropertySum, canIncreaseProperty, canDecreaseProperty, getChoiceKey } from '../utils/apCalculator';

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
    if (id === s.character.erfahrungsgradId) return s;
    // Keep bought points unless they break the new level's caps
    const eg = ERFAHRUNGSGRADE.find(e => e.id === id);
    const props = s.character.properties;
    const fits = eg && PROPERTY_KEYS.every(k => props[k] <= eg.maxProperty) && calculatePropertySum(props) <= eg.maxPropertySum;
    const { speciesId, propertyChoices } = s.character.speciesChoice;
    const properties = fits ? props : applySpeciesMods(speciesId, propertyChoices);
    return { character: { ...s.character, erfahrungsgradId: id, properties } };
  }),

  setSpecies: (speciesId) => set(s => {
    if (speciesId === s.character.speciesChoice.speciesId) return s;
    const species = SPECIES.find(sp => sp.id === speciesId);
    const newPropertyChoices: Record<string, PropertyKey> = {};

    // Pre-select first option for each choice
    if (species) {
      for (const mod of species.propertyMods) {
        if (mod.property === 'CHOICE' && mod.choices && mod.choices.length > 0) {
          newPropertyChoices[getChoiceKey(speciesId, mod)] = mod.choices[0];
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
    const { speciesId, propertyChoices } = s.character.speciesChoice;
    if (propertyChoices[choiceKey] === property) return s;
    const newPropertyChoices = { ...propertyChoices, [choiceKey]: property };
    const oldBase = applySpeciesMods(speciesId, propertyChoices);
    const newProps = applySpeciesMods(speciesId, newPropertyChoices);
    // Move the species mod, keep the bought points
    for (const key of PROPERTY_KEYS) {
      newProps[key] += s.character.properties[key] - oldBase[key];
    }
    return { character: { ...s.character, speciesChoice: { speciesId, propertyChoices: newPropertyChoices }, properties: newProps } };
  }),

  // Changing culture can drop the profession's cultureConstraint, so the profession is reset
  setCultura: (cultureId) => set(s => (
    cultureId === s.character.cultureId ? s : { character: { ...s.character, cultureId, professionId: '' } }
  )),

  setProfession: (professionId) => set(s => ({ character: { ...s.character, professionId } })),

  increaseProperty: (prop) => set(s => {
    if (!canIncreaseProperty(prop, s.character).allowed) return s;
    const newProps = { ...s.character.properties, [prop]: s.character.properties[prop] + 1 };
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

  getAPBreakdown: () => calculateAPBreakdown(get().character),

  getSpeciesBaseProperties: () => {
    const { character } = get();
    if (!character.speciesChoice.speciesId) return { ...DEFAULT_PROPERTIES };
    return applySpeciesMods(character.speciesChoice.speciesId, character.speciesChoice.propertyChoices);
  },
}));
