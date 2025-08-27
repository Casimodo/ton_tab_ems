RegisterNetEvent('ton_tablette:changeStatut')
AddEventHandler('ton_tablette:changeStatut', function(datas)

    SendNUIMessage({
        type = 'dispatch_status',
        values = datas
    })

end)

-- *******************************************************
-- ** Renvoi le resultat des données du dispatch EMS   
-- *******************************************************
RegisterNUICallback('dispatch_get', function(data, cb)

    fk.TriggerServerCallback('ton_tab_ems:get_dispatch', function(result)
        cb(result)
    end, nil)

end)

-- *******************************************************
-- ** Mise à jour du statut d'une intervention          
-- *******************************************************
RegisterNUICallback('dispatch_get_inter', function(data, cb)

    local dt = data
    fk.TriggerServerCallback('ton_tab_ems:set_dispatch_inter', function(result)
        cb(result)
    end, dt)

end)

-- *******************************************************
-- ** Renvoi la list des unités sur le terrain   
-- *******************************************************
RegisterNUICallback('get_unity', function(data, cb)

    print(">>>> call ton_tab_ems:unity_get")
    fk.TriggerServerCallback('ton_tab_ems:get_unity', function(result)
        cb(result)
    end)

end)