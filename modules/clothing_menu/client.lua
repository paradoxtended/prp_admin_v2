local clothingMenu

local function isStarted(resourceName)
    return GetResourceState(resourceName) == 'started'
end

if isStarted('illenium-appearance') then
    clothingMenu = 'illenium-appearance'
elseif isStarted('fivem-appearance') then
    clothingMenu = 'fivem-appearance'
end

---@param targetId number
RegisterNuiCallback('clothing_menu', function(targetId, cb)
    cb(1)

    local response = lib.callback.await('prp_admin_v2:clothing_menu', false, targetId)

    if response then
        prp.notify({
            description = locale('action_success'),
            type = 'success'
        })
    end
end)

RegisterNetEvent('prp_admin_v2:clothing_menu', function()
    if clothingMenu == 'illenium-appearance' then
        TriggerEvent('illenium-appearance:client:openClothingShopMenu', true)
    elseif clothingMenu == 'fivem-appearance' then
        -- Not sure, I'm not using fivem-appearance ....
        exports['fivem-appearance']:startPlayerCustomization(nil, {
            ped = true, headBlend = true, faceFeatures = true, headOverlays = true, components = true, props = true, allowExit = true, tattoos = true
        })
    end
end)