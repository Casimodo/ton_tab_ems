
local function getDatasPlayer(source)
    local xPlayer = ESX.GetPlayerFromId(source)
    if xPlayer then

        local gang = {name = "Aucun", label = "Aucun", grade = "Aucun"}
        print("xPlayer.gang: " .. json.encode(xPlayer.gang))
        if xPlayer.gang ~= nil then
            gang.name = xPlayer.gang.name
            gang.label = xPlayer.gang.label
            gang.grade = xPlayer.gang.grade
        end

        return {
            playerId = xPlayer.playerId,
            source = xPlayer.source,
            group = xPlayer.group,
            admin = xPlayer.admin,
            job = xPlayer.job,
            identifier = xPlayer.identifier,
            gang = gang,
            sex = xPlayer.sex,
            dateofbirth = xPlayer.dateofbirth,
            status = xPlayer.status,
            lastName = xPlayer.variables.lastName,
            firstName = xPlayer.variables.firstName,
            name = xPlayer.name,
            height = xPlayer.variables.height,
            accounts = xPlayer.accounts
        }
    end
end

RegisterServerEvent('ton_tablette:getMyIdentity')
AddEventHandler('ton_tablette:getMyIdentity', function()

    local src = source
    local datas = getDatasPlayer(src)

    TriggerClientEvent('ton_tablette:openTablette', src, datas)

end)

RegisterCommand("ton_tab_ems", function(source, args, rawCommand)
    
    local src = source
    local datas = getDatasPlayer(src)

    TriggerClientEvent('ton_tablette:openTablette', src, datas)
    
end)