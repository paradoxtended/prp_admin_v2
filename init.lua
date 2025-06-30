local resourceName = GetCurrentResourceName()
local resource = 'prp_admin_v2'

-- Some people have decided to load this file as part of prp_admin_v2's fxmanifest?
if resourceName ~= resource then return end

local LoadResourceFile = LoadResourceFile
local context = IsDuplicityVersion() and 'server' or 'client'

local frameworkName = GetResourceState('es_extended') == 'started' and 'esx' or 'qb'

local configFile = LoadResourceFile('prp_admin_v2', 'data/config.json')
local framework = LoadResourceFile('prp_lib', ('resource/callbacks/%s/%s.lua'):format(context, frameworkName))

config = json.decode(configFile)

Framework = assert(load(framework))()