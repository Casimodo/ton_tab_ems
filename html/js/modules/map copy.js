// === CONFIG CALIBRATION ===
// Tu dois donner les coordonnées monde (GTA) correspondant au coin HAUT-GAUCHE et BAS-DROIT de ton image.
// Exemple *fictif* (à remplacer par tes vraies limites) :
const WORLD_TOP    = 8000;   // Y max
const WORLD_BOTTOM = -8000;  // Y min
const WORLD_LEFT   = -8000;  // X min
const WORLD_RIGHT  = 8000;   // X max

// Dimensions en pixels de ton image gtav_satellite.jpg :
const IMG_WIDTH  = 8192;   // px
const IMG_HEIGHT = 8192;   // px
// ==========================

// utilitaire NUI
const resource = GetParentResourceName ? GetParentResourceName() : 'ton_tab_ems';

// Éléments DOM
// const tablet   = document.getElementById('tablet');
const viewport = document.getElementById('viewport');
const img      = document.getElementById('mapImage');
const markersLayer = document.getElementById('markers');
const playerDot = document.getElementById('playerDot');
const scaleBar  = document.getElementById('scalebar');

// état pan/zoom
let scale = 0.20;               // zoom initial (1 = 100% pixels)
let originX = 0;                // translation écran (px) du coin image (0,0)
let originY = 0;
let isPanning = false;
let startX, startY;

// cache marqueurs
const markers = new Map(); // id -> {x,y,el,label,active}

// Applique transform aux calques
function applyTransform() {
  const t = `translate(${originX}px, ${originY}px) scale(${scale})`;
  img.style.transform = t;
  markersLayer.style.transform = t;
  playerDot.style.transform = `translate(${originX}px, ${originY}px) scale(${scale})`;
  updateScaleBar();
}

// World (x,y GTA) -> Image pixels
function worldToPixel(x, y) {
  const u = (x - WORLD_LEFT) / (WORLD_RIGHT - WORLD_LEFT);   // 0..1 horizontal
  const v = (WORLD_TOP - y) / (WORLD_TOP - WORLD_BOTTOM);    // 0..1 vertical (y inversé)
  return { px: u * IMG_WIDTH, py: v * IMG_HEIGHT };
}

// Image pixels -> World (x,y GTA)
function pixelToWorld(px, py) {
  const x = WORLD_LEFT + (px / IMG_WIDTH)  * (WORLD_RIGHT - WORLD_LEFT);
  const y = WORLD_TOP  - (py / IMG_HEIGHT) * (WORLD_TOP - WORLD_BOTTOM);
  return { x, y };
}

// Positionne un élément (marker/dot) en pixels image
function placeAtImagePx(el, px, py) {
  el.style.left = `${px}px`;
  el.style.top  = `${py}px`;
}

// Ajoute/maj le curseur joueur
function setPlayerPos(x, y) {
  const { px, py } = worldToPixel(x, y);
  placeAtImagePx(playerDot, px, py);
  playerDot.classList.remove('hidden');
}

// Ajoute un marker {id,x,y,label}
function addMarker(m) {
  let item = markers.get(m.id);
  if (!item) {
    const el = document.createElement('div');
    el.className = 'marker';
    el.title = m.label || m.id;
    el.addEventListener('click', (ev) => {
      ev.stopPropagation();
      focusMarker(m.id, { animate: true });
      setActive(m.id);
    });
    markersLayer.appendChild(el);
    item = { ...m, el, active: false };
    markers.set(m.id, item);
  } else {
    item.x = m.x; item.y = m.y; item.label = m.label || item.label;
    item.el.title = item.label;
  }
  const { px, py } = worldToPixel(item.x, item.y);
  placeAtImagePx(item.el, px, py);
}

// Supprime un marker par id
function removeMarker(id) {
  const item = markers.get(id);
  if (item) {
    item.el.remove();
    markers.delete(id);
  }
}

// Active visuellement un marker
function setActive(id) {
  markers.forEach((it) => it.el.classList.remove('active'));
  const item = markers.get(id);
  if (item) item.el.classList.add('active');
}

// Recentrer/zoomer sur un marker
function focusMarker(id, opts = {}) {
  const item = markers.get(id);
  if (!item) return;
  const { px, py } = worldToPixel(item.x, item.y);

  const targetScale = Math.max(scale, 0.35); // assure un zoom mini
  const dx = viewport.clientWidth  / 2 - px * targetScale;
  const dy = viewport.clientHeight / 2 - py * targetScale;

  if (opts.animate) {
    const steps = 12, startScale = scale, startOX = originX, startOY = originY;
    for (let i = 1; i <= steps; i++) {
      setTimeout(() => {
        const k = i / steps;
        scale   = startScale + (targetScale - startScale) * k;
        originX = startOX + (dx - startOX) * k;
        originY = startOY + (dy - startOY) * k;
        applyTransform();
      }, i * 12);
    }
  } else {
    scale = targetScale; originX = dx; originY = dy; applyTransform();
  }
}

// Gestion pan (drag)
viewport.addEventListener('mousedown', (e) => {
  isPanning = true; startX = e.clientX - originX; startY = e.clientY - originY;
  viewport.style.cursor = 'grabbing';
});
// window.addEventListener('mouseup', () => { isPanning = false; viewport.style.cursor = 'grab'; });
// window.addEventListener('mousemove', (e) => {
//   if (!isPanning) return;
//   originX = e.clientX - startX; originY = e.clientY - startY; applyTransform();
// });

// Zoom molette centré sous le curseur
viewport.addEventListener('wheel', (e) => {
  e.preventDefault();
  const prev = scale;
  const delta = -Math.sign(e.deltaY) * 0.1; // +0.1 zoom / -0.1 dezoom
  const next = Math.min(2.0, Math.max(0.1, scale + delta));

  // zoom autour du point curseur
  const rect = viewport.getBoundingClientRect();
  const cx = e.clientX - rect.left, cy = e.clientY - rect.top;
  originX = cx - (cx - originX) * (next / prev);
  originY = cy - (cy - originY) * (next / prev);
  scale = next; applyTransform();
}, { passive: false });

// Clic carte -> waypoint jeu
viewport.addEventListener('click', (e) => {
  // Convertir le point cliqué (écran) vers pixels image
  const rect = viewport.getBoundingClientRect();
  const sx = e.clientX - rect.left, sy = e.clientY - rect.top;
  const px = (sx - originX) / scale;
  const py = (sy - originY) / scale;
  const { x, y } = pixelToWorld(px, py);
  fetch(`https://${resource}/setWaypoint`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ x, y })
  });
});

// Échelle (barre)
function updateScaleBar() {
  // mètres/px côté monde
  const metersPerPx = (WORLD_RIGHT - WORLD_LEFT) / IMG_WIDTH; // 1 unité GTA = 1 m ~ (approx)
  const mppScreen = metersPerPx / scale; // sur l'écran, 1px vaut X mètres
  // on choisit une échelle “propre” (50 / 100 / 200 / 500 / 1000m…)
  const targets = [25, 50, 100, 200, 500, 1000, 2000];
  let targetMeters = targets[0];
  for (const t of targets) {
    const px = t / mppScreen;
    if (px >= 80 && px <= 200) { targetMeters = t; break; }
  }
  const widthPx = targetMeters / mppScreen;
  scaleBar.style.width = `${Math.round(widthPx)}px`;
  scaleBar.setAttribute('data-label', `${targetMeters} m`);
}

// Init image et transform
export function init(datas) {
  img.onload = () => {
    // centre initial sur la carte
    originX = (viewport.clientWidth - IMG_WIDTH * scale) / 2;
    originY = (viewport.clientHeight - IMG_HEIGHT * scale) / 2;
    applyTransform();
  };
  img.width = IMG_WIDTH; img.height = IMG_HEIGHT;
}

// NUI messages
// window.addEventListener('message', (event) => {
//   const { action, data, x, y } = event.data || {};
//   if (action === 'map_playerPos') setPlayerPos(x, y);
//   if (action === 'map_setMarkers') (data || []).forEach(addMarker);
// });

// Expose une petite API globale si tu veux piloter via devtools NUI
//window.SimpleMap = { addMarker, removeMarker, focusMarker, setPlayerPos };


export function content(datas) {

    let content = `
        <div id="viewport">
            <!-- Calque fond -->
            <img id="mapImage" src="../../img/maps/map_satellite.jpg" alt="GTAV Map" />

            <!-- Calque marqueurs -->
            <div id="markers"></div>
            
            <!-- Curseur joueur optionnel -->
            <div id="playerDot" class="dot hidden" title="Toi"></div>
        </div>
    `;
    console.log('>>>return content map');
    return content

}