
/** ****************************************************************************
 * Contenu par défaut de la page
 * ****************************************************************************/
export function content(datas) {

    let dt = datas;
    let content = `
        <div>
            <embed class="embed-googlesheet" src="` + dt.url.google_info_service + `"/>
        </div>
    `;

    $('#content').html(content);
};


/** ****************************************************************************
 * Permet de lancer les actions quand click sur l'icon de la home page
 * ****************************************************************************/
export function action(datas) {

    // (Re)bind jQuery avec NAMESPACE pour éviter les doublons
    $('#emsOpenInfo').on('click', () => {
        content(datas);
    }); 

};