myCar = {};

myCar.content = (response) => {

    $('#content').html('');
    response.forEach(elem => {
        let badgeFourriere = (elem.impound != 1) ? '<span class="badge text-bg-secondary">Non</span>' : '<span class="badge text-bg-warning">Oui</span>';
        $('#content').append(`
            <div class="card vehicle-card">
                <div class="row g-0">
                    <div class="col-md-6">
                    <img src="https://www.despote-island.com/stream/vehicules/vehicules/${elem.vehicle}.jpg" class="my_car-vehicle-image" alt="Voiture de ${elem.job}">
                    </div>
                    <div class="col-md-6">
                        <div class="card-body">
                            <h5 class="card-title mb-4">Vehicle Information</h5>
                            <div class="row">
                                <div class="col-sm-6 info-column">
                                    <div class="info-item"><strong>Plate:</strong> <span id="plate">${elem.plate}</span></div>
                                    <div class="info-item"><strong>Vehicle:</strong> <span id="vehicle">${elem.vehicle}</span></div>
                                    <div class="info-item"><strong>Vehicle Name:</strong> <span id="vehicleName">${elem.vehicleName}</span></div>
                                    <div class="info-item"><strong>Job:</strong> <span id="job">${elem.job}</span></div>
                                </div>
                                <div class="col-sm-6 info-column">
                                    <div class="info-item"><strong>Km:</strong> <span id="mileage">${elem.mileage}</span></div>
                                    <div class="info-item"><strong>Date Inserted:</strong> <span id="dateInsert">${lib.formatTimestamp(elem.date_insert)}</span></div>
                                    <div class="info-item"><strong>En fourrière:</strong> <span id="impound">${badgeFourriere}</span></div>
                                    <div class="info-item"><strong>Garage ID:</strong> <span id="garageId">${lib.fourriereLabel(elem.garage_id)}</span></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `);
    });
};

/**
 * Permet de rechercher mes voitures
 * @param {string} identifier Identifier du player
 */
myCar.find = () => {
    fetch(`https://${GetParentResourceName()}/my_car`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify({}),
    }).then(resp => resp.json()).then(resp => {
        myCar.content(resp);
    });
};

/**
 * Permet de lancer les actions quand le menu est déclaré
 */
myCar.action = () => {

    $('#openMyCar').on('click', () => {
        lib.wait();
        myCar.find();

    });

};