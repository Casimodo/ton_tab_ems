const lib = {};
let actif = '';


/** ****************************************************************************
 * Permet de savoir quelle page est active
 * ****************************************************************************/
export function getActif() {
    return actif;
}


/** ****************************************************************************
 * Permet de mettre à jour la page active
 * @param {*} page 
 * ****************************************************************************/
export function setActif(page) {
    actif = page;
}


/** ****************************************************************************
 * Permet de gerer des previews sur les images
 * @param {*} urlInput 
 * @param {*} previewDiv 
 * ****************************************************************************/
export function previewImage (urlInput, previewDiv) {
    $(urlInput).on('input', function () {
        const url = $(this).val();
        if (url) {
            $(previewDiv).html(`<img src="${url}" alt="Preview" onerror="this.onerror=null;this.src='https://via.placeholder.com/150?text=Error';">`);
        } else {
            $(previewDiv).html('<i class="fas fa-camera fa-3x text-muted"></i>');
        }
    });
}


/** ****************************************************************************
 * Demande de close de la tablette envoi au client
 * ****************************************************************************/
export function close() {
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

/** ****************************************************************************
 * Permet d'envoyer une commande au client
 * ****************************************************************************/
export function postCmd(cmd) {
    close();
    fetch(`https://${GetParentResourceName()}/${cmd}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify(''),
    }).then(resp => resp.json()).then(resp => {
        
    });
}


/** ****************************************************************************
 * Permet de mettre un écran patientez
 * ****************************************************************************/
export function wait() {
    const contenu = `
        <div class="spinner-border text-secondary p-wait" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    `;
    $('#content').html(contenu);
};


/** ****************************************************************************
 * Permet de vider l'écran
 * ****************************************************************************/
export function clearScreen() {
    $('#police_dossier_edit').hide();
};


/** ****************************************************************************
 * Met à jour l'heure
 * ****************************************************************************/
export function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    $('#time').text(timeString);
}
setInterval(updateTime(), 1000);
updateTime();


/** ****************************************************************************
 * Permet de formater un nombre en version US
 * @param {int} nombre 
 * ****************************************************************************/
export function formatNumber(nombre) {
    return nombre.toLocaleString('en-US', {
        minimumFractionDigits: 2, // Pour afficher deux décimales
        maximumFractionDigits: 2
    });
}


/** ****************************************************************************
 *  timestamp to local string format
 * @param {timestamp (unix * 1000) for miliem format} not_unix_timestamp 
 * ****************************************************************************/
export function formatTimestamp(timestamp) {
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
