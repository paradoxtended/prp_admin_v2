---@param source number
---@param coords vector3
---@param heading number
---@param props { model: string, freeze?: boolean }
lib.callback.register('prp_admin_v2:createObject', function(source, coords, heading, props)
    local player = Framework.getPlayerFromId(source)
    if not player or not player:hasOneOfGroups(config.adminPanel.allowedGroups) then return end

    local entity = CreateObject(props.model, coords.x, coords.y, coords.z, true, true, false)
    SetEntityAsMissionEntity(entity, true, true)
    SetEntityHeading(entity, heading)
    FreezeEntityPosition(entity, props?.freeze or false)

    return true
end)

---@param netId number
RegisterNetEvent('prp_admin_v2:deleteObject', function(netId)
    local source = source

    local player = Framework.getPlayerFromId(source)
    local entity = NetworkGetEntityFromNetworkId(netId)

    if not player
    or not player:hasOneOfGroups(config.adminPanel.allowedGroups)
    or not entity then
        return
    end

    DeleteEntity(entity)
end)