import $ from '../jquery-shim.js';

/** ****************************************************************************
 * Debut system map
 * ****************************************************************************/
// === CONFIG CALIBRATION ===
// Tu dois donner les coordonnées monde (GTA) correspondant au coin HAUT-GAUCHE et BAS-DROIT de ton image.
// Exemple *fictif* (à remplacer par tes vraies limites) :
const WORLD_TOP    = 8409.491;   // Y max
const WORLD_BOTTOM = -4041.964;  // Y min
const WORLD_LEFT   = -5720.671;  // X min
const WORLD_RIGHT  = 6767.207;   // X max


// Dimensions en pixels de ton image gtav_satellite.jpg :
const IMG_WIDTH  = 2048 //8192;   // px
const IMG_HEIGHT = 2048 //8192;   // px
// ==========================

// utilitaire NUI
const resource = GetParentResourceName ? GetParentResourceName() : 'ton_tab_ems';

// état pan/zoom
let scale = 0.80;               // zoom initial (1 = 100% pixels)
let originX = 0;                // translation écran (px) du coin image (0,0)
let originY = 0;
let isPanning = false;
let startX, startY;

let viewport        = null;
let world           = null;
let img             = null;
let markersLayer    = null;
let unityLayer    = null;
let playerDot       = null;
let scaleBar        = null;
let actionFocus     = null;
let config          = null;    
let lastFocusId     = null;    

// cache marqueurs
const markers = new Map(); // id -> {x,y,el,label,active}
const unity = new Map(); // id -> {x,y,el,label,active}

// Applique transform aux calques
function applyTransform() {
    world.style.transform = `translate(${originX}px, ${originY}px) scale(${scale})`;
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
function setPlayerPos(x, y, ) {
    const { px, py } = worldToPixel(x, y);
    placeAtImagePx(playerDot, px, py);
    playerDot.classList.remove('hidden');
}


// Permet d'avoir dynamiquement le focus sur les lignes du dispatch
function updateFocus(idRecherche) {
    
    $("#table-dispatch tr").each(function() {
      // Retirer la classe à tous les tr
      $(this).removeClass("table-success");
      // Vérifier si le data-id correspond
      if ($(this).attr("data-id") == idRecherche) {
        $(this).addClass("table-success"); // Ajouter la classe
      }
    });
}

// Ajoute un marker {id,x,y,label}
function addMarker(m) {
    let item = markers.get(m.id);
    if (!item) {
        const el = document.createElement('div');
        el.className = 'marker';
        el.title = m.label || m.id;
        el.id = m.id;
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

// Ajoute une unity {id,x,y,label}
function addUnity(m) {
    let item = unity.get(m.id);
    if (!item) {
        const el = document.createElement('div');
        el.className = 'unity';
        el.title = m.label || m.id;
        el.id = m.id;
        el.addEventListener('click', (ev) => {
            ev.stopPropagation();
            // focusMarker(m.id, { animate: true });
            // setActive(m.id);
        });
        unityLayer.appendChild(el);
        item = { ...m, el, active: false };
        unity.set(m.id, item);
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

// Supprime les unity
function removeAllUnity() {
    unity.forEach((it) => {
        let id = it.id;
        const item = markers.get(id);
        if (item) {
            item.el.remove();
            markers.delete(id);
        }
    });
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
    lastFocusId = id;
    updateFocus(lastFocusId);
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

// Permet d'avoir dynamiquement le focus sur les lignes du dispatch
function changeStatut(id, status) {
    
    let classStatus = (status == 'en attente') ? 'eti-enattente' :
                          (status == 'attribué') ? 'eti-attribue' : 'eti-traite' ;
    
    var ligne = $("#table-dispatch tr[data-id='" + id + "']");
    ligne.find(".bade-status").removeClass("eti-enattente");
    ligne.find(".bade-status").removeClass("eti-attribue");
    ligne.find(".bade-status").removeClass("eti-traite");
    ligne.find(".bade-status").text(status);
    ligne.find(".bade-status").addClass(classStatus);
    
}

// Init image et transform
function init(datas) {

    // Éléments DOM
    viewport        = document.getElementById('viewport');
    world           = document.getElementById('world');
    img             = document.getElementById('mapImage');
    markersLayer    = document.getElementById('markers');
    playerDot       = document.getElementById('playerDot');
    scaleBar        = document.getElementById('scalebar');
    

    // Gestion pan (drag)
    viewport.addEventListener('mousedown', (e) => {
        isPanning = true; startX = e.clientX - originX; startY = e.clientY - originY;
        viewport.style.cursor = 'grabbing';
        });
        window.addEventListener('mouseup', () => { isPanning = false; viewport.style.cursor = 'grab'; });
        window.addEventListener('mousemove', (e) => {
        if (!isPanning) return;
        originX = e.clientX - startX; originY = e.clientY - startY; applyTransform();
    });

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
        // fetch(`https://${resource}/setWaypoint`, {
        //     method: 'POST', headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ x, y })
        // });
    });

    // NUI messages
    window.addEventListener('message', (event) => {
        const { action, data, x, y } = event.data || {};
        if (action === 'map_playerPos') setPlayerPos(x, y);
        if (action === 'map_setMarkers') (data || []).forEach(addMarker);
    });

    // Expose une petite API globale si tu veux piloter via devtools NUI
    window.SimpleMap = { addMarker, removeMarker, focusMarker, setPlayerPos };

    img.onload = () => {
        // centre initial sur la carte
        originX = (viewport.clientWidth - IMG_WIDTH * scale) / 2;
        originY = (viewport.clientHeight - IMG_HEIGHT * scale) / 2;
        applyTransform();
    };
    img.width = IMG_WIDTH; 
    img.height = IMG_HEIGHT;

    /** ****************************************************************************
     * ---- CALIBRATION AIDE AU DEVELOPPEMENT ----
    * Ci-dessous à mettre en commentaire ne sert qu'à calibrer la carte
    * Utilisation :
    * 1. Va te placer au bâtiment A en jeu → /pushpos → clic gauche sur sa position sur la carte NUI.
    * 2. Va au point B éloigné → /pushpos → clic droit sur la carte NUI.
    * 3. /dumpCalibration → copie/colle les valeurs dans le script (WORLD_...) 
    * Tu as maintenant calib.A et calib.B (x,y et px,py) dans la console NUI.
    * ATTENTION : Ne jamais fermer la carte de la tablette pour ce déplacer utilier les /tp 
    * avec les coordonnées que vous aurait choisie pour A et B.
    * ****************************************************************************/   
    // stocke deux échantillons
    // let calib = { A: null, B: null };

    // // utilité : obtenir (px,py) image à partir d'un clic
    // function screenToImagePx(sx, sy) {
    // const rect = viewport.getBoundingClientRect();
    // const ex = sx - rect.left; // px écran dans le viewport
    // const ey = sy - rect.top;
    // const px = (ex - originX) / scale;
    // const py = (ey - originY) / scale;
    // return { px, py };
    // }

    // // CLIQUE GAUCHE = point A, CLIQUE DROIT = point B (exemple)
    // viewport.addEventListener('click', (e) => {
    // const { px, py } = screenToImagePx(e.clientX, e.clientY);
    // // Renseigne ici xA,yA d’après ta position en jeu (ou via un prompt)
    // // Pour un vrai workflow, envoie x,y depuis client.lua -> NUI juste avant de cliquer.
    // const x = window.lastWorldX ?? 0;
    // const y = window.lastWorldY ?? 0;
    // calib.A = { x, y, px, py };
    // console.log('A =', JSON.stringify(calib.A));
    // });

    // viewport.addEventListener('contextmenu', (e) => {
    // e.preventDefault();
    // const { px, py } = screenToImagePx(e.clientX, e.clientY);
    // const x = window.lastWorldX ?? 0;
    // const y = window.lastWorldY ?? 0;
    // calib.B = { x, y, px, py };
    // console.log('B =', JSON.stringify(calib.B));
    // });

    // function computeBoundsFromAB(A, B, IMG_WIDTH, IMG_HEIGHT) {
    //     const bx = (B.x - A.x) / (B.px - A.px);
    //     const ax = A.x - bx * A.px;

    //     const by = (B.y - A.y) / (B.py - A.py);
    //     const ay = A.y - by * A.py;

    //     const WORLD_LEFT   = ax;
    //     const WORLD_RIGHT  = ax + bx * IMG_WIDTH;
    //     const WORLD_TOP    = ay;
    //     const WORLD_BOTTOM = ay + by * IMG_HEIGHT;

    //     return { ax, bx, ay, by, WORLD_LEFT, WORLD_RIGHT, WORLD_TOP, WORLD_BOTTOM };
    // }

    // // Quand A et B sont prêts :
    // function dumpCalibration() {
    //     if (!calib.A || !calib.B) { console.warn('A/B manquants'); return; }
    //     const out = computeBoundsFromAB(calib.A, calib.B, IMG_WIDTH, IMG_HEIGHT);
    //     console.table(out);
    //     console.log(`
    //     const WORLD_TOP = ${out.WORLD_TOP.toFixed(3)};
    //     const WORLD_BOTTOM = ${out.WORLD_BOTTOM.toFixed(3)};
    //     const WORLD_LEFT = ${out.WORLD_LEFT.toFixed(3)};
    //     const WORLD_RIGHT = ${out.WORLD_RIGHT.toFixed(3)};
    //     `);
    // }
    
    // window.addEventListener('message', (ev) => {
    //     const { action, x, y } = ev.data || {};
    //     if (action === 'setLastWorldPos') {
    //         window.lastWorldX = x;
    //         window.lastWorldY = y;
    //         console.log('Position monde reçue pour le prochain clic:', x, y);
    //     }
    //     if (action === 'dumpCalibration') {
    //         dumpCalibration()
    //     }
    // });

    /** ****************************************************************************
     * ---- FIN : CALIBRATION AIDE AU DEVELOPPEMENT ----
    * ****************************************************************************/   


     /**
      * Action click sur la liste
      */
    $('.fMarker').on('click', (e) => {
        
        let id = parseInt(e.currentTarget.getAttribute('data-id'));
        lastFocusId = id;
        setActive(id);
        focusMarker(id, { animate: true });
    });

    /**
     * Action prendre l'intervention
    */
    $('.actionPrendre').on('click', (e) => {
        
        let id = parseInt(e.currentTarget.getAttribute('data-id'));
        let status = e.currentTarget.getAttribute('data-status');
        let dtBody = JSON.stringify({ id : id, status : status });

        fetch(`https://${resource}/dispatch_get_inter`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json; charset=UTF-8',},
            body: dtBody,
        }).then(resp => resp.json()).then(resp => {
            
        });

    });

    /**
     * Action close l'intervention
    */
    $('.actionCloturer').on('click', (e) => {
        
        let id = parseInt(e.currentTarget.getAttribute('data-id'));
        let status = 'traité';
        let dtBody = JSON.stringify({ id : id, status : status });
        
        fetch(`https://${resource}/dispatch_get_inter`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json; charset=UTF-8',},
            body: dtBody,
        }).then(resp => resp.json()).then(resp => {
            
        });

    });

    /**
     * Action close l'intervention
    */
    $('.actionSupprimer').on('click', (e) => {
        
        let id = parseInt(e.currentTarget.getAttribute('data-id'));
        let status = 'close';
        let dtBody = JSON.stringify({ id : id, status : status });

        fetch(`https://${resource}/dispatch_get_inter`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json; charset=UTF-8',},
            body: dtBody,
        }).then(resp => resp.json()).then(resp => {
            
        });

    });

    /**
     * Voir les unités
    */
    $('#actionUnity').on('click', (e) => {
        
        fetch(`https://${resource}/get_unity`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json; charset=UTF-8',},
            body: null,
        }).then(resp => resp.json()).then(resp => {
            
        });

    });

    /**
     * Ce remet sur le dernier marker focus
    */
    if (lastFocusId != null) {
        focusMarker(lastFocusId, { animate: true });
        setActive(lastFocusId);
    }

}



/** ****************************************************************************
 * Fin system map
 * 
 * --- Utilisation ---
 * -- Markers
 * let marker = {id : 11, x : 261.758240, y : 6965.314454, label : 'appel urgence'};
 * addMarker(marker);
 * setActive(11);
 * focusMarker(11, { animate: true });
 * removeMarker(11);
 * -- Player
 * setPlayerPos(261.758240, 6965.314454);
 * ****************************************************************************/

/** ****************************************************************************
 * Contenu par défaut de la page
 * ****************************************************************************/
function content(config, datas, callback) {

    let details = '';
    datas.forEach((dt, index) => {
        let classStatus = (dt.status == 'en attente') ? 'eti-enattente' :
                          (dt.status == 'attribué') ? 'eti-attribue' : 'eti-traite' ;

        let classTrSelect = (lastFocusId == dt.id) ? 'table-success' : '' ;

        details += `
            <tr class="fMarker ${classTrSelect}" data-id="${dt.id}">
                <td class=""><span class="badge ${classStatus} text-dark bade-status">${dt.status}</span></td>
                <td>${dt.description}</td>
                <td>-</td>
                <td>${dt.heure_minute}</td>
                <td class="text-center">
                <i class="fas fa-hand-paper text-success mx-2 actionPrendre" title="Prendre l'intervention" data-id="${dt.id}" data-status="${dt.status}"></i>
                <i class="fas fa-check-circle text-success mx-2 actionCloturer" title="Clôturer" data-id="${dt.id}"></i>
                <i class="fas fa-trash text-danger mx-2 actionSupprimer" title="Supprimer" data-id="${dt.id}"></i>
                </td>
            </tr>
        `;
    });

    let content = `

        <h2 class="mb-4">📋 Dispatch EMS - Interventions</h2>
        <div class="row">

            <div class="col-5">
                <div id="scalebar"></div>
                <div id="viewport">
                    <div id="world"> 
                        <!-- Calque fond -->
                        <img id="mapImage" src="img/map_satellite.jpg" alt="Dispatch map" />

                        <!-- Calque marqueurs -->
                        <div id="markers"></div>

                        <!-- Calque unity -->
                        <div id="unity"></div>
                        
                        <!-- Curseur joueur optionnel -->
                        <div id="playerDot" class="dot hidden" title="Toi"></div>
                    </div>
                </div>
                <br/>
                <div class="row">
                    <div class="col-3">
                        <button type="button" id="actionUnity" class="btn btn-primary btn-sm">Refresh unités</button>
                    </div>
                    <div class="col-9">
                        <div id="detailUnite">Unité 6 - [Tony, Blaze]</div>
                    </div>
                </div>
            </div>


            <div class="col-7">
                <div class="col-12">
                    <span><i>cliquer sur la ligne pour voir l'emplacement</i></span><br/>
                    <span><i class="fas fa-hand-paper text-success mx-2"></i> Prendre / libérer l'intervention</i></span><br/>
                    <span><i class="fas fa-check-circle text-success mx-2"></i> Clôturer l'intervention</i></span><br/>
                    <span><i class="fas fa-trash text-danger mx-2"></i> Supprimer l'intervention</i></span>
                </div>
                <div class="col-12">
                    <table id="table-dispatch" class="table table-hover table-striped align-middle">
                        <thead class="table-dark">
                        <tr>
                            <th scope="col">Statut</th>
                            <th scope="col">Description</th>                        
                            <th scope="col">Unité</th>
                            <th scope="col">Heure</th>
                            <th scope="col" class="text-center">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                            ${details}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    `;

    $('#content').html(content);
    callback();
     
}

/** ****************************************************************************
 * Permet d'actualiser données
 * ****************************************************************************/
function refresh() {

    // Recherche des interventions
    fetch(`https://${resource}/dispatch_get`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json; charset=UTF-8',},
        body: "",
    }).then(resp => resp.json()).then(resp => {
        
        let datas = resp;
        content(config, datas, () => {
            
            init(config);   // Initialisation de la map si pas encore faite
            
            datas.forEach((dt, index) => {
                removeMarker(dt.id); // On supprime les anciens markers

                let coord = JSON.parse(dt.location);
                //let coord = {x : location[0], y : location[1]};
                console.log(`Coordonnées intervention x:${coord.x} y:${coord.y} id:${dt.id} desc:${dt.description}`);
                addMarker({id: dt.id, x: coord.x, y: coord.y, label: dt.description});

            });

        });    
    });

}


/** ****************************************************************************
 * Permet de lancer les actions quand click sur l'icon de la home page
 * ****************************************************************************/
let oldMarkers = [];
export function action(config) {

    config = config || {};

    // Mise en place des actions des menu
    $('#openDispatch').on('click', () => {

        refresh();        

    }); 

};

/** ****************************************************************************
 * Reception de message pour le dispatch
 * ****************************************************************************/
window.addEventListener('message', function (event) {

    let dt = event.data; 
    switch (dt.type) {
        case "dispatch_status":
            console.log(`dt.id:${dt.values.id}, dt.status:${dt.values.status}`)
            changeStatut(dt.values.id, dt.values.status)
            break;
        default:
            break;
    }

});