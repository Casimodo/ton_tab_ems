-- *******************************************************
-- ** Renvoi le resultat des données         
-- *******************************************************
function getAllAmendes(callback)
    MySQL.Async.fetchAll('SELECT * FROM ton_tab_amendes', {},
    function(dtdb)
        local metadata = {}
        for i = 1, #dtdb do
            local row = dtdb[i]
            table.insert(metadata, {
                id = row.id,
                label_court = row.label,
                label = row.label .. " ($" .. row.prix .. " / " .. row.tps_prison .. "mn)",
                prix = row.prix,
                tps_prison = row.tps_prison
            })
            
        end
        callback(metadata)
    end)
end

-- *******************************************************
-- ** Renvoi le resultat de la recherche            
-- *******************************************************
ESX.RegisterServerCallback('ton_tablette:police_dossier_find', function(source, cb, data)
    local _src = source
    local xPlayer = ESX.GetPlayerFromId(_src)
    local identifier = xPlayer.identifier
    local limit = ''
    if (data == '') then
        limit = ' limit 10 '
    end
    local QUERY = ""
    QUERY = QUERY .. "SELECT * "
    QUERY = QUERY .. "  FROM ton_tab_incidents "
    QUERY = QUERY .. "  WHERE (LOWER(label) like @find) or (LOWER(comment) like @find) or (LOWER(redige_par) like @find) or  "
    QUERY = QUERY .. "    (LOWER(civils_implique) like @find) or (LOWER(num_casier) like @find) or (LOWER(lieux) like @find) or (LOWER(type) like @find) "
    QUERY = QUERY .. "  ORDER BY date_update DESC " .. limit
    MySQL.query(QUERY, {
        ['@find'] = '%' .. data .. '%'
    }, function(result)

        getAllAmendes(function(amendesList)

            local response = {}
            for i = 1, #result do
                local row = result[i]
                table.insert(response, {
                    id              = row.id,
                    type            = row.type,
                    label           = row.label,
                    comment         = row.comment,
                    phone_number    = row.phone_number,
                    num_casier      = row.num_casier,
                    redige_par      = row.redige_par, 
                    cree_par        = row.cree_par, 
                    civils_implique = row.civils_implique,
                    amendes         = row.amendes,
                    lieux           = row.lieux,
                    date_add        = row.date_add,
                    date_update     = row.date_update,
                    photo1          = row.photo1, 
                    photo2          = row.photo2,
                    photo3          = row.photo3,
                    photo4          = row.photo4,
                    photo5          = row.photo5,
                    photo6          = row.photo6
                })
            end
            cb(response, amendesList)

        end)

    end)
end)

-- *******************************************************
-- ** Renvoi le resultat d'un resultat               
-- *******************************************************
ESX.RegisterServerCallback('ton_tablette:police_dossier_get', function(source, cb, id)
    local _src = source
    local xPlayer = ESX.GetPlayerFromId(_src)
    local identifier = xPlayer.identifier
    
    local QUERY = "SELECT * FROM ton_tab_incidents WHERE id = @id LIMIT 1;"
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
ESX.RegisterServerCallback('ton_tablette:police_dossier_save', function(source, cb, dt)
    local _src = source
    local xPlayer = ESX.GetPlayerFromId(_src)
    local identifier = xPlayer.identifier
    if (dt.id == "") then
        local stringRequete = 'INSERT INTO ton_tab_incidents (type, label, comment, redige_par, cree_par, civils_implique, phone_number, num_casier, amendes, lieux, photo1, photo2, photo3, photo4, photo5, photo6) VALUES (@type, @label, @comment, @redige_par, @cree_par, @civils_implique, @phone_number, @num_casier, @amendes, @lieux, @photo1, @photo2, @photo3, @photo4, @photo5, @photo6)';
        MySQL.Async.execute(stringRequete,
        {
            ['@type']               = dt.type,
            ['@label'] 	            = dt.label,
            ['@comment'] 		    = dt.comment,
            ['@civils_implique'] 	= dt.civils_implique,
            ['@phone_number'] 	    = dt.phone_number,
            ['@num_casier'] 	    = dt.num_casier,
            ['@amendes'] 		    = dt.amendes,
            ['@lieux'] 		        = dt.lieux,
            ['@redige_par'] 		= dt.redige_par,
            ['@cree_par'] 		    = dt.redige_par,
            ['@photo1'] 	        = dt.photo1,
            ['@photo2'] 		    = dt.photo2,
            ['@photo3'] 		    = dt.photo3,
            ['@photo4'] 		    = dt.photo4,
            ['@photo5'] 		    = dt.photo5,
            ['@photo6'] 		    = dt.photo6
        }, function(resp)
            cb('ok')
        end)
        
    else
        local stringRequete = 'UPDATE ton_tab_incidents SET type=@type, label=@label, comment=@comment, redige_par=@redige_par, civils_implique=@civils_implique, phone_number=@phone_number, num_casier=@num_casier, amendes=@amendes, lieux=@lieux, photo1=@photo1, photo2=@photo2, photo3=@photo3, photo4=@photo4, photo5=@photo5, photo6=@photo6 WHERE id=@id LIMIT 1;';
        MySQL.Async.execute(stringRequete,
        {
            ['@id']                 = dt.id,
            ['@type']               = dt.type,
            ['@label'] 	            = dt.label,
            ['@comment'] 		    = dt.comment,
            ['@civils_implique'] 	= dt.civils_implique,
            ['@phone_number'] 	    = dt.phone_number,
            ['@num_casier'] 	    = dt.num_casier,
            ['@amendes'] 		    = dt.amendes,
            ['@lieux'] 		        = dt.lieux,
            ['@redige_par'] 		= dt.redige_par,
            ['@photo1'] 	        = dt.photo1,
            ['@photo2'] 		    = dt.photo2,
            ['@photo3'] 		    = dt.photo3,
            ['@photo4'] 		    = dt.photo4,
            ['@photo5'] 		    = dt.photo5,
            ['@photo6'] 		    = dt.photo6
        }, function(resp)
            cb('ok')
        end)
    end
    
end)