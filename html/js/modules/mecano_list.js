mecanoList = {}

mecanoList.content = (datas) => {
    let content = `
        <div class="cadre-interne">
        <h4 class="mb-4">Liste des Effectifs <span class="badge text-bg-success">présent</span></h4>
        <table class="table table-dark table-striped table-hover">
        <thead>
            <tr>
            <th scope="col">Prénom, Nom</th>
            <th scope="col">Date de Naissance</th>
            <th scope="col">Grade</th>
            <th scope="col">Téléphone</th>
            <th scope="col">Taille</th>
            <th scope="col">En Service</th>
            <th scope="col">Prise d'appel</th>
            </tr>
        </thead>
        <tbody>
    `;

    datas.forEach(el => {
        if (el.isConnect == true) {
            content += `
                <tr>
                    <td>${el.firstname}, ${el.lastname}</td>
                    <td>${el.dateofbirth}</td>
                    <td>${el.job_label}</td>
                    <td>${el.phone_number} <span class="badge text-bg-secondary" onclick="lib.call('${el.phone_number}');"><i class="fa-solid fa-phone"></i></span></td>
                    <td>${el.height} cm</td>
                    <td>${(el.duty == 1) ? '<span class="badge text-bg-success">en service</span>' : ''}</td>
                    <td>${(el.isgetcall == true) ? '<span class="badge text-bg-success">oui</span>' : '<span class="badge text-bg-danger">non</span>'}</td>
                </tr>
            `;
        }
    });

    content += `
        </tbody>
        </table>
        </div>
    `;


    content += `
        <div class="cadre-interne">
        <h4 class="mb-4">Liste des Effectifs  <span class="badge text-bg-secondary">non présent</span></h4>
        <table class="table table-dark table-striped table-hover">
        <thead>
            <tr>
            <th scope="col">Prénom, Nom</th>
            <th scope="col">Date de Naissance</th>
            <th scope="col">Grade</th>
            <th scope="col">Téléphone</th>
            <th scope="col">Taille</th>
            </tr>
        </thead>
        <tbody>
    `;

    datas.forEach(el => {
        if (el.isConnect == false) {
            content += `
                <tr>
                    <td>${el.firstname}, ${el.lastname}</td>
                    <td>${el.dateofbirth}</td>
                    <td>${el.job_label}</td>
                    <td>${el.phone_number}</td>
                    <td>${el.height} cm</td>
                </tr>
            `;
        }
    });

    content += `
        </tbody>
        </table>
        </div>
    `;


    $('#content').html(content);
};

mecanoList.get = () => {

    fetch(`https://${GetParentResourceName()}/mecano_list`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify({}),
    }).then(resp => resp.json()).then(resp => {
        mecanoList.content(resp);
    });

};


/**
 * Permet de lancer les actions quand le menu est déclaré
 */
mecanoList.action = () => {

    $('#openMecanoList').on('click', () => {
        lib.wait();
        mecanoList.get();
    });

};