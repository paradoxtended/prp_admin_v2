local db = require 'modules.db.server'

---@param source number
---@param data { target: number, type: 'bank' | 'money', action: 'add' | 'remove', amount: string }
lib.callback.register('prp_admin_v2:change_account_status', function(source, data)
    local player = Framework.getPlayerFromId(source)

    if not player or not player:hasOneOfGroups(config.adminPanel.allowedGroups) then return end

    local target = Framework.getPlayerFromIdentifier(data.target)

    if target then
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
    else
        if Framework.name == 'es_extended' then
            local player = db.loadPlayer(data.target)
            local money = json.decode(player.accounts)

            money[data.type] = data.action == 'add' and money[data.type] + data.amount
                or money[data.type] - data.amount

            MySQL.update.await('UPDATE users SET accounts = ? WHERE identifier = ?', {
                json.encode(money),
                data.target
            })
        else
            local player = db.loadPlayer(data.target)
            local money = json.decode(player.money)
            local type = data.type == 'money' and 'cash' or 'bank'

            money[type] = data.action == 'add' and money[type] + data.amount
                or money[type] - data.amount
            
            MySQL.update.await('UPDATE players SET money = ? WHERE citizenid = ?', {
                json.encode(money),
                data.target
            })
        end
    end

    return true
end)