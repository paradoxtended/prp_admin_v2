lib.locale()

require 'modules.account.client'
require 'modules.job.client'
require 'modules.peds.client'

---@param id number
---@param cb any
RegisterNuiCallback('getPlayerData', function(id, cb)
    local response = lib.callback.await('prp_admin_v2:getPlayerData', false, id)

    cb(response)
end)

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