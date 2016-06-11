<?php

class StartPage extends Model{

    public function getYearsRange(){
        $sql = "select (select `value` from defaults where `name` = 'min_year') as min, (select `value` from defaults where `name` = 'max_year') as max;";
        $result = $this->db->query($sql);
        $min = (int)$result[0]['min'];
        $max = $result[0]['max'];

        if($max == 'next'){
            $max = date('Y') + 1;
        } else {
            $max = (int)$max;
        }

        return range($max, $min);
    }

}