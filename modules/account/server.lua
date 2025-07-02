---@param source number
---@param data { target: number, type: 'bank' | 'money', action: 'add' | 'remove', amount: number }
lib.callback.register('prp_admin_v2:change_account_status', function(source, data)
    local player = Framework.getPlayerFromId(source)

    if not player or not player:hasOneOfGroups(config.adminPanel.allowedGroups) then return end

    local target = Framework.getPlayerFromId(data.target)

    if not target then return end

    local currentAmount = target:getAccountMoney(data.type)

    if data.action == 'add' then
        target:addAccountMoney(data.type, data.amount)
    elseif data.action == 'remove' then
        if currentAmount <= 0 then return end

        if currentAmount < data.amount then
            target:removeAccountMoney(data.type, currentAmount)

            return true
        end

        target:removeAccountMoney(data.type, data.amount)
    end

    return true
end)