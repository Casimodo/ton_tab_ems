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
    -- Si c'est ce statut alors ont met le GPS pour le client
    --if dt.status == "en attente" then
        -- local ped = PlayerPedId()
        -- local coords = GetEntityCoords(ped)

        -- -- Création du blip
        -- local blip = AddBlipForCoord(coords.x, coords.y, coords.z)
        -- SetBlipSprite(blip, 280)         -- Icône (ici un petit drapeau)
        -- SetBlipColour(blip, 1)           -- Couleur (1 = rouge)
        -- SetBlipScale(blip, 1.0)          -- Taille

        -- -- Active le tracé GPS vers le blip
        -- SetBlipRoute(blip, true)
        -- SetBlipRouteColour(blip, 1)      -- Même couleur que le blip
    --end
    
    fk.TriggerServerCallback('ton_tab_ems:set_dispatch_inter', function(result)
        cb(result)
    end, dt)

end)

-- *******************************************************
-- ** Renvoi la list des unités sur le terrain   
-- *******************************************************
RegisterNUICallback('get_unity', function(data, cb)

    fk.TriggerServerCallback('ton_tab_ems:get_unity', function(result)
        cb(result)
    end)

end)