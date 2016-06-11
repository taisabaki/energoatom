<?php

class SettingsHandler extends Handler{

    public function create_user($params){

        $login = $this->db->escape($params['login']);
        $spec_login = htmlspecialchars($login);
        $name = $this->db->escape($params['name']);
        $hash = md5(Config::get('salt').$params['password']);

        if (in_array($login, $this->getLogins())){
            return array(
                'complete' => false,
                'message' => "Не удалось создать пользователя. Логин <strong>{$spec_login}</strong> уже занят."
            );
        }

        $sql = "insert into `users` set `login` = '{$login}', `name` = '{$name}', `password` = '{$hash}', `role` = 'user'";

        if ($this->db->query($sql)){
            return array(
                'complete' => true,
                'message' => "Пользователь <strong>{$spec_login}</strong> успешно создан.",
                'active_users' => $this->getActiveUsers(),
                'admins_and_users' => $this->getAdminsAndUsers()
            );
        }

        return array(
            'complete' => false,
            'message' => "Не удалось выполнить операцию."
        );

    }

    public function create_admin($params){

        $login = $this->db->escape($params['login']);
        $spec_login = htmlspecialchars($login);
        $name = $this->db->escape($params['name']);
        $hash = md5(Config::get('salt').$params['password']);

        $admin_login = $this->db->escape($params['admin_login']);
        $admin_hash = md5(Config::get('salt').$params['admin_password']);

        if ($admin_hash != $this->getByLogin($admin_login)['password']){
            return array(
                'complete' => false,
                'message' => "Не удалось добавить администратора. Неправильный пароль."
            );
        }

        if (in_array($login, $this->getLogins())){
            return array(
                'complete' => false,
                'message' => "Не удалось добавить администратора. Логин <strong>{$spec_login}</strong> уже занят."
            );
        }

        $sql = "insert into `users` set `login` = '{$login}', `name` = '{$name}', `password` = '{$hash}', `role` = 'admin'";

        if ($this->db->query($sql)){
            return array(
                'complete' => true,
                'message' => "Администратор <strong>{$spec_login}</strong> добавлен.",
                'admins' => $this->getAdmins(),
                'admins_and_users' => $this->getAdminsAndUsers()
            );
        }

        return array(
            'complete' => false,
            'message' => "Не удалось выполнить операцию."
        );

    }

    public function delete_user($params){

        $login = $this->db->escape($params['login']);
        $spec_login = htmlspecialchars($login);

        $sql = "update `users` set `is_active` = 0 where `login` = '{$login}'";

        if ($this->db->query($sql)){
            return array(
                'complete' => true,
                'message' => "Пользователь <strong>{$spec_login}</strong> успешно удален.",
                'active_users' => $this->getActiveUsers(),
                'non_active_users' => $this->getNonActiveUsers(),
                'admins_and_users' => $this->getAdminsAndUsers()
            );
        }

        return array(
            'complete' => false,
            'message' => "Не удалось выполнить операцию."
        );


    }

    public function restore_user($params){

        $login = $this->db->escape($params['login']);
        $spec_login = htmlspecialchars($login);

        $sql = "update `users` set `is_active` = 1 where `login` = '{$login}'";

        if ($this->db->query($sql)){
            return array(
                'complete' => true,
                'message' => "Пользователь <strong>{$spec_login}</strong> успешно восстановлен.",
                'active_users' => $this->getActiveUsers(),
                'non_active_users' => $this->getNonActiveUsers(),
                'admins_and_users' => $this->getAdminsAndUsers()
            );
        }

        return array(
            'complete' => false,
            'message' => "Не удалось выполнить операцию."
        );

    }

    public function new_login($params){

        $login = $this->db->escape($params['login']);
        $new_login = $this->db->escape($params['new_login']);
        $new_name = $this->db->escape($params['new_name']);
        $hash = md5(Config::get('salt').$params['password']);

        $user = $this->getByLogin($login);

        if ($hash != $user['password']){
            return array(
                'complete' => false,
                'message' => "Не удалось переименовать пользователя. Неправильный пароль."
            );
        }

        if (in_array($new_login, $this->getLogins()) && $login != $new_login){
            return array(
                'complete' => false,
                'message' => "Не удалось переименовать пользователя. Логин <strong>{$new_login}</strong> уже занят."
            );
        }

        if (empty($new_login)){
            $sql = "update `users` set `name` = '{$new_name}' where `login` = '{$login}'";
        } elseif (empty($new_name)){
            $sql = "update `users` set `login` = '{$new_login}' where `login` = '{$login}'";
        } else {
            $sql = "update `users` set `login` = '{$new_login}', `name` = '{$new_name}' where `login` = '{$login}'";
        }

        if ($this->db->query($sql)){
            $refresh = false;
            if($login == Session::get('login')){
                $refresh = true;
                $user = $this->getByLogin($login);
                Session::set('name', $user['name']);
                Session::set('login', $user['login']);
            }
            return array(
                'complete' => true,
                'refresh' => $refresh,
                'message' => "Пользователь успешно переименован.",
                'active_users' => $this->getActiveUsers(),
                'non_active_users' => $this->getNonActiveUsers(),
                'admins_and_users' => $this->getAdminsAndUsers()
            );
        };

        return array(
            'complete' => false,
            'message' => "Не удалось выполнить операцию."
        );

    }

    public function new_password($params){

        $login = $this->db->escape($params['login']);
        $old_hash = md5(Config::get('salt').$params['old_password']);
        $new_hash = md5(Config::get('salt').$params['new_password']);

        if ($old_hash != $this->getByLogin($login)['password']){
            return array(
                'complete' => false,
                'message' => "Не удалось сменить пароль. Неправильный пароль."
            );
        }

        $sql = "update `users` set `password` = '{$new_hash}' where `login` = '{$login}'";

        if ($this->db->query($sql)){
            return array(
                'complete' => true,
                'message' => "Смена пароля произведена успешно."
            );
        };

        return array(
            'complete' => false,
            'message' => "Не удалось выполнить операцию."
        );

    }

    public function new_department($params){

        $name = $this->db->escape($params['name']);
        $full_name = $this->db->escape($params['full_name']);
        $spec_name = htmlspecialchars($name);
        $spec_full_name = htmlspecialchars($full_name);

        if (in_array($name, $this->getDepartmentsNames())){
            return array(
                'complete' => false,
                'message' => "Не удалось добавить подразделение. Сокращение <strong>{$spec_name}</strong> уже занято. Воспользуйтесь опцией изменения подразделений."
            );
        }

        $sql = "insert into `departments` set `name` = '{$name}', `full_name` = '{$full_name}'";

        if ($this->db->query($sql)){
            return array(
                'complete' => true,
                'message' => "Добавлено новое подразделение, <strong>{$spec_name} ({$spec_full_name})</strong>.",
                'departments' => $this->getDepartments()
            );
        };

        return array(
            'complete' => false,
            'message' => "Не удалось выполнить операцию."
        );


    }

    public function delete_department($params){

        $id = $this->db->escape($params['id']);

        $department = $this->getDepartmentById($id);

        $name = $department['name'];
        $full_name = $department['full_name'];

        $sql = "update `departments` set `is_active` = 0 where `id` = {$id}";

        if ($this->db->query($sql)){
            return array(
                'complete' => true,
                'message' => "Подразделение <strong>{$name} ({$full_name})</strong> было удалено из списка.",
                'departments' => $this->getDepartments()
            );
        };

        return array(
            'complete' => false,
            'message' => "Не удалось выполнить операцию."
        );

    }

    public function edit_department($params){

        $id = $params['id'];
        $department = $this->getDepartmentById($id);
        $name = $department['name'];
        $full_name = $department['full_name'];
        $new_name = $this->db->escape($params['new_name']);
        $new_full_name = $this->db->escape($params['new_full_name']);
        $spec_new_name = htmlspecialchars($name);
        $spec_new_full_name = htmlspecialchars($full_name);

        if (in_array($new_name, $this->getDepartmentsNames())){
            return array(
                'complete' => false,
                'message' => "Не удалось переименовать подразделение. Сокращение <strong>{$name}</strong> уже занято. Воспользуйтесь опцией удаления подразделений."
            );
        }

        if (empty($new_name)){
            $sql = "update `departments` set `full_name` = '{$new_full_name}' where `id` = {$id}";
            $new_name = $name;
        } elseif (empty($new_full_name)){
            $sql = "update `departments` set `name` = '{$new_name}' where `id` = {$id}";
            $new_full_name = $full_name;
        } else {
            $sql = "update `departments` set `name` = '{$new_name}', `full_name` = '{$new_full_name}' where `id` = {$id}";
        }

        if ($this->db->query($sql)){
            return array(
                'complete' => true,
                'message' => "Подразделение <strong>{$name} ({$full_name})</strong> переименовано на <strong>$spec_new_name ({$spec_new_full_name})</strong>.",
                'departments' => $this->getDepartments()
            );
        };

        return array(
            'complete' => false,
            'message' => "Не удалось выполнить операцию."
        );


    }

    public function new_class($params){

        $new_term = $this->db->escape($params['new_term']);

        $sql = "insert into `class` set `term` = '{$new_term}'";

        if ($this->db->query($sql)){
            return array(
                'complete' => true,
                'message' => "Отраслевое условие добавлено.",
                'classes' => $this->getClasses()
            );
        };

        return array(
            'complete' => false,
            'message' => "Не удалось выполнить операцию."
        );

    }

    public function delete_class($params){

        $id = $this->db->escape($params['id']);

        $sql = "update `class` set `is_active` = 0 where `id` = {$id}";

        if ($this->db->query($sql)){
            return array(
                'complete' => true,
                'message' => "Отраслевое условие удалено из списка.",
                'classes' => $this->getClasses()
            );
        };

        return array(
            'complete' => false,
            'message' => "Не удалось выполнить операцию."
        );

    }

    public function edit_class($params){

        $id = $this->db->escape($params['id']);
        $edit_term = $this->db->escape($params['edit_term']);

        $sql = "update `class` set `term` = '{$edit_term}' where `id` = {$id}";

        if ($this->db->query($sql)){
            return array(
                'complete' => true,
                'message' => "Отраслевое условие успешно изменено.",
                'classes' => $this->getClasses()
            );
        };

        return array(
            'complete' => false,
            'message' => "Не удалось выполнить операцию."
        );

    }

    public function get_term($params){

        $id = $this->db->escape($params['id']);

        $sql = "select `term` from `class` where `id` = {$id} limit 1";

        return $this->db->query($sql)[0]['term'];

    }


    public function get_plants_by_document($params){ // params = 'protocol' | 'permission' | 'program'

        $sql = "select `npp`.* from `$params` join `unit` join `npp` on `{$params}`.`fk_to_unit` = `unit`.`id` and `unit`.`fk_to_npp` = `npp`.`id` where `{$params}`.`is_published` = 0 group by `npp`.`id` order by `npp`.`id`";

        $this->data = $this->db->query($sql);

        return array(
            'html' => $this->getHTML('plants_by_document'),
            'disabled' => count($this->data) == 0
        );

    }

    public function get_units_by_plant_and_document($params){

        $document = $this->db->escape($params['document']);
        $plant = $this->db->escape($params['plant']);

        $sql = "select `unit`.* from `$document` join `unit` join `npp`
                on `{$document}`.`fk_to_unit` = `unit`.`id` and `unit`.`fk_to_npp` = `npp`.`id`
                where `unit`.`fk_to_npp` = {$plant} and `{$document}`.`is_published` = 0 group by `unit`.`unit` order by `unit`.`unit`";

        $this->data = $this->db->query($sql);

        return array(
            'html' => $this->getHTML('units_by_plant_and_document'),
            'disabled' => count($this->data) == 0
        );

    }

    public function get_years_by_plant_and_unit_and_document($params){

        $document = $this->db->escape($params['document']);
        $plant = $this->db->escape($params['plant']);
        $unit = $this->db->escape($params['unit']);

        $sql = "select `{$document}`.`year` from `$document` join `unit` join `npp`
                on `{$document}`.`fk_to_unit` = `unit`.`id` and `unit`.`fk_to_npp` = `npp`.`id`
                where `unit`.`fk_to_npp` = {$plant} and `{$document}`.`fk_to_unit` = {$unit} and `{$document}`.`is_published` = 0 order by `{$document}`.`year` desc";

        $this->data = $this->db->query($sql);

        return array(
            'html' =>$this->getHTML('years_by_plant_and_unit_and_document'),
            'disabled' => count($this->data) == 0
        );

    }

    public function restore_from_archive($params){

        $id = $this->db->escape($params['id']);
        $year = $this->db->escape($params['year']);
        $document = $this->db->escape($params['document']);

        $sql = "update `{$document}` set `is_published` = 1 where `fk_to_unit` = {$id} and `year` = {$year}";

        if ($this->db->query($sql)){
            return array(
                'complete' => true,
                'message' => "Документ успешно восстановлен из архива."
            );
        };

        return array(
            'complete' => false,
            'message' => "Не удалось выполнить операцию."
        );

    }

    public function set_years_range($params){

        $min = $this->db->escape($params['min']);
        $max = $this->db->escape($params['max']);

        $sql = "update `defaults` set `value` = (case `name` when 'min_year'  then '{$min}' when 'max_year' then '{$max}' else `name` end)";

        if ($this->db->query($sql)){
            return array(
                'complete' => true,
                'message' => "Диапазон ППР успешно изменен."
            );
        };

        return array(
            'complete' => false,
            'message' => "Не удалось выполнить операцию."
        );

    }

    private function getByLogin($login){
        $login = $this->db->escape($login);
        $sql = "select * from users where login = '{$login}' limit 1";
        $result = $this->db->query($sql);
        if(isset($result[0])){
            $result[0]['name'] = htmlspecialchars($result[0]['name']);
            return $result[0];
        }
        return false;
    }

    private function getAdmins(){

        $sql = "select `login`, `password`, `name` from `users` where `role` = 'admin' and `is_active` = 1 order by `login`";

        $result = $this->db->query($sql);

        foreach($result as &$row){
            $row['name'] = htmlspecialchars($row['name']);
        }

        $this->data['admins'] =  $result;

        return $this->getHTML('admins');

    }

    private function getActiveUsers(){

        $sql = "select `login`, `password`, `name` from `users` where `is_active` = 1 and `role` = 'user' order by `login`";

        $result = $this->db->query($sql);

        foreach($result as &$row){
            $row['name'] = htmlspecialchars($row['name']);
        }

        $this->data['users'] = $result;

        return $this->getHTML('active_users');

    }

    private function getNonActiveUsers(){

        $sql = "select `login`, `password`, `name` from `users` where `is_active` = 0 and `role` = 'user' order by `login`";

        $result = $this->db->query($sql);

        foreach($result as &$row){
            $row['name'] = htmlspecialchars($row['name']);
        }

        $this->data['users'] = $result;

        return $this->getHTML('non_active_users');

    }

    private function getAllUsers(){

        $sql = "select `login`, `password`, `name` from `users` where `role` = 'user' order by `login`";

        $result = $this->db->query($sql);

        foreach($result as &$row){
            $row['name'] = htmlspecialchars($row['name']);
        }

        $this->data['users'] = $result;

        return $this->getHTML('all_users');

    }

    private function getAdminsAndUsers(){

        $sql = "select `login`, `password`, `name` from `users` where `is_active` = 1 order by `role`";

        $result = $this->db->query($sql);

        foreach($result as &$row){
            $row['name'] = htmlspecialchars($row['name']);
        }

        $this->data['users'] = $result;

        return $this->getHTML('users');

    }

    private function getLogins(){

        $sql = "select `login` from `users`";

        $result = $this->db->query($sql);

        $list = array();

        foreach ($result as $row){
            $list[] = $row['login'];
        }

        return $list;

    }

    private function getDepartmentsNames(){

        $sql = "select `name` from `departments` where `is_active` = 1";

        $result = $this->db->query($sql);

        $list = array();

        foreach ($result as $row){
            $list[] = htmlspecialchars($row['name']);
        }

        return $list;

    }

    private function getDepartments(){

        $sql = "select `id`, `name`, `full_name` from `departments` where `id` != 1 and `is_active` = 1 order by `name`";

        $result = $this->db->query($sql);

        foreach($result as &$row){
            foreach($row as $name => &$value){
                $value = htmlspecialchars($value);
            }
        }

        $this->data['departments'] = $result;

        return $this->getHTML('departments');

    }

    private function getDepartmentById($id){

        $sql = "select `name`, `full_name` from `departments` where `id` = {$id} limit 1";

        $result = $this->db->query($sql)[0];

        $result['name'] = htmlspecialchars($result['name']);
        $result['full_name'] = htmlspecialchars($result['full_name']);

        return $result;

    }

    private function getClasses(){

        $sql = "select * from `class` where `is_active` = 1 and `id` != 0";

        $classes = $this->db->query($sql);

        foreach($classes as &$row){
            foreach($row as $name => &$value){
                $value = htmlspecialchars($value);
            }
        }

        $this->data['classes'] = $classes;

        return $this->getHTML('classes');

    }



}