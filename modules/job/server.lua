local db = require 'modules.db.server'

---@param source number
---@param data { target: string, name: string, grade: number }
lib.callback.register('prp_admin_v2:change_job', function(source, data)
    local player = Framework.getPlayerFromId(source)

    if not player or not player:hasOneOfGroups(config.adminPanel.allowedGroups) then return end

    local target = Framework.getPlayerFromIdentifier(data.target)

    if target then 
        local job = target:getJob()

        if not data.name or not data.grade or job == data.name then return end

        target:setJob(data.name, data.grade)
    else
        if Framework.name == 'es_extended' then
            MySQL.update.await('UPDATE users SET job = ?, job_grade = ? WHERE identifier = ?', {
                data.name,
                data.grade,
                data.target
            })
        else
            local player = db.loadPlayer(data.target)
            local job = json.decode(player.job)

            job.name = data.name
            job.grade.level = data.grade

            MySQL.update.await('UPDATE players SET job = ? WHERE citizenid = ?', {
                json.encode(job),
                data.target
            })
        end
    end

    return true
end)