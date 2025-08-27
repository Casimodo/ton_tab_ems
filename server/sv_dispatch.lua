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
    print('>>>>>' .. dt.status .. '>>' .. status)
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
fk.RegisterServerCallback('ton_tab_ems:unity_get', function(source, cb, data)
    local _src = source

    -- local xPlayer = ESX.GetPlayerFromId(_src)
    -- local identifier = xPlayer.identifier

    local QUERY = "SELECT * FROM ton_ems_unites WHERE agent1_id <> '' ORDER BY id;"
    MySQL.query(QUERY, {}, function(result)

        local response = {}
        for i = 1, #result do
            local row = result[i]
            table.insert(response, {
                id              = row.id,
                nom             = row.nom,
                prenom          = row.prenom,
                datebirday      = row.datebirday,
                phone_number    = row.phone_number,
                comment         = row.comment, 
                adn             = row.adn, 
                photo1          = row.photo1, 
                photo2          = row.photo2,
                photo3          = row.photo3,
                photo4          = row.photo4,
                redige_par      = row.redige_par,
                cree_par        = row.cree_par,
                date_add        = row.date_add,
                date_update     = row.date_update
            })
        end
        cb(response)

    end)
end)
