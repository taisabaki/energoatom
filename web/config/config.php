<?php

Config::set('site_name', 'ЭНЕРГОАТОМ - ПУСК ЭНЕРГОБЛОКОВ');

Config::set('languages', array('en', 'fr'));

// Routes. Route name => method prefix

Config::set('routes', array(
    'default' => '',
    'admin'   => 'admin_',
));

Config::set('default_route', 'default');
Config::set('default_language', 'en');
Config::set('default_controller', 'start');
Config::set('default_action', 'index');

Config::set('db.host', $_SERVER['RDS_HOSTNAME']);
Config::set('db.user', $_SERVER['RDS_USERNAME']);
Config::set('db.password', $_SERVER['RDS_PASSWORD']);
Config::set('db.db_name', $_SERVER['RDS_DB_NAME']);
Config::set('db.port', $_SERVER['RDS_PORT']);

Config::set('PM_min', 2008);
Config::set('PM_max', date('Y') + 1);

Config::set('salt', 'rutjkfei9rjf940kd02');