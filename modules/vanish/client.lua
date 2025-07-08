--[[
    This script is taken from https://github.com/paradoxtended/prp_admin/blob/main/src/client/commands/noclip.ts and has been rewritten in Lua

    It is essentially the cloak script from the old version of prp_admin
]]

vanished = false

---@param cb? fun(data: any)
local function vanish(cb)
    if cb then cb(1) end

    local isAdmin = lib.callback.await('prp_admin_v2:isAdmin', false)

    if not isAdmin then return end
    
    vanished = not vanished

    if vanished then
        CreateThread(function()
            while vanished do
                SetEntityLocallyVisible(cache.ped)
                Wait(0)
            end
        end)
    end

    ClearPedBloodDamage(cache.ped)
    SetPedCanBeTargetted(cache.ped, not vanished)
    SetPedCanRagdoll(cache.ped, not vanished)
    SetPedCanRagdollFromPlayerImpact(cache.ped, not vanished)
    SetPedRagdollOnCollision(cache.ped, not vanished)

    SetEntityVisible(cache.ped, not vanished, false)
    SetEveryoneIgnorePlayer(cache.playerId, vanished)
    SetPoliceIgnorePlayer(cache.playerId, vanished)
    SetEntityInvincible(cache.ped, vanished)
    SetEntityAlpha(cache.ped, vanished and 150 or 255, false)

    TriggerServerEvent('prp_admin_v2:vanish', vanished)
end

RegisterNuiCallback('vanish', vanish)

---@param adminId number
---@param state boolean
RegisterNetEvent('prp_admin_v2:vanish', function(adminId, state)
    local admin = GetPlayerFromServerId(adminId)
    local ped = GetPlayerPed(admin)

    if ped and ped ~= cache.ped then
        SetEntityCollision(ped, not state, not state)
    end
end)

lib.addKeybind({
    name = 'prp_admin_v2:toggleVanish',
    description = 'Toggle Vanish (Admins only)',
    defaultKey = config.binds.vanish,
    onReleased = function()
        vanish()
    end
})