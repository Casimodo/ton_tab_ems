import $ from '../jquery-shim.js';

let Config = null;
let Lib = null;

function selectedAgent(name, listAgent, identifier) {

    let detailSelect = ``;
    detailSelect += `<option ${(identifier == '') ? 'selected' : ''} value=""></option>`;
    listAgent.forEach(el => {
        detailSelect += `<option ${(el.identifier == identifier) ? 'selected' : ''} value="${el.identifier}">${el.firstname}, ${el.lastname}</option>`;
    });

    let contentAgent = `
        <select id="${name}" class="form-select">
            ${detailSelect}
        </select>
    `;
    return contentAgent;
}

function contentDetail(dt, agentList, cb) {

    // <table class="table table-hover table-striped align-middle mb-0 text-center w-100">
    let contentDetail = `
        <div class="container mt-5">
            <div class="card shadow bg-dark text-white">
                <div class="card-header bg-primary text-white">
                <h4 class="mb-0">Formulaire de gestion d’une unité</h4>
                </div>
                <div class="card-body">
                <form>
                    <!-- Nom unité -->
                    <div class="mb-3">
                    <label for="nomUnite" class="form-label"><strong>Nom de l’unité</strong> : ${dt.nom_unite}</label>
                    </div>

                    <!-- Statut -->
                    <div class="mb-3">
                    <label for="statut" class="form-label"><strong>Statut</strong></label>
                    <select id="statut" class="form-select">
                        <option ${(dt.status == 'off') ? 'selected' : ''} value="off">off</option>
                        <option ${(dt.status == 'disponible') ? 'selected' : ''} value="disponible">disponible</option>
                        <option ${(dt.status == 'indisponible') ? 'selected' : ''} value="indisponible">indisponible</option>
                    </select>
                    </div>

                    <!-- Agents -->
                    <div class="row">
                    <div class="col-md-6 mb-3">
                        <label for="agent1" class="form-label"><strong>Agent 1</strong></label>
                        ${selectedAgent('agent1_id', agentList, dt.agent1_id)}
                    </div>
                    <div class="col-md-6 mb-3">
                        <label for="agent2" class="form-label"><strong>Agent 2</strong></label>
                        ${selectedAgent('agent2_id', agentList, dt.agent2_id)}
                    </div>
                    </div>

                    <div class="row">
                    <div class="col-md-6 mb-3">
                        <label for="agent3" class="form-label"><strong>Agent 3</strong></label>
                        ${selectedAgent('agent3_id', agentList, dt.agent3_id)}
                    </div>
                    <div class="col-md-6 mb-3">
                        <label for="agent4" class="form-label"><strong>Agent 4</strong></label>
                        ${selectedAgent('agent4_id', agentList, dt.agent4_id)}
                    </div>
                    </div>

                    <div class="col-md-6 mb-3">
                        <label for="agent4" class="form-label"><strong>Dernière Maj</strong> : ${Lib.formatTimestamp(dt.date_update)}</label>
                    </div>

                    <!-- Boutons -->
                    <div class="d-flex justify-content-end">
                    <button type="button" class="btn btn-outline-secondary me-2 actionAnnuler">Annuler</button>
                    <button type="button" class="btn btn-primary actionRecord" data-id="${dt.id}">Enregistrer</button>
                    </div>
                </form>
                </div>
            </div>
        </div>
    `;

    $('#content').html(contentDetail);
    cb();
};

/** ****************************************************************************
 * Init après chargement
 * ****************************************************************************/
function init() {

    // Voir le détail d'une unitée pour la modifier
    $(".actionDetailUnite").on("click", (e) => {

        let key = parseInt(e.currentTarget.getAttribute('data-id'));
        
        // Récupère la list des agents
        fetch(`https://${GetParentResourceName()}/ems_list`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify({}),
        }).then(resp => resp.json()).then(resp => {

            contentDetail(datasAll[key], resp, () => {
                init();
            });
            
        });

    });

    // Annuler la modification d'une unitée
    $(".actionAnnuler").on("click", (e) => {

        openAction(Config, Lib);

    });

    // Annuler la modification d'une unitée
    $(".actionRecord").on("click", (e) => {

        let id = parseInt(e.currentTarget.getAttribute('data-id'));

        let record = {
            id : id,
            statut : $("#statut").val(),
            agent1_id : $("#agent1_id").val(),
            agent2_id : $("#agent2_id").val(),
            agent3_id : $("#agent3_id").val(),
            agent4_id : $("#agent4_id").val()
        };
        
        // Récupère la list des agents
        fetch(`https://${GetParentResourceName()}/ems_unite_record`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify(record),
        }).then(resp => resp.json()).then(resp => {

            openAction(Config, Lib);
            
        });

    });

}

/** ****************************************************************************
 * Contenu par défaut de la page
 * ****************************************************************************/
let datasAll = null;
function content(config, datas, lib, callback) {

    let cf = config;

    let details = '';
    datasAll = datas;
    let i = 0;
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
                    <button type="button" data-id="${i}" class="btn btn-primary actionDetailUnite" style="--bs-btn-padding-y: .25rem; --bs-btn-padding-x: .5rem; --bs-btn-font-size: .75rem;">
                        <i class="fa-solid fa-pen"></i>
                    </button>
                </td>
            </tr>
        `;
        i++;
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
    callback();
};


/** ****************************************************************************
 * Permet d'appeler le content de cette page principal
 * ****************************************************************************/
function openAction(config, lib) {

    fetch(`https://${GetParentResourceName()}/ems_unite`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify({}),
    }).then(resp => resp.json()).then(resp => {
        
        content(config, resp, lib, () => {
            init();
        });
        
    });

}

/** ****************************************************************************
 * Permet de lancer les actions quand click sur l'icon de la home page
 * ****************************************************************************/
export function action(config, lib) {

        Config = config;
        Lib = lib;

        
    // Mise en place des actions des menu
    $('#openOpenUnite').on('click', () => {
        openAction(Config, Lib); 
    });

};