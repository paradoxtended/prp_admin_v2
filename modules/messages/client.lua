---@param data { message: string, id: number }
RegisterNuiCallback('create_me_message', function(data, cb)
    cb(1)

    local _ = lib.callback.await('prp_admin_v2:createMeMessage', false, data)
end)

---@param message string
RegisterNetEvent('prp_admin_v2:createMeMessage', function(message)
    ExecuteCommand(('me %s'):format(message))
end)