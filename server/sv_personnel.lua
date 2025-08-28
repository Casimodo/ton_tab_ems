-- *******************************************************
-- ** Renvoi la list des unités sur le terrain   
-- *******************************************************
fk.RegisterServerCallback('ton_tab_ems:ems_list', function(source, cb)
    local _src = source
    local jobs = Config.job_name

    -- Construire une chaîne de placeholders : "?, ?" si deux éléments
    local placeholders = {}
    for i = 1, #jobs do
        table.insert(placeholders, "?")
    end
    local placeholders_str = table.concat(placeholders, ", ")

    local QUERY = "SELECT * FROM users WHERE job IN (" .. placeholders_str .. ") ORDER BY lastname, firstname ;"
    MySQL.query(QUERY, jobs, function(result)

        local response = {}
        for i = 1, #result do
            local row = result[i]
            table.insert(response, {
                identifier      = row.identifier,
                job             = row.job,
                job_grade       = row.job_grade,
                firstname       = row.firstname,
                lastname        = row.lastname,
                dateofbirth     = row.dateofbirth,
                sex             = row.sex,
                height          = row.height,
                phone_number    = row.phone_number,
                created_at      = row.created_at
            })
        end
        cb(response)

    end)
end)
