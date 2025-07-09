local raycast = lib.raycast.fromCamera
local IsControlJustReleased = IsControlJustReleased
local DisablePlayerFiring = DisablePlayerFiring

local lastCoords

local snapping = false
local heading = 0.0
local settingUp = false
---@type { model?: string, freeze?: boolean }
local props = {}

local function keyListener()
    --- ESC
    if IsControlJustReleased(2, 200) then settingUp = false end

    --- Z key
    if IsControlJustReleased(0, 20) then snapping = not snapping end

    --- Mouse wheel
    if IsControlPressed(0, 15) then heading += 5.0 end
    if IsControlPressed(0, 14) then heading -= 5.0 end
end

---@param coords vector3 Entity (object)
---@param heading number Entity's heading
local function requestPlaceObject(coords, heading)
    settingUp = false

    local response = lib.callback.await('prp_admin_v2:createObject', false, coords, heading, props)

    if response then
        prp.notify({
            description = locale('entity_created'),
            type = 'inform'
        })
    end
end

---@param object number Entity (object)
local function settingObject(object)
    keyListener()

    if IsDisabledControlJustPressed(0, 24) then requestPlaceObject(GetEntityCoords(object), GetEntityHeading(object)) end

    DisablePlayerFiring(cache.playerId, true)
    DisableFrontendThisFrame()
end

---@param data { model: string, freeze?: boolean }
local function createLocalObject(data)
    local isAdmin = lib.callback.await('prp_admin_v2:isAdmin', false)
    if not isAdmin then return end
    
    local curCoords = GetEntityCoords(cache.ped)
    
    local model = data.model

    lib.requestModel(model)
    local object = CreateObject(model, curCoords.x, curCoords.y, curCoords.z, false, false, false)
    SetEntityCollision(object, false, true)
    SetEntityAlpha(object, 150, false)
    SetModelAsNoLongerNeeded(model)

    -- Text UI
    prp.showTextUI({
        { key = 'ESC', text = locale('exit') },
        { key = 'Z', text = locale('toggle_snapping') },
        { key = 'MWHEEL', text = locale('change_heading') },
        { key = 'LMB', text = locale('confirm') }
    })

    settingUp = true

    CreateThread(function()
        while settingUp do
            settingObject(object)
            Wait(0)
        end
    end)

    while settingUp do
        local hit
        
        hit, _, lastCoords = raycast()

        if hit then
            SetEntityCoords(object, lastCoords.x, lastCoords.y, lastCoords.z, false, false, false, false)
            SetEntityHeading(object, heading)
        end

        if snapping then
            PlaceObjectOnGroundProperly(object)
        end

        Wait(0)
    end

    snapping = false
    heading = 0.0
    settingUp = false

    prp.hideTextUI()

    if DoesEntityExist(object) then
        DeleteEntity(object)
    end
end

---@param data { model: string, freeze?: boolean }
RegisterNuiCallback('spawn_object', function(data, cb)
    cb(1)

    if not IsModelValid(data.model) then
        error(('Object model: `%s` is not valid model'):format(data.model))
        return
    end

    props = data

    createLocalObject(data)
end)

--------------------------------------------------------------------------------------------------------------------------------------------------------
--- DELETING OBJECTS
--------------------------------------------------------------------------------------------------------------------------------------------------------

local finding = false
local highlightedEntity

---@param entity number
local function GetEntityProps(entity)
    local entityCoords = GetEntityCoords(entity)

    local coords = { x = entityCoords.x, y = entityCoords.y, z = entityCoords.z }
    local heading = GetEntityHeading(entity)
    local model = GetEntityModel(entity)
    local networkOwner = GetPlayerServerId(NetworkGetEntityOwner(entity))

    SendNUIMessage({
        action = 'entityProps',
        data = {
            coords = coords,
            heading = heading,
            model = model,
            networkOwner = networkOwner,
            plate = IsEntityAVehicle(entity) and GetVehicleNumberPlateText(entity) or nil
        }
    })
end

---@param escaped boolean
local function stopFindingObject(escaped)
    finding = false

    if not highlightedEntity then return end

    SetEntityDrawOutline(highlightedEntity, false) 
    SendNUIMessage({ action = 'hideEntityProps' })

    if escaped then return end

    local netId = NetworkGetNetworkIdFromEntity(highlightedEntity)
    TriggerServerEvent('prp_admin_v2:deleteObject', netId)

    highlightedEntity = nil
end

local function lookForObject()
    local lastCoords = lastCoords or vector3(0, 0, 0)

    DrawMarker(28, lastCoords.x, lastCoords.y, lastCoords.z, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.1, 0.1,
        0.1,
        ---@diagnostic disable-next-line: param-type-mismatch
        0, 255, 0, 150, false, false, 0, true, false, false, false)

    DisablePlayerFiring(cache.playerId, true)
    DisableFrontendThisFrame()

    if IsControlJustReleased(2, 200) or IsDisabledControlJustPressed(0, 24) then -- 200 = ESC, 24 = LMB
        stopFindingObject(IsControlJustReleased(2, 200))
    end
end

local function createObjectThread()
    prp.showTextUI({
        { key = 'ESC', text = locale('exit') },
        { key = 'LMB', text = locale('confirm') }
    })

    CreateThread(function()
        while finding do
            lookForObject()
            Wait(0)
        end

        prp.hideTextUI()
    end)

    while finding do
        local hit, entity
        
        hit, entity, lastCoords = raycast()

        local valid = hit and entity and (IsEntityAnObject(entity) or IsEntityAVehicle(entity)) and NetworkGetEntityIsNetworked(entity)

        if valid and highlightedEntity ~= entity then
            SetEntityDrawOutline(entity, true)
            SetEntityDrawOutlineColor(0, 255, 0, 255)
            GetEntityProps(entity)

            if highlightedEntity then SetEntityDrawOutline(highlightedEntity, false) end
            highlightedEntity = entity
        elseif not valid then
            if highlightedEntity then 
                SetEntityDrawOutline(highlightedEntity, false)
                SendNUIMessage({ action = 'hideEntityProps' })
                highlightedEntity = nil
            end
        end

        Wait(0)
    end
end

---@param closest boolean
---@param cb? fun(data: any)
local function deleteObject(closest, cb)
    if cb then cb(1) end

    local isAdmin = lib.callback.await('prp_admin_v2:isAdmin', false)
    if not isAdmin then return end

    if closest then
        local coords = GetEntityCoords(cache.ped)
        local object = lib.getClosestObject(coords, 5.0)

        if object and NetworkGetEntityIsNetworked(object) then
            local netId = NetworkGetNetworkIdFromEntity(object)
            TriggerServerEvent('prp_admin_v2:deleteObject', netId)
        else
            prp.notify({
                description = locale('no_entity'),
                type = 'error'
            })
        end

        return
    end

    finding = true

    createObjectThread()
end

RegisterNuiCallback('delete_entity', deleteObject)