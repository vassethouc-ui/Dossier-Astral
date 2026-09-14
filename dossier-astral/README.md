# 🌌 Système Solaire Interactif

Un système solaire interactif en HTML/CSS/JS pur (aucune librairie externe), avec une mécanique de vaisseaux spatiaux et un vrai contenu éducatif basé sur des données astronomiques réelles.

## ✨ Fonctionnalités

- **5 types de vaisseaux** avec des spécialités cohérentes avec la réalité :
  - 🛰️ **Satellite** — analyse spectrométrique détaillée, priorité à la température
  - 🚀 **Explorateur** — sites d'intérêt géographiques, priorité à la distance au Soleil
  - 🎯 **Chasseur** — déplacement rapide, priorité à la vitesse orbitale
  - 🕵️ **Furtif** — immunisé face à la chaleur du Soleil, priorité au nombre de lunes
  - 📦 **Cargo** — ressources exploitables détectées, priorité à la gravité de surface
- **Couleur du vaisseau personnalisable**, appliquée dynamiquement
- **Radar de suivi** en temps réel pendant les déplacements
- **Spatioport** où le vaisseau est stationné entre deux missions
- **Dossier astral détaillé** pour chaque planète (et le Soleil), avec :
  - Des données réelles (température, distance, vitesse, gravité, lunes)
  - Une section "Si tu étais là" (poids relatif, durée d'un jour)
- **Mécanique risque/récompense sur le Soleil** : sans protection thermique, un vaisseau qui s'en approche explose ; avec la protection (native pour le Furtif, activable pour les autres), il peut consulter les données solaires
- **Vue réaliste optionnelle** : bouton pour afficher les planètes selon leurs vraies proportions relatives
- **Voyage vers la Lune** depuis la Terre, avec décollage et retour animés
- **Écran de rotation** sur mobile en mode portrait, pour une expérience pensée pour le paysage

## 🗂️ Structure du projet

```
├── solaire.html
├── css/
│   ├── base.css            → étoiles, radar, configuration, spatioport, orbites
│   ├── planets-orbits.css  → planètes, anneaux, vue réaliste, focus
│   ├── dossier-ui.css      → dossier astral, analyses spéciales, HUD
│   └── ships-effects.css   → vaisseaux, effets, responsive mobile
└── js/
    ├── dom-audio.js        → références DOM, boutons, sons, radar, HUD
    ├── planet-data.js      → données des planètes, analyses par vaisseau
    ├── stats-details.js    → statistiques par vaisseau, comparaisons
    └── ship-travel.js      → déplacement du vaisseau, voyages, événements
```

Le code a été découpé en plusieurs fichiers pour rester lisible et maintenable, mais reste du HTML/CSS/JS 100% natif — aucune étape de build n'est nécessaire.

## 🚀 Lancer le projet

Ouvrir simplement `solaire.html` dans un navigateur, ou héberger le dossier tel quel (compatible GitHub Pages, Netlify, Vercel).

## 🛠️ Réalisation

Projet conçu et supervisé par Shadow, avec l'assistance de GitHub Copilot pour l'implémentation.
