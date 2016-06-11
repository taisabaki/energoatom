window.db = {};

window.$DATA = {};
var datepicker_options = {
    dateFormat: "dd.mm.yy",
    altField: "#actualDate",
    firstDay: 1,
    showOtherMonths: true,
    selectOtherMonths: true,
    dayNamesMin: [ "Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб" ],
    monthNames: [ "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь" ]
};

String.prototype.wrapToAttr = function(name){

    return '[' + name + '=' + '"' + this + '"' + ']';
};

Number.prototype.wrapToAttr = function(name){

    return '[' + name + '=' + '"' + this + '"' + ']';
};

String.prototype.convertDate = function(){
    return /\./g.test(this) ? this.split('.').reverse().join('-') : "";
};

String.prototype.emphasize = function(style){ // style = info | primary | danger | success | warning
    return '<strong class = "text-emphasize text-' + style + '">' + this + '</strong>';
};

String.prototype.consoleParagraph = function(){
      return '<span class = "text-emphasize stats-par btn btn-xs">' + this + '</span>';
};

function consoleSentence(html){
    return '<span class = "console-sentence">' + html + '</span>';
}

$.request = function(request_method, request_data, options){ // ajax by default

    var defaults = {
        url: '/ajax/ajax.php?ajax=true',
        data: {
            'request_method': request_method,
            'data': request_data,
            'handler': db.category
        },
        type: 'POST',
        dataType: 'json',
        success: function(data){
            $.extend($DATA, data);
        },
        error: function(  jqXHR, textStatus, errorThrown ){
            console.log(jqXHR.responseText);
            document.write(jqXHR.responseText);
            $('body').append('<a href = "/protocols">Назад</a>');
        }
    };
//    console.log($.extend(defaults, options));
    return $.ajax($.extend(defaults, options));
};

function tion(title, html){

    var defer = $.Deferred();

    $( "<div>" )
        .html(html)
        .dialog({
            resizable: false,

            width: 400,
            modal: true,
            buttons: {
                "Да": function() {
                    defer.resolve(true);
                    $( this ).dialog( "close" );
                },
                'Отмена': function() {
                    defer.resolve(false);
                    $( this ).dialog( "close" );
                }
            },
            title: title,
            close: function () {
                $(this).remove();
                db.pad.data('not-hide', false);
            }

    });
    return defer.promise();
}

function confirmAction(title, html){

    var defer = $.Deferred();

    $('#confirm-confirm-button').one('click', function(){
        $('#output-confirm').modal('hide');
        defer.resolve(true);
    });

    $('#confirm-cancel-button').one('click', function(){
        defer.resolve(false);
    });

    $('#output-confirm')
        .find('.modal-title').html(title).end()
        .find('.modal-body').html(html).end()
        .modal('show');

    return defer.promise();
}

function info(title, html){

    $('#info-confirm-button').one('click', function(){
        $('#output-info').modal('hide');

    });

    $('#output-info')
        .find('.modal-title').html(title).end()
        .find('.modal-body').html(html).end()
        .modal('show');

}

function output_info(title, html, promise){

    if(promise){
        var defer = $.Deferred();
        $('#info-confirm-button').one('click', function(){
            $('#output-info').modal('hide');
            defer.resolve(true);
        });

        $('#output-info')
            .find('.alert-title').html(title).end()
            .find('.alert-message').html(html).end()
            .modal('show');

        return defer.promise();

    }

    $('#info-confirm-button').one('click', function(){
        $('#output-info').modal('hide');

    });

    $('#output-info')
        .find('.alert-title').html(title).end()
        .find('.alert-message').html(html).end()
        .modal('show');


}

function output_alert(title, html){

    $('#info-confirm-button').one('click', function(){
        $('#output-alert').modal('hide');

    });

    $('#output-alert')
        .find('.alert-title').html(title).end()
        .find('.alert-message').html(html).end()
        .modal('show');


}


function output_confirm(title, html){

    var defer = $.Deferred();

    $('#confirm-confirm-button').one('click', function(){
        $('#output-confirm').modal('hide');
        defer.resolve(true);
    });

    $('#confirm-cancel-button').one('click', function(){
        defer.resolve(false);
    });

    $('#output-confirm')
        .find('.alert-title').html(title).end()
        .find('.alert-message').html(html).end()
        .modal('show');

    return defer.promise();
}

function progress(title, html){

    if(title === false){
        $('#output-progress').modal('hide');
        return false;

    }
    $('#output-progress')
        .find('.modal-title').html(title).end()
        .find('.modal-body').html(html).end()
        .modal('show');

}

function trim_paragraph(val){
    return val.replace(/\.{2,}/g, '.').replace(/^\./, '').replace(/\.$/, '');
}

function relative_position(number, numbers){
    var before = [], after = [];
    var n = parseInt(number);
    var v;
    $.each(numbers, function(i, val){
        v = parseInt(val);
        if(n < v){
            after.push(v)
        } else if (n > v) {
            before.push(v)
        }
    });

    if (before.length == 0){
        return 'first';
    }
    if(after.length == 0){
        return 'last';
    }

    var after_min = after[0];

    $.each(after, function(i, val){
        if(after_min > val) after_min = val;
    });

    return after_min;
}

function hold(){
    $('#main-container').addClass('hidden');
    $('body').append('<div class = "overlay">');


}

function release(){
    $('.overlay').remove();
    $('#main-container').removeClass('hidden');

}

function cursor_hold(){
    $('body').append('<div class = "cursor-hold">');
}

function cursor_release(){
    $('.cursor-hold').remove();
}

function onClickAfterFormError(){
    $(document).one('click.pad.error', function(){
        cursor_release();
        db.form.form('release', 'form').form('release', 'service');
    });

}

function onClickAfterPadError(){
    db.pad.data('not-hide', true);
    $(document).one('click.form.error', function(){
        console.log(db.pad.data('elements').highlighted());
        db.pad.data('elements').highlighted().removeClass('not-filled');
        db.pad.data('not-hide', false);
        cursor_release();
    });
}

function highlight(field){
    field.css({'border-color': '#333333', 'border-width': 1}).animate({
        'border-top-color': '#A94442',
        'border-width': '+=1px'
    }, 'fast');
}

function paragraphTextToAttr(val){
    var string = 'par_' + val.replace(/\.+/g, '_');

    return {
        'id': string,
        'aria_controls': string,
        'data_target': '#' + string
    }
}

function contentIdToAttr(val){
    var string = 'par_' + val.replace(/_+/g, '.');

    return {
        'aria_controls': string,
        'data_target': '#' + string
    }
}

function range(start, end){
    var range = [];
    if (end == 'next') end = (new Date).getFullYear() + 1;
    if (start == 'next') start = (new Date).getFullYear() + 1;
    start = parseInt(start);
    end = parseInt(end);

    console.log(start);
    console.log(end);

    if (start < end){
        for (var val = parseInt(start); val <= parseInt(end); val++){
            range.push(val);
        }
    } else {
        for (var val = parseInt(start); val >= parseInt(end); val--){
            range.push(val);
        }
    }


    return range;
}