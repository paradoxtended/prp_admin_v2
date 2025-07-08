------------------------------------------------------------------------------------------------------------------------------------------
--- BLIPS
------------------------------------------------------------------------------------------------------------------------------------------

---@type boolean
playerBlips = false

---Function returns blip sprite according to player current vehicle
---@param class number
---@return number BlipSprite
local function GetBlipSpriteForVehicle(class)
    if class == 8 or class == 13 then
        return 226
    elseif class == 9 then
        return 757
    elseif class == 10 or class == 11 then
        return 477
    elseif class == 12 then
        return 67
    elseif class == 14 then
        return 427
    elseif class == 15 then
        return 422
    elseif class == 16 then
        return 423
    elseif class == 17 then
        return 198
    elseif class == 18 then
        return 56
    elseif class == 19 then
        return 421
    elseif class == 20 then
        return 477
    else
        return 225
    end
end

---@param cb? fun(data: any)
local function toggleBlips(_, cb)
    if cb then cb(1) end

    local isAdmin = lib.callback.await('prp_admin_v2:isAdmin', false)
    if not isAdmin then return end

    playerBlips = not playerBlips

    prp.notify({
        description = locale('blips_' .. (playerBlips and 'activated' or 'disabled')),
        type = 'inform'
    })

    CreateThread(function()
        while playerBlips do
            for _, playerId in ipairs(GetActivePlayers()) do
                local ped = GetPlayerPed(playerId)
                local blip = GetBlipFromEntity(ped)

                if not DoesBlipExist(blip) then
                    blip = AddBlipForEntity(ped)
                    SetBlipSprite(blip, 1)
                    SetBlipColour(blip, 59)
                    ShowHeadingIndicatorOnBlip(blip, true)
                else
                    local vehicle = GetVehiclePedIsIn(ped, false)
                    local blipSprite = GetBlipSprite(blip)

                    if not GetEntityHealth(ped) and blipSprite ~= 274 then -- Dead icon
                        SetBlipSprite(blip, 274)
                        SetBlipColour(blip, 59)
                        ShowHeadingIndicatorOnBlip(blip, false)
                    elseif vehicle ~= 0 then -- Player is in vehicle
                        local class = GetVehicleClass(vehicle)
                        local sprite = GetBlipSpriteForVehicle(class)

                        if blipSprite ~= sprite then
                            SetBlipSprite(blip, sprite)
                            SetBlipColour(blip, 59)
                        end

                        local passengers = GetVehicleNumberOfPassengers(vehicle)

                        if passengers and not IsVehicleSeatFree(veh, -1) then
                            passengers = passengers + 1
                            ShowNumberOnBlip(blip, passengers)
                        else
                            HideNumberOnBlip(blip)
                        end
                    else -- Player is on foot
                        HideNumberOnBlip(blip)
                        if blipSprite ~= 1 then
                            SetBlipSprite(blip, 1)
                            SetBlipColour(blip, 59)
                            ShowHeadingIndicatorOnBlip(blip, true)
                        end
                    end
                end

                SetBlipRotation(blip, math.ceil(GetEntityHeading(vehicle)))
                BeginTextCommandSetBlipName('STRING')
                AddTextComponentSubstringPlayerName('ID: ' .. GetPlayerServerId(playerId) .. ' | ' .. GetPlayerName(playerId))
                EndTextCommandSetBlipName(blip)
                SetBlipScale(blip, 0.75)
            end

            Wait(config.blipInterval)
        end

        -- Admin turned off player blips, then we need to remove all blips from players
        for _, playerId in ipairs(GetActivePlayers()) do
            local ped = GetPlayerPed(playerId)
            local blip = GetBlipFromEntity(ped)

            if blip then
                RemoveBlip(blip)
            end
        end
    end)
end

RegisterNuiCallback('player_blips', toggleBlips)

------------------------------------------------------------------------------------------------------------------------------------------
--- NAMES
------------------------------------------------------------------------------------------------------------------------------------------

---@type boolean
playerNames = false
local playerGamerTags = {}
local distanceToCheck = config.namesMaxDistance or 150

-- Game consts
local fivemGamerTagCompsEnum = {
    GamerName = 0,
    CrewTag = 1,
    HealthArmour = 2,
    BigText = 3,
    AudioIcon = 4,
    UsingMenu = 5,
    PassiveMode = 6,
    WantedStars = 7,
    Driver = 8,
    CoDriver = 9,
    Tagged = 12,
    GamerNameNearby = 13,
    Arrow = 14,
    Packages = 15,
    InvIfPedIsFollowing = 16,
    RankText = 17,
    Typing = 18
}

--- Removes all cached tags
local function cleanAllGamerTags()
    for _, v in pairs(playerGamerTags) do
        if IsMpGamerTagActive(v.gamerTag) then
            RemoveMpGamerTag(v.gamerTag)
        end
    end
    playerGamerTags = {}
end

--- Draws a single gamer tag
local function setGamerTag(targetTag, pid)
    -- Setup name
    SetMpGamerTagVisibility(targetTag, fivemGamerTagCompsEnum.GamerName, 1)

    -- Setup Health
    SetMpGamerTagHealthBarColor(targetTag, 129)
    SetMpGamerTagAlpha(targetTag, fivemGamerTagCompsEnum.HealthArmour, 255)
    SetMpGamerTagVisibility(targetTag, fivemGamerTagCompsEnum.HealthArmour, 1)

    -- Setup AudioIcon
    SetMpGamerTagAlpha(targetTag, fivemGamerTagCompsEnum.AudioIcon, 255)
    if NetworkIsPlayerTalking(pid) then
        SetMpGamerTagVisibility(targetTag, fivemGamerTagCompsEnum.AudioIcon, true)
        SetMpGamerTagColour(targetTag, fivemGamerTagCompsEnum.AudioIcon, 12) --HUD_COLOUR_YELLOW
        SetMpGamerTagColour(targetTag, fivemGamerTagCompsEnum.GamerName, 12) --HUD_COLOUR_YELLOW
    else
        SetMpGamerTagVisibility(targetTag, fivemGamerTagCompsEnum.AudioIcon, false)
        SetMpGamerTagColour(targetTag, fivemGamerTagCompsEnum.AudioIcon, 0)
        SetMpGamerTagColour(targetTag, fivemGamerTagCompsEnum.GamerName, 0)
    end
end

--- Clears a single gamer tag
local function clearGamerTag(targetTag)
    -- Cleanup name
    SetMpGamerTagVisibility(targetTag, fivemGamerTagCompsEnum.GamerName, 0)
    -- Cleanup Health
    SetMpGamerTagVisibility(targetTag, fivemGamerTagCompsEnum.HealthArmour, 0)
    -- Cleanup AudioIcon
    SetMpGamerTagVisibility(targetTag, fivemGamerTagCompsEnum.AudioIcon, 0)
end

--- Loops through every player, checks distance and draws or hides the tag
local function showGamerTags()
    local curCoords = GetEntityCoords(PlayerPedId())
    -- Per infinity this will only return players within 300m
    local allActivePlayers = GetActivePlayers()

    for _, pid in ipairs(allActivePlayers) do
        -- Resolving player
        local targetPed = GetPlayerPed(pid)

        -- If we have not yet indexed this player or their tag has somehow dissapeared (pause, etc)
        if
            not playerGamerTags[pid]
            or playerGamerTags[pid].ped ~= targetPed --ped can change if it leaves the networked area and back
            or not IsMpGamerTagActive(playerGamerTags[pid].gamerTag)
        then
            local playerName = string.sub(GetPlayerName(pid) or "unknown", 1, 75)
            local playerStr = '[' .. GetPlayerServerId(pid) .. ']' .. ' ' .. playerName
            playerGamerTags[pid] = {
                gamerTag = CreateFakeMpGamerTag(targetPed, playerStr, false, false, 0),
                ped = targetPed
            }
        end
        local targetTag = playerGamerTags[pid].gamerTag

        -- Distance Check
        local targetPedCoords = GetEntityCoords(targetPed)
        if #(targetPedCoords - curCoords) <= distanceToCheck then
            setGamerTag(targetTag, pid)
        else
            clearGamerTag(targetTag)
        end
    end
end

local function createGamerTagThread()
    CreateThread(function()
        while playerNames do
            showGamerTags()
            Wait(250)
        end

        cleanAllGamerTags()
    end)
end

---@param cb? fun(data: any)
local function toggleNames(_, cb)
    if cb then cb(1) end

    local isAdmin = lib.callback.await('prp_admin_v2:isAdmin', false)
    if not isAdmin then return end

    playerNames = not playerNames

    prp.notify({
        description = locale('names_' .. (playerNames and 'activated' or 'disabled')),
        type = 'inform'
    })

    if playerNames then
        createGamerTagThread()
    end
end

RegisterNuiCallback('player_names', toggleNames)



lib.addKeybind({
    name = 'prp_admin_v2:toggleBlips',
    description = 'Toggle Players Blips (Admins Only)',
    defaultKey = config.binds.blips,
    onReleased = function()
        toggleBlips()
    end
})

lib.addKeybind({
    name = 'prp_admin_v2:toggleNames',
    description = 'Toggle Players Names (Admins Only)',
    defaultKey = config.binds.names,
    onReleased = function()
        toggleNames()
    end
})