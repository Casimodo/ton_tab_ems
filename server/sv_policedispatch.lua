-- *******************************************************
-- **                                                   **
-- *******************************************************
ESX.RegisterServerCallback('ton_tab_ems:police_get_alertdispatch', function(source, cb)
    
    local SQL = 'SELECT * FROM dispatch_alerts;'
    MySQL.Async.fetchAll(SQL, {},
    function(result)
        callback(result)
    end)
end)
