import * as lib from './modules/lib.js';
import * as profil from './modules/profil.js';
import * as emsOpenInfo from './modules/ems_openInfo.js';


/**
 * Pour afficher le menu HOME
 * datas : {profil: {}, url: {}, img64: ''}
 */
function home(datas) {

    let app_police = ``;
    let app_patron = ``;
    let app_mecano = ``;
    let app_ambulance = ``;

    lib.clearScreen();
    let myProfil = datas.profil

    if (myProfil.job.name == 'mechanic') {
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

    if (myProfil.job.name == 'ambulance') {
        app_ambulance = `
            <div class="app-icon icon-ambulance" id="emsOpenInfo">
                <i class="fa-solid fa-person-military-to-person"></i>
                <div class="app-name">Informations</div>
            </div>
            <div class="app-icon icon-ambulance" id="openAmbulanceGetCall">
                <i class="fa-solid fa-person-military-to-person"></i>
                <div class="app-name">Prise Appel</div>
            </div>
        `;
    }

    // Pour un autre profil par exemple
    // if (myProfil.job.name == 'xxx') {
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

    // policeList.action();
    // getCall.action();
    // policeFindVe.action();
    // policeDossier.action();
    // policeCasier.action();
    // policeLicence.action();
    // mecanoList.action();

    // Les petits raccourcis client
    $('#openSiteWeb').on('click', () => {
        lib.actif = 'open_page_formation';
        $('#content').html($('#open_page_formation').html());
    });
    $('#openInfo').on('click', () => {
        $('#content').html($('#aide_info').html());
    });
    // $('#cmdVehiclekeys').on('click', () => {lib.postCmd('vehiclekeys')});
    // $('#cmdAttachtrailer').on('click', () => {lib.postCmd('attachtrailer')});
    // $('#cmdDetachtrailer').on('click', () => {lib.postCmd('detachtrailer')});
    // $('#cmdPmms').on('click', () => {lib.postCmd('pmms')});
};


/** *******************************************
 *  apres le chargement de la page
 ******************************************** */
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


// Dispatch des traitements au moment de la réception de message
let datas = {
    profil: null,
    url: null,
    img: null,
};
window.addEventListener('message', function (event) {
    
    if (lib.getActif() == '') {

        switch (event.data.type) {
            case "open":
                datas.profil = event.data.values;
                datas.url = event.data.url;
                datas.img = event.data.img64;

                console.log('url', JSON.stringify(event.data));
                $('body').show();
                home(datas); // Affichage de la page d'accueil
                break;
            case "xxx":
                break;
            default:
                break;
        }

    }else{
        $('body').show();
    }
});

$('#btn-home').on('click', (event) => {
    lib.setActif('');
    home(datas);
});