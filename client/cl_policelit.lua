-- *******************************************************
-- ** Recherche des effectifs de police connecté        **
-- *******************************************************
RegisterNUICallback('police_list', function(data, cb)

    ESX.TriggerServerCallback('ton_tab_ems:police_list', function(res)
        cb(res)
    end)

end)