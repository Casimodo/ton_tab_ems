/** ****************************************************************************
 * Contenu par défaut de la page
 * ****************************************************************************/
export function content(datas) {

    let dt = datas;
    console.log('emsOpenInfo.content', JSON.stringify(dt.url));

        let content = `
            <div id="info_service">
                tototoo
                <embed class="embed" src="` + dt.url.url_google_info_service + `"/>
            </div>
        `;

        $('#content').html(content);

};

/** ****************************************************************************
 * Permet de lancer les actions quand click sur l'icon de la home page
 * ****************************************************************************/
export function action(datas) {

    $('#emsOpenInfo').on('click', () => {

        content(datas);

    });

};