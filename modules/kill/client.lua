---@param targetId number
RegisterNuiCallback('kill', function(targetId, cb)
    cb(1)

    local response = lib.callback.await('prp_admin_v2:kill', false, targetId)

    if response then
        prp.notify({
            description = locale('action_success'),
            type = 'success'
        })
    end
end)

RegisterNetEvent('prp_admin_v2:killed', function()
    SetEntityHealth(cache.ped, 0)
end)