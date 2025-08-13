
-- *******************************************************
-- ** Maj matricule
-- *******************************************************
ESX.RegisterServerCallback('ton_tablette:matricule_police', function(source, cb, dt)
    local _src = source
    local xPlayer = ESX.GetPlayerFromId(_src)
    local identifier = xPlayer.identifier

    local stringRequete = 'UPDATE users SET police_matricule=@police_matricule WHERE identifier=@identifier LIMIT 1;';
    MySQL.Async.execute(stringRequete,
    {
        ['@identifier']         = identifier,
        ['@police_matricule']   = dt.matricule
    }, function(resp)
        cb('ok')
    end)

    
end)