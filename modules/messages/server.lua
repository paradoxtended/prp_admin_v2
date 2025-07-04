---@param source number
---@param data { message: string, id: number }
lib.callback.register('prp_admin_v2:createMeMessage', function(source, data)
    local player = Framework.getPlayerFromId(source)

    if not player or not player:hasOneOfGroups(config.adminPanel.allowedGroups) then return end

    local target = Framework.getPlayerFromId(data.id)

    if not target then return end

    TriggerClientEvent('prp_admin_v2:createMeMessage', target.source, data.message)

    return true
end)