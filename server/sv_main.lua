RegisterServerEvent('ton_tablette:getMyIdentity')
AddEventHandler('ton_tablette:getMyIdentity', function()

    local src = source
    local xPlayer = ESX.GetPlayerFromId(src)

    local listAgentReceiveCall = exports.ton_npwd:playerListReceiveCallByJob('police')
    if #listAgentReceiveCall == 0 then
        listAgentReceiveCall = exports.ton_npwd:playerListReceiveCallByJob('mechanic')
    end
    if #listAgentReceiveCall == 0 then
        listAgentReceiveCall = exports.ton_npwd:playerListReceiveCallByJob('ambulance')
    end

    local playerIsGetCall = false
    for _, playerGetCall in pairs(listAgentReceiveCall) do
        if xPlayer.identifier == playerGetCall.identifier then 
            playerIsGetCall = true
            break
        end
    end

    local datas = {
        playerId = xPlayer.playerId,
        source = xPlayer.source,
        group = xPlayer.group,
        admin = xPlayer.admin,
        job = xPlayer.job,
        identifier = xPlayer.identifier,
        gang = xPlayer.gang,
        sex = xPlayer.sex,
        dateofbirth = xPlayer.dateofbirth,
        status = xPlayer.status,
        lastName = xPlayer.variables.lastName,
        firstName = xPlayer.variables.firstName,
        name = xPlayer.name,
        height = xPlayer.variables.height,
        accounts = xPlayer.accounts,
        getCall = playerIsGetCall
    }
    TriggerClientEvent('ton_tablette:openTablette', src, datas)

end)