---@param players PlayerData[]
---@param jobs JobsData[]
RegisterNetEvent('prp_admin_v2:openAdminMenu', function(players, jobs)
    SetNuiFocus(true, true)
    SendNUIMessage({
        action = 'openAdmin',
        data = {
            players = {
                players = players,
                jobs = jobs
            },
        }
    })
end)

RegisterNuiCallback('closeAdmin', function(_, cb)
    cb(1)
    SetNuiFocus(false, false)
end)