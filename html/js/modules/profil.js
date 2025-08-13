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
                        <li class="list-group-item">Prénom: ${dt.firstName}</li>
                        <li class="list-group-item">Nom: ${dt.lastName}</li>
                        <li class="list-group-item">Taille: ${dt.height / 100} m</li>
                    </ul>
                </div>
            </div>
            <div class="col-md-6">
                <div class="card">
                    <div class="card-header">Informations Emploi</div>
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item">Job: ${dt.job.label}</li>
                        <li class="list-group-item">Grade: ${dt.job.grade_name}</li>
                        <li class="list-group-item">Salary: $${lib.formatNumber(dt.job.grade_salary)}</li>
                    </ul>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-md-6">
                <div class="card">
                    <div class="card-header">Information Gang</div>
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item">Gang: ${dt.gang.label}</li>
                        <li class="list-group-item">Grade: ${dt.gang.grade_label}</li>
                        <li class="list-group-item">Grade ID: ${dt.gang.grade}</li>
                    </ul>
                </div>
            </div>
            <!--<div class="col-md-6">
                <div class="card">
                    <div class="card-header">Informations Divers</div>
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item">Banque: $${bank}</li>
                    </ul>
                </div>
            </div>-->
        </div>

    `;
        $('#content').html(contenu);

    });

};;