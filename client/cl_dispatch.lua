
RegisterNUICallback('dispatch_get', function(data, cb)

    -- id = json.encode(data);
    -- print("cl find_marker", id)
    -- cb({marker_id = id})
    -- ESX.TriggerServerCallback('ton_tablette:police_dossier_find', function(res, amendesList)
    --     cb({dossiers = res, amendes = amendesList})
    -- end, data)
    print("cl_dispatch - dispatch_get")
    fk.TriggerServerCallback('ton_tab_ems:get_dispatch', function(data)
        print("cl_dispatch - dispatch_send" .. json.encode(data))
        cb(data)
    end)

end)