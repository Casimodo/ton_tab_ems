-- *******************************************************
-- ** Récupère la liste des EMS
-- *******************************************************
RegisterNUICallback('ems_list', function(data, cb)

    fk.TriggerServerCallback('ton_tab_ems:ems_list', function(result)
        cb(result)
    end, nil)

end)