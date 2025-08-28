-- *******************************************************
-- ** Config classique   
-- *******************************************************
Config = {}
Config.framework = "esx" -- newqb, oldqb, esx, infinity
Config.url = {
    google_info_service = "https://docs.google.com/spreadsheets/d/1d4CaG7jVHKwIBUCISx9GEfva46fAnsiLUp_dzwuwu1w/edit?usp=sharing"
}

-- Nom de job authorisé pour voir et modifier les informations d'un patient
Config.job_name = {"ambulance", "police"}

-- Nom de la command réservé au admin pour tester l'alert !
Config.command = {
    alert = 'ton_tab_ems_alert'
}


-- *******************************************************
-- ** methode de callback vous permet de personnaliser 
-- ** certaines action
-- *******************************************************
Config_callback = {}

-- Fonction callback [Server] si besoins action alert
Config_callback.alert = function(source, message, coords)
    print("Nouvelle alert : " .. message .. " / coords:" .. json.encode(coords))
end

-- Fonction callback [Server] si besoins pour prévenir la personne de la prise en charge
Config_callback.priseEnCharge = function(source, unity_name)

    local message = "Bonjour, " .. unity_name .. " vient de prendre en charge votre demande !"
    print(message);
    TriggerClientEvent('ton_tab_ems:ShowNotification', source, message) -- utilise lib.notify(...)

end