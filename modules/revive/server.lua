---@param source number
---@param targetId number
lib.callback.register('prp_admin_v2:revive', function(source, targetId)
    local player = Framework.getPlayerFromId(source)

    if not player or not player:hasOneOfGroups(config.adminPanel.allowedGroups) then return end

    if Framework.name == 'es_extended' then
        TriggerClientEvent('esx_ambulancejob:revive', targetId)
    else
        TriggerClientEvent('hospital:client:Revive', targetId)
    end

    return true
end)