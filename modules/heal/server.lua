---@param source number
---@param targetId number
lib.callback.register('prp_admin_v2:heal', function(source, targetId)
    local player = Framework.getPlayerFromId(source)

    if not player or not player:hasOneOfGroups(config.adminPanel.allowedGroups) then return end

    TriggerClientEvent('prp_admin_v2:healed', targetId)

    return true
end)