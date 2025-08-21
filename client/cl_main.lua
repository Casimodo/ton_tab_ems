-- *******************************************************
-- ** Simple ouverture de la tablette                   **
-- *******************************************************
local currentTablet = nil

RegisterNetEvent('ton_tablette:openTablette')
AddEventHandler('ton_tablette:openTablette', function(datas)

    local datasImage = exports["loaf_headshot_base64"]:getBase64(PlayerPedId())
	local img64 = datasImage.base64
    local playerPed = PlayerPedId()
    local tabletModel = 'prop_cs_tablet'

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
