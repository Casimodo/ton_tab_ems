fx_version 'cerulean'

games { 'gta5' }
lua54 'yes'

name "ton_tab_ems"
description "EMS Tab for ESX Framework"
author "tontonCasi"
version "1.0.0"

client_script {
  	"client/*.lua",
}

server_script {
	'@oxmysql/lib/MySQL.lua',
	"server/*.lua",
}

shared_script {
    '@ox_lib/init.lua',
	'@es_extended/imports.lua',
    'shared/GetFrameworkObject.lua',
	'shared/config.lua',
}

ui_page 'html/index.html'
files {
    'html/index.html',
    'html/css/*',
    'html/js/*',
	'html/img/*',
    'html/external/js/*.js',
    'html/external/css/*.css',
    'html/js/modules/*',
}

dependencies {
    'es_extended',
    'oxmysql',
    'ox_inventory',
    'loaf_headshot_base64'
}
