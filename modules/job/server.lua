---@param source number
---@param data { target: number, name: string, grade: number }
lib.callback.register('prp_admin_v2:change_job', function(source, data)
    local player = Framework.getPlayerFromId(source)

    if not player or not player:hasOneOfGroups(config.adminPanel.allowedGroups) then return end

    local target = Framework.getPlayerFromId(data.target)

    if not target then return end

    local job = target:getJob()

    if not data.name or not data.grade or job == data.name then return end

    target:setJob(data.name, data.grade)

    return true
end)