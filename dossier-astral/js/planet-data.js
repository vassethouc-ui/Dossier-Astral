// === PLANET-DATA.JS — données des planètes, analyses spéciales par vaisseau ===

const bodies = {
  sun: {
    name: "Soleil",
    type: "Étoile naine jaune",
    statLabel: "Température",
    stat: "5 500 °C en surface • 15 millions °C au cœur",
    description: "Le Soleil est le centre gravitationnel et énergétique du système solaire.",
    feature: "Il contient 99,8 % de la masse totale du système solaire et tourne sur lui-même de manière fluide."
  },
  mercury: {
    name: "Mercure",
    type: "Planète tellurique",
    statLabel: "Température",
    stat: "-180 °C à 430 °C",
    description: "Mercure est la planète la plus proche du Soleil.",
    feature: "C'est la planète la plus rapide du système solaire."
  },
  venus: {
    name: "Vénus",
    type: "Planète tellurique",
    statLabel: "Température",
    stat: "460 °C constante",
    description: "Vénus est souvent surnommée la sœur jumelle de la Terre.",
    feature: "Son effet de serre est destructeur et elle tourne à l'envers."
  },
  earth: {
    name: "Terre",
    type: "Planète tellurique",
    statLabel: "Population",
    stat: "~8 milliards d'humains",
    description: "La Terre est notre planète bleue, avec des océans et une atmosphère respirable.",
    feature: "C'est la seule planète connue abritant la vie et de l'eau liquide en surface. Satellite : la Lune."
  },
  moon: {
    name: "Lune",
    type: "Satellite naturel",
    statLabel: "Distance de la Terre",
    stat: "384 400 km",
    description: "La Lune est le satellite naturel de la Terre.",
    feature: "Elle provoque les marées sur Terre et présente toujours la même face."
  },
  mars: {
    name: "Mars",
    type: "Planète tellurique",
    statLabel: "Missions",
    stat: "Curiosity & Perseverance",
    description: "Mars est surnommée la planète Rouge.",
    feature: "Elle possède le plus grand volcan du système solaire : Olympus Mons."
  },
  jupiter: {
    name: "Jupiter",
    type: "Géante gazeuse",
    statLabel: "Particularité",
    stat: "Grande Tache Rouge",
    description: "Jupiter est la plus grande planète du système solaire.",
    feature: "Sa Grande Tache Rouge est une tempête géante plus grande que la Terre."
  },
  saturn: {
    name: "Saturne",
    type: "Géante gazeuse",
    statLabel: "Diamètre des anneaux",
    stat: "282 000 km",
    description: "Saturne est une géante gazeuse reconnaissable à ses anneaux glacés.",
    feature: "Sa densité est si faible qu'elle pourrait flotter sur l'eau."
  },
  uranus: {
    name: "Uranus",
    type: "Géante de glace",
    statLabel: "Inclinaison",
    stat: "Axe fortement incliné",
    description: "Uranus est une géante de glace aux teintes cyan.",
    feature: "Elle est complètement inclinée sur le côté et roule sur son orbite."
  },
  neptune: {
    name: "Neptune",
    type: "Géante glacée",
    statLabel: "Vents",
    stat: "Jusqu'à 2 100 km/h",
    description: "Neptune est la planète la plus éloignée du Soleil.",
    feature: "Elle est balayée par des tempêtes supersoniques."
  }
};

const bodyName = document.querySelector("#body-name");
const bodyDescription = document.querySelector("#body-description");
const bodyType = document.querySelector("#body-type");
const bodyStatLabel = document.querySelector("#body-stat-label");
const bodyStat = document.querySelector("#body-stat");
const bodyFeature = document.querySelector("#body-feature");
const comparisonWeight = document.querySelector("#comparison-weight");
const comparisonDay = document.querySelector("#comparison-day");
const astralDossier = document.querySelector("#astral-dossier");
const satelliteAnalysis = document.querySelector("#satellite-analysis");
const explorerAnalysis = document.querySelector("#explorer-analysis");
const cargoAnalysis = document.querySelector("#cargo-analysis");
const spectrometryData = document.querySelector("#spectrometry-data");
const surfaceSites = document.querySelector("#surface-sites");
const cargoResources = document.querySelector("#cargo-resources");

const spectrometryByBody = {
  sun: "Hydrogène 73,46 % • Hélium 24,85 % • Oxygène 0,77 % • Carbone 0,29 %",
  mercury: "Oxygène 42 % • Sodium 29 % • Hydrogène 22 % • Hélium 6 %",
  venus: "Dioxyde de carbone 96,5 % • Azote 3,5 % • Dioxyde de soufre : traces",
  earth: "Azote 78,08 % • Oxygène 20,95 % • Argon 0,93 % • CO₂ 0,04 %",
  moon: "Oxygène 43 % • Silicium 21 % • Aluminium 10 % • Calcium 8 %",
  mars: "Dioxyde de carbone 95,3 % • Azote 2,7 % • Argon 1,6 % • Oxygène : traces",
  jupiter: "Hydrogène 89,8 % • Hélium 10,2 % • Méthane et ammoniac : traces",
  saturn: "Hydrogène 96,3 % • Hélium 3,25 % • Méthane et ammoniac : traces",
  uranus: "Hydrogène 82,5 % • Hélium 15,2 % • Méthane 2,3 %",
  neptune: "Hydrogène 80 % • Hélium 19 % • Méthane 1,5 %"
};

const surfaceSitesByBody = {
  sun: "Granulation magnétique détectée à la surface • Éruption solaire active sur le limbe",
  mercury: "Anomalie thermique détectée au pôle Nord • Cratère Caloris accessible",
  venus: "Anomalie thermique dans les hautes terres • Zone volcanique à surveiller",
  earth: "Anomalie océanique détectée • Biosphère active dans l'hémisphère Nord",
  moon: "Point d'alunissage recommandé près du pôle Sud • Dépôts de glace repérés",
  mars: "Canyon d'Olympus Mons accessible • Anomalie thermique détectée au pôle Nord",
  jupiter: "Grande Tache Rouge en observation • Turbulence atmosphérique remarquable",
  saturn: "Structure complexe repérée dans les anneaux • Zone de particules denses",
  uranus: "Aurore polaire détectée • Région magnétique fortement inclinée",
  neptune: "Front de tempête supersonique • Vortex sombre en déplacement"
};

const resourcesByBody = {
  sun: "Hélium-3 en fusion continue • Plasma à forte densité énergétique",
  mercury: "Gisements de fer et de nickel en surface • Glace d'eau dans les cratères polaires",
  venus: "Composés soufrés en abondance • Aucune ressource extractible viable pour l'instant",
  earth: "Eau liquide en abondance • Réserves de fer, cuivre et terres rares",
  moon: "Régolithe riche en hélium-3 • Glace d'eau au pôle Sud",
  mars: "Glace d'eau sous la surface • Oxyde de fer (origine de sa couleur rouge)",
  jupiter: "Hydrogène métallique en profondeur • Hélium en grande quantité",
  saturn: "Glace d'eau abondante dans les anneaux • Hydrogène liquide en profondeur",
  uranus: "Glaces d'eau, d'ammoniac et de méthane • Aucun sol solide exploitable",
  neptune: "Glaces volatiles riches en méthane • Vents trop violents pour l'extraction"
};

function clearMapPointers() {
  document.querySelectorAll(".map-pointer").forEach((pointer) => pointer.remove());
}

function addMapPointers(target) {
  clearMapPointers();
  const positions = [
    { left: "30%", top: "35%" },
    { left: "68%", top: "48%" },
    { left: "46%", top: "70%" }
  ];

  positions.forEach((position, index) => {
    const pointer = document.createElement("span");
    pointer.className = "map-pointer";
    pointer.setAttribute("aria-hidden", "true");
    pointer.style.left = position.left;
    pointer.style.top = position.top;
    pointer.style.animationDelay = `${index * 0.18}s`;
    target.appendChild(pointer);
  });
}

function updateSpecialAnalysis(bodyKey, shipType, target) {
  satelliteAnalysis.classList.toggle("hidden", shipType !== "satellite");
  explorerAnalysis.classList.toggle("hidden", shipType !== "explorateur");
  cargoAnalysis.classList.toggle("hidden", shipType !== "cargo");

  if (shipType === "satellite") {
    spectrometryData.textContent =
      spectrometryByBody[bodyKey] || "Signature chimique non résolue.";
    clearMapPointers();
  } else if (shipType === "explorateur") {
    surfaceSites.textContent =
      surfaceSitesByBody[bodyKey] || "Aucun site d'intérêt confirmé.";
    addMapPointers(target);
  } else if (shipType === "cargo") {
    cargoResources.textContent =
      resourcesByBody[bodyKey] || "Aucune ressource exploitable détectée.";
    clearMapPointers();
  } else {
    clearMapPointers();
  }
}

