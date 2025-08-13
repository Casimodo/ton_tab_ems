-- *******************************************************
-- **                              
-- *******************************************************
RegisterNUICallback('police_get_alertdispatch', function(data, cb)

    ESX.TriggerServerCallback('ton_tablette:police_get_alertdispatch', function(res)
        cb(res)
    end)

end)
