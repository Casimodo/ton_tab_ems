fk = GetFrameworkObject()

-- *******************************************************
-- ** Renvoi le resultat des données du dispatch EMS   
-- *******************************************************
fk.RegisterServerCallback('ton_tab_ems:get_dispatch', function(source, cb, data)
    local _src = source

    -- local xPlayer = ESX.GetPlayerFromId(_src)
    -- local identifier = xPlayer.identifier

    local QUERY = "SELECT *, DATE_FORMAT(created_at, '%H:%i') AS heure_minute FROM ton_ems_dispatch WHERE status <> 'close' ORDER BY id DESC;"
    MySQL.query(QUERY, {}, function(result)

        cb(result)

    end)
end)

-- *******************************************************
-- ** Mise à jour du statut d'une intervention          
-- *******************************************************
fk.RegisterServerCallback('ton_tab_ems:set_dispatch_inter', function(source, cb, dt)

    local status = "en attente";
    if dt.status == "close" then status = "close" end
    if dt.status == "traité" then status = "traité" end
    if dt.status == "en attente" then status = "attribué" end
    if dt.status == "attribué" then status = "en attente" end

    local QUERY = "UPDATE ton_ems_dispatch SET status = @status WHERE id = @id;"
    MySQL.query(QUERY, {
        ['@status'] = status,
        ['@id'] = dt.id
    }, function(result)

        -- Récupère les players ayant ouvert la tablette et leur notifie en live du changement
        local targets = exports['ton_tab_ems']:GetSourcesOpenTab()  -- tableau d'entiers
        for _, src in ipairs(targets) do
            -- Vérifier que le joueur est bien connecté (sécurité)
            if GetPlayerName(src) ~= nil then
                local newStatus = {id = dt.id, status = status}
                TriggerClientEvent('ton_tablette:changeStatut', src, newStatus)
            end
        end

        cb(true)

    end)

end)

-- *******************************************************
-- ** Renvoi la list des unités sur le terrain   
-- *******************************************************
fk.RegisterServerCallback('ton_tab_ems:get_unity', function(source, cb)
    local _src = source

    local QUERY = "SELECT * FROM ton_ems_unites WHERE agent1_id <> '' ORDER BY id;"
    MySQL.query(QUERY, {}, function(result)

        local response = {}
        for i = 1, #result do
            local row = result[i]
            local ok, dt = exports['ton_tab_ems']:GetPlayerCoordsAndJobByIdentifier(row.agent1_id)
            local job = dt.job.name
            local emsJob = exports['ton_tab_ems']:isJobAllowed(job)
            if emsJob then
                table.insert(response, {
                    id              = row.id,
                    nom_unite       = row.nom_unite,
                    coords          = dt.coords
                })
            end
        end
        cb(response)

    end)
end)


-- *******************************************************
-- ** Mise à jour du statut d'une intervention          
-- *******************************************************
local function alert(source, raison) 
    local _src = source

    local ped = GetPlayerPed(_src)
    local coords = vector3(0,0,0)
    if not ped or ped <= 0 then return nil end
    coords = GetEntityCoords(ped)

    -- local QUERY = "INSERT ton_ems_dispatch SET status = @status WHERE id = @id;"
    -- MySQL.query(QUERY, {
    --     ['@status'] = status,
    --     ['@id'] = dt.id
    -- }, function(result)

    --     -- Récupère les players ayant ouvert la tablette et leur notifie en live du changement
    --     local targets = exports['ton_tab_ems']:GetSourcesOpenTab()  -- tableau d'entiers
    --     for _, src in ipairs(targets) do
    --         -- Vérifier que le joueur est bien connecté (sécurité)
    --         if GetPlayerName(src) ~= nil then
    --             local newStatus = {id = dt.id, status = status}
    --             TriggerClientEvent('ton_tablette:changeStatut', src, newStatus)
    --         end
    --     end

    --     cb(true)

    -- end)
end

exports('alert', function(source)
    alert(source, "bla")
end)

RegisterCommand("alert", function(source)
    alert(source, "bla2")
end)