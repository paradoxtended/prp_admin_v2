local IsControlJustReleased = IsControlJustReleased
local DisablePlayerFiring = DisablePlayerFiring
local DisableFrontendThisFrame = DisableFrontendThisFrame

local props = {}
local raycast = lib.raycast.fromCamera
local lastCoords
local spawning = false
local heading = 0.0

local function requestSpawnVehicle()
    spawning = false

    TriggerServerEvent('prp_admin_v2:spawnVehicle', lastCoords, heading, props)
    props = {}
end

local function listenerForKeys()
    if IsControlJustReleased(2, 200) then spawning = false end

    if IsControlPressed(0, 14) then heading -= 5.0 end
    if IsControlPressed(0, 15) then heading += 5.0 end

    if IsDisabledControlJustReleased(0, 24) then
        requestSpawnVehicle()
    end

    DisablePlayerFiring(cache.playerId, true)
    DisableFrontendThisFrame()
end

---@param data { model: string, spawnIn?: boolean }
local function createVehicleThread(data)
    local curCoords, curHeading = GetEntityCoords(cache.ped), GetEntityHeading(cache.ped)

    lib.requestModel(data.model)
    local vehicle = CreateVehicle(data.model, curCoords.x, curCoords.y, curCoords.z, curHeading, false, false)
    SetEntityAlpha(vehicle, 150, false)
    SetEntityCollision(vehicle, false, true)
    SetModelAsNoLongerNeeded(data.model)

    -- Add vehicleType into props
    props.vehType = GetVehicleType(vehicle)

    spawning = true

    prp.showTextUI({
        { key = 'ESC', text = locale('exit') },
        { key = 'LMB', text = locale('confirm') }
    })

    CreateThread(function()
        while spawning do
            listenerForKeys()
            Wait(0)
        end
    end)

    while spawning do
        local hit

        hit, _, lastCoords = raycast(nil, nil, 30)
        lastCoords = lastCoords or vector3(0, 0, 0) -- Prevent from error
        
        if hit then
            SetEntityCoords(vehicle, lastCoords.x, lastCoords.y, lastCoords.z, false, false, false, false)
            SetVehicleOnGroundProperly(vehicle)
            SetEntityHeading(vehicle, heading)
        end

        Wait(0)
    end

    prp.hideTextUI()
    DeleteEntity(vehicle)
end

---@param data { model: string, spawnIn?: boolean }
---@param cb? fun(data: any)
local function spawnLocalVehicle(data, cb)
    if cb then cb(1) end

    local isAdmin = lib.callback.await('prp_admin_v2:isAdmin', false)
    if not isAdmin then return end

    if not IsModelAVehicle(data.model) then
        error(('Model: `%s` is no a vehicle!'):format(data.model))
        return
    end

    props = data

    createVehicleThread(data)
end

RegisterNuiCallback('spawn_vehicle', spawnLocalVehicle)

---@param netId number
RegisterNetEvent('prp_admin_v2:seatInVehicle', function(netId)
    local attemptsCounter = 0
    local attemptsLimit = 400 -- 400*5 = 2s
    while not NetworkDoesEntityExistWithNetworkId(netId) and attemptsCounter < attemptsLimit do
        Wait(5)
    end
    if not NetworkDoesEntityExistWithNetworkId(netId) then
        return error('Failed to seat into vehicle (net=' .. netId .. ')')
    end

    local vehicle = NetworkGetEntityFromNetworkId(netId)

    if vehicle and vehicle > 0 then
        SetPedIntoVehicle(cache.ped, vehicle, -1)
    end
end)