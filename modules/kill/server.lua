---@param source number
---@param targetId number
lib.callback.register('prp_admin_v2:kill', function(source, targetId)
    local player = Framework.getPlayerFromId(source)

    if not player or not player:hasOneOfGroups(config.adminPanel.allowedGroups) then return end

    local target = Framework.getPlayerFromId(targetId)

    if not target then return end

    TriggerClientEvent('prp_admin_v2:killed', targetId)

    return true
end)