lib.locale()

------------------------------------------------------------------------------------------------------------------------------------
--- MODULES
------------------------------------------------------------------------------------------------------------------------------------
require 'modules.account.client'
require 'modules.job.client'
require 'modules.peds.client'
require 'modules.revive.client'
require 'modules.heal.client'
require 'modules.kill.client'
require 'modules.reset_bucket.client'
require 'modules.spectate.client'
require 'modules.screenshot.client'
require 'modules.inventory.client'
require 'modules.freeze.client'
require 'modules.mute.client'
require 'modules.clothing_menu.client'
require 'modules.names.client'
require 'modules.teleport.client'
require 'modules.messages.client'
require 'modules.kick.client'
require 'modules.ban.client'

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