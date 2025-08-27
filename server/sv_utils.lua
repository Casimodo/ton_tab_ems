-- *******************************************************
-- ** Quelques fonction innterne pour simplifier
-- *******************************************************
-- Helpers
local function normalize(s)
    s = string.lower(s or '')
    return s:gsub('%s+', '')
end

local function playerMatchesIdentifier(src, identifier)
    if not identifier or identifier == '' then return false end
    local needle = normalize(identifier)
    for _, id in ipairs(GetPlayerIdentifiers(src)) do
        local hay = normalize(id)
        if hay == needle or hay:find(needle, 1, true) then
            return true
        end
    end
    return false
end

local function findPlayerSourceByIdentifier(identifier)
    for _, src in ipairs(GetPlayers()) do
        if playerMatchesIdentifier(src, identifier) then
            return tonumber(src)
        end
    end
    -- Essais spécifiques framework si l'identifiant fourni est un citizenid (QB) ou steam/license exact
    if Config.frameworkObject == 'qb' then
        -- QBCore: recherche par citizenid exact si passé
        for _, src in ipairs(GetPlayers()) do
            local p = QBCore.Functions.GetPlayer(tonumber(src))
            if p and (p.PlayerData.citizenid == identifier) then
                return tonumber(src)
            end
        end
    elseif Config.frameworkObject == 'esx' and ESX.GetPlayerFromIdentifier then
        -- ESX: recherche directe si identifiant complet (ex: license:xxxxxxxx)
        local xPlayer = ESX.GetPlayerFromIdentifier(identifier)
        if xPlayer then return xPlayer.source end
    end
    return nil
end

local function getJobData(src)
    if Config.frameworkObject == 'esx' then
        local xPlayer = ESX.GetPlayerFromId(src)
        if xPlayer and xPlayer.job then
            return {
                framework = 'esx',
                name = xPlayer.job.name,
                label = xPlayer.job.label,
                grade = xPlayer.job.grade,
                grade_label = xPlayer.job.grade_label
            }
        end
    elseif Config.frameworkObject == 'qb' then
        local p = QBCore.Functions.GetPlayer(src)
        if p and p.PlayerData and p.PlayerData.job then
            local j = p.PlayerData.job
            return {
                framework = 'qbcore',
                name = j.name,
                label = j.label,
                grade = (j.grade and (j.grade.level or j.grade)) or 0
            }
        end
    end
    return nil
end

local function getCoords(src)
    local ped = GetPlayerPed(src)
    if not ped or ped <= 0 then return nil end
    local coords = GetEntityCoords(ped)
    return { x = coords.x + 0.0, y = coords.y + 0.0, z = coords.z + 0.0 }
end

-- Export principal : GetPlayerCoordsAndJobByIdentifier
-- Usage (depuis une autre ressource) :
--   local ok, data = exports['ton_tab_ems']:GetPlayerCoordsAndJobByIdentifier('license:xxxxxxxx')
--   if ok then print(json.encode(data)) end
exports('GetPlayerCoordsAndJobByIdentifier', function(identifier)
    local src = findPlayerSourceByIdentifier(identifier)
    if not src then
        return false, { error = 'Player not found for identifier', identifier = identifier }
    end
    local coords = getCoords(src)
    if not coords then
        return false, { error = 'Could not get coords', source = src }
    end
    local job = getJobData(src) -- peut être nil en standalone
    return true, {
        source = src,
        identifiers = GetPlayerIdentifiers(src),
        coords = coords,       -- vector3-like table {x,y,z}
        job = job              -- nil si standalone ou si job indispo
    }
end)

exports('isJobAllowed', function(jobName)
    for _, v in ipairs(Config.job_name) do
        if v == jobName then
            return true
        end
    end
    return false
end)