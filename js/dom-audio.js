// === DOM-AUDIO.JS — références DOM, config vaisseau, boutons refroidissement/vue réaliste, sons, radar, HUD, crash ===

const shipTypeSelect = document.querySelector("#ship-type");
const shipColorSelect = document.querySelector("#ship-color");
const orbitContainers = document.querySelectorAll(".orbit-container");
const solarSystem = document.querySelector(".solar-system");
const sun = document.querySelector(".sun");
const focusLayer = document.querySelector(".focus-layer");
const detailsCard = document.querySelector(".details-card");
const returnSystemButton = document.querySelector(".return-system");
const stationDock = document.querySelector(".station-dock");
const stationLed = document.querySelector(".station-led");
const hudLoader = document.querySelector("#hud-loader");
const hudText = document.querySelector(".hud-text");
const hudProgress = document.querySelector(".hud-progress");
const spaceRadar = document.querySelector("#space-radar");
const radarBlip = document.querySelector(".radar-blip");
const radarStatus = document.querySelector(".radar-status");

let selectedShipType = shipTypeSelect.value;
let selectedShipColor = shipColorSelect.value;
let focusedBody = null;
let focusedPlaceholder = null;
let focusedLevel = "planet";
let currentShip = null;
let parkedShip = null;
let focusedShip = null;
let focusTimer = null;
let radarFrame = null;
let rocketAudioContext = null;
let coolingSystem = false;
let coolingSystemUnlocked = false;
let sunHovered = false;
const travelDuration = 3500;

function getTravelDuration(ship = currentShip) {
  return ship?.type === "chasseur" ? 1500 : travelDuration;
}

// Element for the hidden coolant control (added in HTML)
const coolantBtn = document.querySelector("#coolant-btn");
const shipMenu = document.querySelector("#ship-menu");

function updateCoolingControl() {
  if (!coolantBtn) return;
  const isStealth = selectedShipType === "furtif";
  coolantBtn.classList.toggle("not-needed", isStealth);
  coolantBtn.disabled = isStealth;
  coolantBtn.textContent = isStealth
    ? "Système bypassé par la coque isolante du Furtif"
    : coolingSystem
      ? "Système de refroidissement [ON]"
      : "Système de refroidissement [OFF]";
}

function updateSolarRadarHint() {
  if (!spaceRadar || !radarStatus) return;
  const isStealth = selectedShipType === "furtif";
  const isProtected = coolingSystem || isStealth;

  spaceRadar.classList.remove("radar-warning", "radar-critical");
  if (isStealth) {
    radarStatus.textContent = "THERMIQUE\nOK";
  } else if (isProtected) {
    radarStatus.textContent = "REFRIG.\nSTABLE";
  } else {
    spaceRadar.classList.add("radar-warning");
    radarStatus.textContent = "TEMP\n98%\nCRIT";
  }
}

function setRadarCritical() {
  if (!spaceRadar || !radarStatus) return;
  spaceRadar.classList.remove("radar-warning");
  spaceRadar.classList.add("radar-critical");
  radarStatus.textContent = "ALERTE\nROUGE";
}

if (coolantBtn) {
  coolantBtn.addEventListener("click", () => {
    if (selectedShipType === "furtif") return;
    coolingSystem = !coolingSystem;
    coolantBtn.classList.toggle("active", coolingSystem);
    updateCoolingControl();
    if (sunHovered) updateSolarRadarHint();
  });
}

const realisticBtn = document.querySelector("#realistic-btn");
if (realisticBtn) {
  realisticBtn.addEventListener("click", () => {
    const isActive = document.body.classList.toggle("realistic-scale");
    realisticBtn.setAttribute("aria-pressed", String(isActive));
    realisticBtn.textContent = isActive
      ? "🔭 Vue réaliste (activée)"
      : "🔭 Vue réaliste";
  });
}

function ensureAudioContext() {
  const AudioCtor = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtor) return null;

  if (!rocketAudioContext) {
    rocketAudioContext = new AudioCtor();
  }

  if (rocketAudioContext.state === "suspended") {
    rocketAudioContext.resume();
  }

  return rocketAudioContext;
}

// Ensure AudioContext is created/resumed on first user gesture (bypass autoplay restrictions)
window.addEventListener('pointerdown', ensureAudioContext, { once: true });
window.addEventListener('keydown', ensureAudioContext, { once: true });

async function playRocketSound() {
  const ctx = ensureAudioContext();
  if (!ctx) return;

  if (ctx.state === "suspended") {
    await ctx.resume();
  }

  // Create white noise buffer
  const bufferLength = Math.ceil(ctx.sampleRate * 3.5);
  const noiseBuffer = ctx.createBuffer(1, bufferLength, ctx.sampleRate);
  const noiseData = noiseBuffer.getChannelData(0);
  for (let i = 0; i < bufferLength; i++) {
    noiseData[i] = (Math.random() * 2 - 1) * 0.8; // slightly reduced amplitude
  }

  const noiseSource = ctx.createBufferSource();
  noiseSource.buffer = noiseBuffer;
  noiseSource.loop = false;

  // Low-pass filter to create a deep rumble
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  const startTime = ctx.currentTime;
  filter.frequency.setValueAtTime(300, startTime);
  filter.frequency.linearRampToValueAtTime(900, startTime + 0.5);
  filter.Q.setValueAtTime(0.7, startTime);

  // Gain envelope (more audible)
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.001, startTime);
  gain.gain.linearRampToValueAtTime(0.65, startTime + 0.06);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 3.5);

  // Optional subtle LFO for 'throb'
  try {
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(4.5, startTime);
    lfoGain.gain.setValueAtTime(0.08, startTime);
    lfo.connect(lfoGain);
    lfoGain.connect(gain.gain);
    lfo.start(startTime);
    lfo.stop(startTime + 3.5);
  } catch (e) {
    // LFO is optional — ignore failures on very restricted environments
  }

  noiseSource.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  noiseSource.start(startTime);
  noiseSource.stop(startTime + 3.5);
}

function playRadioScanSound() {
  const ctx = ensureAudioContext();
  if (!ctx) return;

  if (ctx.state === 'suspended') {
    ctx.resume();
  }

  const startTime = ctx.currentTime;
  const duration = 1;

  const bufferLength = Math.ceil(ctx.sampleRate * duration);
  const noiseBuffer = ctx.createBuffer(1, bufferLength, ctx.sampleRate);
  const noiseData = noiseBuffer.getChannelData(0);

  for (let i = 0; i < bufferLength; i += 1) {
    const grain = (Math.random() * 2 - 1) * 0.9;
    const currentRatio = i / bufferLength;
    noiseData[i] = grain * (1 - currentRatio * 0.45);
  }

  const source = ctx.createBufferSource();
  source.buffer = noiseBuffer;

  const bandFilter = ctx.createBiquadFilter();
  bandFilter.type = 'bandpass';
  bandFilter.frequency.setValueAtTime(1800, startTime);
  bandFilter.Q.setValueAtTime(1.6, startTime);

  const lowFilter = ctx.createBiquadFilter();
  lowFilter.type = 'lowpass';
  lowFilter.frequency.setValueAtTime(3000, startTime);
  lowFilter.Q.setValueAtTime(0.6, startTime);

  const highFilter = ctx.createBiquadFilter();
  highFilter.type = 'highpass';
  highFilter.frequency.setValueAtTime(800, startTime);
  highFilter.Q.setValueAtTime(0.8, startTime);

  const tremolo = ctx.createOscillator();
  tremolo.type = 'sine';
  tremolo.frequency.setValueAtTime(7.5, startTime);

  const tremoloGain = ctx.createGain();
  tremoloGain.gain.setValueAtTime(0.18, startTime);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, startTime);
  gain.gain.linearRampToValueAtTime(0.2, startTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

  source.connect(bandFilter);
  bandFilter.connect(lowFilter);
  lowFilter.connect(highFilter);
  highFilter.connect(gain);
  tremolo.connect(tremoloGain);
  tremoloGain.connect(gain.gain);
  gain.connect(ctx.destination);

  tremolo.start(startTime);
  tremolo.stop(startTime + duration);
  source.start(startTime);
  source.stop(startTime + duration);
}

function playSatelliteDataSound() {
  const ctx = ensureAudioContext();
  if (!ctx) return;

  if (ctx.state === "suspended") {
    ctx.resume();
  }

  const startTime = ctx.currentTime;
  const duration = 2;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, startTime);
  gain.gain.linearRampToValueAtTime(0.18, startTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
  gain.connect(ctx.destination);

  for (let index = 0; index < 24; index += 1) {
    const oscillator = ctx.createOscillator();
    const beepGain = ctx.createGain();
    const beepStart = startTime + index * 0.08;
    const beepDuration = 0.025 + (index % 3) * 0.008;
    oscillator.type = "square";
    oscillator.frequency.setValueAtTime(
      index % 2 === 0 ? 1200 + (index % 4) * 140 : 2200 + (index % 3) * 180,
      beepStart
    );
    beepGain.gain.setValueAtTime(0.0001, beepStart);
    beepGain.gain.linearRampToValueAtTime(0.22, beepStart + 0.004);
    beepGain.gain.exponentialRampToValueAtTime(0.0001, beepStart + beepDuration);
    oscillator.connect(beepGain);
    beepGain.connect(gain);
    oscillator.start(beepStart);
    oscillator.stop(beepStart + beepDuration);
  }

  window.setTimeout(() => gain.disconnect(), 1100);
}

function updateRadar() {
  if (!currentShip || !radarBlip || !spaceRadar) return;

  const shipRect = currentShip.getBoundingClientRect();
  const radarRect = spaceRadar.getBoundingClientRect();
  const x = Math.min(94, Math.max(6, (shipRect.left + shipRect.width / 2) / window.innerWidth * 100));
  const y = Math.min(94, Math.max(6, (shipRect.top + shipRect.height / 2) / window.innerHeight * 100));
  radarBlip.style.left = `${x}%`;
  radarBlip.style.top = `${y}%`;
  radarFrame = window.requestAnimationFrame(updateRadar);
}

function startRadarTracking() {
  if (!radarBlip || !spaceRadar) return;
  window.cancelAnimationFrame(radarFrame);
  radarBlip.classList.add("is-active");
  updateRadar();
}

function stopRadarTracking() {
  window.cancelAnimationFrame(radarFrame);
  radarFrame = null;
  radarBlip.classList.remove("is-active");
}

async function playReturnSound() {
  const ctx = ensureAudioContext();
  if (!ctx) return;

  if (ctx.state === "suspended") {
    await ctx.resume();
  }

  const bufferLength = Math.ceil(ctx.sampleRate * 0.9);
  const noiseBuffer = ctx.createBuffer(1, bufferLength, ctx.sampleRate);
  const noiseData = noiseBuffer.getChannelData(0);
  for (let index = 0; index < bufferLength; index += 1) {
    noiseData[index] = Math.random() * 2 - 1;
  }

  const source = ctx.createBufferSource();
  const filter = ctx.createBiquadFilter();
  const gain = ctx.createGain();
  const startTime = ctx.currentTime;

  source.buffer = noiseBuffer;
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(220, startTime);
  filter.Q.setValueAtTime(0.7, startTime);

  gain.gain.setValueAtTime(0.0001, startTime);
  gain.gain.exponentialRampToValueAtTime(0.12, startTime + 0.04);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.9);

  source.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  source.start(startTime);
  source.stop(startTime + 0.9);
}

async function playLandingSound() {
  const ctx = ensureAudioContext();
  if (!ctx) return;

  if (ctx.state === "suspended") {
    await ctx.resume();
  }

  const playBeep = (frequency, duration, delay) => {
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    const startTime = ctx.currentTime + delay;

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(frequency, startTime);

    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.exponentialRampToValueAtTime(0.08, startTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    oscillator.connect(gain);
    gain.connect(ctx.destination);
    oscillator.start(startTime);
    oscillator.stop(startTime + duration);
  };

  playBeep(880, 0.1, 0);
  playBeep(1200, 0.15, 0.1);
}

function showHud(targetName, ship, duration = getTravelDuration()) {
  hudText.textContent = `APPROCHE DE ${targetName.toUpperCase()}...`;
  hudLoader.style.setProperty(
    "--vaisseau-couleur",
    ship.style.getPropertyValue("--vaisseau-couleur") || "#00eaff"
  );
  hudLoader.classList.remove("hidden");
  hudProgress.style.transition = "none";
  hudProgress.style.width = "0%";
  void hudProgress.offsetWidth;
  hudProgress.style.transition = `width ${duration}ms linear`;
  hudProgress.style.width = "100%";
}

function hideHud() {
  hudLoader.classList.add("hidden");
  hudProgress.style.transition = "none";
  hudProgress.style.width = "0%";
}

function createShockwave(target, ship) {
  const targetRect = target.getBoundingClientRect();
  const wave = document.createElement("div");
  const shipColor =
    ship.style.getPropertyValue("--vaisseau-couleur") || "#00eaff";

  wave.className = "shockwave";
  if (ship.type === "cargo") wave.classList.add("cargo-shockwave");
  wave.setAttribute("aria-hidden", "true");
  wave.style.left = `${targetRect.left + targetRect.width / 2}px`;
  wave.style.top = `${targetRect.top + targetRect.height / 2}px`;
  wave.style.setProperty("--vaisseau-couleur", shipColor);
  document.body.appendChild(wave);

  window.setTimeout(() => wave.remove(), 600);
}

function playCrashSound() {
  const ctx = ensureAudioContext();
  if (!ctx) return;
  if (ctx.state === "suspended") ctx.resume();
  const length = Math.ceil(ctx.sampleRate * 0.9);
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / length);
  const src = ctx.createBufferSource();
  const gain = ctx.createGain();
  src.buffer = buffer;
  gain.gain.setValueAtTime(0.0001, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.6, ctx.currentTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.9);
  src.connect(gain);
  gain.connect(ctx.destination);
  src.start(ctx.currentTime);
  src.stop(ctx.currentTime + 0.9);
}

function showCrashScreen() {
  // remove any existing ship and stop radar
  hideHud();
  stopRadarTracking();
  if (currentShip) {
    currentShip.remove();
    currentShip = null;
  }
  const overlay = document.createElement('div');
  overlay.className = 'crash-overlay';
  overlay.setAttribute('role','dialog');
  overlay.setAttribute('aria-live','assertive');
  const firstCrashMessage = !coolingSystemUnlocked
    ? `⚠️ CRASH MAJEUR — RECONSTRUCTION EN COURS...
Rapport de la salle de contrôle : Le prototype choisi était un vaisseau en phase d'expérimentation. Ses boucliers standards ne peuvent pas supporter les températures extrêmes et le plasma du Soleil.
Nos ingénieurs viennent d'installer en urgence un module de refroidissement cryogénique sur votre tableau de bord. Activez-le pour la prochaine tentative.`
    : "Alerte Température ! Pensez à activer le système de refroidissement avant le décollage vers le Soleil.";

  overlay.innerHTML = `
    <div class="crash-card">
      <h3>ÉCHEC DE LA SCÈNE</h3>
      <p>${firstCrashMessage.replace(/\n/g, "<br>")}</p>
      <button class="retry-btn" id="crash-retry">Réessayer</button>
    </div>
  `;
  document.body.appendChild(overlay);

  // explosion visual briefly
  const explosion = document.createElement('div');
  explosion.className = 'crash-explosion';
  document.body.appendChild(explosion);
  setTimeout(() => explosion.remove(), 900);

  const retry = overlay.querySelector('#crash-retry');
  retry.addEventListener('click', () => {
    overlay.remove();
    coolingSystemUnlocked = true;
    if (coolantBtn) {
      document.getElementById("coolant-btn").classList.remove("hidden");
      if (shipMenu) {
        shipMenu.classList.add("coolant-unlocked");
      }
    }
    stationLed.classList.remove('led-busy');
    stationLed.setAttribute('aria-label', 'Station disponible');
    parkShip();
  });
}

shipTypeSelect.addEventListener("change", (event) => {
  selectedShipType = event.target.value;
  updateCoolingControl();
  if (sunHovered) updateSolarRadarHint();
  if (!currentShip && !document.body.classList.contains("focus-mode")) parkShip();
});

shipColorSelect.addEventListener("change", (event) => {
  selectedShipColor = event.target.value;
  if (!currentShip && !document.body.classList.contains("focus-mode")) parkShip();
});

