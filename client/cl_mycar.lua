-- *******************************************************
-- ** Recherche des voitures du player                  **
-- *******************************************************
RegisterNUICallback('my_car', function(data, cb)

    ESX.TriggerServerCallback('ton_tablette:my_car', function(res)
        cb(res)
    end)

end)