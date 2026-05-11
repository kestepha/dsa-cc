export const PROPERTY_KEYS = ['MU', 'KL', 'IN', 'CH', 'FF', 'GE', 'KO', 'KK'] as const;
export type PropertyKey = typeof PROPERTY_KEYS[number];

export const PROPERTY_NAMES: Record<PropertyKey, string> = {
  MU: 'Mut',
  KL: 'Klugheit',
  IN: 'Intuition',
  CH: 'Charisma',
  FF: 'Fingerfertigkeit',
  GE: 'Gewandtheit',
  KO: 'Konstitution',
  KK: 'Körperkraft',
};

export interface PropertyMod {
  property: PropertyKey | 'CHOICE';
  value: number;
  choices?: PropertyKey[];
}

export interface Erfahrungsgrad {
  id: string;
  name: string;
  ap: number;
  maxProperty: number;
  maxSkill: number;
  maxCombatTechnique: number;
  maxPropertySum: number;
  fatePoints: number;
}

export interface Species {
  id: string;
  name: string;
  apCost: number;
  leGrundwert: number;
  skGrundwert: number;
  zaGrundwert: number;
  geGrundwert: number;
  propertyMods: PropertyMod[];
  usualCultures: string[];
  automaticAdvantages: string[];
  automaticDisadvantages: string[];
  apFromAdvantages: number;
  apFromDisadvantages: number;
  description: string;
}

export interface Culture {
  id: string;
  name: string;
  speciesIds: string[];
  apCost: number;
  description: string;
}

export interface Profession {
  id: string;
  name: string;
  category: 'kämpfer' | 'profane' | 'zauberer' | 'geweihte';
  apCost: number;
  speciesConstraint?: string[];
  cultureConstraint?: string[];
  description: string;
}

export interface CharacterProperties {
  MU: number;
  KL: number;
  IN: number;
  CH: number;
  FF: number;
  GE: number;
  KO: number;
  KK: number;
}

export interface SpeciesChoice {
  speciesId: string;
  propertyChoices: Record<string, PropertyKey>;
}

export interface Character {
  name: string;
  erfahrungsgradId: string;
  speciesChoice: SpeciesChoice;
  cultureId: string;
  professionId: string;
  properties: CharacterProperties;
}

export interface APCostBreakdown {
  species: number;
  properties: number;
  culture: number;
  profession: number;
  total: number;
  maxAP: number;
  remaining: number;
  propertySum: number;
  maxPropertySum: number;
}
