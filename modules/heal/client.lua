---@param targetId number
RegisterNuiCallback('heal', function(targetId, cb)
    cb(1)

    local response = lib.callback.await('prp_admin_v2:heal', false, targetId)

    if response then
        prp.notify({
            description = locale('action_success'),
            type = 'success'
        })
    end
end)

-- No need to secure this event, cheaters can abuse natives anyways
RegisterNetEvent('prp_admin_v2:healed', function()
    SetEntityHealth(cache.ped, GetEntityMaxHealth(cache.ped))
end)