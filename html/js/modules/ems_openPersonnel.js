
/** ****************************************************************************
 * Contenu par défaut de la page
 * ****************************************************************************/
function content(config, datas) {

    let cf = config;

    let details = '';
    datas.forEach(el => {
        details += `
            <tr>
                <td>${el.lastname}, ${el.firstname}</td>
                <td>${el.dateofbirth}</td>
                <td>${el.job_label}</td>
                <td>${el.job_grade}</td>
                <td>${el.phone_number}</td>
            </tr>
        `;
    });

    let content = `
        <div class="col-12">
            <table class="table table-hover table-striped align-middle">
                <thead class="table-dark">
                <tr>
                    <th scope="col">Nom, Prénom</th>
                    <th scope="col">Née le</th>                        
                    <th scope="col">Job</th>
                    <th scope="col">Grade</th>
                    <th scope="col">Téléphone</th>
                </tr>
                </thead>
                <tbody>
                    ${details}
                </tbody>
            </table>
        </div>
    `;

    $('#content').html(content);
};


/** ****************************************************************************
 * Permet de lancer les actions quand click sur l'icon de la home page
 * ****************************************************************************/
export function action(config) {

        // Mise en place des actions des menu
        $('#emsOpenPersonnel').on('click', () => {

            fetch(`https://${GetParentResourceName()}/ems_list`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify({}),
        }).then(resp => resp.json()).then(resp => {
            console.log(">>>", JSON.stringify(resp))
            content(config, resp);
        });

            
    }); 

};