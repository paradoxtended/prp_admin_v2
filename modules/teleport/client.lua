---@param targetId number
---@param cb? fun(value: any)
function teleportToPlayer(targetId, cb)
    if cb then cb(1) end

    local target = GetPlayerFromServerId(targetId)
    local ped = GetPlayerPed(target)

    if not ped then return end

    local coords = GetEntityCoords(ped)

    DoScreenFadeOut(500)
    while not IsScreenFadedOut() do Wait(10) end

    SetEntityCoords(cache.ped, coords.x, coords.y, coords.z, true, true, true, false)

    DoScreenFadeIn(500)

    prp.notify({
        description = locale('action_success'),
        type = 'success'
    })
end

---@param targetId number
---@param cb? fun(value: any)
function teleportPlayerToMe(targetId, cb)
    if cb then cb(1) end

    local target = GetPlayerFromServerId(targetId)
    local ped = GetPlayerPed(target)

    if not ped then return end

    local coords = GetEntityCoords(cache.ped)

    SetEntityCoords(ped, coords.x, coords.y, coords.z, true, true, true, false)

    prp.notify({
        description = locale('action_success'),
        type = 'success'
    })
end

---@param targetId number
---@param cb? fun(value: any)
function teleportToPlayerCar(targetId, cb)
    if cb then cb(1) end

    local target = GetPlayerFromServerId(targetId)
    local ped = GetPlayerPed(target)

    if not ped then return end

    local vehicle = GetVehiclePedIsIn(ped, true)

    if vehicle and DoesEntityExist(vehicle) then
        local coords = GetEntityCoords(vehicle)

        DoScreenFadeOut(500)
        while not IsScreenFadedOut() do Wait(10) end

        SetEntityCoords(cache.ped, coords.x, coords.y, coords.z, true, true, true, false)

        DoScreenFadeIn(500)

        prp.notify({
            description = locale('action_success'),
            type = 'success'
        })

        return
    end

    prp.notify({
        description = locale('no_vehicle_found'),
        type = 'error'
    })
end




RegisterNuiCallback('teleport_to_player', teleportToPlayer)
RegisterNuiCallback('teleport_to_me', teleportPlayerToMe)
RegisterNuiCallback('teleport_to_car', teleportToPlayerCar)