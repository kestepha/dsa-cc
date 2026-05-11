# DSA Heldenerschaffung — Charaktererschaffungstool

Ein Webtool zur Charaktererschaffung für **Das Schwarze Auge (DSA)**, dem deutschen Pen-&-Paper-Rollenspiel. Erstellt mit Vite.js, React, TypeScript und TailwindCSS.

## Features

- **Erfahrungsgrad wählen**: Unerfahren bis Legendär, mit korrekten AP- und Maximalwerten
- **Spezies wählen**: 10 Spezies (Mensch, Elf, Zwerg, etc.) mit AP-Kosten und Eigenschaftsmodifikationen
- **Kultur wählen**: Kulturen gefiltert nach Spezies-Zugehörigkeit
- **Profession wählen**: Kämpfer, Profane, Zauberer, Geweihte mit Spezies-/Kultur-Einschränkungen
- **Eigenschaften verteilen**: MU, KL, IN, CH, FF, GE, KO, KK mit automatischer AP-Berechnung
- **AP-Bilanz**: Echtzeit-Anzeige der verbrauchten und verbleibenden Abenteuerpunkte
- **Export/Import**: Charaktere als JSON speichern und laden

## Voraussetzungen

- **Node.js** >= 18.x
- **npm** >= 9.x

## Installation & Start auf WSL Ubuntu 24.04

```bash
# In WSL Ubuntu 24.04 Terminal

# Node.js installieren (falls nicht vorhanden)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Projekt klonen / in Projektverzeichnis wechseln
cd /pfad/zu/dsa-cc

# Abhängigkeiten installieren
npm install

# Entwicklungsserver mit Hot Reload starten
npm run dev
```

Der Entwicklungsserver startet auf `http://localhost:5173` und unterstützt Hot Module Replacement (HMR) — Änderungen werden sofort im Browser angezeigt.

## Build für Produktion

```bash
npm run build
npm run preview
```

## Technologien

- **Vite.js** — Build-Tool mit extrem schnellem HMR
- **React 18** — UI-Framework
- **TypeScript** — Typsicherheit
- **TailwindCSS 3** — Utility-First CSS Framework
- **Zustand** — Minimalistischer State-Manager
- **Google Fonts** — Cinzel, Cinzel Decorative, MedievalSharp, Lora

## DSA-Regelreferenz

Die implementierten Regeln basieren auf dem DSA-Regelwiki:
- https://dsa.ulisses-regelwiki.de/Heldenerschaffung.html
- https://dsa.ulisses-regelwiki.de/Erfahrung.html

## Projektstruktur

```
dsa-cc/
├── public/
│   └── vite.svg
├── src/
│   ├── components/
│   │   ├── APCostSummary.tsx
│   │   ├── CultureSelector.tsx
│   │   ├── ErfahrungsgradSelector.tsx
│   │   ├── ProfessionSelector.tsx
│   │   ├── PropertyEditor.tsx
│   │   └── SpeciesSelector.tsx
│   ├── data/
│   │   ├── cultures.ts
│   │   ├── erfahrungsgrade.ts
│   │   ├── professions.ts
│   │   └── species.ts
│   ├── store/
│   │   └── characterStore.ts
│   ├── types/
│   │   └── character.ts
│   ├── utils/
│   │   └── apCalculator.ts
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   └── vite-env.d.ts
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```
