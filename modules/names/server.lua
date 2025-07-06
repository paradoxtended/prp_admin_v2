local db = require 'modules.db.server'

---@param source number
---@param data { firstname: string, lastname: string, id: string }
lib.callback.register('prp_admin_v2:update_character_names', function(source, data)
    local player = Framework.getPlayerFromId(source)

    if not player or not player:hasOneOfGroups(config.adminPanel.allowedGroups) then return end

    if Framework.name == 'es_extended' then
        MySQL.update.await('UPDATE users SET firstname = ?, lastname = ? WHERE identifier = ?', {
            data.firstname,
            data.lastname,
            data.id
        })
    else
        local player = db.loadPlayer(data.id)
        local charinfo = json.decode(player.charinfo)

        charinfo.firstname = data.firstname
        charinfo.lastname = data.lastname

        MySQL.update.await('UPDATE players SET charinfo = ? WHERE citizenid = ?', {
            json.encode(charinfo),
            data.id
        })
    end

    local target = Framework.getPlayerFromIdentifier(data.id)

    if target then 
        target:updateNames(data.firstname, data.lastname)
    end

    return true
end)