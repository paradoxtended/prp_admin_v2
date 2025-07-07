---@param state boolean
RegisterNetEvent('prp_admin_v2:vanish', function(state)
    local source = source
    local player = Framework.getPlayerFromId(source)

    if not player or not player:hasOneOfGroups(config.adminPanel.allowedGroups) then return end

    TriggerClientEvent('prp_admin_v2:vanish', -1, source, state)
end)