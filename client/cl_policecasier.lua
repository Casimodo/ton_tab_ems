-- *******************************************************
-- ** Recherche de casier                              
-- *******************************************************
RegisterNUICallback('police_casier_find', function(data, cb)

    ESX.TriggerServerCallback('ton_tablette:police_casier_find', function(res)
        cb(res)
    end, data)

end)

-- *******************************************************
-- ** Get de casier                                    
-- *******************************************************
RegisterNUICallback('police_casier_get', function(id, cb)

    ESX.TriggerServerCallback('ton_tablette:police_casier_get', function(res)
        cb(res)
    end, id)

end)

-- *******************************************************
-- ** Save de casier                                    
-- *******************************************************
RegisterNUICallback('police_casier_save', function(data, cb)

    ESX.TriggerServerCallback('ton_tablette:police_casier_save', function(res)
        cb(res)
    end, data)

end)

-- *******************************************************
-- ** Imprimer casier                                    
-- *******************************************************
RegisterNUICallback('police_casier_print', function(data, cb)

    cb('ok')

    TriggerServerEvent('k5_documents:createServerDocument', {
        customName = "Dossier LSPD/BCSO",
        name = "Casier",
        description = "Dossier LSPD/BCSO : Casier",
        fields = {
            {
                name = "Fait du",
                value = data.redige_par
            },
            {
                name = "Tél. Contact",
                value = data.phone_number
            }
        },
        infoName = "Détail du casier",
        infoValue = data.comment,
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