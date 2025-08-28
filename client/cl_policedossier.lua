-- *******************************************************
-- ** Recherche de dossier                              
-- *******************************************************
RegisterNUICallback('police_dossier_find', function(data, cb)

    ESX.TriggerServerCallback('ton_tab_ems:police_dossier_find', function(res, amendesList)
        cb({dossiers = res, amendes = amendesList})
    end, data)

end)

-- *******************************************************
-- ** Get de dossier                                    
-- *******************************************************
RegisterNUICallback('police_dossier_get', function(id, cb)

    ESX.TriggerServerCallback('ton_tab_ems:police_dossier_get', function(res)
        cb(res)
    end, id)

end)

-- *******************************************************
-- ** Save de dossier                                    
-- *******************************************************
RegisterNUICallback('police_dossier_save', function(data, cb)

    ESX.TriggerServerCallback('ton_tab_ems:police_dossier_save', function(res)
        cb(res)
    end, data)

end)

-- *******************************************************
-- ** Imprimer dossier                                    
-- *******************************************************
RegisterNUICallback('police_dossier_print', function(data, cb)

    cb('ok')

    local amendesList = ''
    local amendes = ''
    local dtAmendes = json.decode(data.amendes)
    for i = 1, #dtAmendes do
        amendesList = amendesList .. dtAmendes[i].label .. "\n"
    end
    if (#dtAmendes > 0) then
        amendes = '\n\nDétail de l\'amendes:\n' .. amendesList .. '\n'
        amendes = amendes .. 'Montant total : $' .. data.amendes_total .. '  (emprisonnement de '.. data.tps_prison ..' mois)'
    end
    

    TriggerServerEvent('k5_documents:createServerDocument', {
        customName = "Dossier LSPD/BCSO",
        name = data.type,
        description = "Dossier LSPD/BCSO : " .. data.type,
        fields = {
            {
                name = "Fait du",
                value = data.date
            },
            {
                name = "Type",
                value = data.type
            },
            {
                name = "Lieu",
                value = data.lieux
            },
            {
                name = "Tél. Contact",
                value = data.phone_number
            }
        },
        infoName = "Détail du dossier : " .. data.label,
        infoValue = data.comment .. amendes,
        isCopy = 0,
        issuer = {
            firstname = data.firstName,
            lastname = data.lastName,
            birthDate = data.dateofbirth,
            jobName = data.job.label .. ' / ' .. data.job.grade_label
        }
    })
    TriggerEvent("ton_lib:ShowNotification", "Consulter votre porte document, imprimé avec succès", "success")

end)