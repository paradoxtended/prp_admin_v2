---@param data { name: string, amount?: number, json?: string, id: number }
RegisterNuiCallback('give_item', function(data, cb)
    cb(1)

    local response = lib.callback.await('prp_admin_v2:give_item', false, data)

    if response then
        prp.notify({
            description = locale('action_success'),
            type = 'success'
        })
    end
end)

---@param targetId number | string
RegisterNuiCallback('open_inventory', function(targetId, cb)
    cb(1)
    
    if cache.serverId == tonumber(targetId) then
        prp.notify({
            description = locale('cant_open_inventory'),
            type = 'error'
        })

        return
    end

    local response = lib.callback.await('prp_admin_v2:open_inventory', false, tonumber(targetId))

    if response then
        prp.notify({
            description = locale('action_success'),
            type = 'success'
        })
    end
end)