fk = GetFrameworkObject()

-- *******************************************************
-- ** Renvoi le resultat de la recherche            
-- *******************************************************
fk.RegisterServerCallback('ton_tab_ems:get_dispatch', function(source, cb, data)
    local _src = source

    print("sv_dispatch - getDispatch")
    -- local xPlayer = ESX.GetPlayerFromId(_src)
    -- local identifier = xPlayer.identifier

    local QUERY = "SELECT * FROM ton_ems_dispatch ORDER BY id DESC;"
    MySQL.query(QUERY, {}, function(result)

        cb(result)

    end)
end)
