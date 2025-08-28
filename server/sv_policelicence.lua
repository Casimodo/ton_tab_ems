
-- Fonction pour obtenir la liste des joueurs en jeu
function getLicence(callback, playerListProche)
    local players = GetPlayers()
    local playerData = {}
    local job = {}
    local list_conn_police = {}

    
    local playerList = {}
    for _, player in pairs(playerListProche) do
        local playerId = player.value
        local playerName = GetPlayerName(playerId)
        local infos = ESX.GetPlayerFromId(playerId)      

        if (infos ~= nil) then
            local identifier = infos.identifier
            table.insert(playerList, identifier)
        end

    end
    
    local SQL = 'SELECT '
    SQL = SQL .. '  us.identifier, us.firstname, us.lastname, ul.id, ul.`type`, li.label '
    SQL = SQL .. 'FROM '
    SQL = SQL .. '  users AS us '
    SQL = SQL .. '  LEFT JOIN user_licenses AS ul ON (us.identifier = ul.`owner`) '
    SQL = SQL .. '  LEFT JOIN licenses AS li ON (ul.`type` = li.`type`) '
    SQL = SQL .. 'WHERE us.identifier IN (@find);'
    MySQL.Async.fetchAll(SQL, {
        ['@find'] = playerList
    },
    function(playerListResult)
        callback(playerListResult)
    end)

end

-- *******************************************************
-- **                                                   **
-- *******************************************************
ESX.RegisterServerCallback('ton_tab_ems:police_licence', function(source, cb, playerListProche)
    getLicence(function(playerListLicence) 
        cb(playerListLicence)
    end, playerListProche)
end)

-- *******************************************************
-- **                                                   **
-- *******************************************************
ESX.RegisterServerCallback('ton_tab_ems:police_licence_remove', function(source, cb, idRemove)
    
    local SQL = 'DELETE FROM user_licenses WHERE id = @find'
    MySQL.Async.fetchAll(SQL, {
        ['@find'] = idRemove
    },
    function(none)
        cb('ok')
    end)
    
end)