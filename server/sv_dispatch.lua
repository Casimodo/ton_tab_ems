
-- *******************************************************
-- ** Renvoi le resultat de la recherche            
-- *******************************************************
framework.RegisterServerCallback('ton_tab_ems:getDispatch', function(source, cb, data)
    local _src = source

    print("sv_dispatch - getDispatch")
    -- local xPlayer = ESX.GetPlayerFromId(_src)
    -- local identifier = xPlayer.identifier

    -- local QUERY = "SELECT * FROM ton_tab_amendes ORDER BY Label;"
    -- MySQL.query(QUERY, {
    -- }, function(result)

    --     cb(result)

    -- end)
end)
