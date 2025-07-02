local account = {}

---@param data { target: number, type: 'bank' | 'money', action: 'add' | 'remove', amount: number }
RegisterNuiCallback('change_account_status', function(data, cb)
    cb(1)

    local response = lib.callback.await('prp_admin_v2:change_account_status', false, data)

    if response then
        prp.notify({
            description = locale('action_success'),
            type = 'success'
        })
    end
end)

return account