-- *******************************************************
-- ** Recherche des effectifs de police connecté        **
-- *******************************************************
RegisterNUICallback('police_list', function(data, cb)

    ESX.TriggerServerCallback('ton_tablette:police_list', function(res)
        cb(res)
    end)

end)