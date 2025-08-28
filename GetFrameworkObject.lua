-- GetFrameworkObject.lua (client)
-- Corrige l'accès à PlayerData pour ESX (fonction OU table), avec commentaires FR.

fk = nil

-- Helper : récupère l'objet framework selon le Config.framework
function GetFrameworkObject()
    local object = nil
    if not Config or not Config.framework then
        print("^1[Framework]^7 Config.framework non défini")
        return nil
    end

    local fw = string.lower(Config.framework)

    if fw == "esx" then
        -- ESX (legacy/1.2/1.final) -> export commun
        object = exports["es_extended"] and exports["es_extended"]:getSharedObject() or nil
    elseif fw == "infinity" then
        object = exports["esx_infinity"] and exports["esx_infinity"]:GetObject() or nil
    elseif fw == "newqb" then
        object = exports["qb-core"] and exports["qb-core"]:GetCoreObject() or nil
    elseif fw == "oldqb" then
        while object == nil do
            TriggerEvent('QBCore:GetObject', function(obj) object = obj end)
            Citizen.Wait(200)
        end
    else
        print("^1[Framework]^7 Inconnu : " .. tostring(Config.framework))
    end

    return object
end

-- Helper : renvoie une table PlayerData pour ESX, quel que soit le fork
local function ESX_GetPlayerDataSafe(esx)
    if not esx then return {} end
    -- Certains forks : ESX.GetPlayerData() (fonction)
    if type(esx.GetPlayerData) == "function" then
        return esx.GetPlayerData() or {}
    end
    -- D'autres forks : ESX.PlayerData (table mise à jour par events)
    if type(esx.PlayerData) == "table" then
        return esx.PlayerData
    end
    return {}
end

Citizen.CreateThread(function()
    fk = GetFrameworkObject()  -- peut être nil si mauvais Config
    if not fk then
        print("^1[Framework]^7 Impossible de récupérer l'objet framework (vérifie Config.framework)")
        return
    end

    if string.lower(Config.framework) == 'esx' then
        -- Attendre que le job soit chargé sans appeler une fonction inexistante
        local timeoutMs, waited = 15000, 0
        while true do
            local pd = ESX_GetPlayerDataSafe(fk)
            if pd and pd.job ~= nil then break end
            Citizen.Wait(100)
            waited = waited + 100
            if waited >= timeoutMs then
                print("^3[Framework]^7 Timeout en attendant ESX PlayerData.job")
                break
            end
        end

        -- Optionnel : s’abonner aux events pour tenir PlayerData à jour
        RegisterNetEvent('esx:playerLoaded', function(xPlayer)
            if type(fk.PlayerData) == "table" then
                fk.PlayerData = xPlayer
            end
        end)

        RegisterNetEvent('esx:setJob', function(job)
            if type(fk.PlayerData) == "table" then
                fk.PlayerData.job = job
            end
        end)
    end
end)
