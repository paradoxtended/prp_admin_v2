---@param data { message: string, duration: number, type: 'minutes' | 'hours' | 'days' | 'perm', id: number }
RegisterNuiCallback('ban', function(data, cb)
    cb(1)

    local response = lib.callback.await('prp_admin_v2:ban', false, data)

    if response then
        prp.notify({
            description = locale('player_banned', data.id, data.message),
            type = 'inform'
        })
    end
end)