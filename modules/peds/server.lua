---@param source number
---@param targetId number
lib.callback.register('prp_admin_v2:reset_model', function(source, targetId)
    local player = Framework.getPlayerFromId(source)

    if not player or not player:hasOneOfGroups(config.adminPanel.allowedGroups) then return end

    local target = Framework.getPlayerFromId(targetId)

    if not target then return end

    if PedModels[target:getIdentifier()] then
        PedModels[target:getIdentifier()] = nil
        SaveResourceFile(GetCurrentResourceName(), 'data/pedModels.json', json.encode(PedModels, { indent = true }), -1)
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
        SaveResourceFile(GetCurrentResourceName(), 'data/pedModels.json', json.encode(PedModels, { indent = true }), -1)
    end

    TriggerClientEvent('prp_admin_v2:set_model', target.source, data.model)

    return true
end)