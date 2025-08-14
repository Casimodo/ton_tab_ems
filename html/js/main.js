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
window.addEventListener('message', function (event) {
    
    if (lib.actif == '') {

        switch (event.data.type) {
            case "open":
                profil.datas = event.data.values;
                profil.img = event.data.img64;
                lib.profil = profil.datas;
                $('body').show();
                lib.home();
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
    lib.actif = '';
    lib.home();
});