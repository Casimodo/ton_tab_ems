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
local oldBlipAlert = nil
RegisterNUICallback('dispatch_get_inter', function(data, cb)

    local dt = data
    
    -- Si c'est ce statut alors ont met le GPS pour le client
    if dt.status == "en attente" then
    
        local coords = vector3(data.marker.x, data.marker.y, 0.0)
        -- Création du blip
        local blip = AddBlipForCoord(coords.x, coords.y, coords.z)
        if oldBlipAlert ~= nil then RemoveBlip(oldBlipAlert) end
        SetBlipSprite(blip, 280)
        SetBlipColour(blip, 1)
        SetBlipScale(blip, 1.0)
        SetBlipRoute(blip,  true)
        SetBlipRouteColour(blip, 1)
        lib.points.new({ 
            coords = vec3(coords), distance = 10,
            nearby = function(selt)
                RemoveBlip(blip)
            end
        })
        oldBlipAlert = blip
    else
        if oldBlipAlert ~= nil then RemoveBlip(oldBlipAlert) end
    end
    
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