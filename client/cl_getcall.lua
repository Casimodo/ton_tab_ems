-- Permet de prendre une photo pour les badges
RegisterNUICallback('get_call', function(data, cb)
    
    ExecuteCommand('ton_getCall')
    TriggerServerEvent('ton_tablette:getMyIdentity')
    cb('ok')
end)