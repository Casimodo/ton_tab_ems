profil = {};
profil.datas = null;
profil.img = null;

/**
 * Permet de lancer les actions quand le menu est déclaré
 */
profil.action = () => {


    $('#openProfil').on('click', () => {

        let dt = profil.datas;
        
        let money = 0;
        let black_money = 0;
        let bank = 0;
        dt.accounts.forEach((acc) => {
            switch (acc.name) {
                case 'money':
                    money = lib.formatNumber(acc.money)
                    break;
                case 'black_money':
                    black_money = lib.formatNumber(acc.money)
                    break;
                case 'bank':
                    bank = lib.formatNumber(acc.money)
                    break;
                default:
                    break;
            }
        });
        const contenu = `
        <div class="profile-header">
            <div class="row align-items-center">
                <div class="col-auto">
                    <img src="${profil.img}" alt="Profile Picture" class="profile-img">
                </div>
                <div class="col">
                    <h2>${dt.name}</h2>
                    <p class="mb-0">ID: ${dt.playerId}</p>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-md-6">
                <div class="card">
                    <div class="card-header">Informations Personnel</div>
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item">Prénom: <span class="list-group-item-label">${dt.firstName}</span></li>
                        <li class="list-group-item">Nom: <span class="list-group-item-label">${dt.lastName}</span></li>
                        <li class="list-group-item">Taille: <span class="list-group-item-label">${dt.height / 100} m</span></li>
                    </ul>
                </div>
            </div>
            <div class="col-md-6">
                <div class="card">
                    <div class="card-header">Informations Emploi</div>
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item">Job: <span class="list-group-item-label">${dt.job.label}</span></li>
                        <li class="list-group-item">Grade: <span class="list-group-item-label">${dt.job.grade_name}</span></li>
                        <li class="list-group-item">Salary: <span class="list-group-item-label">$${lib.formatNumber(dt.job.grade_salary)}</span></li>
                    </ul>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-md-6">
                <div class="card">
                    <div class="card-header">Information Gang</div>
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item">Gang: <span class="list-group-item-label">${dt.gang.label}</span></li>
                        <li class="list-group-item">Grade: <span class="list-group-item-label">${dt.gang.grade_label}</span></li>
                        <li class="list-group-item">Grade ID: <span class="list-group-item-label">${dt.gang.grade}</span></li>
                    </ul>
                </div>
            </div>
            <div class="col-md-6">
                <div class="card">
                    <div class="card-header">Informations Divers</div>
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item">Banque: <span class="list-group-item-label">$${bank}</span></li>
                    </ul>
                </div>
            </div>
        </div>

    `;
        $('#content').html(contenu);

    });

};;