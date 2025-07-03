---@param targetId number
RegisterNuiCallback('revive', function(targetId, cb)
    cb(1)

    local response = lib.callback.await('prp_admin_v2:revive', false, targetId)

    if response then
        prp.notify({
            description = locale('action_success'),
            type = 'success'
        })
    end
end)