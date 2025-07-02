local resourceName = GetCurrentResourceName()
local resource = 'prp_admin_v2'

-- Some people have decided to load this file as part of prp_admin_v2's fxmanifest?
if resourceName ~= resource then return end

local LoadResourceFile = LoadResourceFile
local context = IsDuplicityVersion() and 'server' or 'client'

local function initPedModels()
    local file = LoadResourceFile(resource, 'data/pedModels.json')

    if not file and context == 'server' then
        SaveResourceFile(resource, 'data/pedModels.json', '{}', -1)
    end

    ---@type table<string, number | string>
    PedModels = file and json.decode(file) or {}
end

initPedModels()

local frameworkName = GetResourceState('es_extended') == 'started' and 'esx' or 'qb'

local configFile = LoadResourceFile('prp_admin_v2', 'data/config.json')
local framework = LoadResourceFile('prp_lib', ('resource/callbacks/%s/%s.lua'):format(context, frameworkName))

config = json.decode(configFile)

Framework = assert(load(framework))()

return context == 'client' and require 'client' or require 'server'