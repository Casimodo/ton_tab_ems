-- *******************************************************
-- **                              
-- *******************************************************
RegisterNUICallback('police_get_alertdispatch', function(data, cb)

    ESX.TriggerServerCallback('ton_tab_ems:police_get_alertdispatch', function(res)
        cb(res)
    end)

end)
