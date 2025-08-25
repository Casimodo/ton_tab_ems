-- *******************************************************
-- ** Renvoi le resultat des données du dispatch EMS   
-- *******************************************************
RegisterNUICallback('dispatch_get', function(data, cb)

    fk.TriggerServerCallback('ton_tab_ems:get_dispatch', function(data)
        
        cb(data)
    end, nil)

end)

-- *******************************************************
-- ** Mise à jour du statut d'une intervention          
-- *******************************************************
RegisterNUICallback('dispatch_get_inter', function(data, cb)

    print('>>>>' .. json.encode(data))
    local dt = json.decode(data)
    fk.TriggerServerCallback('ton_tab_ems:set_dispatch_inter', function(data)
        cb(nil)
    end, dt)

end)