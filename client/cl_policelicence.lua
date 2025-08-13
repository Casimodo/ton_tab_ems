-- ====== récupère les joueurs proche =================
function GetNearbyPlayers()
	local players = {}
	local ped = PlayerPedId()
	local playerCoords = GetEntityCoords(ped)

	for _, playerId in ipairs(GetActivePlayers()) do
		local targetPed = GetPlayerPed(playerId)
		local targetCoords = GetEntityCoords(targetPed)
		local distance = #(playerCoords - targetCoords)

		-- On considère qu'un joueur est à proximité si la distance est inférieure à 10 unités
		if distance < 10 and playerId ~= PlayerId() then
			table.insert(players, {value = GetPlayerServerId(playerId), label = GetPlayerName(playerId)})
		end
	end

	return players
end

-- *******************************************************
-- **                                                   **
-- *******************************************************
RegisterNUICallback('police_licence', function(data, cb)

    local playerProche = GetNearbyPlayers();

    ESX.TriggerServerCallback('ton_tablette:police_licence', function(res)
        cb(res)
    end, playerProche)

end)

-- *******************************************************
-- **                                                   **
-- *******************************************************
RegisterNUICallback('police_licence_remove', function(idRemove, cb)

    ESX.TriggerServerCallback('ton_tablette:police_licence_remove', function(res)
        cb(res)
    end, idRemove)

end)