---@type boolean
local muted = false

---@param targetId number
RegisterNuiCallback('mute', function(targetId, cb)
    cb(1)

    local response = lib.callback.await('prp_admin_v2:mute', false, targetId)

    if response then
        prp.notify({
            description = locale('action_success'),
            type = 'success'
        })
    end
end)

-- This disables the player from "targeting" anyone when talking
RegisterNetEvent('prp_admin_v2:muted', function()
    muted = not muted

    if not muted then
        exports['pma-voice']:resetProximityCheck()
    else
        exports['pma-voice']:overrideProximityCheck(function()
            return false
        end)
    end
end)