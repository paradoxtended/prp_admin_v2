local db = require 'modules.db.server'

MySQL.ready(function()
    MySQL.query.await(
        [[
            CREATE TABLE IF NOT EXISTS `prp_admin_bans` (
                `license` varchar(255) NOT NULL,
                `expire` datetime NOT NULL,
                `bannedBy` varchar(255) NOT NULL,
                `reason` varchar(255) NOT NULL,
                PRIMARY KEY (`license`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
        ]]
    )
end)

---@param type 'minutes' | 'hours' | 'days' | 'perm'
---@param duration number
---@return string | osdate
local function getExpireDate(type, duration)
    local seconds

    if type == 'perm' then
        return '9999-12-31 23:59:59'
    elseif type == 'days' then
        seconds = duration * 86400
    elseif type == 'hours' then
        seconds = duration * 3600
    elseif type == 'minutes' then
        seconds = duration * 60
    end

    return os.date('%Y-%m-%d %H:%M:%S', os.time() + seconds)
end

---@param source number
---@param data { message?: string, duration: number, type: 'minutes' | 'hours' | 'days' | 'perm', id: string }
---@return boolean?
function banPlayer(source, data)
    if not data.message then
        data.message = locale('no_reason_provided')
    end

    local admin = Framework.getPlayerFromId(source)
    if not admin or not admin:hasOneOfGroups(config.adminPanel.allowedGroups) then return end

    local license = data.id:match(':(.+)') or data.id
    local expire = getExpireDate(data.type, data.duration)
    local bannedBy = GetPlayerName(source)
    local reason = data.message

    db.banPlayer(license, expire, bannedBy, reason)

    return true
end

---@param source number
---@param data { message: string, duration: number, type: 'minutes' | 'hours' | 'days' | 'perm', id: string }
lib.callback.register('prp_admin_v2:ban', function(source, data)
    local admin = Framework.getPlayerFromId(source)
    
    if not admin or not admin:hasOneOfGroups(config.adminPanel.allowedGroups) then return end

    local success = banPlayer(source, data)

    if not success then return end

    local target = Framework.getPlayerFromIdentifier(data.id)

    if target then
        DropPlayer(target.source, locale('ban_message', reason, expire))
    end

    return true
end)

------------------------------------------------------------------------------------------------------------------------
-- PLAYER CONNECTING
------------------------------------------------------------------------------------------------------------------------

local function msToSeconds(ms)
    return math.floor(ms / 1000)
end

AddEventHandler('playerConnecting', function(_, _, deferrals)
    local source = source
    local license = getPlayerIdentifier(source, 'license')
    deferrals.defer()

    Wait(0)

    deferrals.update(locale('being_checked'))

    Wait(0)

    local ban = db.loadBan(license)

    -- Player is not banned
    if not ban then
        deferrals.done()
        return
    end

    local bannedTime = msToSeconds(ban.expire)
    local currentTime = os.time()

    ban.expire = os.date('%Y-%m-%d %H:%M:%S', bannedTime)

    -- Ban expired
    if bannedTime <= currentTime  then
        db.deleteBan(license)
        deferrals.done()
    else
        deferrals.done('\n\n\n' .. locale('ban_message', ban.reason, ban.expire))
    end
end)