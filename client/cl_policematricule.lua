-- Permet de prendre une photo pour les badges
RegisterNUICallback('matricule_police', function(data, cb)
    
    local input = lib.inputDialog('Vos informations', {
        {type = 'number', label = 'votre matricule', description = 'Fournie par votre supérieur', icon = 'hashtag'}
    })
    
    local dt = {
        matricule = input[1]
    }
    
    ESX.TriggerServerCallback('ton_tablette:matricule_police', function(res)
        cb('ok')
    end, dt)
end)