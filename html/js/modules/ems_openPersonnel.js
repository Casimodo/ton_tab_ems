
/** ****************************************************************************
 * Contenu par défaut de la page
 * ****************************************************************************/
function content(config, datas, lib) {

    let cf = config;

    let details = '';
    datas.forEach(el => {
        details += `
            <tr>
                <td>${el.lastname}, ${el.firstname}</td>
                <td>${el.dateofbirth}</td>
                <td>${el.job}</td>
                <td>${el.job_grade}</td>
                <td>${el.phone_number}</td>
                <td>${lib.formatTimestamp(el.created_at)}</td>
            </tr>
        `;
    });

    // <table class="table table-hover table-striped align-middle mb-0 text-center w-100">
    let content = `
        <div class="container my-5 text-center">
            <div class="row justify-content-center">
                <div class="col-lg-9">
                    <div class="card-header bg-dark text-white text-center">
                        <h4 class="mb-0">Liste des employés</h4>
                    </div>
                    <br/>
                    <!-- table-responsive permet à la table d'utiliser 100% de la largeur -->
                    <div class="card-body p-0">
                        <div class="table-responsive">
                            <table class="table table-dark table-hover">
                                <thead class="table-dark">
                                    <tr>
                                        <th scope="col">Nom, Prénom</th>
                                        <th scope="col">Née le</th>
                                        <th scope="col">Job</th>
                                        <th scope="col">Grade</th>
                                        <th scope="col">Téléphone</th>
                                        <th scope="col">Visa du</th>
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
        $('#emsOpenPersonnel').on('click', () => {

            fetch(`https://${GetParentResourceName()}/ems_list`, {
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