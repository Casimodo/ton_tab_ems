
-- *******************************************************
-- ** Renvoi les voitures du player                     **
-- *******************************************************
ESX.RegisterServerCallback('ton_tablette:my_car', function(source, cb)
    local _src = source
    local xPlayer = ESX.GetPlayerFromId(_src)
    local identifier = xPlayer.identifier

    local QUERY = ""
    QUERY = QUERY .. "SELECT JSON_EXTRACT(ve.vehicle, '$.model') AS modelHash, vmodel.model AS modelKey, vmodel.name AS modelName, ve.plate, ve.vehicle, ve.job, ve.mileage, ve.impound, ve.date_insert, ve.garage_id "
    QUERY = QUERY .. "  FROM owned_vehicles AS ve "
    QUERY = QUERY .. "    LEFT JOIN vehicles AS vmodel ON (CAST(vmodel.hash AS UNSIGNED) = CAST(JSON_EXTRACT(ve.vehicle, '$.model') AS UNSIGNED)) "
    QUERY = QUERY .. "  WHERE ve.owner LIKE @find "
    QUERY = QUERY .. " ORDER BY ve.plate; "
    MySQL.query(QUERY, {
        ['@find'] = identifier
    }, function(result)

        local response = {}
        for i = 1, #result do
            local row = result[i]
            table.insert(response, {
                plate = row.plate,
                vehicle = row.modelKey,
                vehicleName = row.modelName,
                modelHash = row.modelHash,
                job = row.job,
                mileage = row.mileage,
                date_insert = row.date_insert,
                impound = row.impound,
                garage_id = row.garage_id
            })
        end
        cb(response)

    end)
end)