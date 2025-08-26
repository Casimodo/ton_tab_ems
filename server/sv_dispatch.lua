fk = GetFrameworkObject()

-- *******************************************************
-- ** Renvoi le resultat des données du dispatch EMS   
-- *******************************************************
fk.RegisterServerCallback('ton_tab_ems:get_dispatch', function(source, cb, data)
    local _src = source

    -- local xPlayer = ESX.GetPlayerFromId(_src)
    -- local identifier = xPlayer.identifier

    local QUERY = "SELECT *, DATE_FORMAT(created_at, '%H:%i') AS heure_minute FROM ton_ems_dispatch ORDER BY id DESC;"
    MySQL.query(QUERY, {}, function(result)

        cb(result)

    end)
end)

-- *******************************************************
-- ** Mise à jour du statut d'une intervention          
-- *******************************************************
fk.RegisterServerCallback('ton_tab_ems:set_dispatch_inter', function(source, cb, dt)

    local status = "en attente";
    print('>>>>' .. json.encode(dt))
    if dt.status == "traité" then cb(true); return end
    if dt.status == "en attente" then status = "attribué" end
    if dt.status == "attribué" then status = "en attente" end

    local QUERY = "UPDATE ton_ems_dispatch SET status = @status WHERE id = @id;"
    MySQL.query(QUERY, {
        ['@status'] = status,
        ['@id'] = dt.id
    }, function(result)

        cb(true)

    end)
end)
