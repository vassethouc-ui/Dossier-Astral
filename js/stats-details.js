// === STATS-DETAILS.JS — statistiques par vaisseau, comparaisons humaines, mise à jour du dossier ===

const statsByBody = {
  sun: {
    temperature: { label: "Température", value: "5 500 °C en surface • 15 millions °C au cœur" },
    distance: { label: "Distance au Soleil", value: "0 km — c'est notre étoile" },
    vitesse: { label: "Vitesse de rotation", value: "~7 189 km/h à l'équateur" },
    lunes: { label: "Lunes en orbite", value: "Aucune — 8 planètes gravitent autour de lui" },
    gravite: { label: "Gravité de surface", value: "274 m/s² (28x celle de la Terre)" }
  },
  mercury: {
    temperature: { label: "Température", value: "-180 °C à 430 °C" },
    distance: { label: "Distance au Soleil", value: "57,9 millions de km (0,39 UA)" },
    vitesse: { label: "Vitesse orbitale", value: "47,9 km/s — la plus rapide" },
    lunes: { label: "Lunes en orbite", value: "Aucune" },
    gravite: { label: "Gravité de surface", value: "3,7 m/s²" }
  },
  venus: {
    temperature: { label: "Température", value: "460 °C constante" },
    distance: { label: "Distance au Soleil", value: "108,2 millions de km (0,72 UA)" },
    vitesse: { label: "Vitesse orbitale", value: "35,0 km/s" },
    lunes: { label: "Lunes en orbite", value: "Aucune" },
    gravite: { label: "Gravité de surface", value: "8,87 m/s²" }
  },
  earth: {
    temperature: { label: "Température", value: "-88 °C à 58 °C (moyenne 15 °C)" },
    distance: { label: "Distance au Soleil", value: "149,6 millions de km (1 UA)" },
    vitesse: { label: "Vitesse orbitale", value: "29,8 km/s" },
    lunes: { label: "Lunes en orbite", value: "1 — la Lune" },
    gravite: { label: "Gravité de surface", value: "9,81 m/s²" }
  },
  mars: {
    temperature: { label: "Température", value: "-140 °C à 20 °C (moyenne -63 °C)" },
    distance: { label: "Distance au Soleil", value: "227,9 millions de km (1,52 UA)" },
    vitesse: { label: "Vitesse orbitale", value: "24,1 km/s" },
    lunes: { label: "Lunes en orbite", value: "2 — Phobos et Deimos" },
    gravite: { label: "Gravité de surface", value: "3,71 m/s²" }
  },
  jupiter: {
    temperature: { label: "Température", value: "-110 °C au sommet des nuages" },
    distance: { label: "Distance au Soleil", value: "778,3 millions de km (5,2 UA)" },
    vitesse: { label: "Vitesse orbitale", value: "13,1 km/s" },
    lunes: { label: "Lunes en orbite", value: "Plus de 90 lunes connues" },
    gravite: { label: "Gravité de surface", value: "24,79 m/s²" }
  },
  saturn: {
    temperature: { label: "Température", value: "-140 °C au sommet des nuages" },
    distance: { label: "Distance au Soleil", value: "1,43 milliard de km (9,5 UA)" },
    vitesse: { label: "Vitesse orbitale", value: "9,7 km/s" },
    lunes: { label: "Lunes en orbite", value: "Plus de 140 lunes connues" },
    gravite: { label: "Gravité de surface", value: "10,44 m/s²" }
  },
  uranus: {
    temperature: { label: "Température", value: "-195 °C" },
    distance: { label: "Distance au Soleil", value: "2,87 milliards de km (19,8 UA)" },
    vitesse: { label: "Vitesse orbitale", value: "6,8 km/s" },
    lunes: { label: "Lunes en orbite", value: "27 lunes connues" },
    gravite: { label: "Gravité de surface", value: "8,69 m/s²" }
  },
  neptune: {
    temperature: { label: "Température", value: "-200 °C" },
    distance: { label: "Distance au Soleil", value: "4,5 milliards de km (30,1 UA)" },
    vitesse: { label: "Vitesse orbitale", value: "5,4 km/s" },
    lunes: { label: "Lunes en orbite", value: "14 lunes connues" },
    gravite: { label: "Gravité de surface", value: "11,15 m/s²" }
  }
};

const shipStatFocus = {
  satellite: "temperature",
  explorateur: "distance",
  chasseur: "vitesse",
  furtif: "lunes",
  cargo: "gravite"
};

const humanComparisonByBody = {
  sun: {
    weight: "Ton poids : environ 28× celui sur Terre",
    day: "Un \"jour\" ici dure ~27 jours terrestres (rotation différentielle)"
  },
  mercury: {
    weight: "Ton poids : environ 0,38× celui sur Terre",
    day: "Un jour ici dure 58,6 jours terrestres"
  },
  venus: {
    weight: "Ton poids : environ 0,9× celui sur Terre (presque pareil)",
    day: "Un jour ici dure 243 jours terrestres — plus long que son année (225 jours) !"
  },
  earth: {
    weight: "Ton poids : ta référence habituelle",
    day: "Un jour ici dure 24 heures (référence)"
  },
  moon: {
    weight: "Ton poids : environ 1/6 de celui sur Terre (0,17×)",
    day: "Un cycle jour/nuit ici dure ~29,5 jours terrestres"
  },
  mars: {
    weight: "Ton poids : environ 0,38× celui sur Terre",
    day: "Un jour ici dure ~24h37 — presque comme sur Terre"
  },
  jupiter: {
    weight: "Ton poids : environ 2,5× celui sur Terre",
    day: "Un jour ici dure seulement ~9h56 — le plus rapide du système solaire"
  },
  saturn: {
    weight: "Ton poids : environ 1,1× celui sur Terre",
    day: "Un jour ici dure ~10h33"
  },
  uranus: {
    weight: "Ton poids : environ 0,9× celui sur Terre",
    day: "Un jour ici dure ~17h14"
  },
  neptune: {
    weight: "Ton poids : environ 1,1× celui sur Terre",
    day: "Un jour ici dure ~16h06"
  }
};

function updateDetails(bodyKey) {
  const body = bodies[bodyKey];
  if (!body) return;

  bodyName.textContent = body.name;
  bodyDescription.textContent = body.description;
  bodyType.textContent = body.type;

  // La Lune garde sa donnée fixe (distance à la Terre) : pas de variante par vaisseau ici.
  const focusKey = shipStatFocus[selectedShipType];
  const focusedStat = bodyKey !== "moon" && focusKey ? statsByBody[bodyKey]?.[focusKey] : null;

  bodyStatLabel.textContent = focusedStat ? focusedStat.label : body.statLabel;
  bodyStat.textContent = focusedStat ? focusedStat.value : body.stat;

  const sensorBonus = ["explorateur", "satellite"].includes(selectedShipType)
    ? "Capteurs avancés actifs : analyse télémétrique renforcée."
    : "";
  bodyFeature.textContent = [body.feature, sensorBonus].filter(Boolean).join(" ");

  const comparison = humanComparisonByBody[bodyKey];
  comparisonWeight.textContent = comparison ? comparison.weight : "";
  comparisonDay.textContent = comparison ? comparison.day : "";
}

function pauseOrbit(orbit) {
  orbit.classList.add("is-paused");
}

function resumeOrbit(orbit) {
  // Ne reprend pas la rotation si l'orbite est verrouillée (vaisseau en vol ou planète en focus)
  if (orbit && orbit.dataset.locked === "true") return;
  orbit.classList.remove("is-paused");
}

function lockOrbit(orbit) {
  if (!orbit) return;
  orbit.dataset.locked = "true";
  pauseOrbit(orbit);
}

function forceResumeOrbit(orbit) {
  if (!orbit) return;
  delete orbit.dataset.locked;
  orbit.classList.remove("is-paused");
}

orbitContainers.forEach((orbit) => {
  const planet = orbit.querySelector(".planet");
  if (!planet) return;

  planet.addEventListener("pointerenter", () => pauseOrbit(orbit));
  planet.addEventListener("pointerleave", () => resumeOrbit(orbit));
  planet.addEventListener("focus", () => pauseOrbit(orbit));
  planet.addEventListener("blur", () => resumeOrbit(orbit));
});

