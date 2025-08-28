-- *******************************************************
-- ** Recherche de vehicule selon leur plaque           **
-- *******************************************************
RegisterNUICallback('police_find_ve', function(data, cb)

    ESX.TriggerServerCallback('ton_tab_ems:police_find_ve', function(res)
        cb(res)
    end, data)

end)