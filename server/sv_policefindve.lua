
-- *******************************************************
-- ** Renvoi les vvéhicule en fonction de leur plaque  **
-- *******************************************************
ESX.RegisterServerCallback('ton_tab_ems:police_find_ve', function(source, cb, data)
    local _src = source
    local xPlayer = ESX.GetPlayerFromId(_src)
    local identifier = xPlayer.identifier
    
    local QUERY = ""
    QUERY = QUERY .. "SELECT users.identifier, users.firstname, users.lastname, users.phone_number, users.created_at, JSON_EXTRACT(ve.vehicle, '$.model') AS modelHash, vmodel.model AS modelKey, vmodel.name AS modelName, ve.plate, ve.vehicle, ve.job, ve.mileage, ve.date_insert, ve.insured "
    QUERY = QUERY .. "  FROM owned_vehicles AS ve "
    QUERY = QUERY .. "    LEFT JOIN vehicles AS vmodel ON (CAST(vmodel.hash  AS UNSIGNED) = CAST(JSON_EXTRACT(ve.vehicle, '$.model') AS UNSIGNED)) "
    QUERY = QUERY .. "    LEFT JOIN users ON (ve.owner = users.identifier) "
    QUERY = QUERY .. "  WHERE ve.plate LIKE @find " 
    QUERY = QUERY .. " ORDER BY ve.plate; "
    MySQL.query(QUERY, {
        ['@find'] = '%' .. data .. '%'
    }, function(result)

        local response = {}
        for i = 1, #result do
            local row = result[i]
            table.insert(response, {
                identifier = row.identifier,
                name = row.firstname .. " " .. row.lastname,
                phone_number = row.phone_number,
                visa = row.created_at,
                plate = row.plate,
                vehicle = row.modelKey,
                vehicleName = row.modelName,
                modelHash = row.modelHash,
                job = row.job,
                mileage = row.mileage,
                date_insert = row.date_insert,
                insured = row.insured
            })
        end
        cb(response)

    end)
end)