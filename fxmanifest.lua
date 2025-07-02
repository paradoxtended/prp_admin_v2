fx_version 'cerulean'
use_experimental_fxv2_oal 'yes'
lua54 'yes'
name 'prp_admin'
game 'gta5'
author 'Paradoxtended'
version '1.0.0'
repository 'https://github.com/paradoxtended/prp_admin_v2'
description 'Advanced admin menu for FiveM servers'

dependencies {
    '/server:6116',
    '/onesync',
    'oxmysql',
    'ox_lib',
    'prp_lib'
}

shared_scripts {
    '@ox_lib/init.lua',
    '@prp_lib/init.lua',
}

server_scripts {
    '@oxmysql/lib/MySQL.lua',
    'init.lua'
}

client_script 'init.lua'

ui_page 'web/build/index.html'

files {
    'client.lua',
    'server.lua',
    'locales/*.json',
    'web/build/index.html',
    'web/build/**/*',
    'modules/**/*.lua',
    'data/*'
}