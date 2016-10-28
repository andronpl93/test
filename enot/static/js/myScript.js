jQuery(function($){
		var obj={
				type:'POST',
				timeout:5000,
				error:function(){
					alert('Произошла какая-то ошибка. Ну хз, попробуйте еще раз');
					},
			}	
	
	$('#add_comm_form').hide();	// Прячем форму добавления комментов, она шаблон, потом будет перемещаться по дереву

    $('body > div ').load('/load_content/');
	// редактирование поста или комента, меняем div на textarea и наоборот, но ничего не отправляем на сервер
	$('body').on('click','.edit',function(event){
		if($(this).html()=='Редактировать')
		{
			$(this).siblings('.content').replaceWith(function(){
						return '<div class="text_edit" style="display:none"><textarea style="height:'+$(this).height()+
						'px;width:'+$(this).width()+'px" >'+$(this).children('pre').text()+'</textarea><button class="edit_btn">Изменить</button></div>';
						});
			$('.text_edit',$(this).parent()).show(400);
			$(this).html('Отменить')
		}else
		{  
			esc_edit(this);
		}
	});
	// Изменение сообщения или комментария. 
	 $('body').on('click','.edit_btn', function (){
		elem=$(this).parent().siblings('.edit');
		 obj.data= {'text'   : $(this).siblings('textarea').val(),
					'id_mass'	 : $(this).parent().parent().parent().attr('data-mass-id'),
					'id_comm'	 : $(this).parent().parent().attr('data-comm-id'),
					}
		 obj.success= function(data){
					esc_edit(elem);
					}
		 obj.url='/edit/';   

		$.ajax(obj);  
	 });
	 // Перемещение формы комментирования
	 $('body').on('click','.add_comm_btn', function (){
        if ($(this).attr('data-index')=='0')
        {   
            $(this).text('Отменить');
            $(this).attr('data-index','1');    
            elem=$("#add_comm_form");
            ecc=elem.children('div').children('input');
            if(elem.parent().attr('data-mass-id')){
                $(this).parent().append(elem);
                ecc.attr('name','mass');
                ecc.attr('value',elem.parent().parent().attr('data-mass-id'));
            }
            else{
                $(this).after(elem);
                ecc.attr('name','comm');
                ecc.attr('value',elem.parent().attr('data-comm-id'));
            }
            elem.show(200);
		}
        else
        {
            $(this).text('Комментировать');
            $("#add_comm_form").hide(200)
            $(this).attr('data-index','0');
        }
	 });
	 
	 // Кнопка "Показать/Скрыть комментарии"
	 $('body').on('click','.show_comm',function(){
         elem=$(this)
         // Загружаем с сервера если показываем первый раз
         if (elem.attr('data-index')=='0')
         {  
            elem.text(elem.text().replace('Показать','Скрыть'));
            elem.attr('data-index','1');
            obj.data= {'id_mass': $(this).parent().parent().attr('data-mass-id')}
            obj.success= function(data){
					elem.parent().parent().append(data);
					}
            obj.url='/show_comm/';   
            $.ajax(obj);  
		 }
         else
         {
           // Скрываем коменты
            if (elem.attr('data-index')=='1')
            {
                elem.text(elem.text().replace('Скрыть','Показать'));
                $('.comment',elem.parent().parent()).hide(200);
                elem.attr('data-index','2');
            }//Показываем, если до этого они были скрыты
            else 
            {  
                elem.text(elem.text().replace('Показать','Скрыть'));
                $('.comment',elem.parent().parent()).show(200);
                elem.attr('data-index','1');
            }
         }

	 });
        index = false;
        scr=true

        $(window).scroll(function() {
            if($(window).scrollTop() + $(window).height() > $(document).height()*0.7 && !index ) {
                index = true;
                if (scr)
                {
                    $.get('/load_content/',function(data){
                        $('body > div ').append(data);
                        index=false;
                        if (data=='')   //когда сервер начинает возвращать пустые вопросы - перестаем спрашивать
                            scr=false;
                    });
                }

                
            
            }       
        });
        
     
     
     
});   






function esc_edit(elem){
			text=$(elem).siblings('.text_edit').children('textarea').val();
			$(elem).siblings('.text_edit').replaceWith(function(){
						return ' <div style="display:none" class="content" ><pre>'+escapeHtml(text)+'</pre></div>';
						});
			$('.content',$(elem).parent()).show(400);
			$(elem).html('Редактировать')
}


/// экранирование
function escapeHtml(text) {
  return text
	  .replace(/&/g, "&amp;")
	  .replace(/</g, "&lt;")
	  .replace(/>/g, "&gt;")
	  .replace(/"/g, "&quot;")
	  .replace(/'/g, "&#039;");
}





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

	 
					
