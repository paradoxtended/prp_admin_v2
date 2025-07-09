---@param coords vector3
---@param heading number
---@param props { model: string, spawnIn?: boolean, vehType: string }
RegisterNetEvent('prp_admin_v2:spawnVehicle', function(coords, heading, props)
    local source = source
    local player = Framework.getPlayerFromId(source)
    local model = props.model

    if not player
    or not player:hasOneOfGroups(config.adminPanel.allowedGroups)
    or not model then
        return
    end

    local sourceBucket = GetPlayerRoutingBucket(source)

    local vehicle = CreateVehicleServerSetter(props.model, props.vehType, coords.x, coords.y, coords.z, heading)
    local attemptsCounter = 0
    local attemptsLimit = 400 -- 400*5 = 2s
    while not DoesEntityExist(vehicle) do
        Wait(5)
        attemptsCounter += 1
        if attemptsCounter > attemptsLimit then
            return error('Failed to spawn vehicle model: ', props.model)
        end
    end
    SetEntityRoutingBucket(vehicle, sourceBucket)

    local netId = NetworkGetNetworkIdFromEntity(vehicle)

    if props.spawnIn then
        TriggerClientEvent('prp_admin_v2:seatInVehicle', source, netId)
    end
end)