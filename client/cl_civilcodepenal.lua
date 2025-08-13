-- *******************************************************
-- ** Recherche                             
-- *******************************************************



RegisterNUICallback('civil_codepenal', function(data, cb)

    ESX.TriggerServerCallback('ton_tablette:civil_codepenal', function(res)
        cb(res)
    end)

end)
