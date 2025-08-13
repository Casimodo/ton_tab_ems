policeFindVe = {}

policeFindVe.content = (datas) => {
    let content = `
        <div class="col-12" id="rech_plaque">
            <h5 class="p-find-ve">Recherche plaque d'immatriculation</h5>
            <div class="input-group mb-3">
                <input type="text" class="form-control" placeholder="entrez ici la plaque (minimum 2 caractères)" id="find_plaque_input"
                    aria-label="Critères de recherche" aria-describedby="find_plaque_btn">
                <button class="btn btn-outline-secondary" type="button" id="find_plaque_btn"><i class="fa-solid fa-magnifying-glass"></i></button>
            </div>
            <div id="plaqueListSpinner" class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <div id="plaqueList" class="list-group overflowSm1">

            </div>

        </div>
    `;

    $('#content').html(content);
    $('#plaqueListSpinner').hide();

    policeFindVe.constucAction()
};

/**
 * Permet d'afficher le resultat de la recherche
 */
policeFindVe.resultPlaque = (datas) => {

    var innerHTML = ``;
    $('#plaqueList').html('');

    if (datas.length == 0) {
        innerHTML = '<span class="badge text-bg-secondary">Pas de résultat</span>';
        $('#plaqueList').html(innerHTML);
    }

    datas.forEach((dt, index) => {
        let insured = (dt.insured == 1) ? '<span class="badge rounded-pill text-bg-success">Oui</span>' : '<span class="badge rounded-pill text-bg-danger">Non</span>';
        innerHTML = `
            <div class="list-group-item list-group-item-action event-item">
                <div class="d-flex w-100 justify-content-between">
                    <small><img src="https://www.despote-island.com/stream/vehicules/vehicules/${dt.vehicle}.jpg" height="30" /></small>
                    <small>Propriétaire:<br/> <strong>${dt.name}</strong></small>
                    <small class="phone_number" onclick="lib.call('${dt.phone_number}');">Téléphone:<br/> <strong>${dt.phone_number}</strong> <i class="fa-solid fa-phone-flip"></i></small>
                    <small>Visa le:<br/> <strong>${lib.formatTimestamp(dt.visa)}</strong></small>
                    <small>Modèle:<br/> <strong>${dt.vehicleName}</strong></small>
                    <small>Plaque:<br/> <strong>${dt.plate}</strong></small>
                    <small>Assurance:<br/>  ${insured}</small>
                    <small>Véhicule acheté le:<br/> <strong>${lib.formatTimestamp(dt.date_insert)}</strong></small>
                </div>
            </div>
        `;
        $('#plaqueList').append(innerHTML);
    });

};

/**
 * Permet de lancer les actions quand la page est chargée
 */
policeFindVe.constucAction = () => {

    /**
     * Si click sur recherche plaque
     */
    $('#find_plaque_btn').on('click', () => {

        $('#plaqueListSpinner').show();

        let value = $('#find_plaque_input').val();
        if (value.length < 2) {

            let innerHTML = '<span class="badge text-bg-warning">Merci de saisir plus de 2 caractères !</span>';
            $('#plaqueListSpinner').hide();
            $('#plaqueList').html(innerHTML);

        }else{

            fetch(`https://${GetParentResourceName()}/police_find_ve`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                },
                body: JSON.stringify(value),
            }).then(resp => resp.json()).then(resp => {
                $('#plaqueListSpinner').hide();
                policeFindVe.resultPlaque(resp);
            });

        }

    });

};

/**
 * Permet de lancer les actions quand le menu est déclaré
 */
policeFindVe.action = () => {

    $('#openPolicefindVe').on('click', () => {
        lib.wait();
        policeFindVe.content();
    });

};