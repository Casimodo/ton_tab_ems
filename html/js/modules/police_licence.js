policeLicence = {};

/** ****************************************************************************
 * Affiche detail de recherche                                 
 * ****************************************************************************/
policeLicence.result = (datas) => {

    var innerHTML = `<h3>Licences des personnes autour</h3><div class="col-12"><div class="list-group overflowSm1">`;
    $('#content').html('');

    if (datas.length == 0) {
        innerHTML = '<span class="badge text-bg-secondary">Pas de résultat</span>';
        $('#content').html(innerHTML);
    }

    datas.forEach((dt, index) => {
        innerHTML = innerHTML + `
            <div class="list-group-item list-group-item-action event-item">
                <div class="d-flex w-100 justify-content-between">
                    <small style="width:10vh;">Prénom:<br/> <strong>${dt.firstname}</strong></small>
                    <small style="width:10vh;">Nom:<br/> <strong>${dt.lastname}</strong></small>
                    <small style="width:20vh;">Type:<br/> <strong>${dt.label}</strong></small>
                    <small style="width:10vh;" id="confirme_${dt.id}"><button class="btn btn-sm btn-danger btnSuppLicence" licence-key="${dt.id}">Supprimer</button></small>
                </div>
            </div>
        `;
    });
    innerHTML = innerHTML + `</div></div>`;
    $('#content').html(innerHTML);


    $(document).on('click', '.btnSuppLicence', function () {
        let licenceKey = $(this).attr("licence-key");
        $(`#confirme_${licenceKey}`).html(`<button class="btn btn-sm btn-success" id="btnConfirm"><i class="fa-solid fa-check"></i></button> <button class="btn btn-sm btn-secondary" id="btnCancel"><i class="fa-solid fa-xmark"></i></button>`)

        
        $('#btnConfirm').on('click', () => {
            fetch(`https://${GetParentResourceName()}/police_licence_remove`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                },
                body: licenceKey,
            }).then(resp => resp.json()).then(resp => {
                policeLicence.openpoliceLicence();
            });
        });
        $('#btnCancel').on('click', () => {
            $(`#confirme_${licenceKey}`).html(`<button class="btn btn-sm btn-danger btnSuppLicence" licence-key="${licenceKey}">Supprimer</button>`)
        });
    });

};


/** ****************************************************************************
* Permet de lancer les actions quand la page est chargée                               
* ****************************************************************************/
policeLicence.constucAction = () => {

    /**
     * Si click sur recherche plaque
     */
    $('#find_dossier_btn').on('click', () => {

        $('#dossierSpinner').show();

        let value = $('#find_dossier_input').val();
        if (value.length < 4) {

            let innerHTML = '<span class="badge text-bg-warning">Merci de saisir plus de 4 caractères !</span>';
            $('#dossierSpinner').hide();
            $('#dossierList').html(innerHTML);

        } else {

            fetch(`https://${GetParentResourceName()}/police_dossier_find`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                },
                body: JSON.stringify(value),
            }).then(resp => resp.json()).then(resp => {
                $('#dossierSpinner').hide();
                policeLicence.result(resp.dossiers);
                policeLicence.amendesList = resp.amendes
                policeLicence.callAutocompleteAmendes(policeLicence.amendesList);
            });

        }

    });

};


/** ****************************************************************************
 * Ouvre les dossiers pour la recherche
 * ****************************************************************************/
policeLicence.openpoliceLicence = () => {

    lib.actif = 'police_licence';
    lib.wait();

    fetch(`https://${GetParentResourceName()}/police_licence`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify(''),
    }).then(resp => resp.json()).then(resp => {
        policeLicence.result(resp);
    });

};


/** ****************************************************************************
 * Permet de lancer les actions quand click sur l'icon de la home page
 * ****************************************************************************/
policeLicence.action = () => {

    $('#openPoliceLicence').on('click', () => {

        policeLicence.openpoliceLicence();

    });

};