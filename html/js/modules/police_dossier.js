policeDossier = {};
policeDossier.amendesList = [];

/** ****************************************************************************
 * Partie pour l'autocompletion Amendes                                        *
 * ****************************************************************************/
policeDossier.selectedAmendes = [];
policeDossier.selectedAmendesPrix = 0;
policeDossier.selectedAmendesPrison = 0;
policeDossier.renderSelectedAmendes = () => {
    $("#selected-amendes").empty(); // Vider la liste avant de la reremplir
    policeDossier.selectedAmendes.forEach(function (dt, index) {
        $("#selected-amendes").append(`
            <div class="form-multi amendes">
                <div class="form-multi-value">${dt.label}</div>
                <div class="form-multi-remove remove-amendes" data-index="${index}">
                    <i class="fa-solid fa-trash-can"></i>
                </div>
            </div>
        `);
    });
    $("#formIncidentAmendesPrix").text(`$${policeDossier.selectedAmendesPrix}`)
    $("#formIncidentAmendesPrison").text(`${policeDossier.selectedAmendesPrison}mn`)

}

$(document).on("click", ".remove-amendes", function () {
    var index = $(this).data("index"); // Récupère l'index de la ville à supprimer
    policeDossier.selectedAmendesPrix -= policeDossier.selectedAmendes[index].prix;
    policeDossier.selectedAmendesPrison -= policeDossier.selectedAmendes[index].tps_prison;
    policeDossier.selectedAmendes.splice(index, 1);  // Supprimer la ville du tableau
    policeDossier.renderSelectedAmendes();
});

policeDossier.callAutocompleteAmendes = (datas_list) => {
    $("#formIncidentAmendes").autocomplete({
        source: datas_list,
        select: function (event, ui) {

            policeDossier.selectedAmendes.push(ui.item);
            policeDossier.selectedAmendesPrix += ui.item.prix
            policeDossier.selectedAmendesPrison += ui.item.tps_prison
            policeDossier.renderSelectedAmendes();
            $(this).val('');  // Empêche le champ texte de conserver la valeur après sélection
            return false;
        }
    });
};


/** ****************************************************************************
 * Affiche la page d'édition                                                   *
 * ****************************************************************************/
policeDossier.edit = (id) => {

    lib.wait();

    fetch(`https://${GetParentResourceName()}/police_dossier_get`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify(id),
    }).then(resp => resp.json()).then(dt => {
        let formDossierEdit = $('#police_dossier_edit').html();
        $('#content').html(formDossierEdit);

        policeDossier.constucAction();
        policeDossier.callAutocompleteAmendes(policeDossier.amendesList);

        // Appliquer la prévisualisation pour chaque photo
        lib.previewImage('#formIncidentPhoto1', '#previewIncident1');
        lib.previewImage('#formIncidentPhoto2', '#previewIncident2');
        lib.previewImage('#formIncidentPhoto3', '#previewIncident3');
        lib.previewImage('#formIncidentPhoto4', '#previewIncident4');
        lib.previewImage('#formIncidentPhoto5', '#previewIncident5');
        lib.previewImage('#formIncidentPhoto6', '#previewIncident6');

        $('#formIncidentAgent').val(`${lib.profil.name}`);
        $('#formIncidentId').val(dt.id);
        $('#formIncidentLabel').val(dt.label);
        $('#formIncidentComment').val(dt.comment);
        $('#formIncidentPhone').val(dt.phone_number);
        $('#formIncidentNumCasier').val(dt.num_casier);
        $('#formIncidentCivil').val(dt.civils_implique);
        $('#formIncidentType').val(dt.type).change();
        $('#formIncidentLieu').val(dt.lieux);
        $('#formIncidentDate').val(lib.formatTimestamp(dt.date_update));
        $('#formIncidentPhoto1').val(dt.photo1)
        $('#formIncidentPhoto2').val(dt.photo2);
        $('#formIncidentPhoto3').val(dt.photo3);
        $('#formIncidentPhoto4').val(dt.photo4);
        $('#formIncidentPhoto5').val(dt.photo5);
        $('#formIncidentPhoto6').val(dt.photo6);

        // Lancement de trigger pour faire changer l'image
        $('#formIncidentPhoto1').trigger('input');
        $('#formIncidentPhoto2').trigger('input');
        $('#formIncidentPhoto3').trigger('input');
        $('#formIncidentPhoto4').trigger('input');
        $('#formIncidentPhoto5').trigger('input');
        $('#formIncidentPhoto6').trigger('input');

        // Purge les données des detail en place
        policeDossier.selectedAmendes = [];
        policeDossier.selectedAmendesPrix = 0;
        policeDossier.selectedAmendesPrison = 0;

        // Mettre les données des detail en place
        policeDossier.selectedAmendes = dt.amendes;
        policeDossier.selectedAmendes.forEach(function (dt, index) {
            policeDossier.selectedAmendesPrix += dt.prix
            policeDossier.selectedAmendesPrison += dt.tps_prison
        });
        policeDossier.renderSelectedAmendes();
    });
};


/** ****************************************************************************
 * Affiche la page d'ajout                                                     *
 * ****************************************************************************/
policeDossier.add = () => {

    lib.wait();

    let formDossierEdit = $('#police_dossier_edit').html();
    $('#content').html(formDossierEdit);

    policeDossier.constucAction();
    policeDossier.callAutocompleteAmendes(policeDossier.amendesList);

    $('#formIncidentAgent').val(`${lib.profil.name}`);
    $('#formIncidentId').val('');
    $('#formIncidentLabel').val('');
    $('#formIncidentComment').val('');
    $('#formIncidentPhone').val('');
    $('#formIncidentNumCasier').val('');
    $('#formIncidentCivil').val('');
    $('#formIncidentLieu').val('');
    $('#formIncidentDate').val('');
    $('#formIncidentPhoto1').val('');
    $('#formIncidentPhoto2').val('');
    $('#formIncidentPhoto3').val('');
    $('#formIncidentPhoto4').val('');
    $('#formIncidentPhoto5').val('');
    $('#formIncidentPhoto6').val('');

    // Appliquer la prévisualisation pour chaque photo
    lib.previewImage('#formIncidentPhoto1', '#previewIncident1');
    lib.previewImage('#formIncidentPhoto2', '#previewIncident2');
    lib.previewImage('#formIncidentPhoto3', '#previewIncident3');
    lib.previewImage('#formIncidentPhoto4', '#previewIncident4');
    lib.previewImage('#formIncidentPhoto5', '#previewIncident5');
    lib.previewImage('#formIncidentPhoto6', '#previewIncident6');

    // Purge les données des detail en place
    policeDossier.selectedAmendes = [];
    policeDossier.selectedAmendesPrix = 0;
    policeDossier.selectedAmendesPrison = 0;
    policeDossier.renderSelectedAmendes();

};


/** ****************************************************************************
 * Affiche la page par défaut de recherche                                     *
 * ****************************************************************************/
policeDossier.content = (datas) => {
    let content = `
        <div class="col-12" id="rech_plaque">
            <h5 class="p-find-ve">Recherche de dossier (par défaut les 10 derniers dossier)</h5>
            <div class="input-group mb-3">
                <input type="text" class="form-control" placeholder="entrez ici n'importe quel critaire pour la recherche (3 caractères mini)" id="find_dossier_input"
                    aria-label="Critères de recherche" aria-describedby="find_dossier_btn">
                <button class="btn btn-outline-secondary" type="button" id="find_dossier_btn"><i class="fa-solid fa-magnifying-glass"></i></button>
                <button class="btn btn-outline-secondary" type="button" id="add_dossier_btn"><i class="fa-solid fa-plus"></i></button>
            </div>
            <div id="dossierSpinner" class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <div id="dossierList" class="list-group overflowSm1">

            </div>

        </div>
    `;

    $('#content').html(content);
    $('#dossierSpinner').hide();

    policeDossier.constucAction()
};


/** ****************************************************************************
 * Affiche detail de recherche                                 
 * ****************************************************************************/
policeDossier.result = (datas) => {

    var innerHTML = ``;
    $('#dossierList').html('');

    if (datas.length == 0) {
        innerHTML = '<span class="badge text-bg-secondary">Pas de résultat</span>';
        $('#dossierList').html(innerHTML);
    }

    datas.forEach((dt, index) => {
        let type = (dt.type == 'recherche') ? `<span class="badge rounded-pill text-bg-danger">Avis de recherche</span>` : `<span class="badge rounded-pill text-bg-secondary">${dt.type}</span>`;
        type = (dt.type == 'amende') ? `<span class="badge rounded-pill text-bg-warning">Amende</span>` : type;
        innerHTML = `
            <div class="list-group-item list-group-item-action event-item" style="cursor:pointer;" onclick="policeDossier.edit(${dt.id});">
                <div class="d-flex w-100 justify-content-between">
                    <small style="width:30vh;">Titre:<br/> <strong>${dt.label}</strong></small>
                    <small style="width:15vh;">Type:<br/> <strong>${type}</strong></small>
                    <small style="width:20vh;">Fait le:<br/> <strong>${lib.formatTimestamp(dt.date_add)}</strong></small>
                    <small style="width:20vh;">par:<br/> <strong>${dt.cree_par}</strong></small>
                    <small style="width:20vh;">Modifier le:<br/> <strong>${lib.formatTimestamp(dt.date_update)}</strong></small>
                    <small style="width:20vh;">par:<br/> <strong>${dt.redige_par}</strong></small>
                    <small style="width:5vh;"><i class="fa-solid fa-pen-to-square"></i></small>
                </div>
            </div>
        `;
        $('#dossierList').append(innerHTML);
    });

};


/** ****************************************************************************
* Permet de lancer les actions quand la page est chargée                               
* ****************************************************************************/
policeDossier.constucAction = () => {

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
                policeDossier.result(resp.dossiers);
                policeDossier.amendesList = resp.amendes
                policeDossier.callAutocompleteAmendes(policeDossier.amendesList);
            });

        }

    });


    /**
     * Si click pour ajouter un dossier
     */
    $('#add_dossier_btn').on('click', () => {
        policeDossier.add();
    });


    /**
     * Si click pour sauvegarder un dossier
     */
    $('#form_police_dossier_edit').on('click', function (event) {

        event.preventDefault(); // Empêche le rechargement de la page lors de la soumission du formulaire
        let formData = {
            id: $('#formIncidentId').val(),
            type: $('#formIncidentType').val(),
            label: $('#formIncidentLabel').val(),
            comment: $('#formIncidentComment').val(),
            lieux: $('#formIncidentLieu').val(),
            redige_par: `${lib.profil.name}`,
            civils_implique: $('#formIncidentCivil').val(),
            phone_number: $('#formIncidentPhone').val(),
            num_casier: $('#formIncidentNumCasier').val(),
            amendes: JSON.stringify(policeDossier.selectedAmendes),
            amendes_total : policeDossier.selectedAmendesPrix,
            tps_prison : policeDossier.selectedAmendesPrison,
            photo1: $('#formIncidentPhoto1').val(),
            photo2: $('#formIncidentPhoto2').val(),
            photo3: $('#formIncidentPhoto3').val(),
            photo4: $('#formIncidentPhoto4').val(),
            photo5: $('#formIncidentPhoto5').val(),
            photo6: $('#formIncidentPhoto6').val()
        };
        
        lib.wait();
        fetch(`https://${GetParentResourceName()}/police_dossier_save`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify(formData),
        }).then(resp => resp.json()).then(resp => {
            policeDossier.openPoliceDossier();
        });
    });


    /**
     * Si click pour générer un document
     */
    $('#formIncidentBtnImp').on('click', function (event) {

        event.preventDefault(); // Empêche le rechargement de la page lors de la soumission du formulaire
        let formData = {
            id: $('#formIncidentId').val(),
            lastName: lib.profil.lastName,
            firstName: lib.profil.firstName,
            dateofbirth: lib.profil.dateofbirth,
            job: lib.profil.job,
            id: $('#formIncidentId').val(),
            type: $('#formIncidentType').val(),
            label: $('#formIncidentLabel').val(),
            comment: $('#formIncidentComment').val(),
            lieux: $('#formIncidentLieu').val(),
            redige_par: `${lib.profil.name}`,
            civils_implique: $('#formIncidentCivil').val(),
            phone_number: $('#formIncidentPhone').val(),
            num_casier: $('#formIncidentNumCasier').val(),
            date: $('#formIncidentDate').val(),
            amendes: JSON.stringify(policeDossier.selectedAmendes),
            amendes_total : policeDossier.selectedAmendesPrix,
            tps_prison : policeDossier.selectedAmendesPrison,
            photo1: $('#formIncidentPhoto1').val(),
            photo2: $('#formIncidentPhoto2').val(),
            photo3: $('#formIncidentPhoto3').val(),
            photo4: $('#formIncidentPhoto4').val(),
            photo5: $('#formIncidentPhoto5').val(),
            photo6: $('#formIncidentPhoto6').val()
        };
        
        fetch(`https://${GetParentResourceName()}/police_dossier_print`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify(formData),
        }).then(resp => resp.json()).then(resp => {
            // Pas d'action msg envoyé par le client
        });
    });


    /**
     * Permet de changer l'état du formalaire en fonction du type
     */
    $('#formIncidentType').change(function () {
        let valeur = $(this).val();
        if (valeur == 'amende') {
            $('#amendeInfo').show();
            $('#amendeList').show();
        } else {
            $('#amendeInfo').hide();
            $('#amendeList').hide();
            policeDossier.selectedAmendes = [];
            policeDossier.selectedAmendesPrix = 0;
            policeDossier.selectedAmendesPrison = 0;
            policeDossier.renderSelectedAmendes();
        }
    });

    /**
     * Permet de changer l'état du formalaire en fonction du type
     */
    $('#formIncidentBtnCancel').on('click', function () {
        policeDossier.openPoliceDossier();
    });

};


/** ****************************************************************************
 * Ouvre les dossiers pour la recherche
 * ****************************************************************************/
policeDossier.openPoliceDossier = () => {

    lib.actif = 'police_dossier';
    lib.wait();
    policeDossier.content();

    fetch(`https://${GetParentResourceName()}/police_dossier_find`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify(''),
    }).then(resp => resp.json()).then(resp => {
        $('#dossierSpinner').hide();
        policeDossier.result(resp.dossiers);
        policeDossier.amendesList = resp.amendes;
        policeDossier.callAutocompleteAmendes(policeDossier.amendesList);
    });

};


/** ****************************************************************************
 * Permet de lancer les actions quand click sur l'icon de la home page
 * ****************************************************************************/
policeDossier.action = () => {

    $('#openPoliceDossier').on('click', () => {

        policeDossier.openPoliceDossier();

    });

};