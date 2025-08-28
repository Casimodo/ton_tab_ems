import * as lib from './modules/lib.js';
import * as profil from './modules/profil.js';
import * as emsOpenInfo from './modules/ems_openInfo.js';
import * as emsOpenDispatch from './modules/ems_openDispatch.js';
import * as emsOpenPersonnel from './modules/ems_openPersonnel.js';

let bsTooltips = [];                // instances de tooltips (BS5)


// Focus et active un marker
function fMarker(id) {
    emsOpenDispatch.focusMarker(id, { animate: true }); 
    emsOpenDispatch.setActive(id);
}

/** ****************************************************************************
 * Pour afficher le menu HOME
 * datas : {profil: {}, url: {}, img64: ''}
 * ****************************************************************************/
function home(datas) {

    let app_ambulance = ``;

    lib.clearScreen();
    let myProfil = datas.profil

    if (datas.config.job_name.includes(myProfil.job.name)) {
        app_ambulance = `
            <div class="app-icon icon-ambulance" id="emsOpenInfo">
                <i class="fa-solid fa-file"></i>
                <div class="app-name">Informations</div>
            </div>
            <div class="app-icon icon-ambulance" id="emsOpenPersonnel">
                <i class="fa-solid fa-users"></i>
                <div class="app-name">Personnel</div>
            </div>
            <div class="app-icon icon-ambulance" id="openDispatch">
                <i class="fa-solid fa-person-military-to-person"></i>
                <div class="app-name">Dispatch</div>
            </div>
        `;
    }


    const contenu = `
        <div class="app-grid">
            <div class="app-icon" id="openInfo">
                <i class="fa-solid fa-circle-info"></i>
                <div class="app-name">Aide</div>
            </div>
            <div class="app-icon" id="openProfil">
                <i class="fa-solid fa-address-card"></i>
                <div class="app-name">Profil</div>
            </div>
            ${app_ambulance}
        </div>
    `;
    $('#content').html(contenu);

    // Mise en place des actions des menu
    profil.action(datas);
    emsOpenInfo.action(datas);
    emsOpenDispatch.action(datas);
    emsOpenPersonnel.action(datas);

    // Les petits raccourcis client
    $('#openInfo').on('click', () => {
        $('#content').html($('#aide_info').html());
    });
    // $('#cmdPmms').on('click', () => {lib.postCmd('pmms')});
    // $('#openSiteWeb').on('click', () => {
    //     lib.actif = 'open_page_formation';
    //     $('#content').html($('#open_page_formation').html());
    // });
};


/** ****************************************************************************
 * Apres le chargement de la page
 * ****************************************************************************/
$(document).ready(() => {

    // Par défaut la tablette est caché
    $('body').hide();

    // Activation des icons
    feather.replace();

    // Fermeture par ESC
    $(document).keydown(function (e) {
        if (e.keyCode === 27 || e.keyCode === 8) {
            lib.close();
        }
    });

});


/** ****************************************************************************
 * Traitements au moment de la réception de message
 * ****************************************************************************/
let datas = {
    profil: null,
    config: null,
    img: null,
};
window.addEventListener('message', function (event) {
    
    if (lib.getActif() == '') {

        let dt = event.data; 
        switch (dt.type) {
            case "open":
                
                datas.profil = dt.values;
                datas.config = dt.config;
                datas.img = dt.img64;

                $('body').show();
                home(datas); // Affichage de la page d'accueil
                break;
            default:
                break;
        }

    }else{
        $('body').show();
    }
});

/** ****************************************************************************
 * Action btn HOME
 * ****************************************************************************/
$('#btn-home').on('click', () => {
    lib.setActif('');
    home(datas);
});


/** ****************************************************************************
 * Dispose Bootstrap permet de libérer la mémoire
 * ****************************************************************************/
if (window.bootstrap?.Tooltip) {
    bsTooltips.forEach(inst => inst?.dispose?.());
    bsTooltips = [];
} else {
    $('.has-tooltip').tooltip('dispose');
}