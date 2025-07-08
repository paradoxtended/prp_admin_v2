lib.locale()

------------------------------------------------------------------------------------------------------------------------------------
--- MODULES
------------------------------------------------------------------------------------------------------------------------------------
require 'modules.account.client'
require 'modules.job.client'
require 'modules.peds.client'
require 'modules.revive.client'
require 'modules.heal.client'
require 'modules.kill.client'
require 'modules.reset_bucket.client'
require 'modules.spectate.client'
require 'modules.screenshot.client'
require 'modules.inventory.client'
require 'modules.freeze.client'
require 'modules.mute.client'
require 'modules.clothing_menu.client'
require 'modules.names.client'
require 'modules.teleport.client'
require 'modules.messages.client'
require 'modules.kick.client'
require 'modules.ban.client'
require 'modules.noclip.client'
require 'modules.vanish.client'
require 'modules.blips_names.client'
require 'modules.objects.client'

---@param id? number
---@param cb any
RegisterNuiCallback('getPlayerData', function(id, cb)
    local response = lib.callback.await('prp_admin_v2:getPlayerData', false, id)

    cb(response)
end)

---@param players PlayerData[]
---@param jobs JobsData[]
RegisterNetEvent('prp_admin_v2:openAdminMenu', function(players, jobs)
    local isAdmin = lib.callback.await('prp_admin_v2:isAdmin', false)
    if not isAdmin then return end

    SetNuiFocus(true, true)
    SendNUIMessage({
        action = 'openAdmin',
        data = {
            players = {
                players = players,
                jobs = jobs
            },
            actions = {
                noclip = noclipActive,
                vanish = vanished,
                blips = playerBlips,
                names = playerNames
            }
        }
    })
end)

RegisterNuiCallback('closeAdmin', function(_, cb)
    cb(1)
    SetNuiFocus(false, false)
end)

------------------------------------------------------------------------------------------------------------------------------------
--- VEHICLES
------------------------------------------------------------------------------------------------------------------------------------

local function getVehicleLabel(model)
    local label = GetLabelText(GetDisplayNameFromVehicleModel(model))
    
    if label == 'NULL' then 
        label = GetDisplayNameFromVehicleModel(model)
    end

    return label
end

---@param vehicles { plate: string, vehicle: { model: string | number }, stored: number }[]
---@param targetId number
---@return VehicleData
lib.callback.register('prp_admin_v2:getVehicles', function(vehicles, targetId)
    local owned = {}

    if vehicles and type(vehicles) == 'table' and table.type(vehicles) == 'array' then
        for _, vehicle in ipairs(vehicles) do
            table.insert(owned, {
                model = getVehicleLabel(json.decode(vehicle.mods or vehicle.vehicle).model),
                plate = vehicle.plate,
                active = vehicle.stored == 0 and locale('out_garage')
                                        or vehicle.stored == 1 and locale('in_garage')
                                        or locale('impounded')
            })
        end
    elseif vehicles then
        table.insert(owned, {
            model = getVehicleLabel(json.decode(vehicles.mods or vehicles.vehicle).model),
            plate = vehicles.plate,
            active = vehicles.stored == 0 and locale('out_garage')
                                        or vehicles.stored == 1 and locale('in_garage')
                                        or locale('impounded')
        })
    end

    local target = GetPlayerFromServerId(targetId)

    if not target or target == -1 or type(targetId) == 'string' then
        return {
            owned = #owned > 0 and owned
        }
    end

    local ped = GetPlayerPed(target)
    local vehicle = GetVehiclePedIsIn(ped, false)

    return {
        current = vehicle ~= 0 and { model = getVehicleLabel(GetEntityModel(vehicle)), plate = GetVehicleNumberPlateText(vehicle) } or nil,
        owned = #owned > 0 and owned
    }
end)

---@param plate string
RegisterNuiCallback('remove_vehicle', function(plate, cb)
    cb(1)

    local response = lib.callback.await('prp_admin_v2:deleteVehicle', false, plate)

    if response then
        prp.notify({
            description = locale('vehicle_deleted', plate),
            type = 'inform'
        })
    end
end)