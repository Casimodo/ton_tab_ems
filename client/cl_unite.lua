-- *******************************************************
-- ** Récupère la liste des unitées
-- *******************************************************
RegisterNUICallback('ems_unite', function(data, cb)

    fk.TriggerServerCallback('ton_tab_ems:ems_unite', function(result)
        cb(result)
    end, nil)

end)

-- *******************************************************
-- ** Permet de modifier l'unitée
-- *******************************************************
RegisterNUICallback('ems_unite_record', function(data, cb)

    fk.TriggerServerCallback('ton_tab_ems:ems_unite_record', function(result)
        cb(true)
    end, data)

end)