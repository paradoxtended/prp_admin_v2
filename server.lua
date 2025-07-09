lib.locale()

------------------------------------------------------------------------------------------------------------------------------------
--- MODULES
------------------------------------------------------------------------------------------------------------------------------------
require 'modules.account.server'
require 'modules.job.server'
require 'modules.peds.server'
require 'modules.revive.server'
require 'modules.heal.server'
require 'modules.kill.server'
require 'modules.reset_bucket.server'
require 'modules.screenshot.server'
require 'modules.inventory.server'
require 'modules.mute.server'
require 'modules.clothing_menu.server'
require 'modules.names.server'
require 'modules.messages.server'
require 'modules.kick.server'
require 'modules.ban.server'
require 'modules.vanish.server'
require 'modules.objects.server'
require 'modules.vehicles.server'

local db = require 'modules.db.server'

---Function yoinked from https://docs.fivem.net/docs/scripting-reference/runtimes/lua/functions/GetPlayerIdentifiers/
---@param playerId number
---@param type 'steam' | 'discord' | 'xbl' | 'live' | 'license' | 'license2' | 'fivem' | 'ip'
---@return string | nil
function getPlayerIdentifier(playerId, type)
    local playerIdents = GetPlayerIdentifiers(playerId)

    for i = 1, #playerIdents do
        local identifierType, identifierValue = string.match(playerIdents[i], "([^:]+):(.+)")
        if identifierType == type then
            return identifierValue
        end
    end

    return nil
end

---@return JobsData[]?
local function initDashboardJobs()
    local jobs = {}

    for _, job in ipairs(config.adminPanel.dashboardJobs) do
        ---@type JobsData
        local data = { amount = 0, color = job.color, label = job.label }

        for _, playerId in ipairs(GetPlayers()) do
            local player = Framework.getPlayerFromId(playerId)

            if player then
                for _, jobName in ipairs(job.jobs) do
                    if jobName == player:getJob() then
                        data.amount += 1
                    end
                end
            end
        end

        table.insert(jobs, data)
    end

    return jobs
end

lib.addCommand(config.adminPanel.command, {
    help = locale('command_help')
}, function(source)
    local player = Framework.getPlayerFromId(source)

    if not player or not player:hasOneOfGroups(config.adminPanel.allowedGroups) then return end

    ---@type PlayerData[], JobsData[]?
    local players, jobs = {}, {}

    for _, data in ipairs(db.getAllPlayers()) do
        local player = Framework.getPlayerFromIdentifier(data.steam)

        table.insert(players, {
            charName = data.characterName,
            id = player and player.source or nil,
            steam = data.steam,
            accName = player and GetPlayerName(player.source) or locale('unknown_acc_name'),
            admin = data.admin,
            online = player and true or false,
            stateId = data.stateId
        })
    end

    if config.adminPanel.dashboardJobs then
        jobs = initDashboardJobs()
    end

    TriggerClientEvent('prp_admin_v2:openAdminMenu', source, players, jobs)
end)

---@param source number
---@param playerId number | string
---@return FetchedPlayer?
lib.callback.register('prp_admin_v2:getPlayerData', function(source, playerId)
    local player = Framework.getPlayerFromId(source)

    if not player or not player:hasOneOfGroups(config.adminPanel.allowedGroups) then return end

    local target = Framework.getPlayerFromId(playerId)
    local vehicles = db.getOwnedVehicles(target and target:getIdentifier() or playerId)

    local vehiclesActions = lib.callback.await('prp_admin_v2:getVehicles', source, vehicles, playerId)

    if target then
        local coords = GetEntityCoords(GetPlayerPed(playerId))

        ---@type FetchedPlayer
        return {
            banned = db.loadBan(target:getIdentifier():match(':(.+)')),
            identifiers = {
                steam = getPlayerIdentifier(playerId, 'steam') or nil,
                license = getPlayerIdentifier(playerId, 'license') or nil,
                discord = getPlayerIdentifier(playerId, 'discord') or nil
            },
            coords = { x = coords.x, y = coords.y, z = coords.z },
            account = { bank = target:getAccountMoney('bank'), cash = target:getAccountMoney('money') },
            jobs = { name = select(1, target:getJob()), label = select(2, target:getJob()), grade = select(2, target:getJobGrade()) },
            ped = GetEntityModel(GetPlayerPed(playerId)),
            vehicles = vehiclesActions
        }
    else
        local data = db.loadPlayer(playerId)
        local identifier = playerId

        ---@type FetchedPlayer
        return {
            banned = db.loadBan(identifier:match(':(.+)') or identifier),
            identifiers = {
                license = identifier:match(':(.+)') or identifier
            },
            coords = { x = json.decode(data.position).x, y = json.decode(data.position).y, z = json.decode(data.position).z },
            account = Framework.name == 'es_extended' and { bank = json.decode(data.accounts).bank, cash = json.decode(data.accounts).money } 
                    or { bank = json.decode(data.accounts).bank, cash = json.decode(data.accounts).cash },
            jobs = Framework.name == 'es_extended' and { name = data.job, label = data.job:gsub('^%l', string.upper), grade = data.job_grade }
                    or { name = json.decode(data.job).name, label = json.decode(data.job).label, grade = json.decode(data.job).grade.name },
            ped = PedModels[identifier] and GetEntityModel(PedModels[identifier])
                    or Framework.name == 'es_extended' and (data.sex == 'm' and 'mp_m_freemode_01' or 'mp_f_freemode_01')
                                                       or (json.decode(data.charinfo).gender == 0 and 'mp_m_freemode_01' or 'mp_f_freemode_01'),
            vehicles = vehiclesActions
        }
    end
end)

---@param source number
---@param plate string
lib.callback.register('prp_admin_v2:deleteVehicle', function(source, plate)
    local player = Framework.getPlayerFromId(source)

    if not player or not player:hasOneOfGroups(config.adminPanel.allowedGroups) then return end

    db.deleteVehicle(plate)

    return true
end)

-- Database
AddEventHandler('txAdmin:events:serverShuttingDown', db.globalSave)

AddEventHandler('txAdmin:events:scheduledRestart', function(eventData)
    if eventData.secondsRemaining ~= 60 then return end

	db.globalSave()
end)

AddEventHandler('onResourceStop', function(resource)
	if resource == cache.resource then
		db.globalSave()
	end
end)

---@param source number
lib.callback.register('prp_admin_v2:isAdmin', function(source)
    local player = Framework.getPlayerFromId(source)

    return player and player:hasOneOfGroups(config.adminPanel.allowedGroups)
end)