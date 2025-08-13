-- *******************************************************
-- ** Recherche des effectifs de mecano connecté        **
-- *******************************************************
RegisterNUICallback('mecano_list', function(data, cb)

    ESX.TriggerServerCallback('ton_tablette:mecano_list', function(res)
        cb(res)
    end)

end)