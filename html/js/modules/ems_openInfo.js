
/** ****************************************************************************
 * Contenu par défaut de la page
 * ****************************************************************************/
function content(config) {

    let cf = config;
    let content = `
        <div>
            <embed class="embed-googlesheet" src="` + cf.config.url.google_info_service + `"/>
        </div>
    `;

    $('#content').html(content);
};


/** ****************************************************************************
 * Permet de lancer les actions quand click sur l'icon de la home page
 * ****************************************************************************/
export function action(config) {

    // Mise en place des actions des menu
    $('#emsOpenInfo').on('click', () => {
        content(config);
    }); 

};