---@type vector3 | nil
local lastCoords
---@type boolean
local spectating = false

---@param targetId number
---@param cb? fun(value: any)
function spectatePlayer(targetId, cb)
    if (cb) then cb(1) end

    local isAdmin = lib.callback.await('prp_admin_v2:isAdmin', false)

    if not isAdmin then return end

    local target = GetPlayerPed(GetPlayerFromServerId(targetId))
    lastCoords = GetEntityCoords(cache.ped)
    local coords = GetEntityCoords(target)

    spectating = not spectating

    if not IsScreenFadedOut() and not IsScreenFadingOut() then
        DoScreenFadeOut(500)

		while not IsScreenFadedOut() do
		    Wait(0)
		end
    end

    RequestCollisionAtCoord(coords.x, coords.y, coords.z)
    NetworkSetInSpectatorMode(spectating, target)

    if not spectating then
        SetEntityCoords(cache.ped, lastCoords.x, lastCoords.y, lastCoords.z, true, true, true, false)
        SetEntityVisible(cache.ped, true, true)
        SetEntityCollision(cache.ped, true, true)
        FreezeEntityPosition(cache.ped, false)
    else
        prp.showTextUI({
            { key = 'ESC', text = locale('stop_spectating') }
        })

        FreezeEntityPosition(cache.ped, true)
        SetEntityVisible(cache.ped, false, false)
        SetEntityCollision(cache.ped, false, false)

        CreateThread(function()
            while spectating do
                DisableFrontendThisFrame()

                if IsControlJustReleased(2, 200) then
                    spectatePlayer(targetId)
                end

                Wait(0)
            end

            prp.hideTextUI()
        end)
    end

    if IsScreenFadedOut() then
		DoScreenFadeIn(500)
	end
end

RegisterNuiCallback('spectate', spectatePlayer)