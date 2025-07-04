local inventory

local function isStarted(resourceName)
    return GetResourceState(resourceName) == 'started'
end

-- You have to change callback (open_inventory) if you're using different inventory than ox_inventory / qb-inventory
if isStarted('ox_inventory') then
    inventory = 'ox_inventory'
elseif isStarted('qb-inventory') then
    inventory = 'qb-inventory'
end

---@param source number
---@param targetId number
lib.callback.register('prp_admin_v2:open_inventory', function(source, targetId)
    local player = Framework.getPlayerFromId(source)

    if not player or not player:hasOneOfGroups(config.adminPanel.allowedGroups) then return end

    local target = Framework.getPlayerFromId(targetId)

    if not target then return end

    if not inventory then
        error('Add inventory into modules/inventory/server.lua, otherwise you won\'t be able to open others inventory')
        return
    end

    -- Change this condition if you are using different inventory!!!
    if inventory == 'ox_inventory' then
        exports.ox_inventory:forceOpenInventory(source, 'player', targetId)
    elseif inventory == 'qb-inventory' then
        exports['qb-inventory']:OpenInventoryById(source, targetId)
    end

    return true
end)