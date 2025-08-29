-- *******************************************************
-- ** Récupère la liste des unitées
-- *******************************************************
fk.RegisterServerCallback('ton_tab_ems:ems_unite', function(source, cb)
    local _src = source
    local jobs = Config.job_name

    -- Construire une chaîne de placeholders : "?, ?" si deux éléments
    local placeholders = {}
    for i = 1, #jobs do
        table.insert(placeholders, "?")
    end
    local placeholders_str = table.concat(placeholders, ", ")

    local QUERY = "SELECT * FROM users WHERE job IN (" .. placeholders_str .. ") ORDER BY lastname, firstname ;"
    MySQL.query(QUERY, jobs, function(resultPersonnel)

        local personnel = {}
        personnel[''] = "   ---   "
        for i = 1, #resultPersonnel do
            local row = resultPersonnel[i]
            personnel[row.identifier] = row.firstname .. ", " .. row.lastname
        end

        local QUERY = "SELECT * FROM ton_ems_unites ORDER BY id;"
        MySQL.query(QUERY, {}, function(result)

            local response = {}
            for i = 1, #result do
                local row = result[i]
                table.insert(response, {
                    id              = row.id,
                    nom_unite       = row.nom_unite,
                    status          = row.status,
                    agent1_id       = row.agent1_id,
                    agent1_name     = personnel[row.agent1_id],
                    agent2_id       = row.agent2_id,
                    agent2_name     = personnel[row.agent2_id],
                    agent3_id       = row.agent3_id,
                    agent3_name     = personnel[row.agent3_id],
                    agent4_id       = row.agent4_id,
                    agent4_name     = personnel[row.agent4_id],
                    date_creation   = row.date_creation,
                    date_update     = row.date_update
                })
            end
            cb(response)

        end)

    end)
end)
