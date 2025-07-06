---@param targetId number
RegisterNuiCallback('freeze', function(targetId, cb)
    cb(1)

    local target = GetPlayerFromServerId(targetId)

    if not target or target == -1 then return end

    local targetPed = GetPlayerPed(target)

    if not targetPed then return end

    FreezeEntityPosition(targetPed, not IsEntityPositionFrozen(targetPed))

    prp.notify({
        description = locale('action_success'),
        type = 'success'
    })
end)