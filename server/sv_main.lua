-- *******************************************************
-- ** Mise en forme des données du joueur          
-- *******************************************************
local function getDatasPlayer(source)
    local xPlayer = ESX.GetPlayerFromId(source)
    if xPlayer then

        local gang = {name = "Aucun", label = "Aucun", grade = "Aucun"}

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



-- Vérifie si une source est déjà dans la liste
local playerOpenTabList = {}
local function isInList(src)
    for _, v in ipairs(playerOpenTabList) do
        if v == src then
            return true
        end
    end
    return false
end

-- Retire une source de la liste
local function removeFromList(src)
    for i, v in ipairs(playerOpenTabList) do
        if v == src then
            table.remove(playerOpenTabList, i)
            --print(("[DEBUG] Source %s retirée de la liste."):format(src))
            break
        end
    end
end

-- Ajoute une source si pas déjà dans la liste
local function addToList(src)
    if not isInList(src) then
        table.insert(playerOpenTabList, src)
        --print(("[DEBUG] Source %s ajoutée à la liste."):format(src))
    end
end

-- Renvoi la liste des source qui ont ouvert leur tablette
local function getList()
    -- Retourne une **copie** pour éviter toute mutation externe
    local copy = {}
    for i, v in ipairs(playerOpenTabList) do copy[i] = v end
    return copy
end

-- *******************************************************
-- ** Enleve de la liste des src qui ont ouvert une tablette
-- *******************************************************
RegisterServerEvent('ton_tablette:src_remove_list')
AddEventHandler('ton_tablette:src_remove_list', function()

    local src = source
    removeFromList(src)

end)

-- *******************************************************
-- ** Ajoute de la liste des src qui ont ouvert une tablette
-- *******************************************************
RegisterServerEvent('ton_tablette:src_add_list')
AddEventHandler('ton_tablette:src_add_list', function()

    local src = source
    addToList(src)

end)

-- *******************************************************
-- ** Récuprère l'identité du joueur          
-- *******************************************************
RegisterServerEvent('ton_tablette:getMyIdentity')
AddEventHandler('ton_tablette:getMyIdentity', function()

    local src = source
    local datas = getDatasPlayer(src)

    TriggerClientEvent('ton_tablette:openTablette', src, datas)

end)

-- *******************************************************
-- ** Ouvrir la tablette par le mode t
-- *******************************************************
RegisterCommand("ton_tab_ems", function(source, args, rawCommand)
    
    local src = source
    local datas = getDatasPlayer(src)

    TriggerClientEvent('ton_tablette:openTablette', src, datas)
    
end)

-- *******************************************************
-- ** Export disponible
-- *******************************************************
exports('GetSourcesOpenTab', getList)