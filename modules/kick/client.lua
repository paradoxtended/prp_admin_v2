---@param data { message: string, id: number }
RegisterNuiCallback('kick', function(data, cb)
    cb(1)

    local response = lib.callback.await('prp_admin_v2:kick', false, data)

    if response then
        prp.notify({
            description = locale('player_kicked', data.id, data.message),
            type = 'inform'
        })
    end
end)