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
-- ** Recherche unités par rapport à l'identifian          
-- *******************************************************
local function getUnityByIdentifier(cb, identifier)

    local QUERY = "SELECT * FROM ton_ems_unites WHERE agent1_id = @agent1_id OR  agent2_id = @agent2_id OR agent3_id = @agent3_id OR  agent4_id = @agent4_id LIMIT 1;"
    MySQL.query(QUERY, {
        ['agent1_id'] = identifier,
        ['agent2_id'] = identifier,
        ['agent3_id'] = identifier,
        ['agent4_id'] = identifier,
    }, function(result)

        local response = {
            id          = 0,
            nom         = 'Unité 0',
            status      = 'Error',
            agent1_id   = '',
            agent2_id   = '',
            agent3_id   = '',
            agent4_id   = '',
            date_update = '',
        }
        for i = 1, #result do
            local row = result[i]
            response = {
                id          = row.id,
                nom         = row.nom_unite,
                status      = row.status,
                agent1_id   = row.agent1_id,
                agent2_id   = row.agent2_id,
                agent3_id   = row.agent3_id,
                agent4_id   = row.agent4_id,
                date_update = row.date_update
            }
        end
        cb(response)

    end)

end

-- *******************************************************
-- ** Recherche du dispatch par id          
-- *******************************************************
local function getInterById(cb, id)

    local QUERY = "SELECT * FROM ton_ems_dispatch WHERE id = @id LIMIT 1;"
    MySQL.query(QUERY, {
        ['id'] = id
    }, function(result)

        local response = {
            id                  = 0,
            unity               = 'Unité 0',
            identifier_alert    = 'Error',
            source_alert        = '',
            description         = '',
            location            = '',
            status              = ''
        }
        for i = 1, #result do
            local row = result[i]
            response = {
                id               = row.id,
                unity            = row.unity,
                identifier_alert = row.identifier_alert,
                source_alert     = row.source_alert,
                description      = row.description,
                location         = row.location,
                status           = row.status
            }
        end
        cb(response)

    end)

end

-- *******************************************************
-- ** Mise à jour du statut d'une intervention          
-- *******************************************************
fk.RegisterServerCallback('ton_tab_ems:set_dispatch_inter', function(source, cb, dt)
    local _src = source

    local status = "en attente";
    if dt.status == "close" then status = "close" end
    if dt.status == "traité" then status = "traité" end
    if dt.status == "en attente" then status = "attribué" end
    if dt.status == "attribué" then status = "en attente" end


    local xPlayer = fk.GetPlayerFromId(_src)
    local identifier = xPlayer.identifier

    getInterById(function(inter) 

        getUnityByIdentifier(function(responseUnity)
            local unityName = responseUnity.nom
            local QUERY = "UPDATE ton_ems_dispatch SET status = @status WHERE id = @id;"
            if status == "attribué" then
                QUERY = "UPDATE ton_ems_dispatch SET status = @status, unity = @unity WHERE id = @id;"
                
                Config_callback.priseEnCharge(inter.source_alert, unityName) -- Appel du callback du config
            end
            MySQL.query(QUERY, {
                ['@status'] = status,
                ['@unity'] = unityName,
                ['@id'] = dt.id
            }, function(result)

                -- Récupère les players ayant ouvert la tablette et leur notifie en live du changement
                local targets = exports['ton_tab_ems']:GetSourcesOpenTab()  -- tableau d'entiers
                for _, src in ipairs(targets) do
                    -- Vérifier que le joueur est bien connecté (sécurité)
                    if GetPlayerName(src) ~= nil then
                        local newStatus = {id = dt.id, status = status, unity = unityName}
                        TriggerClientEvent('ton_tab_ems:changeStatut', src, newStatus)
                    end
                end

                cb(true)

            end)
        end, identifier)

    end, dt.id)

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
            --local job = dt.job.name
            --local emsJob = exports['ton_tab_ems']:isJobAllowed(job)
            --if emsJob then
                table.insert(response, {
                    id              = row.id,
                    nom_unite       = row.nom_unite,
                    coords          = dt.coords
                })
            --end
        end
        cb(response)

    end)
end)


-- *******************************************************
-- ** Mise à jour du statut d'une intervention          
-- *******************************************************
local function alert(source, description) 
    local _src = source

    local ped = GetPlayerPed(_src)
    local xPlayer = fk.GetPlayerFromId(_src)
    local identifier = xPlayer.identifier
    local coords = vector3(0,0,0)
    if not ped or ped <= 0 then return nil end
    coords = GetEntityCoords(ped)

    local QUERY = "INSERT INTO ton_ems_dispatch (identifier_alert, source_alert, description, location) VALUES (@identifier, @source, @description, @location);"
    MySQL.query(QUERY, {
        ['@identifier'] = identifier,
        ['@source'] = _src,
        ['@description'] = description,
        ['@location'] = json.encode(coords)
    }, function(result)

        Config_callback.alert(_src, description, coords)

    end)
end

exports('alert', alert)

RegisterCommand(Config.command.alert, function(source)

    local xPlayer = fk.GetPlayerFromId(source)
    if not xPlayer then return end

    -- Vérifie le groupe ESX
    if xPlayer.getGroup() == "admin" or xPlayer.getGroup() == "superadmin" then
        alert(source, "test Admin !")
    end
end)