<?php

class ProtocolsHandler extends Handler{

    public function get_defaults(){

        $sql = "select * from `defaults`";
        $result = $this->db->query($sql);
        $list = array();
        if (count($result)){
            foreach ($result as $row){
                $list[$row['name']] = $row['value'];
            }
        }

        return $list;

    }

    public function get_years($params){

        $id = $params;

        $data = array();

        $disabled_years = array_merge($this->getYearsById($id), $this->getYearsById($id, 0));
        $archive_years = $this->getYearsById($id, 0);

        $years_range = $this->get_years_range();

        foreach ($years_range as $year){
            $data[] = array(
                'year' => $year,
                'disabled' => in_array($year, $disabled_years) ? 'disabled' : '',
                'archive' => in_array($year, $archive_years) ? 'archive' : '',
            );
        }

        $this->data = $data;

        return $this->getHTML('years');
    }


    public function get_protocols(){
        return array('by_id' => $this->get_years_by_id(), 'by_year' => $this->get_ids_by_year());
    }

    public function get_years_by_id(){

        $id_list = $this->getIdList();
        $list = array();
        $regular = array();
        $archive = array();
        foreach($id_list as $id){
            $regular[$id] = $this->getYearsById($id);
            $archive[$id] = $this->getYearsById($id, 0);
        }

        $list['regular'] = $regular;
        $list['archive'] = $archive;

        return $list;
    }

    public function get_ids_by_year(){
        $years = $this->get_years_range();
        $list = array();
        $regular = array();
        $archive = array();
        foreach($years as $year){
            $regular[$year] = $this->getIdsByYear($year);
            $archive[$year] = $this->getIdsByYear($year, 0);
        }

        $list['regular'] = $regular;
        $list['archive'] = $archive;

        return $list;
    }



    public function get_units(){
        $sql = "select
                `unit`.`id`,
                `unit`.`short_name` as `unit_name`,
                `npp`.`name` as `npp_name`,
                `npp`.`full_name` as `npp_full_name`
                from `unit` join `npp` on `unit`.`fk_to_npp` = `npp`.`id` order by `unit`.`id`";
        $result = $this->db->query($sql);
        $list = array();
        foreach($result as $row){
            $list[$row['id']] = array(
                'unit_name' => $row['unit_name'],
                'npp_name' => $row['npp_name'],
                'npp_full_name' => $row['npp_full_name']
            );
        }

        return $list;
    }

    public function get_years_range(){

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

    public function get_link($id, $year){

        $sql = "select `link` from `protocol` where `fk_to_unit` = {$id} and `year` = {$year}";
        $result = $this->db->query($sql);
        if (count($result)){
            return $result[0]['link'];
        }
        return false;


    }

    public function create($params){

        if ( !isset($params['id']) || !isset($params['year']) || !isset($params['date']) ){
            return false;
        }

        $id = $params['id'];
        $year = $this->db->escape($params['year']);
        $date = $this->convert_date($this->db->escape($params['date']));

        $sql = "insert into `protocol` (`year`, `fk_to_unit`, `date`) values ({$year}, ${id}, '{$date}')";

        $year_exists = $this->yearExists($year);

        if($this->db->query($sql)){

            if($year_exists){
                $return = array(
                    'refresh' => 'item',
                    'item' => $this->get_list_item(array('id' => $id, 'year' => $year)),
                    'id' => $id,
                    'year' => $year
                );
            } else {
                $return = array(
                    'refresh' => 'panel',
                    'panel' => $this->get_list_panel(array('year' => $year, 'id_list' => $this->getIdsByYear($year))),
                    'id' => $id,
                    'year' => $year
                );
            }
            return $return;
        }

        return false;
    }

    public function get_form_data($params){

        $units_data = $this->get_units();

        if($params == 'first'){
            $year = $this->getMaxYear();
            $id = $this->getMinId($year);

            if(!isset($year) || !isset($id)){
                return false;
            }
        } else {
            $id = $params['id'];
            $year = $params['year'];
        }

        $date = $this->getDate($id, $year);
        $unit_name = $units_data[$id]['unit_name'];


        $form_header = $this->get_form_header($date, $year, $unit_name);

        $this->data['id'] = $id;

        $this->data['year'] = $year;

        $this->data['content'] = array();

        $content = $this->getContent($id, $year);
        if(count($content)){
            foreach($content as $row){

                $form_paragraphs[] = $this->get_form_paragraph($row['paragraph']);
                $form_contents[] = $this->get_form_content($row);
            }

        } else {

            $form_paragraphs[] = $this->get_form_paragraph();
            $form_contents[] = $this->get_form_content();
        }
        array_push($form_paragraphs, $this->getHTML('form_paragraph_empty'));
        array_push($form_contents, $this->getHTML('form_content_empty'));

        return array(
            'form_header' => $form_header,
            'form_paragraphs' => $form_paragraphs,
            'form_contents' => $form_contents,
            'link' => $this->get_link($id, $year),
            'stats' => $this->get_stats(['id' => $id, 'year' => $year]),
            'id' => $id,
            'year' => $year,
            'unit_name' => $unit_name
        );
    }

    public function save_date($params){

        $id = $params['id'];
        $year = $params['year'];
        $date = $params['date'];

        $sql = "update `protocol` set `date` = '{$date}' where `fk_to_unit` = {$id} and `year` = {$year}";

        return $this->db->query($sql);

    }

    public function save_paragraph($params){

        $new = $params['new'];

        if ($new == null){
            return Ajax::getMessage('error', 'paragraph_empty');
        }

        $current = $params['current'];

        $id = $params['id'];
        $year = $params['year'];

        if (!$this->unique($new, $id, $year)){
            return Ajax::getMessage('error', 'paragraph_not_unique');
        }

        if ($current == null){
            $sql = "insert into `protocol_content` (`fk_to_protocol`, `paragraph`) values
                    ((select `id` from `protocol` where `fk_to_unit` = {$id} and `year` = {$year}), '{$new}')";
        } else {

            $sql = "update `protocol_content` join `protocol`
                on `protocol_content`.`fk_to_protocol` = `protocol`.`id`
                set `protocol_content`.`paragraph` = '{$new}'
                where `protocol_content`.`paragraph` = '{$current}'
                and `protocol`.`fk_to_unit` = {$id} and `protocol`.`year` = {$year}";

        }

        return $this->db->query($sql);

    }

    public function save_status($params){
        $id = $params['id'];
        $year = $params['year'];
        $paragraph = $params['paragraph'];
        $status = $params['status'];
        $sql = "update `protocol_content` join `protocol`
                on `protocol_content`.`fk_to_protocol` = `protocol`.`id`
                set `protocol_content`.`status` = {$status}
                where `protocol_content`.`paragraph` = '{$paragraph}'
                and `protocol`.`fk_to_unit` = {$id} and `protocol`.`year` = {$year}";
        return $this->db->query($sql);
    }

    public function save($params){

        if(!isset($params['id']) || !isset($params['year'])){
//            Ajax::setMessage('error');
            return false;
        }

        $id = $params['id'];
        $year = $params['year'];
        $data = $params['data'];


        foreach($data as $p => $array){
            $paragraph = $this->db->escape($p);
            $content = $this->db->escape($array['content']);
            $executive = $this->db->escape($array['executive']);
            $state = $this->db->escape($array['state']);
            $status = $this->db->escape($array['status']);
            $term = $this->db->escape($array['term']);

            $sql = "update `protocol_content` join `protocol`
                    on `protocol_content`.`fk_to_protocol` = `protocol`.`id`
                    set `protocol_content`.`content` = '{$content}',
                        `protocol_content`.`term` = '{$term}',
                        `protocol_content`.`executive` = '{$executive}',
                        `protocol_content`.`status` = '{$status}',
                        `protocol_content`.`state` = '{$state}'
                    where `protocol_content`.`paragraph` = '{$paragraph}'
                    and `protocol`.`fk_to_unit` = {$id} and `protocol`.`year` = {$year}";
            if(!$this->db->query($sql)){
                return false;
            }
        }

        return true;

    }

    public function archive($params){

        $id = $params['id'];
        $year = $params['year'];

        $sql = "update `protocol` set `is_published` = 0 where `fk_to_unit` = {$id} and `year` = {$year}";

        if( $this->db->query($sql) ){
            return array(
                'id' => $id,
                'year' => $year,
                'remove' => count($this->getIdsByYear($year)) ? 'item' : 'panel'
            );
        }

        return false;

    }

    private function getContent($id, $year){

        $sql = "select  `protocol_content`.`paragraph`,
                        `protocol_content`.`content`,
                        DATE_FORMAT(`protocol_content`.`term`,'%d.%m.%Y') as term,
                        `protocol_content`.`executive`,
                        `protocol_content`.`status`,
                        `protocol_content`.`state`
                from `protocol_content` join `protocol`
                on `protocol_content`.`fk_to_protocol` = `protocol`.`id`
                where `protocol`.`year` = {$year} and `protocol`.`fk_to_unit` = {$id} order by `protocol_content`.`paragraph` + 0";

        $result = $this->db->query($sql);

        foreach($result as &$row){
            foreach($row as $name => &$value){
                $value = htmlspecialchars($value);
            }
        }

        function srt($a, $b){
            return strval($a['paragraph']) > strval($b['paragraph']) ? 1 : -1;
        }

        usort($result, "srt");

        return $result;
    }

    public function remove_paragraph($params){
        if(!isset($params['id']) || !isset($params['year']) || !isset($params['paragraph'])){
            return false;
        }

        $id = $params['id'];
        $year = $params['year'];
        $paragraph = $params['paragraph'];

        $sql = "delete from `protocol_content`
                where `fk_to_protocol` = (select `id` from `protocol` where `year` = {$year} and `fk_to_unit` = {$id}) and `protocol_content`.`paragraph` = '{$paragraph}'";

        return $this->db->query($sql);
    }

    public function get_form_header($date, $year, $unit_name){
//        $this->data['heading'] = 'Протокол от '.$date.' по результатам ППР-'.$year.' энергоблока '.$unit_name;
        $this->data['heading'] = $unit_name.' / '.'ППР-'.$year.' (Протокол от '.'<span class = "protocol-header-date" title = "Изменить дату совещания">'.$date.'</span>)';
        return $this->getHTML('form_header');
    }

    public function get_form_paragraph($paragraph = null){

        $this->data['content']['paragraph'] = $paragraph;
        $string = 'par_'.str_replace('.', '_', $paragraph);
        $this->data['content']['data_target'] = '#'.$string;
        $this->data['content']['aria_controls'] = $string;

        return $this->getHTML('form_paragraph');

    }

    public function get_form_content($content = array()){



        if(count($content)){
            $this->data['content'] = $content;

        } else {
            $this->data['content'] = array(
                'paragraph' => '',
                'content' => '',
                'term' => '',
                'status' => 1,
                'executive' => '',
                'state' => ''
            );
        }

        $this->data['content']['id'] = 'par_'.str_replace('.', '_', $this->data['content']['paragraph']);


        return $this->getHTML('form_content');

    }

    public function get_form_templates(){
        return array(
            'paragraph' => $this->get_form_paragraph(),
            'content' => $this->get_form_content(),
            'paragraph_empty' => $this->getHTML('form_paragraph_empty'),
            'content_empty' => $this->getHTML('form_content_empty')
        );
    }

    public function get_list(){

        $this->data['list']['id'] = 'protocol-list';

        $ids_by_year = $this->get_ids_by_year()['regular'];

        $panels = array();

        foreach($ids_by_year as $year => $id_list){
            if(count($id_list)){
                $panels[] = $this->get_list_panel(array('year' => $year, 'id_list' => $id_list));
            }
        }

        $this->data['panels'] = $panels;

        return $this->getHTML('list');

    }

    public function get_list_panel($params){

        $year = $params['year'];
        $id_list = $params['id_list'];

        $list_id = 'protocol-list';
        $panel_heading_id = $list_id.'-'.$year;
        $tabpanel_id = $panel_heading_id.'-'.'collapse';
        $accordion_button_aria_controls = $tabpanel_id;
        $accordion_button_data_target = '#'.$tabpanel_id;
        $accordion_button_data_parent = '#'.$list_id;

        $this->data['panel-heading'] = array(
            'id' => $panel_heading_id
        );
        $this->data['accordion-button'] = array(
            'data-year' =>  $year,
            'aria-controls' => $accordion_button_aria_controls,
            'data-parent' => $accordion_button_data_parent,
            'data-target' => $accordion_button_data_target,
            'text' => 'ППР-'.$year,
            'docs-count' => count($id_list)
        );
        $this->data['tabpanel'] = array(
            'id' => $tabpanel_id,
            'aria-labelledby' => $panel_heading_id
        );

        $list_group = array();
        foreach($id_list as $id){
            $list_group[] = $this->get_list_item(array('id' => $id, 'year' => $year));
        }
        $this->data['list-group'] = $list_group;

        return $this->getHTML('list.panel');

    }

    public function get_list_item($params){

        $this->data['data-id'] = $params['id'];
        $this->data['data-year'] = $params['year'];

        $this->data['name'] = $this->getUnitById($params['id']).' '.'('.$params['year'].')';

        return $this->getHTML('list.item');
    }

    public function get_stats($params){

        $id = $params['id'];
        $year = $params['year'];

        $list = array(
            '0' => array(
                'count' => 0,
                'paragraphs' => array()
            ),
            '1' => array(
                'count' => 0,
                'paragraphs' => array()
            ),
            '2' => array(
                'count' => 0,
                'paragraphs' => array()
            ),
            'total' => array(
                'count' => 0,
                'paragraphs' => array(),
                'content' => array()
            )
        );

        $total = 0;

        $sql = "select `protocol_content`.`status` as status, COUNT(`protocol_content`.`status`) as count
                from `protocol_content` join `protocol` on `protocol`.`id` = `protocol_content`.`fk_to_protocol`
                where `protocol`.`fk_to_unit` = {$id} and `protocol`.`year` = {$year} and (`protocol_content`.`status` in (0, 1, 2))
                group by `protocol_content`.`status`";

        $result = $this->db->query($sql);

        foreach($result as $row){
            $list[$row['status']]['count'] = $row['count'];
            $s = $row['status'];
            $sql = "select `protocol_content`.`paragraph` as paragraph
                    from `protocol_content` join `protocol` on `protocol`.`id` = `protocol_content`.`fk_to_protocol`
                    where `protocol`.`fk_to_unit` = {$id} and `protocol`.`year` = {$year} and (`protocol_content`.`status` = {$s})
                    order by `protocol_content`.`paragraph` + 0";
            $result1 = $this->db->query($sql);
            foreach($result1 as $row1){
                $list[$row['status']]['paragraphs'][] = $row1['paragraph'];
            }

        }

        $sql = "select `protocol_content`.`paragraph` as paragraph, `protocol_content`.`content` as `content`
                from `protocol_content` join `protocol` on `protocol`.`id` = `protocol_content`.`fk_to_protocol`
                where `protocol`.`fk_to_unit` = {$id} and `protocol`.`year` = {$year}
                order by `protocol_content`.`paragraph` + 0";
        $result2 = $this->db->query($sql);
        foreach($result2 as $row2){
            $list['total']['paragraphs'][] = $row2['paragraph'];
            $list['total']['content'][$row2['paragraph']] = !empty($row2['content']) ? htmlspecialchars($row2['content']) : 'Нет условия в пункте '.$row2['paragraph'];
            $total++;
        }

        $list['total']['count'] = $total;

        return $list;

    }


// inner helper functions

    public function getYearsById($id, $is_published = 1){
        if($is_published === false){
            $sql = "select `year` from `protocol` where `fk_to_unit` = {$id} order by `year` desc";
        } else {
            $sql = "select `year` from `protocol` where `is_published` = {$is_published} and `fk_to_unit` = {$id} order by `year` desc";
        }

        $result = $this->db->query($sql);
        $list = array();
        foreach($result as $row){
            $list[] = $row['year'];
        }
        return $list;
    }

    public function getIdsByYear($year, $is_published = 1){
        if($is_published === false){
            $sql = "select `fk_to_unit` as `id` from `protocol` where `year` = {$year} order by `id`";
        } else {
            $sql = "select `fk_to_unit` as `id` from `protocol` where `is_published` = {$is_published} and `protocol`.`year` = {$year} order by `id`";
        }

        $result = $this->db->query($sql);
        $list = array();
        foreach($result as $row){
            $list[] = $row['id'];
        }
        return $list;
    }

    private function yearExists($year){
        return count($this->getIdsByYear($year)) ? true : false;
    }

    private function idExists($id){
        return count($this->getYearsById($id)) ? true : false;
    }

    public function getIdList(){

        $sql = "select `id` from `unit` order by `id`";
        $result = $this->db->query($sql);
        $list = array();
        foreach($result as $row){
            $list[] = $row['id'];
        }

        return $list;
    }

    public function getDate($id, $year){
        $sql = "select DATE_FORMAT(`date`,'%d.%m.%Y') as `date` from protocol where `fk_to_unit` = {$id} and `year` = {$year} limit 1";
        return $this->db->query($sql)[0]['date'];
    }

    public function getMaxYear(){
        $sql = "select MAX(`year`) as `year` from `protocol` where `is_published` = 1";
        $result = $this->db->query($sql);
        $max1 = (int)$result[0]['year'];

        $sql = "select `value` as `max` from `defaults` where `name` = 'max_year'";
        $result = $this->db->query($sql);
        $max2 = $result[0]['max'];
        if ($max2 == 'next'){
            $max2 = date('Y') + 1;
        } else {
            $max2 = (int)$max2;
        }

        return $max1 < $max2 ? $max1 : $max2;

    }

    public function getMinId($year){
        if(!isset($year)){
            return null;
        }
        $sql = "select MIN(`fk_to_unit`) as `id` from `protocol` where `is_published` = 1 and `year` = {$year}";
        return $this->db->query($sql)[0]['id'];
    }

    public function getParagraphs($id, $year){

        $sql = "select `paragraph` from `protocol_content` join `protocol`
                on `protocol_content`.`fk_to_protocol` = `protocol`.`id`
                where `protocol`.`year` = {$year} and `protocol`.`fk_to_unit` = {$id}";

        $list = array();
        $result = $this->db->query($sql);

        foreach ($result as $row){
            $list[] = $row['paragraph'];
        }

        return $list;

    }

    private function getUnitById($id){
        $sql = "select `short_name` from `unit` where `id` = {$id}";
        $result = $this->db->query($sql);

        return $result[0]['short_name'];
    }

    private function unique($par, $id, $year){

        return !in_array($par, $this->getParagraphs($id, $year), true);

    }

    private function convert_date($date){
        return implode('-', array_reverse(explode('.', $date)));
    }

}