getCall = {};
/**
 * Permet de lancer les actions quand le menu est déclaré
 */
getCall.action = () => {

    $('#openPoliceGetCall').on('click', () => {
        fetch(`https://${GetParentResourceName()}/get_call`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify({}),
        }).then(resp => resp.json()).then(resp => {
            
        });
    });

    $('#openMecanoGetCall').on('click', () => {
        fetch(`https://${GetParentResourceName()}/get_call`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify({}),
        }).then(resp => resp.json()).then(resp => {
            
        });
    });

    $('#openAmbulanceGetCall').on('click', () => {
        fetch(`https://${GetParentResourceName()}/get_call`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify({}),
        }).then(resp => resp.json()).then(resp => {
            
        });
    });

};