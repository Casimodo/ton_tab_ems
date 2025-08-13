-- *******************************************************
-- ** Renvoi le resultat de la recherche            
-- *******************************************************
ESX.RegisterServerCallback('ton_tablette:civil_codepenal', function(source, cb, data)
    local _src = source
    local xPlayer = ESX.GetPlayerFromId(_src)
    local identifier = xPlayer.identifier

    local QUERY = "SELECT * FROM ton_tab_amendes ORDER BY Label;"
    MySQL.query(QUERY, {
    }, function(result)

        cb(result)

    end)
end)
