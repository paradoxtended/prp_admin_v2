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

local db = require 'modules.db.server'

---Function yoinked from https://docs.fivem.net/docs/scripting-reference/runtimes/lua/functions/GetPlayerIdentifiers/
---@param playerId number
---@param type 'steam' | 'discord' | 'xbl' | 'live' | 'license' | 'license2' | 'fivem' | 'ip'
---@return string | nil
local function getPlayerIdentifier(playerId, type)
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

    for _, playerId in ipairs(GetPlayers()) do
        local player = Framework.getPlayerFromId(playerId)

        if player then
            table.insert(players, {
                charName = player:getFirstName() .. ' ' .. player:getLastName(),
                id = playerId,
                steam = getPlayerIdentifier(playerId, 'steam') or getPlayerIdentifier(playerId, 'fivem'),
                accName = GetPlayerName(playerId),
                admin = player:hasOneOfGroups(config.adminPanel.allowedGroups)
            })
        end
    end

    if config.adminPanel.dashboardJobs then
        jobs = initDashboardJobs()
    end

    TriggerClientEvent('prp_admin_v2:openAdminMenu', source, players, jobs)
end)

---@param source number
---@param playerId number
---@return FetchedPlayer?
lib.callback.register('prp_admin_v2:getPlayerData', function(source, playerId)
    local player = Framework.getPlayerFromId(source)

    if not player or not player:hasOneOfGroups(config.adminPanel.allowedGroups) then return end

    local target = Framework.getPlayerFromId(playerId)

    if not target then return end
    local coords = GetEntityCoords(GetPlayerPed(playerId))

    ---@type FetchedPlayer
    return {
        banned = false, -- todo import banning system and check if player is banned
        identifiers = {
            steam = getPlayerIdentifier(playerId, 'steam') or nil,
            license = getPlayerIdentifier(playerId, 'license') or nil,
            discord = getPlayerIdentifier(playerId, 'discord') or nil
        },
        coords = { x = coords.x, y = coords.y, z = coords.z },
        account = { bank = target:getAccountMoney('bank'), cash = target:getAccountMoney('money') },
        jobs = { name = select(1, target:getJob()), label = select(2, target:getJob()), grade = select(2, target:getJobGrade()) },
        ped = GetEntityModel(GetPlayerPed(playerId))
    }
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