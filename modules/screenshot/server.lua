---@param source number
---@param targetId number
lib.callback.register('prp_admin_v2:screenshot', function(source, targetId)
    local player = Framework.getPlayerFromId(source)

    if not player or not player:hasOneOfGroups(config.adminPanel.allowedGroups) then return end

    local target = Framework.getPlayerFromId(targetId)

    if not target then return end

    exports['screenshot-basic']:requestClientScreenshot(targetId, {
        encoding = 'jpg'
    }, function(err, data)
        if err then return end

        TriggerClientEvent('prp_admin_v2:screenshoted', source, data)
    end)

    return true
end)