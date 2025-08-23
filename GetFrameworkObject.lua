fk = nil

function GetFrameworkObject()
    local object = nil
    if not Config.frameworkObject then
        print("Framework object not defined in configuration")
        return nil
    end

    if Config.frameworkObject == "esx" then
        object = exports["es_extended"]:getSharedObject()
    elseif Config.frameworkObject == "infinity" then
        object = exports["esx_infinity"]:GetObject()
    elseif Config.frameworkObject == "newqb" then
        object = exports["qb-core"]:GetCoreObject()
    elseif Config.frameworkObject == "oldqb" then
        while object == nil do
            TriggerEvent('QBCore:GetObject', function(obj) object = obj end)
            Citizen.Wait(200)
        end
    else
        print("Unknown framework object specified: " .. tostring(Config.frameworkObject))
    end

    return object
end

Citizen.CreateThread(function()
    fk = GetFrameworkObject() 
      
    if Config.framework == 'esx' then 
        while fk.GetPlayerData().job == nil do
            Citizen.Wait(10)
        end
        PlayerData = fk.GetPlayerData()
    end
end)