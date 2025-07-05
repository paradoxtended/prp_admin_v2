local Query = {
    SAVE_PED_MODELS = 'INSERT INTO prp_admin_peds (identifier, model) VALUES (?, ?) ON DUPLICATE KEY UPDATE model = VALUES(model)',
    DELETE_PED = 'DELETE FROM prp_admin_peds WHERE identifier = ?',
    BAN_PLAYER = 'INSERT INTO prp_admin_bans (license, expire, bannedBy, reason) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE expire = VALUES(expire), bannedBy = VALUES(bannedBy), reason = VALUES(reason)',
    LOAD_BAN = 'SELECT * FROM prp_admin_bans WHERE license = ?',
    DELETE_BAN = 'DELETE FROM prp_admin_bans WHERE license = ?'
}

local db = {}

---@param identifier string
function db.deletePed(identifier)
    return MySQL.prepare.await(Query.DELETE_PED, { identifier })
end

function db.savePedModels()
    local parameters = {}
    local size = 0

    for identifier, model in pairs(PedModels) do
        size += 1
        parameters[size] = {
            identifier,
            model
        }
    end

    if size > 0 then
        MySQL.prepare.await(Query.SAVE_PED_MODELS, parameters)
    end
end

function db.banPlayer(license, expire, bannedBy, reason)
    return MySQL.prepare.await(Query.BAN_PLAYER, { license, expire, bannedBy, reason })
end

function db.loadBan(license)
    return MySQL.prepare.await(Query.LOAD_BAN, { license })
end

function db.deleteBan(license)
    return MySQL.prepare.await(Query.DELETE_BAN, { license })
end

---Trigger every database save function, used when resource is going to be restarted or suddenlly stop
function db.globalSave()
    db.savePedModels()
end

return db