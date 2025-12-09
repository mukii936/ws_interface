local QBCore = exports['qb-core']:GetCoreObject()
local ResetStress = false
-- local BOTToken = ''

QBCore.Commands.Add('dev', 'Enable/Disable developer Mode', {}, false, function(source, _)
    TriggerClientEvent('qb-admin:client:ToggleDevmode', source)
end, 'admin')

RegisterNetEvent('hud:server:GainStress', function(amount)
    if Config.DisableStress then return end
    local src = source
    local Player = QBCore.Functions.GetPlayer(src)
    local Job = Player.PlayerData.job.name
    local JobType = Player.PlayerData.job.type
    local newStress
    if not Player or Config.WhitelistedJobs[JobType] or Config.WhitelistedJobs[Job] then return end
    if not ResetStress then
        if not Player.PlayerData.metadata['stress'] then
            Player.PlayerData.metadata['stress'] = 0
        end
        newStress = Player.PlayerData.metadata['stress'] + amount
        if newStress <= 0 then newStress = 0 end
    else
        newStress = 0
    end
    if newStress > 100 then
        newStress = 100
    end
    Player.Functions.SetMetaData('stress', newStress)
    TriggerClientEvent('hud:client:UpdateStress', src, newStress)
    TriggerClientEvent('QBCore:Notify', src, Lang:t('notify.stress_gain'), 'error', 1500)
end)

RegisterNetEvent('hud:server:RelieveStress', function(amount)
    if Config.DisableStress then return end
    local src = source
    local Player = QBCore.Functions.GetPlayer(src)
    local newStress
    if not Player then return end
    if not ResetStress then
        if not Player.PlayerData.metadata['stress'] then
            Player.PlayerData.metadata['stress'] = 0
        end
        newStress = Player.PlayerData.metadata['stress'] - amount
        if newStress <= 0 then newStress = 0 end
    else
        newStress = 0
    end
    if newStress > 100 then
        newStress = 100
    end
    Player.Functions.SetMetaData('stress', newStress)
    TriggerClientEvent('hud:client:UpdateStress', src, newStress)
    TriggerClientEvent('QBCore:Notify', src, Lang:t('notify.stress_removed'))
end)

QBCore.Functions.CreateCallback('hud:server:getMenu', function(_, cb)
    cb(Config.Menu)
end)

-- RegisterNetEvent('QBCore:Server:OnPlayerLoaded', function()
--     local src = source
--     local dc = (QBCore.Functions.GetIdentifier(source, 'discord'):gsub("discord:", "") or 'undefined')
--     if dc == 'undefined' then return end
--     PerformHttpRequest('https://discordapp.com/api/users/'..dc, function(err, result, headers)
--         local met = json.decode(result)
--         local url = 'https://cdn.discordapp.com/avatars/'..dc..'/'..met.avatar..'.webp?size=4096'
--         TriggerClientEvent('hud:Client:GetDisPic', src, url)
--     end, "GET", "", {["Content-Type"] = "application/json", ["Authorization"] = "Bot "..BOTToken})
-- end)

-- AddEventHandler("onResourceStart", function(res)
--     if res ~= GetCurrentResourceName() then return end
--     local xPlayers = QBCore.Functions.GetPlayers()
--     for i=1, #xPlayers, 1 do
--         local xPlayer = QBCore.Functions.GetPlayer(xPlayers[i])
--         local dc = (QBCore.Functions.GetIdentifier(xPlayer.PlayerData.source, 'discord'):gsub("discord:", "") or 'undefined')
--         if dc == 'undefined' then return end
--         PerformHttpRequest('https://discordapp.com/api/users/'..dc, function(err, result, headers)
--             local met = json.decode(result)
--             local url = 'https://cdn.discordapp.com/avatars/'..dc..'/'..met.avatar..'.webp?size=4096'
--             TriggerClientEvent('hud:Client:GetDisPic', xPlayer.PlayerData.source, url)
--         end,"GET", "", {["Content-Type"] = "application/json", ["Authorization"] = "Bot "..BOTToken})
--     end
-- end)