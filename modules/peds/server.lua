local db = require 'modules.db.server'

---@type table<string, string | number>
PedModels = {}

MySQL.ready(function()
    MySQL.query.await(
        [[
            CREATE TABLE IF NOT EXISTS `prp_admin_peds` (
                `identifier` varchar(50) NOT NULL,
                `model` longtext NOT NULL,
                PRIMARY KEY (`identifier`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
        ]]
    )

    local data = MySQL.query.await('SELECT * FROM prp_admin_peds')

    for _, entry in ipairs(data) do
        PedModels[entry.identifier] = entry.model
    end
end)

lib.cron.new('*/30 * * * *', db.savePedModels)

---@param source number
---@param targetId number
lib.callback.register('prp_admin_v2:reset_model', function(source, targetId)
    local player = Framework.getPlayerFromId(source)

    if not player or not player:hasOneOfGroups(config.adminPanel.allowedGroups) then return end

    local target = Framework.getPlayerFromId(targetId)

    if not target then return end

    local identifier = target:getIdentifier()

    if PedModels[identifier] then
        PedModels[identifier] = nil
        db.deletePed(identifier)
    end

    TriggerClientEvent('prp_admin_v2:reset_model', target.source)

    return true
end)

---@param source number
---@param data { target: number, model: string, perm?: boolean }
lib.callback.register('prp_admin_v2:set_model', function(source, data)
    local player = Framework.getPlayerFromId(source)

    if not player or not player:hasOneOfGroups(config.adminPanel.allowedGroups) then return end

    local target = Framework.getPlayerFromId(data.target)

    if not target then return end

    if data.perm then
        PedModels[target:getIdentifier()] = data.model
    end

    TriggerClientEvent('prp_admin_v2:set_model', target.source, data.model)

    return true
end)

---@param source number
lib.callback.register('prp_admin_v2:hasCustomModel', function(source)
    local player = Framework.getPlayerFromId(source)

    if not player then return end

    return PedModels[player:getIdentifier()]
end)