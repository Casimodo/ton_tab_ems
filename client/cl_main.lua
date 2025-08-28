
-- *******************************************************
-- ** Simple ouverture de la tablette                   **
-- *******************************************************
local currentTablet = nil

RegisterNetEvent('ton_tab_ems:openTablette')
AddEventHandler('ton_tab_ems:openTablette', function(datas)

    local datasImage = exports["loaf_headshot_base64"]:getBase64(PlayerPedId())
	local img64 = datasImage.base64
    local playerPed = PlayerPedId()
    local tabletModel = 'prop_cs_tablet'

    TriggerServerEvent('ton_tab_ems:src_add_list') -- Permet de lister qui à ouvert la tablette

    RequestModel(tabletModel)
    while not HasModelLoaded(tabletModel) do
        Wait(500)
    end

    currentTablet = CreateObject(GetHashKey(tabletModel), 0, 0, 0, true, true, true)
    AttachEntityToEntity(currentTablet, playerPed, GetPedBoneIndex(playerPed, 60309), 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, true, true, false, true, 1, true)
    
    RequestAnimDict('amb@world_human_seat_wall_tablet@female@base')
    while not HasAnimDictLoaded('amb@world_human_seat_wall_tablet@female@base') do
        Wait(500)
    end
    TaskPlayAnim(playerPed, 'amb@world_human_seat_wall_tablet@female@base', 'base', 8.0, -8, -1, 49, 0, 0, 0, 0)

    -- Envoie les données à la page HTML via NUI
    SendNUIMessage({
        type = 'open',
        values = datas,
        config = Config,
        img64 = img64
    })
    
    -- Affiche la page HTML
    SetNuiFocus(true, true)

end)

-- *******************************************************
-- ** Permet de lancer des appels                       **
-- *******************************************************
RegisterNUICallback('phone_call', function(number, cb)
    cb(true)
    exports.npwd:startPhoneCall(number)
end)

-- *******************************************************
-- ** quelques petite commande joueur
-- *******************************************************
RegisterNUICallback('vehiclekeys', function(none, cb)
    ExecuteCommand('vehiclekeys')
    cb(true)
end)
RegisterNUICallback('attachtrailer', function(none, cb)
    ExecuteCommand('attachtrailer')
    cb(true)
end)
RegisterNUICallback('detachtrailer', function(none, cb)
    ExecuteCommand('detachtrailer')
    cb(true)
end)
RegisterNUICallback('pmms', function(none, cb)
    ExecuteCommand('pmms')
    cb(true)
end)
RegisterNUICallback('setbadgephoto', function(none, cb)
    ExecuteCommand('setbadgephoto')
    cb(true)
end)

-- *******************************************************
-- ** Fermeture de la page HTML en appuyant sur Echap   **
-- *******************************************************
RegisterNUICallback('close', function(data, cb)
    local playerPed = PlayerPedId()

    TriggerServerEvent('ton_tab_ems:src_remove_list') -- Permet de lister qui à fermer la tablette

    ClearPedTasks(playerPed)
    local attachedObjects = GetGamePool('CObject') -- Obtenir tous les objets de la scène
    for _, obj in ipairs(attachedObjects) do
        if DoesEntityExist(obj) and IsEntityAttachedToEntity(obj, playerPed) then
            DetachEntity(obj, true, true) -- Détache l'objet du joueur
            DeleteObject(obj) -- Supprime l'objet
        end
    end
    
    SetNuiFocus(false, false)
    currentTablet = nil
    cb('ok')
end)

-- /** ****************************************************************************
--  * ---- CALIBRATION AIDE AU DEVELOPPEMENT ----
--  * Ci-dessous à mettre en commentaire ne sert qu'à calibrer la carte
--  * Utilisation :  Voir dans le ems_openDispatch.js la partie à documenter
--  * *****************************************************************************/
-- RegisterCommand('pushpos', function()
--   local p = GetEntityCoords(PlayerPedId())
--   SendNUIMessage({ action = "setLastWorldPos", x = p.x + 0.0, y = p.y + 0.0 })
-- end, false)
-- RegisterCommand('dumpCalibration', function()
--   local p = GetEntityCoords(PlayerPedId())
--   SendNUIMessage({ action = "dumpCalibration"})
-- end, false)
