
/** ****************************************************************************
 * Contenu par défaut de la page
 * ****************************************************************************/
function content(config, datas, lib) {

    let cf = config;

    let details = '';
    datas.forEach(el => {
        details += `
            <tr>
                <td class="unite-${el.status}">${el.nom_unite}</td>
                <td class="unite-${el.status}">${el.status}</td>
                <td class="unite-${el.status}">${el.agent1_name}</td>
                <td class="unite-${el.status}">${el.agent2_name}</td>
                <td class="unite-${el.status}">${el.agent3_name}</td>
                <td class="unite-${el.status}">${el.agent4_name}</td>
                <td class="unite-${el.status}">${lib.formatTimestamp(el.date_update)}</td>
                <td>
                    <button type="button" class="btn btn-primary" style="--bs-btn-padding-y: .25rem; --bs-btn-padding-x: .5rem; --bs-btn-font-size: .75rem;">
                        <i class="fa-solid fa-pen"></i>
                    </button>
                </td>
            </tr>
        `;
    });

    // <table class="table table-hover table-striped align-middle mb-0 text-center w-100">
    let content = `
        <div class="container my-6 text-center">
            <div class="row justify-content-center">
                <div class="col-lg-12">
                    <div class="card-header bg-dark text-white text-center">
                        <h4 class="mb-0">Liste des unités</h4>
                        <h5 class="mb-0"><i>Attention, merci de bien mettre à jour cette liste qui sert au dispatch, ne pas faire de double affectation seule la première sera retenu.</i></h5>
                    </div>
                    <br/>
                    <!-- table-responsive permet à la table d'utiliser 100% de la largeur -->
                    <div class="card-body p-0">
                        <div class="table-responsive">
                            <table class="table table-dark table-hover">
                                <thead class="table-dark">
                                    <tr>
                                        <th scope="col">Nom unitée</th>
                                        <th scope="col">Statut</th>
                                        <th scope="col">Agent 1</th>
                                        <th scope="col">Agent 2</th>
                                        <th scope="col">Agent 3</th>
                                        <th scope="col">Agent 4</th>
                                        <th scope="col">Date maj</th>
                                        <th scope="col">Modifier</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${details}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    $('#content').html(content);
};


/** ****************************************************************************
 * Permet de lancer les actions quand click sur l'icon de la home page
 * ****************************************************************************/
export function action(config, lib) {

        // Mise en place des actions des menu
        $('#openOpenUnite').on('click', () => {

            fetch(`https://${GetParentResourceName()}/ems_unite`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify({}),
        }).then(resp => resp.json()).then(resp => {
            content(config, resp, lib);
        });

            
    }); 

};