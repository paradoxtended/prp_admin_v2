lib.locale()

---Function yoinked from https://docs.fivem.net/docs/scripting-reference/runtimes/lua/functions/GetPlayerIdentifiers/
---@param playerId number
---@return string | nil
local function getPlayerIdentifier(playerId)
    local playerIdents = GetPlayerIdentifiers(playerId)

    for i = 1, #playerIdents do
        local identifierType, identifierValue = string.match(playerIdents[i], "([^:]+):(.+)")
        if identifierType == "fivem" or identifierType == 'steam' then
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
                steam = getPlayerIdentifier(playerId),
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