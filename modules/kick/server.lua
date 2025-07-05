---@param source number;
---@param data { message: string, id: number };
lib.callback.register('prp_admin_v2:kick', function(source, data)
    local admin = Framework.getPlayerFromId(source)
    
    if not admin or not admin:hasOneOfGroups(config.adminPanel.allowedGroups) then return end

    local target = Framework.getPlayerFromId(data.id)

    if not target then return end

    DropPlayer(data.id, locale('kick_message', data.message))

    return true
end)