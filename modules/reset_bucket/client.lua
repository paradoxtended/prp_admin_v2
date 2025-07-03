---@param targetId number
RegisterNuiCallback('reset_bucket', function(targetId, cb)
    cb(1)

    local response = lib.callback.await('prp_admin_v2:reset_bucket', false, targetId)

    if response then
        prp.notify({
            description = locale('action_success'),
            type = 'success'
        })
    end
end)