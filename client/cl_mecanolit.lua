-- *******************************************************
-- ** Recherche des effectifs de mecano connecté        **
-- *******************************************************
RegisterNUICallback('mecano_list', function(data, cb)

    ESX.TriggerServerCallback('ton_tab_ems:mecano_list', function(res)
        cb(res)
    end)

end)