fx_version 'cerulean'
game 'gta5'
lua54 'yes'

author 'WATERMELON STUDIO'
description 'ws_interface |  https://discord.gg/watermelonstudio'
version '1.0.0'

shared_scripts {
    '@qb-core/shared/locale.lua',
    'locales/en.lua',
    'locales/*.lua',
    'config.lua'
}

client_script {
    'client/*.lua',
}
server_script {
    '@oxmysql/lib/MySQL.lua',
    'server/*.lua'
}

ui_page 'web/build/index.html'

files {
	'web/build/index.html',
	'web/build/**/*',
}