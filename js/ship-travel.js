// === SHIP-TRAVEL.JS — création et déplacement du vaisseau, voyages, focus, retour au spatioport, écouteurs d'événements ===

const moonOrbit = document.querySelector(".moon-orbit");
const moon = document.querySelector(".moon");

if (moonOrbit && moon) {
  moon.addEventListener("pointerenter", () => pauseOrbit(moonOrbit));
  moon.addEventListener("pointerleave", () => resumeOrbit(moonOrbit));
  moon.addEventListener("focus", () => pauseOrbit(moonOrbit));
  moon.addEventListener("blur", () => resumeOrbit(moonOrbit));
}

function createShip(container = document.body) {
  const shipColors = {
    red: "#ff506f",
    blue: "#4c9dff",
    violet: "#bd70ff",
    gold: "#ffca55",
    "vert-neon": "#55ff9b",
    "violet-plasma": "#d56bff",
    "blanc-nasa": "#f2f6ff"
  };
  const ship = document.createElement("div");
  const shipTypes = ["explorateur", "chasseur", "satellite", "furtif", "cargo"];
  const shipType = shipTypes.includes(selectedShipType) ? selectedShipType : "explorateur";
  const shipColor = shipColors[selectedShipColor] || shipColors.red;
  ship.className = `spaceship ${shipType}`;
  ship.type = shipType;
  ship.dataset.type = shipType;
  ship.innerHTML = `
    <div class="solar-panel-left" aria-hidden="true"></div>
    <div class="solar-panel-right" aria-hidden="true"></div>
    <div class="ship-wings"></div>
    <div class="ship-body"></div>
    <div class="ship-headlight headlight-top"></div>
    <div class="ship-headlight headlight-bottom"></div>
    <div class="ship-fire"></div>
  `;
  ship.style.setProperty("--vaisseau-couleur", shipColor);
  ship.style.setProperty("--ship-color", shipColor);
  container.appendChild(ship);
  void ship.offsetWidth;
  return ship;
}

function angleBetween(start, end) {
  return Math.atan2(end.y - start.y, end.x - start.x) * 180 / Math.PI;
}

function centerOf(element) {
  const rect = element.getBoundingClientRect();
  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2
  };
}

function removeShip() {
  if (currentShip) {
    currentShip.remove();
    currentShip = null;
  }
}

function parkShip() {
  if (parkedShip) parkedShip.remove();
  parkedShip = createShip(stationDock);
  parkedShip.classList.add("is-parked");
  parkedShip.style.setProperty("--ship-angle", "-90deg");
  parkedShip.style.left = "50%";
  parkedShip.style.top = "50%";
  stationLed.classList.remove("led-busy");
  stationLed.setAttribute("aria-label", "Station disponible");
}

function enterFocusMode(target, shipType = selectedShipType) {
  clearTimeout(focusTimer);
  focusedBody = target;
  focusedLevel = "planet";
  focusedPlaceholder = document.createComment("focused-body-placeholder");
  target.replaceWith(focusedPlaceholder);
  focusLayer.appendChild(target);
  target.classList.add("is-focused-body");
  if (target.dataset.body === "earth") {
    const moonOrbit = target.querySelector(".moon-orbit");
    const moon = target.querySelector(".moon");
    if (moonOrbit) moonOrbit.removeAttribute("aria-hidden");
    if (moon) moon.setAttribute("tabindex", "0");
  }

  document.body.classList.add("focus-mode");
  focusLayer.setAttribute("aria-hidden", "false");
  updateDetails(target.dataset.body || "sun");
  astralDossier.classList.toggle(
    "scan-active",
    ["explorateur", "satellite"].includes(shipType)
  );
  updateSpecialAnalysis(target.dataset.body || "sun", shipType, target);
  astralDossier.classList.remove("hidden");
  astralDossier.setAttribute("aria-hidden", "false");
}

function deploySatellitePanels(ship) {
  if (ship && ship.type === "satellite") {
    ship.classList.add("panels-deploy");
  }
}

function clearSatelliteScanner() {
  document.querySelectorAll(".satellite-scanner").forEach((scanner) => scanner.remove());
}

function activateEarthSatelliteScan(target, ship) {
  if (!target || !ship || ship.type !== "satellite" || target.dataset.body !== "earth") {
    return;
  }

  const scanner = document.createElement("div");
  scanner.className = "satellite-scanner is-active";
  scanner.setAttribute("aria-hidden", "true");
  target.appendChild(scanner);

  const earthCenter = centerOf(target);
  ship.style.left = `${earthCenter.x}px`;
  ship.style.top = `${earthCenter.y - target.getBoundingClientRect().height * 0.95}px`;
  ship.style.setProperty("--ship-angle", "90deg");
  deploySatellitePanels(ship);
  playSatelliteDataSound();
  window.setTimeout(() => {
    scanner.classList.remove("is-active");
    scanner.style.opacity = "0";
    scanner.remove();
  }, 2000);
}

function startMoonTravel() {
  if (
    !focusedBody ||
    focusedBody.dataset.body !== "earth" ||
    focusedLevel !== "planet" ||
    currentShip
  ) return;

  const moon = focusedBody.querySelector(".moon");
  if (!moon) return;
  clearSatelliteScanner();

  const moonOrbitEl = focusedBody.querySelector(".moon-orbit");
  if (moonOrbitEl) lockOrbit(moonOrbitEl);

  const start = centerOf(focusedBody);
  const destination = centerOf(moon);
  const ship = createShip();
  const flightDuration = getTravelDuration(ship);
  const angle = angleBetween(start, destination);
  currentShip = ship;
  ship.style.transition = `all ${flightDuration}ms cubic-bezier(.25, 1, .5, 1)`;
  playRocketSound();
  startRadarTracking();
  showHud("Lune", ship, flightDuration);
  ship.classList.add("headlights-on");
  ship.style.setProperty("--ship-angle", `${angle}deg`);
  ship.style.left = `${start.x}px`;
  ship.style.top = `${start.y}px`;
  ship.style.transform = `translate(-50%, -50%) rotate(${angle}deg) scale(0)`;
  void ship.offsetWidth;

  window.setTimeout(() => {
    ship.classList.add("is-moving");
    ship.style.transform = `translate(-50%, -50%) rotate(${angle}deg) scale(1)`;
    ship.style.left = `${destination.x}px`;
    ship.style.top = `${destination.y}px`;
  }, 50);

  window.setTimeout(() => {
    hideHud();
    createShockwave(moon, ship);
    playLandingSound();
    ship.classList.add("is-arriving");
    window.setTimeout(() => ship.classList.add("is-entering"), 180);
    window.setTimeout(() => {
      ship.classList.remove("headlights-on");
      astralDossier.style.setProperty(
        "--vaisseau-couleur",
        ship.style.getPropertyValue("--vaisseau-couleur") || "#61e8ff"
      );
      removeShip();
      stopRadarTracking();
      focusedLevel = "moon";
      updateDetails("moon");
    }, 380);
  }, flightDuration);
}

function startTravel(target) {
  if (document.body.classList.contains("focus-mode") || currentShip) return;

  // Verrouille l'orbite de la planète ciblée dès le clic pour qu'elle reste
  // immobile pendant tout le vol, même si la souris quitte la planète.
  const targetOrbit = target.closest(".orbit-container");
  if (targetOrbit) lockOrbit(targetOrbit);

  updateDetails(target.dataset.body || "sun");
  const targetCenter = centerOf(target);
  const isSolarVisit = target === sun;
  const destination = isSolarVisit
    ? (() => {
        const dx = targetCenter.x - centerOf(stationDock).x;
        const dy = targetCenter.y - centerOf(stationDock).y;
        const distance = Math.hypot(dx, dy) || 1;
        const safeDistance = target.getBoundingClientRect().width / 2 + 24;
        return {
          x: targetCenter.x - (dx / distance) * safeDistance,
          y: targetCenter.y - (dy / distance) * safeDistance
        };
      })()
    : targetCenter;
  if (parkedShip) {
    parkedShip.remove();
    parkedShip = null;
  }
  stationLed.classList.add("led-busy");
  stationLed.setAttribute("aria-label", "Station occupée");
  const ship = createShip();
  const flightDuration = getTravelDuration(ship);
  const isSolarImmune = ship.type === "furtif";
  if (isSolarVisit && !coolingSystem && !isSolarImmune) {
    setRadarCritical();
  }
  ship.classList.remove("headlights-on");
  // Only grant the solar shield if the hidden cooling system is active
  if (isSolarVisit && (coolingSystem || isSolarImmune)) {
    ship.classList.add("solar-shield");
  }
  playRocketSound();
  const start = centerOf(stationDock);
  const startX = start.x;
  const startY = start.y;
  const angle = angleBetween({ x: startX, y: startY }, destination);

  currentShip = ship;
  ship.style.transition = `all ${flightDuration}ms cubic-bezier(.25, 1, .5, 1)`;
  showHud(target.dataset.body === "sun" ? "Soleil" : target.dataset.body, ship, flightDuration);
  startRadarTracking();
  ship.style.setProperty("--ship-angle", `${angle}deg`);
  ship.style.left = `${startX}px`;
  ship.style.top = `${startY}px`;

  // schedule movement and arrival/collision timeouts so we can cancel on crash
  const moveTimeout = window.setTimeout(() => {
    ship.classList.add("is-moving");
    ship.style.transform = `translate(-50%, -50%) rotate(${angle}deg) scale(1)`;
    ship.style.left = `${destination.x}px`;
    ship.style.top = `${destination.y}px`;
  }, 50);

  // If heading to the Sun without cooling active -> plan mid-flight crash
  let crashTimeout = null;
  if (isSolarVisit && !coolingSystem && !isSolarImmune) {
    crashTimeout = window.setTimeout(() => {
      // mid-flight shake
      if (!currentShip) return;
      if (selectedShipType !== "cargo") ship.classList.add("is-shaking");
      // short pause then crash
      setTimeout(() => {
        playCrashSound();
        // remove ship and stop tracking
        if (currentShip) {
          currentShip.remove();
          currentShip = null;
        }
        stopRadarTracking();
        // show crash screen with message and retry
        showCrashScreen();
        // clear arrival timeout if any
        if (landingTimeout) clearTimeout(landingTimeout);
        if (moveTimeout) clearTimeout(moveTimeout);
      }, 420);
    }, flightDuration / 2);
  }

  const landingTimeout = window.setTimeout(() => {
    // if a crash already removed the ship, do nothing
    if (!currentShip) return;
    hideHud();
    // normal arrival: shockwave + sound
    if (!isSolarVisit) {
      createShockwave(target, ship);
      playLandingSound();
      ship.classList.add("is-arriving");
      window.setTimeout(() => ship.classList.add("is-entering"), 180);
    } else {
      // solar arrival when coolingSystem active
      if (coolingSystem || isSolarImmune) {
        ship.classList.add("solar-orbit");
        sun.classList.add("solar-flames-active");
        playLandingSound();
      } else {
        // safety: if somehow we reached here without crash, fallback to crash
        playCrashSound();
        if (currentShip) { currentShip.remove(); currentShip = null; }
        stopRadarTracking();
        showCrashScreen();
        return;
      }
    }

    focusTimer = window.setTimeout(() => {
      astralDossier.style.setProperty(
        "--vaisseau-couleur",
        ship.style.getPropertyValue("--vaisseau-couleur") || "#61e8ff"
      );

      const arrivingShipType = currentShip.type;
      enterFocusMode(target, arrivingShipType);
      if (arrivingShipType === "satellite") {
        focusedShip = currentShip;
        if (target.dataset.body === "earth") {
          activateEarthSatelliteScan(target, focusedShip);
        } else {
          deploySatellitePanels(focusedShip);
          playSatelliteDataSound();
        }
      }
      if (arrivingShipType === "explorateur") {
        playRadioScanSound();
      }
      if (arrivingShipType !== "satellite") {
        removeShip();
      } else {
        currentShip = null;
      }
      stopRadarTracking();
    }, 600);
  }, flightDuration);
}

function returnFromMoon() {
  const moon = focusedBody.querySelector(".moon");
  if (!moon || currentShip) {
    // Repli de sécurité : si la Lune n'est pas trouvable, on bascule sans animation.
    focusedLevel = "planet";
    const fallbackOrbit = focusedBody.querySelector(".moon-orbit");
    if (fallbackOrbit) forceResumeOrbit(fallbackOrbit);
    updateDetails(focusedBody.dataset.body || "earth");
    return;
  }

  const start = centerOf(moon);
  const destination = centerOf(focusedBody);
  const ship = createShip();
  const flightDuration = 900;
  const angle = angleBetween(start, destination);

  currentShip = ship;
  playRocketSound();
  startRadarTracking();
  showHud("Terre", ship, flightDuration);
  ship.classList.add("headlights-on");
  ship.style.setProperty("--ship-angle", `${angle}deg`);
  ship.style.left = `${start.x}px`;
  ship.style.top = `${start.y}px`;
  ship.style.transition = `all ${flightDuration}ms cubic-bezier(.25, 1, .5, 1)`;
  ship.style.transform = `translate(-50%, -50%) rotate(${angle}deg) scale(0)`;
  void ship.offsetWidth;

  // Décollage de la Lune
  window.setTimeout(() => {
    ship.classList.add("is-moving");
    ship.style.transform = `translate(-50%, -50%) rotate(${angle}deg) scale(1)`;
    ship.style.left = `${destination.x}px`;
    ship.style.top = `${destination.y}px`;
  }, 50);

  // Arrivée sur Terre
  window.setTimeout(() => {
    hideHud();
    createShockwave(focusedBody, ship);
    playLandingSound();
    ship.classList.add("is-arriving");
    window.setTimeout(() => ship.classList.add("is-entering"), 180);
    window.setTimeout(() => {
      ship.classList.remove("headlights-on");
      removeShip();
      stopRadarTracking();
      focusedLevel = "planet";
      const moonOrbitEl = focusedBody.querySelector(".moon-orbit");
      if (moonOrbitEl) forceResumeOrbit(moonOrbitEl);
      updateDetails(focusedBody.dataset.body || "earth");
    }, 380);
  }, flightDuration);
}

function returnToSystem() {
  if (!focusedBody || !focusedPlaceholder || currentShip) return;

  if (focusedLevel === "moon") {
    returnFromMoon();
    return;
  }

  clearTimeout(focusTimer);
  focusTimer = null;
  clearSatelliteScanner();
  if (document.activeElement instanceof HTMLElement) {
    document.activeElement.blur();
  }
  astralDossier.classList.add("hidden");
  astralDossier.classList.remove("scan-active");
  astralDossier.setAttribute("aria-hidden", "true");
  clearMapPointers();
  if (focusedShip) {
    focusedShip.classList.remove("panels-deploy");
    focusedShip.remove();
    focusedShip = null;
  }
  const targetPosition = centerOf(focusedBody);
  const bottomPoint = {
    x: Math.min(window.innerWidth - 40, Math.max(40, targetPosition.x)),
    y: window.innerHeight - 70
  };
  const ship = createShip();
  const stationPosition = centerOf(stationDock);

  currentShip = ship;
  playReturnSound();
  startRadarTracking();
  ship.classList.add("headlights-on");
  ship.style.setProperty("--ship-angle", "90deg");
  ship.style.left = `${targetPosition.x}px`;
  ship.style.top = `${targetPosition.y}px`;
  ship.classList.add("is-returning");
  ship.style.transition = "left 1.5s cubic-bezier(0.16, 1, 0.3, 1), top 1.5s cubic-bezier(0.16, 1, 0.3, 1), transform 1.5s cubic-bezier(0.16, 1, 0.3, 1)";
  ship.style.transform = "translate(-50%, -50%) rotate(var(--ship-angle)) scale(0)";
  void ship.offsetWidth;

  // Étape 1 : plongée douce vers le bas pour éviter le panneau d'infos.
  window.setTimeout(() => {
    ship.classList.add("is-moving");
    ship.style.transform = "translate(-50%, -50%) rotate(90deg) scale(1.2)";
    ship.style.left = `${bottomPoint.x}px`;
    ship.style.top = `${bottomPoint.y}px`;
  }, 50);

  // Étape 2 : masquer l'interface, puis traverser le bas de l'écran vers le spatioport.
  window.setTimeout(() => {
    document.body.classList.remove("focus-mode");
    focusLayer.setAttribute("aria-hidden", "true");
    focusedBody.classList.remove("is-focused-body");
    const moonOrbit = focusedBody.querySelector(".moon-orbit");
    const moon = focusedBody.querySelector(".moon");
    if (moonOrbit) moonOrbit.setAttribute("aria-hidden", "true");
    if (moon) moon.setAttribute("tabindex", "-1");
    focusedPlaceholder.replaceWith(focusedBody);

    const angleToStation = angleBetween(bottomPoint, stationPosition);
    ship.style.setProperty("--ship-angle", `${angleToStation}deg`);
    ship.style.transition = "left 4s cubic-bezier(0.16, 1, 0.3, 1), top 4s cubic-bezier(0.16, 1, 0.3, 1), transform 4s cubic-bezier(0.16, 1, 0.3, 1)";
    ship.classList.add("is-moving");
    ship.style.transform = "translate(-50%, -50%) rotate(var(--ship-angle)) scale(1.2)";
    ship.style.left = `${stationPosition.x}px`;
    ship.style.top = `${stationPosition.y}px`;
  }, 1500);

  // Étape 3 : arrivée au quai, arrêt final et retour à la station.
  window.setTimeout(() => {
    ship.classList.remove("headlights-on");
    ship.classList.add("is-departing");
    sun.classList.remove("solar-flames-active");
    stopRadarTracking();
    focusedBody = null;
    focusedPlaceholder = null;
    focusedLevel = "planet";
    removeShip();
    parkShip();
    stationLed.classList.remove("led-busy");
    stationLed.setAttribute("aria-label", "Station disponible");
    orbitContainers.forEach(forceResumeOrbit);
  }, 5500);
}

document.querySelectorAll(".planet, .sun").forEach((target) => {
  target.addEventListener("click", () => startTravel(target));
});

sun.addEventListener("pointerenter", () => {
  sunHovered = true;
  updateSolarRadarHint();
});

sun.addEventListener("pointerleave", () => {
  sunHovered = false;
  if (spaceRadar) spaceRadar.classList.remove("radar-warning", "radar-critical");
  if (radarStatus) radarStatus.textContent = "RADAR\nSTABLE";
});

document.querySelector(".moon").addEventListener("click", startMoonTravel);
returnSystemButton.addEventListener("click", returnToSystem);

parkShip();
