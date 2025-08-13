-- *******************************************************
-- **                                                   **
-- *******************************************************
ESX.RegisterServerCallback('ton_tablette:police_get_alertdispatch', function(source, cb)
    
    local SQL = 'SELECT * FROM dispatch_alerts;'
    MySQL.Async.fetchAll(SQL, {},
    function(result)
        callback(result)
    end)
end)
