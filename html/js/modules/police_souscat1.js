policeSouscat1 = {};

/** ****************************************************************************
 * Permet de lancer les actions quand click sur l'icon de la home page
 * ****************************************************************************/
policeSouscat1.action = () => {

    $('#openPoliceCat1').on('click', () => {

        let content = `
            <div class="app-grid">
                
                
                <div class="app-icon icon-police" id="openPoliceInfo">
                    <i class="fa-solid fa-circle-info"></i>
                    <div class="app-name">Infos</div>
                </div>
                <div class="app-icon icon-police" id="openPolicePhotoBadge">
                    <i class="fa-regular fa-id-card"></i>
                    <div class="app-name">Photo Badge</div>
                </div>
                <div class="app-icon icon-police" id="openPoliceMatricule">
                    <i class="fa-solid fa-clipboard-list"></i>
                    <div class="app-name">Chg. Matricule</div>
                </div>
                <div class="app-icon icon-police" id="openPoliceCodepenal">
                    <i class="fa-solid fa-book"></i>
                    <div class="app-name">Code pénal</div>
                </div>
                <div class="app-icon icon-police" id="openPoliceEvolution">
                    <i class="fa-solid fa-person-walking-dashed-line-arrow-right"></i>
                    <div class="app-name">Evolution carrière</div>
                </div>
                <div class="app-icon icon-police" id="openPoliceStory">
                    <i class="fa-solid fa-timeline"></i>
                    <div class="app-name">Division LSPD</div>
                </div>

            </div>
        `;

        $('#content').html(content);

        // Action des boutons
        $('#openPoliceInfo').on('click', () => {
            $('#content').html($('#police_info').html());
        });
        $('#openPolicePhotoBadge').on('click', () => { lib.postCmd('setbadgephoto'); });
        $('#openPoliceMatricule').on('click', () => {

            fetch(`https://${GetParentResourceName()}/matricule_police`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                },
                body: JSON.stringify({}),
            }).then(resp => resp.json()).then(resp => {
                
            });
    
        });

        // Simple ouverture de page html ou onglet
        $('#openPoliceCodepenal').on('click', () => {
            lib.actif = 'police_codepenal';
            $('#content').html($('#police_codepenal').html());
        });
        $('#openSiteWeb').on('click', () => {
            lib.actif = 'open_page_formation';
            $('#content').html($('#open_page_formation').html());
        });
        $('#openPoliceEvolution').on('click', () => {
            lib.actif = 'police_evolution';
            $('#content').html($('#police_evolution').html());
        });
        $('#openPoliceStory').on('click', () => {
            lib.actif = 'police_story';
            $('#content').html($('#police_story').html());
        });

    });

};