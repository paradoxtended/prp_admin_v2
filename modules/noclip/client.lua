--[[
    This script is taken from https://github.com/paradoxtended/prp_admin/blob/main/src/client/commands/noclip.ts and has been rewritten in Lua

    It is essentially the noclip script from the old version of prp_admin
]]

noclipActive = false
local speed = 1.0
local maxSpeed = 16.0
local cam = nil
local entity = nil

local function SetupCam()
    local coords = GetEntityCoords(entity)
    local _, _, heading = table.unpack(GetEntityRotation(entity, 2))

    cam = CreateCam("DEFAULT_SCRIPTED_CAMERA", true)
    SetCamCoord(cam, coords.x, coords.y, coords.z)
    SetCamRot(cam, 0.0, 0.0, heading, 2)
    AttachCamToEntity(cam, entity, 0.0, 0.0, 1.0, true)
    SetCamActive(cam, true)
    RenderScriptCams(true, true, 1000, false, false)
end

local function ToggleBehavior(state)
    local coords = GetEntityCoords(entity)
    RequestCollisionAtCoord(coords.x, coords.y, coords.z)

    FreezeEntityPosition(entity, state)
    SetEntityInvincible(entity, state)
    SetEveryoneIgnorePlayer(PlayerId(), state)
    SetPoliceIgnorePlayer(PlayerId(), state)
    SetEntityAlpha(entity, state and 0 or vanished and 150 or 255, false)

    if not vanished then
        SetEntityVisible(entity, not state, false)
        SetEntityCollision(entity, not state, not state)
    end

    local veh = GetVehiclePedIsIn(PlayerPedId(), false)
    if veh ~= 0 then
        SetEntityAlpha(veh, state and 0 or 255, false)
    end
end

local function UpdateCameraRotation()
    local rightX = GetControlNormal(0, 220)
    local rightY = GetControlNormal(0, 221)

    local rotX, rotY, rotZ = table.unpack(GetCamRot(cam, 2))
    rotX = math.max(-89.0, math.min(89.0, rotX + rightY * -5))
    rotZ = rotZ + rightX * -10
    if rotZ < 0.0 then rotZ = rotZ + 360.0 end
    if rotZ > 360.0 then rotZ = rotZ - 360.0 end

    SetCamRot(cam, rotX, rotY, rotZ, 2)
    SetEntityHeading(entity, rotZ)
end

local function UpdateSpeed()
    if IsControlPressed(0, 14) then
        speed = speed - 0.5
        if speed < 0.5 then speed = 0.5 end
    elseif IsControlPressed(0, 15) then
        speed = speed + 0.5
        if speed > maxSpeed then speed = maxSpeed end
    elseif IsControlJustReleased(0, 348) then
        speed = 1.0
    end
end

local function UpdateMovement()
    local multi = 1.0

    if IsControlPressed(0, 21) then
        multi = 2.0 -- Shift
    elseif IsControlPressed(0, 19) then
        multi = 4.0 -- Alt
    elseif IsControlPressed(0, 36) then
        multi = 0.15 -- Ctrl
    end

    local rotX, rotY, rotZ = table.unpack(GetCamRot(cam, 2))
    local heading = math.rad(rotZ)

    local forward = vector3(-math.sin(heading), math.cos(heading), 0.0)
    local right = vector3(math.cos(heading), math.sin(heading), 0.0)
    local up = vector3(0.0, 0.0, 1.0)

    local moveDir = vector3(0.0, 0.0, 0.0)

    if IsControlPressed(0, 32) then moveDir = moveDir + forward end -- W
    if IsControlPressed(0, 33) then moveDir = moveDir - forward end -- S
    if IsControlPressed(0, 34) then moveDir = moveDir - right end -- A
    if IsControlPressed(0, 35) then moveDir = moveDir + right end -- D
    if IsControlPressed(0, 44) then moveDir = moveDir + up end    -- Q
    if IsControlPressed(0, 46) then moveDir = moveDir - up end    -- E

    if #(moveDir) > 0.0 then
        moveDir = moveDir / #(moveDir)
        moveDir = moveDir * (speed * multi)
        local coords = GetEntityCoords(entity)
        local newCoords = coords + moveDir
        SetEntityCoordsNoOffset(entity, newCoords.x, newCoords.y, newCoords.z, true, true, true)
    end
end

local function destroyCam()
    SetGameplayCamRelativeHeading(0.0)
    RenderScriptCams(false, true, 1000, true, true)
    DetachEntity(entity, true, true)
    SetCamActive(cam, false)
    DestroyCam(cam, true)
    cam = nil
end

local function TeleportToGround()
    local coords = GetEntityCoords(entity)
    
    local hit, z_coord = GetGroundZFor_3dCoord(coords.x, coords.y, coords.z, true)

    if hit and z_coord then
        SetEntityCoords(entity, coords.x, coords.y, z_coord, true, true, true, false)
    end
end

local function StopNoclip()
    destroyCam()
    TeleportToGround()
    ToggleBehavior(false)
end

-- Main toggle function
---@param cb? fun(data: any)
local function ToggleNoclip(_, cb)
    if cb then cb(1) end

    local isAdmin = lib.callback.await('prp_admin_v2:isAdmin', false)

    if not isAdmin then return end

    noclipActive = not noclipActive
    entity = IsPedInAnyVehicle(PlayerPedId(), false) and GetVehiclePedIsIn(PlayerPedId(), false) or PlayerPedId()

    if noclipActive then
        SetupCam()
        ToggleBehavior(true)

        CreateThread(function()
            while noclipActive do
                Wait(0)
                UpdateCameraRotation()
                UpdateSpeed()
                UpdateMovement()
            end
        end)
    else
        StopNoclip()
    end
end

RegisterNuiCallback('noclip', ToggleNoclip)

lib.addKeybind({
    name = 'prp_admin_v2:toggleNoclip',
    description = 'Toggle Noclip (Admins only)',
    defaultKey = config.binds.noclip,
    onReleased = function()
        ToggleNoclip()
    end
})