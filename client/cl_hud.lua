local QBCore = exports['qb-core']:GetCoreObject()
local PlayerData = QBCore.Functions.GetPlayerData()
local speedMultiplier = Config.UseMPH and 2.23694 or 3.6
local seatbeltOn = false
local cruiseOn = false
local showAltitude = false
local showSeatbelt = false
local nos = 0
local stress = 0
local hunger = 100
local thirst = 100
local cashAmount = 0
local bankAmount = 0
local nitroActive = 0
local harness = 0
local hp = 100
local armed = 0
local parachute = -1
local oxygen = 100
local dev = false
local playerDead = false
local showMenu = false
local showCircleB = false
local showSquareB = false
local Menu = Config.Menu
local CinematicHeight = 0.2
local w = 0
local radioActive = false
-- local avtlink = ''

DisplayRadar(false)

local function CinematicShow(bool)
    SetRadarBigmapEnabled(true, false)
    Wait(0)
    SetRadarBigmapEnabled(false, false)
    if bool then
        for i = CinematicHeight, 0, -1.0 do
            Wait(10)
            w = i
        end
    else
        for i = 0, CinematicHeight, 1.0 do
            Wait(10)
            w = i
        end
    end
end

RegisterNetEvent('hud:Client:GetDisPic', function(avatar)
    local xPlayer = QBCore.Functions.GetPlayerData()
    SendNUIMessage({
        event = 'UpdateAvatar',
        data = {
            avatar = avatar,
        }
    })
end)


local function loadSettings(settings)
    for k, v in pairs(settings) do
        if k == 'isToggleMapShapeChecked' then
            Menu.isToggleMapShapeChecked = v
            SendNUIMessage({ test = true, event = k, toggle = v })
        elseif k == 'isCinematicModeChecked' then
            Menu.isCinematicModeChecked = v
            CinematicShow(v)
            SendNUIMessage({ test = true, event = k, toggle = v })
        elseif k == 'isChangeFPSChecked' then
            Menu[k] = v
            local val = v and 'Optimized' or 'Synced'
            SendNUIMessage({ test = true, event = k, toggle = val })
        else
            Menu[k] = v
            SendNUIMessage({ test = true, event = k, toggle = v })
        end
    end
    QBCore.Functions.Notify(Lang:t('notify.hud_settings_loaded'), 'success')
    Wait(1000)
    TriggerEvent('hud:client:LoadMap')
end

local function saveSettings()
    SetResourceKvp('hudSettings', json.encode(Menu))
end

RegisterNetEvent('QBCore:Client:OnPlayerLoaded', function()
    Wait(2000)
    local hudSettings = GetResourceKvpString('hudSettings')
    if hudSettings then loadSettings(json.decode(hudSettings)) end
    PlayerData = QBCore.Functions.GetPlayerData()
    -- Wait(3000)
    -- SetEntityHealth(PlayerPedId(), 200)
    -- TriggerServerEvent('hud:server:GainStress', 0)
    -- SendNUIMessage({
    --     event = 'UpdateMoney',
    --     data = {
    --         cash = math.floor(PlayerData.money['cash']),
    --         bank = math.floor(PlayerData.money['bank']),
    --     }
    -- })
end)

RegisterNetEvent('QBCore:Client:OnPlayerUnload', function()
    PlayerData = {}
end)

RegisterNetEvent('QBCore:Player:SetPlayerData', function(val)
    PlayerData = val
end)

AddEventHandler('onResourceStart', function(resourceName)
    if GetCurrentResourceName() ~= resourceName then return end
    Wait(2000)
    local hudSettings = GetResourceKvpString('hudSettings')
    if hudSettings then loadSettings(json.decode(hudSettings)) end
    -- TriggerServerEvent('hud:server:GainStress', 0)
    -- SendNUIMessage({
    --     event = 'UpdateMoney',
    --     data = {
    --         cash = math.floor(PlayerData.money['cash']),
    --         bank = math.floor(PlayerData.money['bank']),
    --     }
    -- })
end)

AddEventHandler('w-voice:radioActive', function(data)
    radioActive = data
end)

-- Callbacks & Events

RegisterCommand('menu', function()
    Wait(50)
    if showMenu then return end
    TriggerEvent('hud:client:playOpenMenuSounds')
    SetNuiFocus(true, true)
    -- SendNUIMessage({ action = 'open' })
    SendNUIMessage({
        event = 'MenuData',
        data = {
            show = true,
        }
    })
    showMenu = true
end)

RegisterNUICallback('closeMenu', function(_, cb)
    Wait(50)
    TriggerEvent('hud:client:playCloseMenuSounds')
    showMenu = false
    SetNuiFocus(false, false)
    cb('ok')
    SendNUIMessage({
        event = 'MenuData',
        data = {
            show = false,
        }
    })
end)

RegisterKeyMapping('menu', 'Open Menu', 'keyboard', Config.OpenMenu)

-- Reset hud
local function restartHud()
    TriggerEvent('hud:client:LoadMap')
    TriggerEvent('hud:client:playResetHudSounds')
    QBCore.Functions.Notify(Lang:t('notify.hud_restart'), 'error')
    if IsPedInAnyVehicle(PlayerPedId()) then
        Wait(2600)
        SendNUIMessage({
            event = 'carData',
            data = {
                show = false,
            }
        })
        SendNUIMessage({
            event = 'carData',
            data = {
                show = true,
            }
        })
    end
    Wait(2600)
    SendNUIMessage({
        event = 'statusData',
        data = {
            show = false,
        }
    })
    SendNUIMessage({
        event = 'statusData',
        data = {
            show = true,
        }
    })
    -- SendNUIMessage({
    --     event = 'UpdateMoney',
    --     data = {
    --         cash = math.floor(PlayerData.money['cash']),
    --         bank = math.floor(PlayerData.money['bank']),
    --     }
    -- })
    Wait(2600)
    QBCore.Functions.Notify(Lang:t('notify.hud_start'), 'success')
end

RegisterNUICallback('restartHud', function(_, cb)
    Wait(50)
    restartHud()
    cb('ok')
end)

RegisterCommand('resethud', function()
    Wait(50)
    restartHud()
end)

RegisterNUICallback('setupHud', function(_, cb)
    Wait(50)
    SetNuiFocus(true, true)
    SendNUIMessage({
        event = 'editMode',
        data = {
            editMode = true,
        }
    })
    showMenu = false
    SendNUIMessage({
        event = 'MenuData',
        data = {
            show = false,
        }
    })
end)

RegisterNUICallback('exitSetup', function(_, cb)
    Wait(50)
    SetNuiFocus(false, false)
    TriggerServerEvent('InteractSound_SV:PlayOnSource', 'airwrench', 0.1)
    cb('ok')
end)

RegisterNetEvent('hud:client:resetStorage', function()
    Wait(50)
    if Menu.isResetSoundsChecked then
        TriggerServerEvent('InteractSound_SV:PlayOnSource', 'airwrench', 0.1)
    end
    QBCore.Functions.TriggerCallback('hud:server:getMenu', function(menu)
        loadSettings(menu); SetResourceKvp('hudSettings', json.encode(menu))
    end)
end)

-- Notifications

RegisterNetEvent('hud:client:playOpenMenuSounds', function()
    Wait(50)
    if not Menu.isOpenMenuSoundsChecked then return end
    TriggerServerEvent('InteractSound_SV:PlayOnSource', 'monkeyopening', 0.5)
end)

RegisterNetEvent('hud:client:playCloseMenuSounds', function()
    Wait(50)
    if not Menu.isOpenMenuSoundsChecked then return end
    TriggerServerEvent('InteractSound_SV:PlayOnSource', 'catclosing', 0.05)
end)

RegisterNetEvent('hud:client:playResetHudSounds', function()
    Wait(50)
    if not Menu.isResetSoundsChecked then return end
    TriggerServerEvent('InteractSound_SV:PlayOnSource', 'airwrench', 0.1)
end)


RegisterNetEvent('hud:client:checklistSounds', function()
    Wait(50)
    Menu.isListSoundsChecked = not Menu.isListSoundsChecked
    TriggerEvent('hud:client:playHudChecklistSound')
    saveSettings()
end)

RegisterNetEvent('hud:client:playHudChecklistSound', function()
    Wait(50)
    if not Menu.isListSoundsChecked then return end
    TriggerServerEvent('InteractSound_SV:PlayOnSource', 'shiftyclick', 0.5)
end)

RegisterNUICallback('showOutMap', function(_, cb)
    Wait(50)
    Menu.isOutMapChecked = not Menu.isOutMapChecked
    TriggerEvent('hud:client:playHudChecklistSound')
    saveSettings()
    cb('ok')
end)

RegisterNetEvent('hud:client:ToggleHealth', function()
    Wait(50)
    Menu.isDynamicHealthChecked = not Menu.isDynamicHealthChecked
    TriggerEvent('hud:client:playHudChecklistSound')
    saveSettings()
end)


RegisterNUICallback('HideMap', function(_, cb)
    Wait(50)
    Menu.isHideMapChecked = not Menu.isHideMapChecked
    DisplayRadar(not Menu.isHideMapChecked)
    TriggerEvent('hud:client:playHudChecklistSound')
    saveSettings()
    cb('ok')
end)

RegisterNetEvent('hud:client:LoadMap', function()
    Wait(50)
    -- Credit to Dalrae for the solve.
    local defaultAspectRatio = 1920 / 1080 -- Don't change this.
    local resolutionX, resolutionY = GetActiveScreenResolution()
    local aspectRatio = resolutionX / resolutionY
    local minimapOffset = -0.02
    if aspectRatio > defaultAspectRatio then
        minimapOffset = ((defaultAspectRatio - aspectRatio) / 3.6) - 0.008
    end
    if Menu.isToggleMapShapeChecked == 'square' then
        RequestStreamedTextureDict('squaremap', false)
        if not HasStreamedTextureDictLoaded('squaremap') then
            Wait(150)
        end
        if Menu.isMapNotifChecked then
            QBCore.Functions.Notify(Lang:t('notify.load_square_map'))
        end
        SetMinimapClipType(0)
        AddReplaceTexture('platform:/textures/graphics', 'radarmasksm', 'squaremap', 'radarmasksm')
        AddReplaceTexture('platform:/textures/graphics', 'radarmask1g', 'squaremap', 'radarmasksm')
        -- 0.0 = nav symbol and icons left
        -- 0.1638 = nav symbol and icons stretched
        -- 0.216 = nav symbol and icons raised up
        SetMinimapComponentPosition("minimap", "L", "B", 0.002 + minimapOffset, -0.097 + 0.07, 0.1638, 0.183)

        -- icons within map
        SetMinimapComponentPosition("minimap_mask", "L", "B", 0.002 + minimapOffset, -0.02 + 0.07, 0.128, 0.20)

        -- -0.01 = map pulled left
        -- 0.025 = map raised up
        -- 0.262 = map stretched
        -- 0.315 = map shorten
        SetMinimapComponentPosition('minimap_blur', 'L', 'B', 0.002 + minimapOffset, -0.045 + 0.07, 0.262, 0.300)
        SetBlipAlpha(GetNorthRadarBlip(), 0)
        SetRadarBigmapEnabled(true, false)
        SetMinimapClipType(0)
        Wait(50)
        SetRadarBigmapEnabled(false, false)
        if Menu.isToggleMapBordersChecked then
            showCircleB = false
            showSquareB = true
        end
        Wait(1200)
        if Menu.isMapNotifChecked then
            QBCore.Functions.Notify(Lang:t('notify.loaded_square_map'))
        end
    elseif Menu.isToggleMapShapeChecked == 'circle' then
        RequestStreamedTextureDict('circlemap', false)
        if not HasStreamedTextureDictLoaded('circlemap') then
            Wait(150)
        end
        if Menu.isMapNotifChecked then
            QBCore.Functions.Notify(Lang:t('notify.load_circle_map'))
        end
        SetMinimapClipType(1)
        AddReplaceTexture('platform:/textures/graphics', 'radarmasksm', 'circlemap', 'radarmasksm')
        AddReplaceTexture('platform:/textures/graphics', 'radarmask1g', 'circlemap', 'radarmasksm')
        -- -0.0100 = nav symbol and icons left
        -- 0.180 = nav symbol and icons stretched
        -- 0.258 = nav symbol and icons raised up
        SetMinimapComponentPosition("minimap", "L", "B", 0.002 + minimapOffset, -0.097, 0.1638, 0.183)

        -- icons within map
        SetMinimapComponentPosition("minimap_mask", "L", "B", 0.002 + minimapOffset, -0.02, 0.128, 0.20)

        -- -0.01 = map pulled left
        -- 0.025 = map raised up
        -- 0.262 = map stretched
        -- 0.315 = map shorten
        SetMinimapComponentPosition('minimap_blur', 'L', 'B', 0.002 + minimapOffset, -0.045, 0.262, 0.300)
        SetBlipAlpha(GetNorthRadarBlip(), 0)
        SetMinimapClipType(1)
        SetRadarBigmapEnabled(true, false)
        Wait(50)
        SetRadarBigmapEnabled(false, false)
        if Menu.isToggleMapBordersChecked then
            showSquareB = false
            showCircleB = true
        end
        Wait(1200)
        if Menu.isMapNotifChecked then
            QBCore.Functions.Notify(Lang:t('notify.loaded_circle_map'))
        end
    end
end)

RegisterNUICallback('ToggleMapShape', function(_, cb)
    Wait(50)
    if not Menu.isHideMapChecked then
        Menu.isToggleMapShapeChecked = Menu.isToggleMapShapeChecked == 'circle' and 'square' or 'circle'
        Wait(50)
        TriggerEvent('hud:client:LoadMap')
    end
    TriggerEvent('hud:client:playHudChecklistSound')
    saveSettings()
    cb('ok')
end)

RegisterNUICallback('cinematicMode', function(_, cb)
    Wait(50)
    if Menu.isCinematicModeChecked then
        CinematicShow(false)
        Menu.isCinematicModeChecked = false
        if Menu.isCinematicNotifChecked then
            QBCore.Functions.Notify(Lang:t('notify.cinematic_off'), 'error')
        end
        DisplayRadar(1)
    else
        CinematicShow(true)
        Menu.isCinematicModeChecked = true
        if Menu.isCinematicNotifChecked then
            QBCore.Functions.Notify(Lang:t('notify.cinematic_on'))
        end
    end
    TriggerEvent('hud:client:playHudChecklistSound')
    saveSettings()
    cb('ok')
end)

RegisterNetEvent('hud:client:ToggleAirHud', function()
    showAltitude = not showAltitude
end)

RegisterNetEvent('hud:client:UpdateNeeds', function(newHunger, newThirst) -- Triggered in qb-core
    hunger = newHunger
    thirst = newThirst
    if hunger >= 100 then hunger = 100 end
    if thirst >= 100 then thirst = 100 end
end)

RegisterNetEvent('hud:client:UpdateStress', function(newStress) -- Add this event with adding stress elsewhere
    stress = newStress
    if stress >= 100 then stress = 100 end
end)

RegisterNetEvent('hud:client:ToggleShowSeatbelt', function()
    showSeatbelt = not showSeatbelt
end)

RegisterNetEvent('seatbelt:client:ToggleSeatbelt', function() -- Triggered in smallresources
    seatbeltOn = not seatbeltOn
end)

RegisterNetEvent('seatbelt:client:ToggleCruise', function() -- Triggered in smallresources
    cruiseOn = not cruiseOn
end)

RegisterNetEvent('hud:client:UpdateNitrous', function(nitroLevel, bool)
    nos = nitroLevel
    nitroActive = bool
end)

RegisterNetEvent('hud:client:UpdateHarness', function(harnessHp)
    hp = harnessHp
end)

RegisterNetEvent('qb-admin:client:ToggleDevmode', function()
    dev = not dev
end)

local prevPlayerStats = { nil, nil, nil, nil, nil, nil, nil, nil, nil, nil, nil, nil, nil, nil, nil, nil, nil, nil, nil, nil, nil, nil, nil, nil, nil, nil, nil, nil, nil, nil }

local function updatePlayerHud(data)
    local shouldUpdate = false
    for k, v in pairs(data) do
        if prevPlayerStats[k] ~= v then
            shouldUpdate = true
            break
        end
    end
    local voice = 0
    if LocalPlayer.state['proximity'] then
        voice = LocalPlayer.state['proximity'].distance
    end
    prevPlayerStats = data
    if shouldUpdate then
        SendNUIMessage({
            event = 'statusData',
            data = {
                show = data[1],
                dynamicHealth = data[2],
                dynamicArmor = data[3],
                dynamicHunger = data[4],
                dynamicThirst = data[5],
                dynamicStress = data[6],
                dynamicOxygen = data[7],
                dynamicEngine = data[8],
                dynamicNitro = data[9],
                health = data[10],
                playerDead = data[11],
                armor = data[12],
                thirst = data[13],
                hunger = data[14],
                stress = data[15],
                voice2 = data[16],
                radio = data[17],
                talking = data[18],
                armed = data[19],
                oxygen = data[20],
                parachute = data[21],
                nos = data[22],
                cruise = data[23],
                nitroActive = data[24],
                harness = data[25],
                hp = data[26],
                speed = data[27],
                engine = data[28],
                cinematic = data[29],
                dev = data[30],
                radioActive = data[31],
                playerid = GetPlayerServerId(PlayerId()),
                voicelv = voice
            }
        })
    end
end

local prevVehicleStats = { nil, nil, nil, nil, nil, nil, nil, nil, nil, nil }

local function getLight(n, n2)
	if n == 0 then
		return n2
	else
		return n
	end
end

local function updateVehicleHud(data)
    local hasBelt = false
    local shouldUpdate = false
    local player = PlayerPedId()
    local vehicle = GetVehiclePedIsIn(player, false)
    local vhealth = GetVehicleEngineHealth(vehicle)
    local RPM = GetVehicleCurrentRpm(vehicle)
    local gear = GetVehicleCurrentGear(vehicle)
    local l1, l2, l3 = GetVehicleLightsState(vehicle)
    if not GetIsVehicleEngineRunning(vehicle) then RPM = 0 end
    if RPM > 0.2 then
        RPM = RPM * 100
        RPM = RPM + math.random(-2, 2)
        RPM = RPM / 100
    end
    RPM = RPM*7000

    for k, v in pairs(data) do
        if prevVehicleStats[k] ~= v then
            shouldUpdate = true
            break
        end
    end
    prevVehicleStats = data
    local curVeh = nil
    if vehicle ~= 0 then
        local model = GetEntityModel(vehicle)
        if IsThisModelABicycle(model) then
            curVeh = 'bike'
        elseif IsThisModelABike(model) then
            curVeh = 'motorcycles'
        elseif IsThisModelACar(model) then
            curVeh = 'car'
        elseif IsThisModelABoat(model) then
            curVeh = 'boat'
        elseif IsThisModelAHeli(model) then
            curVeh = 'helicopters'
        else 
            curVeh = 'car'
        end
    end
    if shouldUpdate then
        SendNUIMessage({
            event = 'carData',
            data = {
                show = data[1],
                isPaused = data[2],
                seatbelt = data[3],
                speed = data[4],
                fuel = data[5],
                altitude = data[6],
                showAltitude = data[7],
                showSeatbelt = data[8],
                showSquareB = data[9],
                showCircleB = data[10],
                gear = gear,
                engine = vhealth/10,
                rpm = round(RPM / 1000),
                rpmPercent = round(RPM / 75),
                light = getLight(l2, l3),
                TyreBurst1 = IsVehicleTyreBurst(vehicle, 0),
                TyreBurst2 = IsVehicleTyreBurst(vehicle, 1),
                TyreBurst3 = IsVehicleTyreBurst(vehicle, 4),
                TyreBurst4 = IsVehicleTyreBurst(vehicle, 5),
                TyreHealth1 = GetTyreHealth(vehicle, 0),
                TyreHealth2 = GetTyreHealth(vehicle, 1),
                TyreHealth3 = GetTyreHealth(vehicle, 4),
                TyreHealth4 = GetTyreHealth(vehicle, 5),
                vehicleType = curVeh,
                turnLeft = IsControlPressed(0,34),
                turnRight = IsControlPressed(0,35),
                brake = GetVehicleHandbrake(vehicle) or IsControlPressed(0, 72),
                engineRunning = GetIsVehicleEngineRunning(vehicle)
            }
        })
    end
end

local lastFuelUpdate = 0
local lastFuelCheck = {}

local function getFuelLevel(vehicle)
    local updateTick = GetGameTimer()
    if (updateTick - lastFuelUpdate) > 2000 then
        lastFuelUpdate = updateTick
        lastFuelCheck = math.floor(exports['w_fuel']:GetFuel(vehicle))
    end
    return lastFuelCheck
end

-- HUD Update loop

CreateThread(function()
    local wasInVehicle = false
    while true do
        if Menu.isChangeFPSChecked then
            Wait(500)
        else
            Wait(50)
        end
        if LocalPlayer.state.isLoggedIn then
            local show = true
            local player = PlayerPedId()
            local playerId = PlayerId()
            local weapon = GetSelectedPedWeapon(player)
            -- Player hud
            if not Config.WhitelistedWeaponArmed[weapon] then
                if weapon ~= `WEAPON_UNARMED` then
                    armed = true
                else
                    armed = false
                end
            end
            playerDead = IsEntityDead(player) or PlayerData.metadata['inlaststand'] or PlayerData.metadata['isdead'] or false
            parachute = GetPedParachuteState(player)
            -- Stamina
            if not IsEntityInWater(player) then
                oxygen = 100 - GetPlayerSprintStaminaRemaining(playerId)
            end
            -- Oxygen
            if IsEntityInWater(player) then
                oxygen = GetPlayerUnderwaterTimeRemaining(playerId) * 10
            end
            -- Player hud
            local talking = NetworkIsPlayerTalking(playerId)
            local voice = 0
            if LocalPlayer.state['proximity'] then
                voice = LocalPlayer.state['proximity'].distance
            end
            if IsPauseMenuActive() then
                show = false
            end
            local vehicle = GetVehiclePedIsIn(player)
            if not (IsPedInAnyVehicle(player) and not IsThisModelABicycle(vehicle)) then
                updatePlayerHud({
                    show,
                    Menu.isDynamicHealthChecked,
                    Menu.isDynamicArmorChecked,
                    Menu.isDynamicHungerChecked,
                    Menu.isDynamicThirstChecked,
                    Menu.isDynamicStressChecked,
                    Menu.isDynamicOxygenChecked,
                    Menu.isDynamicEngineChecked,
                    Menu.isDynamicNitroChecked,
                    GetEntityHealth(player) - 100,
                    playerDead,
                    GetPedArmour(player),
                    thirst,
                    hunger,
                    stress,
                    voice,
                    LocalPlayer.state['radioChannel'],
                    talking,
                    armed,
                    oxygen,
                    parachute,
                    -1,
                    cruiseOn,
                    nitroActive,
                    harness,
                    hp,
                    math.ceil(GetEntitySpeed(vehicle) * speedMultiplier),
                    -1,
                    Menu.isCinematicModeChecked,
                    dev,
                    radioActive,
                })
            end
            -- Vehicle hud
            if IsPedInAnyHeli(player) or IsPedInAnyPlane(player) then
                showAltitude = true
                showSeatbelt = false
            end
            if IsPedInAnyVehicle(player) and not IsThisModelABicycle(vehicle) then
                if not wasInVehicle then
                    DisplayRadar(true)
                end
                wasInVehicle = true
                updatePlayerHud({
                    show,
                    Menu.isDynamicHealthChecked,
                    Menu.isDynamicArmorChecked,
                    Menu.isDynamicHungerChecked,
                    Menu.isDynamicThirstChecked,
                    Menu.isDynamicStressChecked,
                    Menu.isDynamicOxygenChecked,
                    Menu.isDynamicEngineChecked,
                    Menu.isDynamicNitroChecked,
                    GetEntityHealth(player) - 100,
                    playerDead,
                    GetPedArmour(player),
                    thirst,
                    hunger,
                    stress,
                    voice,
                    LocalPlayer.state['radioChannel'],
                    talking,
                    armed,
                    oxygen,
                    GetPedParachuteState(player),
                    nos,
                    cruiseOn,
                    nitroActive,
                    harness,
                    hp,
                    math.ceil(GetEntitySpeed(vehicle) * speedMultiplier),
                    (GetVehicleEngineHealth(vehicle) / 10),
                    Menu.isCinematicModeChecked,
                    dev,
                    radioActive,
                })
                updateVehicleHud({
                    show,
                    IsPauseMenuActive(),
                    seatbeltOn,
                    math.ceil(GetEntitySpeed(vehicle) * speedMultiplier),
                    getFuelLevel(vehicle),
                    math.ceil(GetEntityCoords(player).z * 0.5),
                    showAltitude,
                    showSeatbelt,
                    showSquareB,
                    showCircleB,

                })
                showAltitude = false
                showSeatbelt = true
            else
                if wasInVehicle then
                    wasInVehicle = false
                    SendNUIMessage({
                        event = 'carData',
                        data = {
                            show = false,
                            seatbelt = false,
                            cruise = false,
                        }
                    })
                    seatbeltOn = false
                    cruiseOn = false
                    harness = false
                end
                DisplayRadar(Menu.isOutMapChecked)
            end
        else
            SendNUIMessage({
                event = 'statusData',
                data = {
                    show = false
                }
            })
        end
    end
end)

-- Low fuel
CreateThread(function()
    while true do
        if LocalPlayer.state.isLoggedIn then
            local ped = PlayerPedId()
            if IsPedInAnyVehicle(ped, false) and not IsThisModelABicycle(GetEntityModel(GetVehiclePedIsIn(ped, false))) then
                if exports['w_fuel']:GetFuel(GetVehiclePedIsIn(ped, false)) <= 20 then -- At 20% Fuel Left
                    if Menu.isLowFuelChecked then
                        TriggerServerEvent('InteractSound_SV:PlayOnSource', 'pager', 0.10)
                        QBCore.Functions.Notify(Lang:t('notify.low_fuel'), 'error')
                        Wait(60000) -- repeats every 1 min until empty
                    end
                end
            end
        end
        Wait(10000)
    end
end)

-- Money HUD

RegisterNetEvent('hud:client:OnMoneyChange', function(type, amount, isMinus)
    cashAmount = PlayerData.money['cash']
    bankAmount = PlayerData.money['bank']
    SendNUIMessage({
        event = 'UpdateMoney',
        data = {
            cash = cashAmount,
            bank = bankAmount,
            amount = amount,
            minus = isMinus,
            type = type
        }
    })
end)

CreateThread(function()
    while true do
        Wait(1500)
        if LocalPlayer.state.isLoggedIn then
            local ped = PlayerPedId()
            if IsPedInAnyVehicle(ped, false) then
                -- hasHarness()
                local veh = GetEntityModel(GetVehiclePedIsIn(ped, false))
                if seatbeltOn ~= true and IsThisModelACar(veh) then
                    TriggerEvent("InteractSound_CL:PlayOnOne", "beltalarm", 0.6)
                end
            end
        end
    end
end)

-- Stress Gain

if not Config.DisableStress then
    CreateThread(function() -- Speeding
        while true do
            if LocalPlayer.state.isLoggedIn then
                local ped = PlayerPedId()
                if IsPedInAnyVehicle(ped, false) then
                    local veh = GetVehiclePedIsIn(ped, false)
                    local vehClass = GetVehicleClass(veh)
                    local speed = GetEntitySpeed(veh) * speedMultiplier
                    local vehHash = GetEntityModel(veh)
                    if Config.VehClassStress[tostring(vehClass)] and not Config.WhitelistedVehicles[vehHash] then
                        local stressSpeed
                        if vehClass == 8 then -- Motorcycle exception for seatbelt
                            stressSpeed = Config.MinimumSpeed
                        else
                            stressSpeed = seatbeltOn and Config.MinimumSpeed or Config.MinimumSpeedUnbuckled
                        end
                        if speed >= stressSpeed then
                            TriggerServerEvent('hud:server:GainStress', math.random(1, 3))
                        end
                    end
                end
            end
            Wait(10000)
        end
    end)

    CreateThread(function() -- Shooting
        while true do
            if LocalPlayer.state.isLoggedIn then
                local ped = PlayerPedId()
                local weapon = GetSelectedPedWeapon(ped)
                if weapon ~= `WEAPON_UNARMED` then
                    if IsPedShooting(ped) and not Config.WhitelistedWeaponStress[weapon] then
                        if math.random() < Config.StressChance then
                            TriggerServerEvent('hud:server:GainStress', math.random(1, 3))
                        end
                    end
                else
                    Wait(1000)
                end
            end
            Wait(0)
        end
    end)
end

-- Stress Screen Effects

local function GetBlurIntensity(stresslevel)
    for _, v in pairs(Config.Intensity['blur']) do
        if stresslevel >= v.min and stresslevel <= v.max then
            return v.intensity
        end
    end
    return 1500
end

local function GetEffectInterval(stresslevel)
    for _, v in pairs(Config.EffectInterval) do
        if stresslevel >= v.min and stresslevel <= v.max then
            return v.timeout
        end
    end
    return 60000
end

CreateThread(function()
    while true do
        local ped = PlayerPedId()
        local effectInterval = GetEffectInterval(stress)
        if stress >= 100 then
            local BlurIntensity = GetBlurIntensity(stress)
            local FallRepeat = math.random(2, 4)
            local RagdollTimeout = FallRepeat * 1750
            TriggerScreenblurFadeIn(1000.0)
            Wait(BlurIntensity)
            TriggerScreenblurFadeOut(1000.0)

            if not IsPedRagdoll(ped) and IsPedOnFoot(ped) and not IsPedSwimming(ped) then
                SetPedToRagdollWithFall(ped, RagdollTimeout, RagdollTimeout, 1, GetEntityForwardVector(ped), 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0)
            end

            Wait(1000)
            for _ = 1, FallRepeat, 1 do
                Wait(750)
                DoScreenFadeOut(200)
                Wait(1000)
                DoScreenFadeIn(200)
                TriggerScreenblurFadeIn(1000.0)
                Wait(BlurIntensity)
                TriggerScreenblurFadeOut(1000.0)
            end
        elseif stress >= Config.MinimumStress then
            local BlurIntensity = GetBlurIntensity(stress)
            TriggerScreenblurFadeIn(1000.0)
            Wait(BlurIntensity)
            TriggerScreenblurFadeOut(1000.0)
        end
        Wait(effectInterval)
    end
end)

-- Minimap update
CreateThread(function()
    while true do
        SetRadarBigmapEnabled(false, false)
        SetRadarZoom(1000)
        Wait(500)
    end
end)

local function BlackBars()
    DrawRect(0.0, 0.0, 2.0, w, 0, 0, 0, 255)
    DrawRect(0.0, 1.0, 2.0, w, 0, 0, 0, 255)
end

CreateThread(function()
    local minimap = RequestScaleformMovie('minimap')
    if not HasScaleformMovieLoaded(minimap) then
        RequestScaleformMovie(minimap)
        while not HasScaleformMovieLoaded(minimap) do
            Wait(1)
        end
    end
    while true do
        if w > 0 then
            BlackBars()
            DisplayRadar(0)
            SendNUIMessage({
                event = 'statusData',
                data = {
                    show = false,
                }
            })
            SendNUIMessage({
                event = 'carData',
                data = {
                    show = false,
                }
            })
        end
        Wait(0)
    end
end)

-- Compass
function round(num, numDecimalPlaces)
    local mult = 10 ^ (numDecimalPlaces or 0)
    return math.floor(num + 0.5 * mult)
end

local prevBaseplateStats = { nil, nil, nil, nil, nil, nil, nil }

local function updateBaseplateHud(data)
    local shouldUpdate = false
    for k, v in pairs(data) do
        if prevBaseplateStats[k] ~= v then
            shouldUpdate = true
            break
        end
    end
    prevBaseplateStats = data
    if shouldUpdate then
        SendNUIMessage({
            action = 'baseplate',
            show = data[1],
            street1 = data[2],
            street2 = data[3],
            showCompass = data[4],
            showStreets = data[5],
            showPointer = data[6],
            showDegrees = data[7],
        })
    end
end

local lastCrossroadUpdate = 0
local lastCrossroadCheck = {}

local function getCrossroads(player)
    local updateTick = GetGameTimer()
    if updateTick - lastCrossroadUpdate > 1500 then
        local pos = GetEntityCoords(player)
        local street1, street2 = GetStreetNameAtCoord(pos.x, pos.y, pos.z)
        lastCrossroadUpdate = updateTick
        lastCrossroadCheck = { GetStreetNameFromHashKey(street1), GetStreetNameFromHashKey(street2) }
    end
    return lastCrossroadCheck
end

-- Compass Update loop

CreateThread(function()
    local lastHeading = 1
    local heading
    while true do
        if Menu.isChangeCompassFPSChecked then
            Wait(50)
        else
            Wait(0)
        end
        local show = true
        local player = PlayerPedId()
        local camRot = GetGameplayCamRot(0)
        if Menu.isCompassFollowChecked then
            heading = tostring(round(360.0 - ((camRot.z + 360.0) % 360.0)))
        else
            heading = tostring(round(360.0 - GetEntityHeading(player)))
        end
        if heading == '360' then heading = '0' end
        if heading ~= lastHeading then
            if IsPedInAnyVehicle(player) then
                local crossroads = getCrossroads(player)
                SendNUIMessage({
                    action = 'update',
                    value = heading
                })
                updateBaseplateHud({
                    show,
                    crossroads[1],
                    crossroads[2],
                    Menu.isCompassShowChecked,
                    Menu.isShowStreetsChecked,
                    Menu.isPointerShowChecked,
                    Menu.isDegreesShowChecked,
                })
            else
                if Menu.isOutCompassChecked then
                    SendNUIMessage({
                        action = 'update',
                        value = heading
                    })
                    SendNUIMessage({
                        action = 'baseplate',
                        show = true,
                        showCompass = true,
                    })
                else
                    SendNUIMessage({
                        action = 'baseplate',
                        show = false,
                    })
                end
            end
        end
        lastHeading = heading
    end
end)
