---@param source number
---@param targetId number
lib.callback.register('prp_admin_v2:reset_model', function(source, targetId)
    local player = Framework.getPlayerFromId(source)

    if not player or not player:hasOneOfGroups(config.adminPanel.allowedGroups) then return end

    local target = Framework.getPlayerFromId(targetId)

    if not target then return end

    TriggerClientEvent('prp_admin_v2:reset_model', target.source)

    return true
end)

---@param source number
---@param data { target: number, model: string }
lib.callback.register('prp_admin_v2:set_model', function(source, data)
    local player = Framework.getPlayerFromId(source)

    if not player or not player:hasOneOfGroups(config.adminPanel.allowedGroups) then return end

    local target = Framework.getPlayerFromId(data.target)

    if not target then return end

    TriggerClientEvent('prp_admin_v2:set_model', target.source, data.model)

    return true
end)