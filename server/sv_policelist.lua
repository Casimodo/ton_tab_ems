function table.search(tbl, value)
    for i, v in ipairs(tbl) do
        if v == value then
            return true  -- Retourne l'index où la valeur a été trouvée
        end
    end
    return false  -- Retourne nil si la valeur n'est pas trouvée
end

-- Fonction pour obtenir la liste des joueurs en jeu
-- function getPolicePlayers(callback)
--     local players = GetPlayers()
--     local playerData = {}
--     local job = {}
--     local list_conn_police = {}

--     for _, playerId in ipairs(players) do
--         local playerName = GetPlayerName(playerId)
--         local infos = ESX.GetPlayerFromId(playerId)      
--         if (infos ~= nil) then
--             local identifier = infos.identifier

--             if (infos) then
--                 job = infos.job
--                 if (job.label == 'LSPD' or job.label == 'BCSO') then
--                     table.insert(list_conn_police, identifier)
--                 end
--             end
--         end

--     end
    
--     local listAgentReceiveCall = exports.ton_npwd:playerListReceiveCallByJob('police')
--     MySQL.Async.fetchAll('SELECT us.identifier, us.police_matricule, us.firstname as firstname, us.lastname as lastname, us.dateofbirth as dateofbirth, us.height as height, us.phone_number as phone_number, jobs.label AS job_type, job.label AS job_label, IF(duty.job IS NOT NULL, TRUE, FALSE) AS on_duty FROM users AS us LEFT JOIN job_grades AS job ON (us.job = job.job_name AND us.job_grade = job.grade) LEFT JOIN jobs ON (us.job = jobs.name) LEFT JOIN ton_service_duty AS duty ON (us.identifier = duty.identifier) WHERE us.job = "police" OR us.job = "bcso";', {},
--     function(user)
--         for i = 1, #user do
--             local row = user[i]

--             local playerIsGetCall = false
--             for _, playerGetCall in pairs(listAgentReceiveCall) do
--                 if row.identifier == playerGetCall.identifier then 
--                     playerIsGetCall = true
--                     break
--                 end
--             end

--             -- Mise en place des données
--             table.insert(playerData, {
--                 identifier = row.identifier,
--                 firstname = row.firstname,
--                 lastname = row.lastname,
--                 dateofbirth = row.dateofbirth, 
--                 height = row.height,
--                 phone_number = row.phone_number,
--                 job_type = row.job_type,
--                 job_label = row.job_label,
--                 duty = row.on_duty,
--                 isgetcall = playerIsGetCall,
--                 isConnect = table.search(list_conn_police, row.identifier),
--                 matricule = row.police_matricule
--             })
--         end
--         callback(playerData)
--     end)

-- end

-- *******************************************************
-- ** Renvoi les voitures du player                     **
-- *******************************************************
ESX.RegisterServerCallback('ton_tablette:police_list', function(source, cb)
    -- getPolicePlayers(function(effectifs) 
    --     cb(effectifs)
    -- end)
    cb({})  -- Retourne une table vide pour l'instant, à remplacer par la fonction getPolicePlayers si nécessaire
end)