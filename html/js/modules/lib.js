
const lib = {};
lib.profil = {}; // exemple : {"skin_male":[],"label":"LSPD","grade":7,"skin_female":[],"grade_label":"Capitaine LSPD","name":"police","grade_name":"captain","grade_salary":100}
lib.actif = '';

/**
 * Permet de gerer des previews sur les images
 * @param {*} urlInput 
 * @param {*} previewDiv 
 */
lib.previewImage = (urlInput, previewDiv) => {
    $(urlInput).on('input', function () {
        const url = $(this).val();
        if (url) {
            $(previewDiv).html(`<img src="${url}" alt="Preview" onerror="this.onerror=null;this.src='https://via.placeholder.com/150?text=Error';">`);
        } else {
            $(previewDiv).html('<i class="fas fa-camera fa-3x text-muted"></i>');
        }
    });
}


/**
 * Demande de close de la tablette envoi au client
 */
lib.close = () => {
    fetch(`https://${GetParentResourceName()}/close`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify({}),
    }).then(resp => resp.json()).then(resp => {
        if (resp === 'ok') {
            $('body').hide();
        }
    });
};

lib.postCmd = (cmd) => {
    lib.close();
    fetch(`https://${GetParentResourceName()}/${cmd}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify(''),
    }).then(resp => resp.json()).then(resp => {
        
    });
}

/**
 * Permet d'appeler
 */
lib.call = (number) => {
    fetch(`https://${GetParentResourceName()}/phone_call`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify(number),
    }).then(resp => resp.json()).then(resp => {

    });
};


/**
 * Permet de mettre un écran patientez
 */
lib.wait = () => {
    const contenu = `
        <div class="spinner-border text-secondary p-wait" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    `;
    $('#content').html(contenu);
};


lib.clearScreen = () => {
    $('#police_dossier_edit').hide();
};


/**
 * Pour afficher le menu HOME
 */
lib.home = (my) => {

    let app_police = ``;
    let app_patron = ``;
    let app_mecano = ``;
    let app_ambulance = ``;

    lib.clearScreen();

    let isGetCall = (lib.profil.getCall == true) ? `<i class="fa-solid fa-phone"></i>` : `<i class="fa-solid fa-phone-slash"></i>`;

    if (lib.profil.job.name == 'police') {
        app_police = `
            <div class="app-icon icon-police" id="openPoliceList">
                <i class="fa-solid fa-person-military-to-person"></i>
                <div class="app-name">Effectifs</div>
            </div>
            <div class="app-icon icon-police" id="openPoliceGetCall">
                ${isGetCall}
                <div class="app-name">Prise Appel</div>
            </div>
            <div class="app-icon icon-police" id="openPolicefindVe">
                <i class="fa-solid fa-magnifying-glass"></i>
                <div class="app-name">Rech. Immat.</div>
            </div>
            <div class="app-icon icon-police" id="openPoliceDossier">
                <i class="fa-solid fa-clipboard"></i>
                <div class="app-name">Dossiers</div>
            </div>
            <div class="app-icon icon-police" id="openPoliceCasier">
                <i class="fa-solid fa-scale-balanced"></i>
                <div class="app-name">Casiers</div>
            </div>
            <div class="app-icon icon-police" id="openPoliceLicence">
                <i class="fa-regular fa-id-card"></i>
                <div class="app-name">Licences</div>
            </div>
            <div class="app-icon icon-police" id="openPoliceCat1">
                <i class="fa-solid fa-book"></i>
                <div class="app-name">Autres</div>
            </div>
        `;
    }

    if (lib.profil.job.name == 'mechanic') {
        app_mecano = `
            <div class="app-icon icon-mecano" id="openMecanoGetCall">
                ${isGetCall}
                <div class="app-name">Prise Appel</div>
            </div>
            <div class="app-icon icon-mecano" id="openMecanoList">
                <i class="fa-solid fa-person-military-to-person"></i>
                <div class="app-name">Effectifs</div>
            </div>
        `;
    }

    if (lib.profil.job.name == 'ambulance') {
        app_ambulance = `
            <div class="app-icon icon-ambulance" id="openAmbulanceGetCall">
                ${isGetCall}
                <div class="app-name">Prise Appel</div>
            </div>
        `;
    }

    // Pour un autre profil par exemple
    // if (lib.profil.job.name == 'xxx') {
    //     app_patron = `
    //         <div class="app-icon icon-patron" id="openPatron">
    //             <i class="fa-solid fa-person-military-to-person"></i>
    //             <div class="app-name">Effectifs</div>
    //         </div>
    //     `;
    // }

    const contenu = `
        <div class="app-grid">
            <div class="app-icon" id="openInfo">
                <i class="fa-solid fa-circle-info"></i>
                <div class="app-name">Aide</div>
            </div>
            <div class="app-icon" id="openSiteWeb">
                <i class="fa-brands fa-youtube"></i>
                <div class="app-name">Tutoriel</div>
            </div>
            <div class="app-icon" id="openProfil">
                <i class="fa-solid fa-address-card"></i>
                <div class="app-name">Profil</div>
            </div>
            <div class="app-icon" id="openMyCar">
                <i class="fa-solid fa-square-parking"></i>
                <div class="app-name">Mes Voitures</div>
            </div>
            <div class="app-icon" id="cmdVehiclekeys">
                <i class="fa-solid fa-key"></i>
                <div class="app-name">Donner clé</div>
            </div>
            <div class="app-icon" id="cmdAttachtrailer">
                <i class="fa-solid fa-trailer"></i>
                <div class="app-name">Attacher ON</div>
            </div>
            <div class="app-icon" id="cmdDetachtrailer">
                <i class="fa-solid fa-trailer"></i>
                <div class="app-name">Détacher OFF</div>
            </div>
            <div class="app-icon" id="cmdPmms">
                <i class="fa-solid fa-tv"></i>
                <div class="app-name">Player</div>
            </div>
            ${app_police}
            ${app_mecano}
            ${app_patron}
            ${app_ambulance}
        </div>
    `;
    $('#content').html(contenu);

    // Mise en place des actions des menu
    profil.action();
    myCar.action();
    policeList.action();
    getCall.action();
    policeFindVe.action();
    policeDossier.action();
    policeCasier.action();
    policeLicence.action();
    policeSouscat1.action();
    mecanoList.action();

    // Les petits raccourcis client
    $('#openSiteWeb').on('click', () => {
        lib.actif = 'open_page_formation';
        $('#content').html($('#open_page_formation').html());
    });
    $('#openInfo').on('click', () => {
        $('#content').html($('#aide_info').html());
    });
    $('#cmdVehiclekeys').on('click', () => {lib.postCmd('vehiclekeys')});
    $('#cmdAttachtrailer').on('click', () => {lib.postCmd('attachtrailer')});
    $('#cmdDetachtrailer').on('click', () => {lib.postCmd('detachtrailer')});
    $('#cmdPmms').on('click', () => {lib.postCmd('pmms')});
};


/**
 * Met à jour l'heure
 */
lib.updateTime = () => {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    $('#time').text(timeString);
}
setInterval(lib.updateTime(), 1000);
lib.updateTime();


/**
 * Permet de formater un nombre en version US
 * @param {int} nombre 
 */
lib.formatNumber = (nombre) => {
    return nombre.toLocaleString('en-US', {
        minimumFractionDigits: 2, // Pour afficher deux décimales
        maximumFractionDigits: 2
    });
}

/** *******************************************
 *  timestamp to local string format
 * @param {timestamp (unix * 1000) for miliem format} not_unix_timestamp 
 ******************************************** */
lib.formatTimestamp = (timestamp) => {
    // Crée un objet Date à partir du timestamp
    const date = new Date(timestamp);

    // Récupère les composants de la date
    const day = String(date.getDate()).padStart(2, '0'); // Jour (DD)
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Mois (MM)
    const year = date.getFullYear(); // Année (YYYY)

    // Récupère les composants de l'heure
    const hours = String(date.getHours()).padStart(2, '0'); // Heures (HH)
    const minutes = String(date.getMinutes()).padStart(2, '0'); // Minutes (MM)

    // Formatte la date et l'heure au format "DD/MM/YYYY HH:MM"
    const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}`;

    return formattedDate;
}

/**
 * Permet de donner un vrai label à lafourriere
 * @param {string} keyFourriere 
 */
lib.fourriereLabel = (keyFourriere) => {
    switch (keyFourriere) {
        case 'impound_sud':
            label = 'Fourrière du Sud';
            break;
        case 'impound_nord':
            label = 'Fourrière du Nord';
            break;
        case 'boat_impound':
            label = 'Fourrière Bateau';
            break;
        case 'air_impound':
            label = 'Fourrière Avion';
            break;
        default:
            label = keyFourriere;
            break;
    }
    return label;
}