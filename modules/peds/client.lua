RegisterNetEvent('prp_admin_v2:reset_model', function()
    TriggerEvent('skinchanger:getSkin', function(skin)
        local model = skin.sex == 0 and 'mp_m_freemode_01' or 'mp_f_reemode_01'

        lib.requestModel(model)

        SetPlayerModel(cache.playerId, model)

        TriggerEvent('skinchanger:getSkin', function(skin)
            TriggerEvent('skinchanger:loadSkin', skin)
        end)

        SetModelAsNoLongerNeeded(model)
    end)
end)

---@param model string
RegisterNetEvent('prp_admin_v2:set_model', function(model)
    if not IsModelValid(model) then return end

    lib.requestModel(model)

    SetPlayerModel(cache.playerId, model)
    SetModelAsNoLongerNeeded(model)
end)

---@param playerId number
RegisterNuiCallback('reset_model', function(playerId, cb) 
    cb(1)

    local response = lib.callback.await('prp_admin_v2:reset_model', false, playerId)

    if response then
        prp.notify({
            description = locale('action_success'),
            type = 'success'
        })
    end
end)

---@param data { target: number, model: string, perm?: boolean }
RegisterNuiCallback('set_model', function(data, cb)
    cb(1)

    if not IsModelValid(data.model) then return end

    local response = lib.callback.await('prp_admin_v2:set_model', false, data)

    if response then
        prp.notify({
            description = locale('action_success'),
            type = 'success'
        })
    end
end)