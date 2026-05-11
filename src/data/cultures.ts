import type { Culture } from '../types/character';

export const CULTURES: Culture[] = [
  // Menschenkulturen - Mittelländer
  { id: 'andergaster', name: 'Andergaster', speciesIds: ['mensch'], apCost: 25, description: 'Kriegerische Kultur aus dem Norden des Mittelreichs.' },
  { id: 'bornlaender', name: 'Bornländer', speciesIds: ['mensch', 'halself', 'goblin'], apCost: 25, description: 'Bewohner des rauen Bornlands an der Grenze zum Norden.' },
  { id: 'horasier', name: 'Horasier', speciesIds: ['mensch', 'halself'], apCost: 25, description: 'Kultivierte Bürger des Horasreichs, bekannt für Kunst und Handel.' },
  { id: 'maraskaner', name: 'Maraskaner', speciesIds: ['mensch'], apCost: 25, description: 'Bewohner der Insel Maraskan, geprägt von Dschungel und Echsen.' },
  { id: 'mittelreicher', name: 'Mittelreicher', speciesIds: ['mensch', 'halself'], apCost: 25, description: 'Die verbreitetste Kultur Aventuriens, vielseitig und anpassungsfähig.' },
  { id: 'nordaventurier', name: 'Nordaventurier', speciesIds: ['mensch', 'halself', 'goblin', 'holberker'], apCost: 25, description: 'Abenteuerlustige Bewohner der Nordmarken.' },
  { id: 'nostrier', name: 'Nostrier', speciesIds: ['mensch', 'halself'], apCost: 25, description: 'Bewohner des greisenreichen Nostria.' },
  { id: 'suedaventurier', name: 'Südaventurier', speciesIds: ['mensch'], apCost: 25, description: 'Sonnengebräunte Bewohner der südlichen Lande.' },
  { id: 'svellttaler', name: 'Svellttaler', speciesIds: ['mensch', 'halself', 'halbork', 'holberker', 'ork'], apCost: 25, description: 'Bewohner des Svellttals, bekannt für ihre Unabhängigkeit.' },
  { id: 'zyklopaeer', name: 'Zyklopäer', speciesIds: ['mensch'], apCost: 25, description: 'Seefahrer und Händler der Zyklopeninseln.' },

  // Menschenkulturen - Nivesen
  { id: 'nivesen', name: 'Nivesen', speciesIds: ['mensch', 'halself'], apCost: 25, description: 'Nomadische Bewohner der ewigen Kälte im Norden.' },

  // Menschenkulturen - Thorwaler
  { id: 'thorwaler', name: 'Thorwaler', speciesIds: ['mensch', 'halself', 'halbork', 'ork'], apCost: 25, description: 'Furchtlose Seefahrer und Krieger des Nordens.' },

  // Menschenkulturen - Tulamiden
  { id: 'aranier', name: 'Aranier', speciesIds: ['mensch'], apCost: 25, description: 'Bewohner des matriarchalischen Aranien, bekannt für Heilkünste.' },
  { id: 'mhanadistani', name: 'Mhanadistani', speciesIds: ['mensch'], apCost: 25, description: 'Gelehrte und Händler aus dem fernen Mhanadistan.' },
  { id: 'novadis', name: 'Novadis', speciesIds: ['mensch'], apCost: 25, description: 'Wüstennomaden mit strengen Traditionen.' },

  // Menschenkulturen - Waldmenschen
  { id: 'waldmenschen', name: 'Waldmenschen', speciesIds: ['mensch'], apCost: 25, description: 'Urbewohner des Dschungels, eins mit der Natur.' },
  { id: 'utulus', name: 'Utulus', speciesIds: ['mensch'], apCost: 25, description: 'Bewohner des südlichen Utulus.' },

  // Elfenkulturen
  { id: 'auelfen', name: 'Auelfen', speciesIds: ['elf', 'halself'], apCost: 25, description: 'Elfen der Flüsse und Auen, freundlich und offen.' },
  { id: 'firnelfen', name: 'Firnelfen', speciesIds: ['elf', 'halself'], apCost: 25, description: 'Elfen des ewigen Eises, verschlossen und geheimnisvoll.' },
  { id: 'waldelfen', name: 'Waldelfen', speciesIds: ['elf', 'halself'], apCost: 25, description: 'Elfen der tiefen Wälder, Hüter der Bäume.' },

  // Zwergenkulturen
  { id: 'ambosszwerge', name: 'Ambosszwerge', speciesIds: ['zwerg'], apCost: 25, description: 'Bergzwerge, meisterhafte Schmiede und Bergleute.' },
  { id: 'brillantzwerge', name: 'Brillantzwerge', speciesIds: ['zwerg'], apCost: 25, description: 'Edelsteinzwerge, berühmt für ihre Juwelierkunst.' },
  { id: 'erzzwerge', name: 'Erzzwerge', speciesIds: ['zwerg'], apCost: 25, description: 'Die älteste Zwergrasse, Hüter des tiefsten Gesteins.' },
  { id: 'huegelzwerge', name: 'Hügelzwerge', speciesIds: ['zwerg'], apCost: 25, description: 'Freundliche Zwerge der Hügel, geschickte Handwerker.' },

  // Ork/Goblin/Holberker Kulturen
  { id: 'orkland', name: 'Orkland', speciesIds: ['ork', 'halbork'], apCost: 25, description: 'Stammeskultur der Orks, geprägt von Stärke und Tradition.' },
  { id: 'raeuberbande', name: 'Räuberbande', speciesIds: ['halbork', 'ork', 'goblin'], apCost: 25, description: 'Gesetzloses Leben abseits der Zivilisation.' },
  { id: 'holberk', name: 'Holberk', speciesIds: ['holberker'], apCost: 25, description: 'Die Kultur der Holberker, zwischen Menschen und Orks.' },
  { id: 'stammesgoblins', name: 'Stammesgoblins', speciesIds: ['goblin'], apCost: 25, description: 'Stammesleben der Goblins in Höhlen und Wäldern.' },
  { id: 'bornlaender_goblin', name: 'Bornland (Goblin)', speciesIds: ['goblin'], apCost: 25, description: 'Goblins, die sich im Bornland angesiedelt haben.' },
  { id: 'nordaventurier_goblin', name: 'Nordaventurien (Goblin)', speciesIds: ['goblin'], apCost: 25, description: 'Goblins in den Nordmarken Aventuriens.' },

  // Achaz Kulturen
  { id: 'achaz_rha', name: 'Achaz-Rha', speciesIds: ['achaz'], apCost: 25, description: 'Die zivilisierteste Achaz-Kultur mit eigener Schrift.' },
  { id: 'ctki_ssrr', name: "Ctki'Ssrr", speciesIds: ['achaz'], apCost: 25, description: 'Kriegerische Achaz-Kultur der Sümpfe.' },
  { id: 'stammesachaz', name: 'Stammesachaz', speciesIds: ['achaz'], apCost: 25, description: 'Traditionelle Stammesachaz der Dschungel.' },

  // Nachtalb Kultur
  { id: 'nai_ashyrr', name: 'Nai Ashyrr', speciesIds: ['nachtalb'], apCost: 25, description: 'Die mysteriöse Kultur der Nachtalben.' },
];
