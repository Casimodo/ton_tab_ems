
-- *******************************************************
-- ** Renvoi le resultat de la recherche            
-- *******************************************************
ESX.RegisterServerCallback('ton_tablette:police_casier_find', function(source, cb, data)
    local _src = source
    local xPlayer = ESX.GetPlayerFromId(_src)
    local identifier = xPlayer.identifier
    local limit = ''
    if (data == '') then
        limit = ' limit 10 '
    end
    local QUERY = ""
    QUERY = QUERY .. "SELECT * "
    QUERY = QUERY .. "  FROM ton_tab_casiers "
    QUERY = QUERY .. "  WHERE (LOWER(nom) like @find) or (LOWER(prenom) like @find) or (LOWER(comment) like @find) or  "
    QUERY = QUERY .. "    (LOWER(redige_par) like @find) or (LOWER(cree_par) like @find) "
    QUERY = QUERY .. "  ORDER BY date_update DESC " .. limit
    MySQL.query(QUERY, {
        ['@find'] = '%' .. data .. '%'
    }, function(result)

        local response = {}
        for i = 1, #result do
            local row = result[i]
            table.insert(response, {
                id              = row.id,
                nom             = row.nom,
                prenom          = row.prenom,
                datebirday      = row.datebirday,
                phone_number    = row.phone_number,
                comment         = row.comment, 
                adn             = row.adn, 
                photo1          = row.photo1, 
                photo2          = row.photo2,
                photo3          = row.photo3,
                photo4          = row.photo4,
                redige_par      = row.redige_par,
                cree_par        = row.cree_par,
                date_add        = row.date_add,
                date_update     = row.date_update
            })
        end
        cb(response)

    end)
end)

-- *******************************************************
-- ** Renvoi le resultat d'un resultat               
-- *******************************************************
ESX.RegisterServerCallback('ton_tablette:police_casier_get', function(source, cb, id)
    local _src = source
    local xPlayer = ESX.GetPlayerFromId(_src)
    local identifier = xPlayer.identifier
    
    local QUERY = "SELECT * FROM ton_tab_casiers WHERE id = @id LIMIT 1;"
    MySQL.query(QUERY, {
        ['@id'] = id
    }, function(result)

        local response = {}
        for i = 1, #result do
            response = result[i]
            break
        end
        cb(response)

    end)
end)

-- *******************************************************
-- ** Renvoi le resultat d'un resultat                  **
-- *******************************************************
ESX.RegisterServerCallback('ton_tablette:police_casier_save', function(source, cb, dt)
    local _src = source
    local xPlayer = ESX.GetPlayerFromId(_src)
    local identifier = xPlayer.identifier

    if (dt.id == "") then
        local stringRequete = 'INSERT INTO ton_tab_casiers (nom, prenom, datebirday, phone_number, comment, adn, photo1, photo2, photo3, photo4, redige_par, cree_par) VALUES (@nom, @prenom, @datebirday, @phone_number, @comment, @adn, @photo1, @photo2, @photo3, @photo4, @redige_par, @cree_par)';
        MySQL.Async.execute(stringRequete,
        {
            ['@nom']            = dt.nom,
            ['@prenom'] 	    = dt.prenom,
            ['@datebirday']     = dt.datebirday,
            ['@phone_number']   = dt.phone_number,
            ['@comment'] 	    = dt.comment,
            ['@adn'] 	        = dt.adn,
            ['@photo1'] 	    = dt.photo1,
            ['@photo2'] 		= dt.photo2,
            ['@photo3'] 		= dt.photo3,
            ['@photo4'] 		= dt.photo4,
            ['@cree_par'] 		= dt.redige_par,
            ['@redige_par'] 	= dt.redige_par
        }, function(resp)
            cb('ok')
        end)
        
    else
        local stringRequete = 'UPDATE ton_tab_casiers SET nom=@nom, prenom=@prenom, datebirday=@datebirday, phone_number=@phone_number, comment=@comment, adn=@adn, photo1=@photo1, photo2=@photo2, photo3=@photo3, photo4=@photo4, redige_par=@redige_par WHERE id=@id LIMIT 1;';
        MySQL.Async.execute(stringRequete,
        {
            ['@id']             = dt.id,
            ['@nom']            = dt.nom,
            ['@prenom'] 	    = dt.prenom,
            ['@datebirday']     = dt.datebirday,
            ['@phone_number']   = dt.phone_number,
            ['@comment'] 	    = dt.comment,
            ['@adn'] 	        = dt.adn,
            ['@photo1'] 	    = dt.photo1,
            ['@photo2'] 		= dt.photo2,
            ['@photo3'] 		= dt.photo3,
            ['@photo4'] 		= dt.photo4,
            ['@redige_par'] 	= dt.redige_par
        }, function(resp)
            cb('ok')
        end)
    end
    
end)