local raycast = lib.raycast.fromCamera
local IsControlJustReleased = IsControlJustReleased

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
    DisableFrontendThisFrame()

    keyListener()
    if IsControlJustPressed(0, 38) then requestPlaceObject(GetEntityCoords(object), GetEntityHeading(object)) end

    local hit, _, coords = raycast(nil, nil, 30)

    if hit then
        SetEntityCoords(object, coords.x, coords.y, coords.z, false, false, false, false)
        SetEntityHeading(object, heading)

        if snapping then
            PlaceObjectOnGroundProperly(object)
        end
    end

    DisableFrontendThisFrame()
end

---@param data { model: string, freeze?: boolean }
local function createLocalObject(data)
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
        { key = 'E', text = locale('confirm') }
    })

    settingUp = true

    CreateThread(function()
        while settingUp do
            Wait(0)
            settingObject(object)
        end

        snapping = false
        heading = 0.0
        settingUp = false

        prp.hideTextUI()

        if DoesEntityExist(object) then
            DeleteEntity(object)
        end
    end)
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