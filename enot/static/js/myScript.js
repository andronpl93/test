jQuery(function($){

    // редактирование поста или комента, меняем div на textarea и наоборот
    $('.edit').bind('click',function(event){
        if($(this).html()=='Редактировать')
        {
            $(this).siblings('.content').replaceWith(function(){
                        return '<div class="text_edit" style="display:none"> <textarea style="height:'+$(this).height()+
                        'px;width:'+$(this).width()+'px"  >'+$(this).text()+'</textarea><button>Изменить</button></div>';
                        });
        $('.text_edit',$(this).parent()).show(400);
        $(this).html('Отменить')
        }else
        {
            $(this).siblings('.text_edit').replaceWith(function(){
                        return ' <div style="display:none" class="content" ><p>'+$(this).children('textarea').text()+'</p></div>';
                        });
            $('.content',$(this).parent()).show(400);
            $(this).html('Редактировать')
        }
/*
 
        */
    });

});   
















/*csrf_token */   
     
 function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
var csrftoken = getCookie('csrftoken');

    function csrfSafeMethod(method) {
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }
    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        }
    });

     
                    
