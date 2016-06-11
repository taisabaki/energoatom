db.category = 'settings';
release();

db.settings = {

    new_user: {
        container: $('#settings-new-user')
    },
    new_admin: {
        container: $('#settings-new-admin')
    },
    delete_user: {
        container: $('#settings-delete-user')
    },
    restore_user: {
        container: $('#settings-restore-user')
    },
    new_login: {
        container: $('#settings-new-login')
    },
    new_password: {
        container: $('#settings-new-password')
    },
    new_department: {
        container: $('#settings-new-department')
    },
    delete_department: {
        container: $('#settings-delete-department')
    },
    edit_department: {
        container: $('#settings-change-department')
    },
    new_class: {
        container: $('#settings-new-class')
    },
    delete_class: {
        container: $('#settings-delete-class')
    },
    edit_class: {
        container: $('#settings-edit-class')
    },
    years: {
        container: $('#settings-years')
    }

};

$.extend(db.settings.new_user,
    {
        login: db.settings.new_user.container.find('[name = "login"]'),
        name: db.settings.new_user.container.find('[name = "name"]'),
        password: db.settings.new_user.container.find('[name = "password"]'),
        button: db.settings.new_user.container.find('button'),
        fields: db.settings.new_user.container.find('.ajax-data'),
        input: db.settings.new_user.container.find('input')
    }
);

$.extend(db.settings.new_admin,
    {
        login: db.settings.new_admin.container.find('[name = "login"]'),
        name: db.settings.new_admin.container.find('[name = "name"]'),
        password: db.settings.new_admin.container.find('[name = "password"]'),
        admin_login: db.settings.new_admin.container.find('[name = "admin-login"]'),
        admin_password: db.settings.new_admin.container.find('[name = "admin-password"]'),
        button: db.settings.new_admin.container.find('button'),
        fields: db.settings.new_admin.container.find('.ajax-data'),
        input: db.settings.new_admin.container.find('input')
    }
);

$.extend(db.settings.delete_user,
    {
        login: db.settings.delete_user.container.find('[name = "login"]'),
        button: db.settings.delete_user.container.find('button'),
        label: db.settings.delete_user.container.find('label')
    }
);


$.extend(db.settings.restore_user,
    {
        login: db.settings.restore_user.container.find('[name = "login"]'),
        button: db.settings.restore_user.container.find('button'),
        label: db.settings.restore_user.container.find('label')
    }
);

$.extend(db.settings.new_login,
    {
        login: db.settings.new_login.container.find('[name = "login"]'),
        new_login: db.settings.new_login.container.find('[name = "new-login"]'),
        new_name: db.settings.new_login.container.find('[name = "new-name"]'),
        password: db.settings.new_login.container.find('[name = "password"]'),
        fields: db.settings.new_login.container.find('.ajax-data'),
        button: db.settings.new_login.container.find('button'),
        input: db.settings.new_login.container.find('input')
    }
);

$.extend(db.settings.new_password,
    {
        login: db.settings.new_password.container.find('[name = "login"]'),
        old_password: db.settings.new_password.container.find('[name = "old-password"]'),
        new_password: db.settings.new_password.container.find('[name = "new-password"]'),
        fields: db.settings.new_password.container.find('.ajax-data'),
        button: db.settings.new_password.container.find('button'),
        input: db.settings.new_password.container.find('input')
    }
);

$.extend(db.settings.years,
    {
        min: db.settings.years.container.find('[name = "min-year"]'),
        max: db.settings.years.container.find('[name = "max-year"]'),
        button: db.settings.years.container.find('button'),
        input: db.settings.years.container.find('input')
    }
);

$.extend(db.settings.new_department,
    {
        name: db.settings.new_department.container.find('[name = "department-name"]'),
        full_name: db.settings.new_department.container.find('[name = "department-full_name"]'),
        button: db.settings.new_department.container.find('button'),
        fields: db.settings.new_department.container.find('.ajax-data'),
        input: db.settings.new_department.container.find('input')
    }
);

$.extend(db.settings.delete_department,
    {
        name: db.settings.delete_department.container.find('[name = "department-name"]'),
        button: db.settings.delete_department.container.find('button')

    }
);

$.extend(db.settings.edit_department,
    {
        name: db.settings.edit_department.container.find('[name = "department-name"]'),
        new_name: db.settings.edit_department.container.find('[name = "department-new-name"]'),
        new_full_name: db.settings.edit_department.container.find('[name = "department-new-full_name"]'),
        button: db.settings.edit_department.container.find('button'),
        fields: db.settings.edit_department.container.find('.ajax-data'),
        input: db.settings.edit_department.container.find('input')
    }
);

$.extend(db.settings.new_class,
    {
        new_term: db.settings.new_class.container.find('[name = "new-term"]'),
        input: db.settings.new_class.container.find('textarea'),
        button: db.settings.new_class.container.find('button')
    }
);

$.extend(db.settings.delete_class,
    {
        label: db.settings.delete_class.container.find('label'),
        class: db.settings.delete_class.container.find('[name = "class"]'),
        term: db.settings.delete_class.container.find('[name = "term"]'),
        input: db.settings.delete_class.container.find('textarea'),
        button: db.settings.delete_class.container.find('button')
    }
);

$.extend(db.settings.edit_class,
    {
        label: db.settings.edit_class.container.find('label'),
        class: db.settings.edit_class.container.find('[name = "class"]'),
        edit_term: db.settings.edit_class.container.find('[name = "edit-term"]'),
        input: db.settings.edit_class.container.find('textarea'),
        button: db.settings.edit_class.container.find('button')
    }
);

console.log(db);

$(document).on('change', '#settings-archive [name = "document"]', function(){ // archive****************************
    cursor_hold();
    if($(this).val() == -1 || $(this).val() == 'program') {
        cursor_release();
        return false;
    }         // remove check for program when Programs database complete

    $('#settings-archive').find('select').not('[name = "document"], [name = "npp"]').each(function(){
        $(this).find('option[value = "-1"]').prop('selected', true).siblings().remove();
    });

    $('#settings-archive').find('[name = "unit"], [name = "year"], button').prop('disabled', true);

    $.request('get_plants_by_document', $(this).val(), {context: $('#settings-archive')}).done(function(data){
        console.log(data);
        this.find('[name = "npp"]').html(data.plants_by_document.html).prop('disabled', data.plants_by_document.disabled);
        cursor_release();
    });

}).on('change', '#settings-archive [name = "npp"]', function(){
    cursor_hold();
    $('#settings-archive').find('select').not('[name = "document"], [name = "npp"], [name = "unit"]').each(function(){
        $(this).find('option[value = "-1"]').prop('selected', true).siblings().remove();
    });

    $('#settings-archive').find('[name = "year"], button').prop('disabled', true);

    $.request('get_units_by_plant_and_document', {document: $('#settings-archive').find('[name = "document"]').val(), plant: $(this).val()}, {context: $('#settings-archive')}).done(function(data){
        console.log(data);
        if(data.units_by_plant_and_document.disabled){
            cursor_release();
            $('#settings-archive [name = "document"]').trigger('change');
            return false;
        }
        this.find('[name = "unit"]').html(data.units_by_plant_and_document.html).prop('disabled', data.units_by_plant_and_document.disabled);
        cursor_release();

    });

}).on('change', '#settings-archive [name = "unit"]', function(){
    cursor_hold();
    $.request('get_years_by_plant_and_unit_and_document', {document: $('#settings-archive').find('[name = "document"]').val(), plant: $('#settings-archive').find('[name = "npp"]').val(), unit: $(this).val()}, {context: $('#settings-archive')}).done(function(data){
        console.log(data);

        if(data.years_by_plant_and_unit_and_document.disabled){
            cursor_release();
            $('#settings-archive [name = "npp"]').trigger('change');
            return false;
        }

        this.find('[name = "year"]').html(data.years_by_plant_and_unit_and_document.html).prop('disabled', data.years_by_plant_and_unit_and_document.disabled);
        this.find('[name = "unit"]').prop('disabled', data.years_by_plant_and_unit_and_document.disabled);
        this.find('button').prop('disabled', true);
        cursor_release();
    });

}).on('change', '#settings-archive [name = "year"]', function(){

    $('#settings-archive').find('button').prop('disabled', false);

}).on('click', '#settings-archive button', function(){
    cursor_hold();
    var section = $('#settings-archive');

    $.request('restore_from_archive', {id: section.find('[name = "unit"]').val(), year: section.find('[name = "year"]').val(), document: section.find('[name = "document"]').val()}).done(function(data){
        console.log(data.restore_from_archive);
        if(data.restore_from_archive.complete){
            cursor_release();
            output_info('Восстановление из архива', data.restore_from_archive.message);
            section.find('[name = "unit"]').trigger('change');
            return false;
        } else {
            cursor_release();
            output_alert('Восстановление из архива', data.restore_from_archive.message);
            section.find('[name = "unit"]').trigger('change');
            return false;
        }

    });
                                                                            // archive end ***************************
}).on('click', db.settings.years.button.selector, function(){                       // years **********************************

    cursor_hold();

    var min = db.settings.years.min;
    var max = db.settings.years.max;

    if (parseInt(min.val()) >= parseInt(max.val()) && max.val() != 'next'){
        cursor_release();
        output_alert('Изменение диапазона ППР', 'Неправильные значения. Минимальное значение должно быть выше максимального.');
        return false;
    }

    if (parseInt(min.val()) >= (new Date()).getFullYear() + 1 && max.val() == 'next'){
        cursor_release();
        output_alert('Изменение диапазона ППР', 'Неправильные значения. Минимальное значение должно быть выше максимального.');
        return false;
    }

    if (parseInt(min.val()) <= 1950 || parseInt(max.val()) >= 2200){
        cursor_release();
        output_alert('Изменение диапазона ППР', 'Неправильные значения. Границы диапазона: от <strong>1950</strong> до <strong>2200</strong>.');
        return false;
    }

    if(!min.val() || !max.val() || ( /[^0-9]/.test(max.val()) && max.val() != 'next' ) ) {
        cursor_release();
        return false;
    }

    $.request('set_years_range', {min: min.val(), max: max.val()}).done(function(data){

        if(data.set_years_range.complete){
            min.val('');
            max.val('');
            db.settings.years.button.prop('disabled', true);
            output_info('Изменение диапазона ППР', data.set_years_range.message);
            cursor_release();
        } else {
            min.val('');
            max.val('');
            db.settings.years.button.prop('disabled', true);
            output_alert('Изменение диапазона ППР', data.set_years_range.message);
            cursor_release();
        }


    });

}).on('keypress', db.settings.years.min.selector, function(){

    var range = [48, 49, 50, 51, 52, 53, 54, 55, 56, 57];

    if ($.inArray(event.keyCode, range) == -1){
        return false;
    } else {
        console.log(event.keyCode);
    }

}).on('keypress', db.settings.years.max.selector, function(){

    var range1 = [101, 110, 116, 120];
    var range2 = [48, 49, 50, 51, 52, 53, 54, 55, 56, 57];

    if ($.inArray(event.keyCode, range1) != -1) {
        $(this).val('next');
        return false;
    } else if ($.inArray(event.keyCode, range2) == -1) {
        return false;
    } else if ($.inArray(event.keyCode, range2) != -1 && $(this).val() == 'next') {
        $(this).val(String.fromCharCode(event.keyCode));
        return false;
    } else if ($.inArray(event.keyCode, range2) != -1 && /[next]/.test($(this).val())){
        $(this).val(String.fromCharCode(event.keyCode));
        return false;
    }


}).on('keyup blur', db.settings.years.min.selector + ', ' + db.settings.years.max.selector, function(){

    if(db.settings.years.min.val().length != 4 || db.settings.years.max.val().length != 4){

        db.settings.years.button.prop('disabled', true);

    } else {
        db.settings.years.button.prop('disabled', false);
    }                                                                              // years end******************************

}).on('keyup blur', 'input[name = "login"], input[name = "new-login"], input[name = "admin-login"]', function(){

    if($(this).val().match(/[^A-Za-z0-9_]/g)){

        $(this).val($(this).val().replace(/[^A-Za-z0-9_]/g, ''));
        return false;
    }

}).on('click', db.settings.new_user.button.selector, function(){                 // new user *******************************
    cursor_hold();
    var valid = true;

    db.settings.new_user.fields.each(function(){
        if (!$(this).val()){
            valid = false;
            return false;
        }
    });

    if (!valid){
        cursor_release();
        output_alert('Создание пользователя', 'Нельзя создать пользователя. Есть не заполненные поля.');
        return false;
    }

    var login = db.settings.new_user.login.val();

    $.request('create_user', {login: db.settings.new_user.login.val(), name: db.settings.new_user.name.val(), password: db.settings.new_user.password.val()}).done(function(data){
        if(data.create_user.complete){

            db.settings.delete_user.label.removeClass('disabled');
            db.settings.delete_user.login.prop('disabled', false);

            db.settings.delete_user.login.html(data.create_user.active_users);
            db.settings.new_login.login.html(data.create_user.admins_and_users);
            db.settings.new_password.login.html(data.create_user.admins_and_users);

            cursor_release();
            output_info('Создание пользователя', data.create_user.message);
            db.settings.new_user.input.val('');
            db.settings.new_user.button.prop('disabled', true);

        } else {
            cursor_release();
            output_alert('Создание пользователя', data.create_user.message);

        }
    });



}).on('keyup blur', db.settings.new_user.login.selector + ', ' + db.settings.new_user.name.selector + ', ' + db.settings.new_user.password.selector, function(){

    if(db.settings.new_user.login.val().length == 0 || db.settings.new_user.name.val().length == 0 || db.settings.new_user.password.val().length == 0){

        db.settings.new_user.button.prop('disabled', true);

    } else {
        db.settings.new_user.button.prop('disabled', false);
    }                                                                                // new user end *****************

}).on('click', db.settings.new_admin.button.selector, function(){                   // new admin *********************
    cursor_hold();
    var valid = true;

    db.settings.new_admin.fields.not('[name = "admin_login"]').each(function(){
        if (!$(this).val()){
            valid = false;
            return false;
        }
    });

    if (db.settings.new_admin.admin_login.val() == -1){
        valid = false;
    }

    if (!valid){
        cursor_release();
        output_alert('Новый администратор', 'Нельзя создать пользователя. Есть не заполненные поля.');
        return false;
    }

    var login = db.settings.new_admin.login.val();

    $.request('create_admin', {login: db.settings.new_admin.login.val(), name: db.settings.new_admin.name.val(), password: db.settings.new_admin.password.val(), admin_login: db.settings.new_admin.admin_login.val(), admin_password: db.settings.new_admin.admin_password.val()}).done(function(data){
        if(data.create_admin.complete){
            db.settings.new_admin.admin_login.html(data.create_admin.admins);
            db.settings.new_login.login.html(data.create_admin.admins_and_users);
            db.settings.new_password.login.html(data.create_admin.admins_and_users);

            cursor_release();
            output_info('Новый администратор', data.create_admin.message);
            db.settings.new_admin.input.val('');
            db.settings.new_admin.admin_login.find('option[value = "-1"]').prop('selected', true);
            db.settings.new_admin.button.prop('disabled', true);
        } else {
            cursor_release();
            output_alert('Новый администратор', data.create_admin.message);

        }
    });

}).on('keyup blur change', db.settings.new_admin.login.selector + ', ' + db.settings.new_admin.name.selector + ', ' + db.settings.new_admin.password.selector + ', ' + db.settings.new_admin.admin_login.selector + ', ' + db.settings.new_admin.admin_password.selector, function(){

    if(db.settings.new_admin.login.val().length == 0 || db.settings.new_admin.name.val().length == 0 || db.settings.new_admin.password.val().length == 0 || db.settings.new_admin.admin_login.val() == -1 || db.settings.new_admin.admin_password.val().length == 0){

        db.settings.new_admin.button.prop('disabled', true);

    } else {
        db.settings.new_admin.button.prop('disabled', false);
    }                                                                                // new admin end *****************

}).on('click', db.settings.delete_user.button.selector, function(){                 // delete user ********************
    cursor_hold();
    if (db.settings.delete_user.login.val() == -1){
        cursor_release();
        output_alert('Удаление пользователя', 'Нельзя удалить пользователя. Пользователь не выбран.');
    }

    var login = db.settings.delete_user.login.val();

    $.request('delete_user', {login: db.settings.delete_user.login.val()}).done(function(data){
        if (data.delete_user.complete){

            db.settings.restore_user.label.removeClass('disabled');
            db.settings.restore_user.login.prop('disabled', false);
            db.settings.delete_user.button.prop('disabled', true);

            db.settings.restore_user.login.html(data.delete_user.non_active_users);
            db.settings.delete_user.login.html(data.delete_user.active_users);
            db.settings.new_login.login.html(data.delete_user.admins_and_users);
            db.settings.new_password.login.html(data.delete_user.admins_and_users);

            if(db.settings.delete_user.login.find('option').length == 1){
                db.settings.delete_user.label.addClass('disabled');
                db.settings.delete_user.login.prop('disabled', true);

            }

            cursor_release();

            output_info('Удаление пользователя', data.delete_user.message);
        } else {
            cursor_release();
            output_alert('Удаление пользователя', data.delete_user.message);
        }
    });

}).on('blur change', db.settings.delete_user.login.selector , function(){

    if(db.settings.delete_user.login.val() == -1){

        db.settings.delete_user.button.prop('disabled', true);

    } else {
        db.settings.delete_user.button.prop('disabled', false);
    }                                                                                // delete user end *****************

}).on('click', db.settings.restore_user.button.selector, function(){                 // restore user ********************
    cursor_hold();
    if (db.settings.restore_user.login.val() == -1){
        cursor_release();
        output_alert('Возобновление пользователя', 'Нельзя возобновить пользователя. Пользователь не выбран.');
    }

    var login = db.settings.restore_user.login.val();

    $.request('restore_user', {login: db.settings.restore_user.login.val()}).done(function(data){
        if (data.restore_user.complete){

            db.settings.delete_user.label.removeClass('disabled');
            db.settings.delete_user.login.prop('disabled', false);
            db.settings.restore_user.button.prop('disabled', true);

            db.settings.restore_user.login.html(data.restore_user.non_active_users);
            db.settings.delete_user.login.html(data.restore_user.active_users);
            db.settings.new_login.login.html(data.restore_user.admins_and_users);
            db.settings.new_password.login.html(data.restore_user.admins_and_users);

            if(db.settings.restore_user.login.find('option').length == 1){
                db.settings.restore_user.label.addClass('disabled');
                db.settings.restore_user.login.prop('disabled', true);

            }

            cursor_release();

            output_info('Удаление пользователя', data.restore_user.message);

        } else {

            cursor_release();
            output_alert('Удаление пользователя', data.restore_user.message);

        }
    });

}).on('blur change', db.settings.restore_user.login.selector , function(){

    if(db.settings.restore_user.login.val() == -1){

        db.settings.restore_user.button.prop('disabled', true);

    } else {
        db.settings.restore_user.button.prop('disabled', false);
    }                                                                                // restore user end *****************

}).on('click', db.settings.new_login.button.selector, function(){                   // new login **********************
    cursor_hold();

    var valid = true;

    if(db.settings.new_login.login.val() == -1 || (db.settings.new_login.new_login.val().length == 0 && db.settings.new_login.new_name.val().length == 0) || db.settings.new_login.password.val().length == 0){
        valid = false;
    }

    if (!valid){
        cursor_release();
        output_alert('Переименование пользователя', 'Нельзя переименовать пользователя. Есть не заполненные поля.');
        return false;
    }

    var login = db.settings.new_login.login.val();

    $.request('new_login', {login: db.settings.new_login.login.val(), new_login: db.settings.new_login.new_login.val(), new_name: db.settings.new_login.new_name.val(), password: db.settings.new_login.password.val()}).done(function(data){
console.log(data);
        if(data.new_login.complete){
            if(data.new_login.refresh){
                cursor_release();
                output_info('Переименование пользователя', data.new_login.message, true).then(function(){
                    location.reload();
                });

            } else{
                db.settings.restore_user.login.html(data.new_login.non_active_users);
                db.settings.delete_user.login.html(data.new_login.active_users);
                db.settings.new_login.login.html(data.new_login.admins_and_users);
                db.settings.new_password.login.html(data.new_login.admins_and_users);

                db.settings.new_login.login.find('option[value = "-1"]').prop('selected', true);
                db.settings.new_login.container.find('input').val('');
                db.settings.new_login.button.prop('disabled', true);

                cursor_release();

                output_info('Переименование пользователя', data.new_login.message);
            }

        } else {
            cursor_release();
            output_alert('Переименование пользователя', data.new_login.message);
            return false;
        }

    });


}).on('keyup blur change', db.settings.new_login.login.selector + ', ' + db.settings.new_login.new_login.selector + ', ' + db.settings.new_login.new_name.selector + ', ' + db.settings.new_login.password.selector, function(){

    if(db.settings.new_login.login.val() == -1 || (db.settings.new_login.new_login.val().length == 0 && db.settings.new_login.new_name.val().length == 0) || db.settings.new_login.password.val().length == 0){

        db.settings.new_login.button.prop('disabled', true);

    } else {

        db.settings.new_login.button.prop('disabled', false);

    }                                                                           // new login end *******************

}).on('click', db.settings.new_password.button.selector, function(){                   // new password **********************
    cursor_hold();

    var valid = true;

    if(db.settings.new_password.login.val() == -1 || db.settings.new_password.new_password.val().length == 0 || db.settings.new_password.old_password.val().length == 0){
        valid = false;
    }

    if (!valid){
        cursor_release();
        output_alert('Смена пароля', 'Нельзя сменить пароль. Есть не заполненные поля.');
        return false;
    }

    var login = db.settings.new_password.login.val();

    $.request('new_password', {login: db.settings.new_password.login.val(), old_password: db.settings.new_password.old_password.val(), new_password: db.settings.new_password.new_password.val()}).done(function(data){
        console.log(data);
        if(data.new_password.complete){
            cursor_release();

            output_info('Смена пароля', data.new_password.message);
            db.settings.new_password.input.val('');
            db.settings.new_password.login.find('option[value = "-1"]').prop('selected', true);
            db.settings.new_password.button.prop('disabled', true);

        } else {
            cursor_release();
            output_alert('Смена пароля', data.new_password.message);
            return false;
        }

    });


}).on('keyup blur change', db.settings.new_password.login.selector + ', ' + db.settings.new_password.old_password.selector + ', ' + db.settings.new_password.new_password.selector, function(){

    if(db.settings.new_password.login.val() == -1 || db.settings.new_password.new_password.val().length == 0 || db.settings.new_password.old_password.val().length == 0){

        db.settings.new_password.button.prop('disabled', true);

    } else {

        db.settings.new_password.button.prop('disabled', false);

    }                                                                           // new password end *******************

}).on('click', db.settings.new_department.button.selector, function(){                   // new department **********************
    cursor_hold();

    var valid = true;

    if(db.settings.new_department.name.val().length == 0 || db.settings.new_department.full_name.val().length == 0){
        valid = false;
    }

    if (!valid){
        cursor_release();
        output_alert('Добавление подразделения', 'Нельзя добавить подразделение. Есть не заполненные поля.');
        return false;
    }

    $.request('new_department', {name: db.settings.new_department.name.val(), full_name: db.settings.new_department.full_name.val()}).done(function(data){
        console.log(data);
        if(data.new_department.complete){
            cursor_release();

            output_info('Добавление подразделения', data.new_department.message);
            db.settings.new_department.input.val('');
            db.settings.delete_department.name.html(data.new_department.departments);
            db.settings.edit_department.name.html(data.new_department.departments);
            db.settings.new_department.button.prop('disabled', true);
        } else {
            cursor_release();
            output_alert('Добавление подразделения', data.new_department.message);
            return false;
        }

    });


}).on('keyup blur', db.settings.new_department.name.selector + ', ' + db.settings.new_department.full_name.selector, function(){

    db.settings.new_department.button.prop('disabled', function(){
        return db.settings.new_department.name.val().length == 0 || db.settings.new_department.full_name.val().length == 0
    });
                                                                                 // new department end *******************

}).on('click', db.settings.delete_department.button.selector, function(){                   // delete department **********************

    cursor_hold();

    var valid = true;

    if(db.settings.delete_department.name.val()== -1){
        valid = false;
    }

    if (!valid){
        cursor_release();
        output_alert('Удаление подразделения', 'Нельзя удалить подразделение. Не выбрано подразделение.');
        return false;
    }

    $.request('delete_department', {id: db.settings.delete_department.name.val()}).done(function(data){
        console.log(data);
        if(data.delete_department.complete){
            cursor_release();

            output_info('Удаление подразделения', data.delete_department.message);
            db.settings.delete_department.name.html(data.delete_department.departments);
            db.settings.edit_department.name.html(data.delete_department.departments);
            db.settings.delete_department.button.prop('disabled', true);
        } else {
            cursor_release();
            output_alert('Удаление подразделения', data.delete_department.message);
            return false;
        }

    });


}).on('blur change', db.settings.delete_department.name.selector, function(){

    db.settings.delete_department.button.prop('disabled', function(){
        return db.settings.delete_department.name.val()== -1;
    });                                                                         // delete department end *******************

}).on('click', db.settings.edit_department.button.selector, function(){                   // change department **********************

    cursor_hold();

    var valid = true;

    if(db.settings.edit_department.name.val()== -1 || (db.settings.edit_department.new_name.val().length == 0 && db.settings.edit_department.new_full_name.val().length == 0)){
        valid = false;
    }

    if (!valid){
        cursor_release();
        output_alert('Редактирование подразделения', 'Нельзя отредактировать подразделение. Не выбрано подразделение.');
        return false;
    }

    $.request('edit_department', {id: db.settings.edit_department.name.val(), new_name: db.settings.edit_department.new_name.val(), new_full_name: db.settings.edit_department.new_full_name.val()}).done(function(data){
        console.log(data);
        if(data.edit_department.complete){
            cursor_release();

            output_info('Редактирование подразделения', data.edit_department.message);
            db.settings.delete_department.name.html(data.edit_department.departments);
            db.settings.edit_department.name.html(data.edit_department.departments);
            db.settings.edit_department.input.val('');
            db.settings.edit_department.button.prop('disabled', true);
        } else {
            cursor_release();
            output_alert('Редактирование подразделения', data.edit_department.message);
            return false;
        }

    });


}).on('blur change keyup', db.settings.edit_department.name.selector + ', ' + db.settings.edit_department.new_name.selector + ', ' + db.settings.edit_department.new_full_name.selector, function(){

    db.settings.edit_department.button.prop('disabled', function(){
        return db.settings.edit_department.name.val()== -1 || (db.settings.edit_department.new_name.val().length == 0 && db.settings.edit_department.new_full_name.val().length == 0);
    });                                                                         // change department end *******************

}).on('click', db.settings.new_class.button.selector, function(){               // new class ***************************

    cursor_hold();

    var valid = true;

    if (db.settings.new_class.new_term.val().length == 0){
        valid = false;
    }

    if (!valid){
        cursor_release();
        output_alert('Добавление отраслевого условия', 'Сначала введите условие.');
        return false;
    }

    $.request('new_class', {new_term: db.settings.new_class.new_term.val()}).done(function(data){
        console.log(data);
        if(data.new_class.complete){
            cursor_release();

            output_info('Добавление отраслевого условия', data.new_class.message);
            db.settings.delete_class.class.html(data.new_class.classes);
            db.settings.edit_class.class.html(data.new_class.classes);
            db.settings.new_class.input.val('');
            db.settings.new_class.button.prop('disabled', true);

            if(db.settings.delete_class.class.find('option').length <= 1){
                db.settings.delete_class.label.addClass('disabled');
                db.settings.delete_class.class.prop('disabled', true);
                db.settings.edit_class.label.addClass('disabled');
                db.settings.edit_class.class.prop('disabled', true);
            } else {
                db.settings.delete_class.label.removeClass('disabled');
                db.settings.delete_class.class.prop('disabled', false);
                db.settings.edit_class.label.removeClass('disabled');
                db.settings.edit_class.class.prop('disabled', false);
            }

            db.settings.delete_class.class.trigger('change');
            db.settings.edit_class.class.trigger('change');

            db.settings.delete_class.button.prop('disabled', true);
            db.settings.edit_class.button.prop('disabled', true);

        } else {
            cursor_release();
            output_alert('Добавление отраслевого условия', data.new_class.message);
            return false;
        }
    });


}).on('blur keyup', db.settings.new_class.new_term.selector, function(){
    db.settings.new_class.button.prop('disabled', function(){
        return db.settings.new_class.new_term.val().length == 0;
    });                                                                 // new class end***************************
}).on('click', db.settings.delete_class.button.selector, function(){    // delete class ****************************

    cursor_hold();

    var valid = true;

    if (db.settings.delete_class.class.val() == -1){
        valid = false;
    }

    if (!valid){
        cursor_release();
        output_alert('Удаление отраслевого условия', 'Сначала выберите условие.');
        return false;
    }

    $.request('delete_class', {id: db.settings.delete_class.class.val()}).done(function(data){
        console.log(data);
        if(data.delete_class.complete){
            cursor_release();

            output_info('Удаление отраслевого условия', data.delete_class.message);
            db.settings.delete_class.class.html(data.delete_class.classes);
            db.settings.edit_class.class.html(data.delete_class.classes);

            if(db.settings.delete_class.class.find('option').length <= 1){
                db.settings.delete_class.label.addClass('disabled');
                db.settings.delete_class.class.prop('disabled', true);
                db.settings.edit_class.label.addClass('disabled');
                db.settings.edit_class.class.prop('disabled', true);
            } else {
                db.settings.delete_class.label.removeClass('disabled');
                db.settings.delete_class.class.prop('disabled', false);
                db.settings.edit_class.label.removeClass('disabled');
                db.settings.edit_class.class.prop('disabled', false);
            }

            db.settings.delete_class.class.trigger('change');
            db.settings.edit_class.class.trigger('change');

            db.settings.delete_class.button.prop('disabled', true);
            db.settings.edit_class.button.prop('disabled', true);

        } else {
            cursor_release();
            output_alert('Удаление отраслевого условия', data.delete_class.message);
            return false;
        }
    });

}).on('change', db.settings.delete_class.class.selector, function(){
    cursor_hold();
    db.settings.delete_class.button.prop('disabled', function(){
        return db.settings.delete_class.class.val() == -1;
    });

    if($(this).val() == -1){
        db.settings.delete_class.term.val('');
        cursor_release();
        return false;
    }
    $.request('get_term', {id: $(this).val()}).done(function(data){
        console.log(data);
        db.settings.delete_class.term.val(data.term);
        cursor_release();
    });


                                                                     // delete class end***************************
}).on('click', db.settings.edit_class.button.selector, function(){    // edit class ****************************

    cursor_hold();

    var valid = true;

    if (db.settings.edit_class.class.val() == -1 || db.settings.edit_class.edit_term.val().length == 0){
        valid = false;
    }

    if (!valid){
        cursor_release();
        output_alert('Редактирование отраслевого условия', 'Нельзя отредактировать условие. Есть незаполненные поля.');
        return false;
    }

    $.request('edit_class', {id: db.settings.edit_class.class.val(), edit_term: db.settings.edit_class.edit_term.val()}).done(function(data){
        console.log(data);
        if(data.edit_class.complete){
            cursor_release();

            output_info('Редактирование отраслевого условия', data.edit_class.message);
            db.settings.delete_class.class.html(data.edit_class.classes);
            db.settings.edit_class.class.html(data.edit_class.classes);

            if(db.settings.delete_class.class.find('option').length <= 1){
                db.settings.delete_class.label.addClass('disabled');
                db.settings.delete_class.class.prop('disabled', true);
                db.settings.edit_class.label.addClass('disabled');
                db.settings.edit_class.class.prop('disabled', true);
            } else {
                db.settings.delete_class.label.removeClass('disabled');
                db.settings.delete_class.class.prop('disabled', false);
                db.settings.edit_class.label.removeClass('disabled');
                db.settings.edit_class.class.prop('disabled', false);
            }

            db.settings.delete_class.class.trigger('change');
            db.settings.edit_class.class.trigger('change');

            db.settings.delete_class.button.prop('disabled', true);
            db.settings.edit_class.button.prop('disabled', true);

        } else {
            cursor_release();
            output_alert('Удаление отраслевого условия', data.edit_class.message);
            return false;
        }
    });

}).on('change', db.settings.edit_class.class.selector, function(){

    cursor_hold();

    if($(this).val() == -1){
        db.settings.edit_class.edit_term.val('');
        cursor_release();
        return false;
    }

    $.request('get_term', {id: $(this).val()}).done(function(data){
        console.log(data);
        db.settings.edit_class.edit_term.val(data.term);
        db.settings.edit_class.button.prop('disabled', function(){
            return db.settings.edit_class.class.val() == -1 || db.settings.edit_class.edit_term.val().length == 0;
        });
        cursor_release();
    });



}).on('blur keyup', db.settings.edit_class.edit_term.selector, function(){

    db.settings.edit_class.button.prop('disabled', function(){
        return db.settings.edit_class.class.val() == -1 || db.settings.edit_class.edit_term.val().length == 0;
    });

                                                                   // edit class end***************************
});

