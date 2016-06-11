<?php

class Setup extends Model{

    public function getAllUsers(){

        $list = array(
            'active' => array(),
            'non-active' => array()
        );

        $sql = "select `login`, `password`, `name`, `role` from `users` where `is_active` = 0";

        $list['non-active'] = $this->db->query($sql);

        $sql = "select `login`, `password`, `name`, `role` from `users` where `is_active` = 1";

        $list['active'] = $this->db->query($sql);

        return $list;

    }

    public function getAdmins(){

        $sql = "select `login`, `password`, `name` from `users` where `role` = 'admin' and `is_active` = 1 order by `login`";

        return $this->db->query($sql);

    }

    public function getUsers(){

        $list = array(
            'active' => array(),
            'non-active' => array()
        );

        $sql = "select `login`, `password`, `name` from `users` where `is_active` = 0 and `role` = 'user' order by `login`";

        $list['non-active'] = $this->db->query($sql);

        $sql = "select `login`, `password`, `name` from `users` where `is_active` = 1 and `role` = 'user' order by `login`";

        $list['active'] = $this->db->query($sql);

        return $list;

    }

    public function getPlants(){

        $sql = "select * from `npp`";

        return $this->db->query($sql);

    }


    public function getActivePlants(){

        $sql = "select * from `npp`";

        return $this->db->query($sql);

    }

    public function getPermissionActivePlants(){

        $sql = "select * from `npp`";

        return $this->db->query($sql);

    }

    public function getProtocolActivePlants(){

        $sql = "select * from `npp`";

        return $this->db->query($sql);

    }

    public function getNonActivePlants(){

        $sql = "select * from `npp`";

        return $this->db->query($sql);

    }


    public function getDepartments(){

        $sql = "select * from `departments` where `is_active` = 1 and `id` != 1 order by `name`";

        return $this->db->query($sql);

    }

    public function getClasses(){

        $sql = "select * from `class` where `is_active` = 1 and `id` != 0";

        $result = $this->db->query($sql);

        foreach($result as &$row){
            foreach($row as $name => &$value){
                $value = htmlspecialchars($value);
            }
        }

        return $result;

    }


}