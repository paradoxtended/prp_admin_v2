---@param source number
---@param data { firstname: string, lastname: string, id: number }
lib.callback.register('prp_admin_v2:update_character_names', function(source, data)
    local player = Framework.getPlayerFromId(source)

    if not player or not player:hasOneOfGroups(config.adminPanel.allowedGroups) then return end

    local target = Framework.getPlayerFromId(data.id)

    if not target then return end

    target:updateNames(data.firstname, data.lastname)

    return true
end)