---@param data { firstname: string, lastname: string, id: number }
RegisterNuiCallback('update_character_names', function(data, cb)
    cb(1)

    local response = lib.callback.await('prp_admin_v2:update_character_names', false, data)

    if response then
        prp.notify({
            description = locale('action_success'),
            type = 'success'
        })
    end
end)