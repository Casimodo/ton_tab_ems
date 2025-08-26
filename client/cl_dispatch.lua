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

    print('>>>>' .. json.encode(data))
    local dt = data
    fk.TriggerServerCallback('ton_tab_ems:set_dispatch_inter', function(result)
        cb(result)
    end, dt)

end)