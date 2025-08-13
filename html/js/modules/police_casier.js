policeCasier = {};


/** ****************************************************************************
 * Affiche la page d'édition                                                   *
 * ****************************************************************************/
policeCasier.edit = (id) => {

    lib.wait();

    fetch(`https://${GetParentResourceName()}/police_casier_get`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify(id),
    }).then(resp => resp.json()).then(dt => {
        let formCasierEdit = $('#police_casier_edit').html();
        $('#content').html(formCasierEdit);

        policeCasier.constucAction();
        
        // Appliquer la prévisualisation pour chaque photo
        lib.previewImage('#formCasierPhoto1', '#previewCasier1');
        lib.previewImage('#formCasierPhoto2', '#previewCasier2');
        lib.previewImage('#formCasierPhoto3', '#previewCasier3');
        lib.previewImage('#formCasierPhoto4', '#previewCasier4');

        $('#formCasierAgent').val(`${lib.profil.name}`);
        $('#formCasierId').val(dt.id);
        $('#formCasierNom').val(dt.nom);
        $('#formCasierPrenom').val(dt.prenom);
        $('#formCasierDatebirday').val(dt.datebirday);
        $('#formCasierPhone').val(dt.phone_number);
        $('#formCasierComment').val(dt.comment);
        $('#formCasierPhoto1').val(dt.photo1)
        $('#formCasierPhoto2').val(dt.photo2);
        $('#formCasierPhoto3').val(dt.photo3);
        $('#formCasierPhoto4').val(dt.photo4);
        $('#formCasierAdn').val(dt.adn);

        // Lancement de trigger pour faire changer l'image
        $('#formCasierPhoto1').trigger('input');
        $('#formCasierPhoto2').trigger('input');
        $('#formCasierPhoto3').trigger('input');
        $('#formCasierPhoto4').trigger('input');
    });
};


/** ****************************************************************************
 * Affiche la page d'ajout                                                     *
 * ****************************************************************************/
policeCasier.add = () => {

    lib.wait();

    let formCasierEdit = $('#police_casier_edit').html();
    $('#content').html(formCasierEdit);

    policeCasier.constucAction();

    $('#formCasierAgent').val(`${lib.profil.name}`);
    $('#formCasierId').val('');
    $('#formCasierNom').val('');
    $('#formCasierPrenom').val('');
    $('#formCasierDatebirday').val('');
    $('#formCasierPhone').val('');
    $('#formCasierComment').val('');
    $('#formCasierPhoto1').val('');
    $('#formCasierPhoto2').val('');
    $('#formCasierPhoto3').val('');
    $('#formCasierPhoto4').val('');
    $('#formCasierAdn').val('');

    // Appliquer la prévisualisation pour chaque photo
    lib.previewImage('#formCasierPhoto1', '#previewCasier1');
    lib.previewImage('#formCasierPhoto2', '#previewCasier2');
    lib.previewImage('#formCasierPhoto3', '#previewCasier3');
    lib.previewImage('#formCasierPhoto4', '#previewCasier4');

};


/** ****************************************************************************
 * Affiche la page par défaut de recherche                                     *
 * ****************************************************************************/
policeCasier.content = (datas) => {
    let content = `
        <div class="col-12" id="rech_plaque">
            <h5 class="p-find-ve">Recherche de Casier (par défaut les 10 derniers Casier)</h5>
            <div class="input-group mb-3">
                <input type="text" class="form-control" placeholder="entrez ici n'importe quel critaire pour la recherche (3 caractères mini)" id="find_casier_input"
                    aria-label="Critères de recherche" aria-describedby="find_casier_btn">
                <button class="btn btn-outline-secondary" type="button" id="find_casier_btn"><i class="fa-solid fa-magnifying-glass"></i></button>
                <button class="btn btn-outline-secondary" type="button" id="add_casier_btn"><i class="fa-solid fa-plus"></i></button>
            </div>
            <div id="casierSpinner" class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <div id="casierList" class="list-group overflowSm1">

            </div>

        </div>
    `;

    $('#content').html(content);
    $('#casierSpinner').hide();

    policeCasier.constucAction()
};


/** ****************************************************************************
 * Affiche detail de recherche                                 
 * ****************************************************************************/
policeCasier.result = (datas) => {

    var innerHTML = ``;
    $('#casierList').html('');

    if (datas.length == 0) {
        innerHTML = '<span class="badge text-bg-secondary">Pas de résultat</span>';
        $('#casierList').html(innerHTML);
    }

    datas.forEach((dt, index) => {
        innerHTML = `
            <div class="list-group-item list-group-item-action event-item" style="cursor:pointer;" onclick="policeCasier.edit(${dt.id});">
                <div class="d-flex w-100 justify-content-between">
                    <small style="width:30vh;">Prénom, Nom de l'individu:<br/> <strong>${dt.prenom}, ${dt.nom}</strong></small>
                    <small style="width:20vh;">Fait le:<br/> <strong>${lib.formatTimestamp(dt.date_add)}</strong></small>
                    <small style="width:20vh;">par:<br/> <strong>${dt.cree_par}</strong></small>
                    <small style="width:20vh;">Modifier le:<br/> <strong>${lib.formatTimestamp(dt.date_update)}</strong></small>
                    <small style="width:20vh;">par:<br/> <strong>${dt.redige_par}</strong></small>
                    <small style="width:5vh;"><i class="fa-solid fa-pen-to-square"></i></small>
                </div>
            </div>
        `;
        $('#casierList').append(innerHTML);
    });

};


/** ****************************************************************************
* Permet de lancer les actions quand la page est chargée                               
* ****************************************************************************/
policeCasier.constucAction = () => {

    /**
     * Si click sur recherche plaque
     */
    $('#find_casier_btn').on('click', () => {

        $('#casierSpinner').show();

        let value = $('#find_casier_input').val();
        if (value.length < 4) {

            let innerHTML = '<span class="badge text-bg-warning">Merci de saisir plus de 4 caractères !</span>';
            $('#casierSpinner').hide();
            $('#casierList').html(innerHTML);

        } else {

            fetch(`https://${GetParentResourceName()}/police_casier_find`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                },
                body: JSON.stringify(value),
            }).then(resp => resp.json()).then(resp => {
                $('#casierSpinner').hide();
                policeCasier.result(resp);
            });

        }

    });


    /**
     * Si click pour ajouter un Casier
     */
    $('#add_casier_btn').on('click', () => {
        policeCasier.add();
    });


    /**
     * Si click pour sauvegarder un Casier
     */
    $('#form_police_casier_edit').on('click', function (event) {

        event.preventDefault(); // Empêche le rechargement de la page lors de la soumission du formulaire
        let formData = {
            id: $('#formCasierId').val(),
            nom: $('#formCasierNom').val(),
            prenom: $('#formCasierPrenom').val(),
            datebirday: $('#formCasierDatebirday').val(),
            phone_number: $('#formCasierPhone').val(),
            comment: $('#formCasierComment').val(),
            adn: $('#formCasierAdn').val(),
            photo1: $('#formCasierPhoto1').val(),
            photo2: $('#formCasierPhoto2').val(),
            photo3: $('#formCasierPhoto3').val(),
            photo4: $('#formCasierPhoto4').val(),
            redige_par: `${lib.profil.name}`
        };
        
        lib.wait();
        fetch(`https://${GetParentResourceName()}/police_casier_save`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify(formData),
        }).then(resp => resp.json()).then(resp => {
            policeCasier.openPoliceCasier();
        });
    });


    /**
     * Si click pour générer un document
     */
    $('#formCasierBtnImp').on('click', function (event) {

        event.preventDefault(); // Empêche le rechargement de la page lors de la soumission du formulaire
        let formData = {
            id: $('#formCasierId').val(),
            lastName: lib.profil.lastName,
            firstName: lib.profil.firstName,
            dateofbirth: lib.profil.dateofbirth,
            job: lib.profil.job,
            nom: $('#formCasierNom').val(),
            prenom: $('#formCasierPrenom').val(),
            datebirday: $('#formCasierDatebirday').val(),
            phone_number: $('#formCasierPhone').val(),
            comment: $('#formCasierComment').val(),
            adn: $('#formCasierAdn').val(),
            photo1: $('#formCasierPhoto1').val(),
            photo2: $('#formCasierPhoto2').val(),
            photo3: $('#formCasierPhoto3').val(),
            photo4: $('#formCasierPhoto4').val(),
            redige_par: `${lib.profil.name}`
        };
        
        fetch(`https://${GetParentResourceName()}/police_casier_print`, {
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
    $('#formCasierBtnCancel').on('click', function () {
        policeCasier.openPoliceCasier();
    });

};

/** ****************************************************************************
 * Ouvre les Casiers pour la recherche
 * ****************************************************************************/
policeCasier.openPoliceCasier = () => {

    lib.actif = 'police_casier';
    lib.wait();
    policeCasier.content();

    fetch(`https://${GetParentResourceName()}/police_casier_find`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify(''),
    }).then(resp => resp.json()).then(resp => {
        $('#casierSpinner').hide();
        policeCasier.result(resp);
    });

};


/** ****************************************************************************
 * Permet de lancer les actions quand click sur l'icon de la home page
 * ****************************************************************************/
policeCasier.action = () => {

    $('#openPoliceCasier').on('click', () => {

        policeCasier.openPoliceCasier();

    });

};