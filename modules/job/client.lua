---@param data { target: number, name: string, grade: number }
RegisterNuiCallback('change_job', function(data, cb)
    cb(1)

    local response = lib.callback.await('prp_admin_v2:change_job', false, data)

    if response then
        prp.notify({
            description = locale('action_success'),
            type = 'success'
        })
    end
end)