
/** ****************************************************************************
 * Contenu par défaut de la page
 * ****************************************************************************/
function content(datas) {

    let dt = datas;
    let content = `
        <div>
            <embed class="embed-googlesheet" src="` + dt.config.url.google_info_service + `"/>
        </div>
    `;

    $('#content').html(content);
};


/** ****************************************************************************
 * Permet de lancer les actions quand click sur l'icon de la home page
 * ****************************************************************************/
export function action(datas) {

    // Mise en place des actions des menu
    $('#emsOpenInfo').on('click', () => {
        content(datas);
    }); 

};