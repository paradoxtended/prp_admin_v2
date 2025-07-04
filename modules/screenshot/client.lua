---@param targetId number
RegisterNuiCallback('screenshot', function(targetId, cb)
    cb(1)

    local response = lib.callback.await('prp_admin_v2:screenshot', false, targetId)

    if response then
        prp.notify({
            description = locale('action_success'),
            type = 'success'
        })
    else
        prp.notify({
            description = locale('screenshot_failed'),
            type = 'error'
        })
    end
end)

---@param image string
RegisterNetEvent('prp_admin_v2:screenshoted', function(image)
    SetNuiFocus(true, true)
    SendNUIMessage({
        action = 'screenshot',
        data = image
    })
end)