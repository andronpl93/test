jQuery(function($){
	load=0;
		var obj={
				type:'POST',
				timeout:5000,
				error:function(){
					alert('Произошла какая-то ошибка. Ну хз, попробуйте еще раз');
					},
			}	
	
	$('#add_comm_form').hide();	// Прячем форму добавления комментов, она шаблон, потом будет перемещаться по дереву

	// Грузим в ленту первую десятку сообщений
	$.get('/load_content/',function(data){

		$('body > div ').append(data);
	});
	
	
	///Так как всё на свете грузится динамически, нужно вешать события на элементы которых еще нет, по этому делегируем body
	$('body').bind('click',function(event){
		
		
		
		// редактирование поста или комента, меняем div на textarea и наоборот, но ничего не отправляем на сервер
		if (event.target.className=='edit'){
			thi=$(event.target);
			if(thi.html()=='Редактировать')
			{   
				thi.siblings('.content').replaceWith(function(){
							return '<div class="text_edit" style="display:none"><textarea required  style="height:'+$(this).height()+
							'px;width:'+$(this).width()*0.98+'px" >'+$(this).text()+'</textarea><button class="edit_btn">Изменить</button></div>';
							});
				$('.text_edit',thi.parent()).show(400);
				thi.html('Отменить');
			}else
			{  
				esc_edit(thi);
			}   
		}
		
		
		
		// Изменение сообщения или комментария. 
		if(event.target.className=='edit_btn'){
			 thi=$(event.target);
			 elem=thi.parent().siblings('.edit');
			 obj.data= {'text'   : thi.siblings('textarea').val(),
						'id_mass'	 : thi.parent().parent().parent().attr('data-mass-id'),
						'id_comm'	 : thi.parent().parent().attr('data-comm-id'),
						}
			 obj.success= function(data){
						esc_edit(elem);
						}
			 obj.url='/edit/';   

			$.ajax(obj); 
				
			
		}
		
		
		
		 // Перемещение формы комментирования
		if(event.target.className=='add_comm_btn'){
			thi=$(event.target);
			if (thi.attr('data-index')=='0')		   //Нажатие на кнопку в состоянии "Комментировать"
			{   
				$('.add_comm_btn[data-index="1"]').each(function(){ // Ставим все кнопки в изначальное состояние
					$(this).text('Комментировать');
					$(this).attr('data-index','0');
				});
		
				thi.text('Отменить');
				thi.attr('data-index','1');	
				elem=$("#add_comm_form");
				
				ecc=elem.children('div').children('input');
				if(thi.parent().attr('data-comm-id')) {	  // Вставляем в форму данные для комментирования комментария
					thi.siblings('.content').after(elem);
					ecc.attr('name','comm');
					ecc.attr('value',elem.parent().attr('data-comm-id'));
				}
				else{										// Вставляем в форму данные для комментирования сообщения
					thi.parent().append(elem);
					ecc.attr('name','mass');
					ecc.attr('value',elem.parent().parent().attr('data-mass-id'));
				}

				elem.show(200);
				elem.children('div').children('textarea').focus();
				$('<a href="#add_comm_form"></a>').click();
			}
			else
			{
				thi.text('Комментировать');

                $("#add_comm_form").children('div').children('textarea').val('');
				$("#add_comm_form").hide(200);
				thi.attr('data-index','0');
                
			}  
		}
		
		
		
	 // Кнопка "Показать/Скрыть комментарии" грузит коменты с сервера
	if(event.target.className=='show_comm'){ 
		thi=$(event.target);
		elem=thi;
			 // Загружаем с сервера если показываем первый раз
			 if (elem.attr('data-index')=='0')
			 {  
				timer=setTimeout(function(){$('#footer > img').fadeIn(100);},300);
				elem.text("Скрыть комментарии");
				elem.attr('data-index','1');
				obj.data= {'id_mass': thi.parent().parent().attr('data-mass-id')};
				obj.success= function(data){
						elem.parent().parent().append(data);
						$('#footer > img').fadeOut(100);
						clearTimeout(timer);
						elem=elem.parent().siblings('.comment');  // Загрузили комменты к сообщению
						
						/*
							Древовидная структура комментариев может иметь произвольную вложенность, 
							слишком большое погружение будет плохо выглядеть, 
							поэтому доходя до 9-го уровня оборачиваем его потомков в див и задаем отрицательный margi-left двигающий их к началу
						 */
						while(true){					  
							elem=$('.comment>.comment>.comment>.comment>.comment>.comment>.comment>.comment>.comment:first',elem).wrap('<div class="perenos"></div>');  
							if(elem.html()==undefined){
								break;
							}
					  
							$('.comment:first-child',$('.perenos')).css('background','none');
							$('.perenos',elem.parent().parent()).prepend('<div class="line_div"></div>').append('<div class="line_div"></div>');
							$('.plus_img:first',elem.parent().parent()).click();
						}
						
					};
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
		
		
	}
	
	 // сворачивание и разворачивание ветки дочерних комментов
	if(event.target.className=='plus_img'){

		thi=$(event.target);
		if(thi.attr('data-index')=='0'){
			thi.css('left',-(thi.height())+'px');
			thi.attr('data-index','1');
			$('.comment,.perenos',thi.parent().parent()).hide(200);
		}
		else{
			thi.css('left','0');
			thi.attr('data-index','0');
			$('.comment,.perenos',thi.parent().parent().parent()).show(200);
			$('.plus_img[data-index="1"]',thi.parent().parent()).each(function(){

					$('.comment,.perenos',$(this).parent().parent()).hide(); 
					
			   });
			
		}
		
	}
	
	
	if($(event.target).attr('id')=='up')
	{
		$('body,html').animate({'scrollTop':'0'},400);
	}
	
		
	});
	


	// Реализация "Беспонечной ленты"
	index = false;
	scr=true
	$(window).scroll(function() {
		
		if ($(window).scrollTop() > 800){
			 $('#up').show(300);
		}
		else
		{
			$('#up').hide(300);
		}
		
		if($(window).scrollTop() + $(window).height() > $(document).height()*0.7 && !index ) {
			index = true;
			if (scr)
			{
			   
				$.get('/load_content/',function(data){
					$('body > div ').append(data);

					index=false;
					if (data=='')   //когда сервер начинает возвращать пустые ответы - перестаем спрашивать
						scr=false;
					});
			}
		}	   
	});
		
	// Добавление коммента к сообщению и комментарию. Через аякс чтобы при перезагрузке пользователю не искать свой коммент
	$('#add_comm_form').submit(function(e){
		e.preventDefault();
		myForm=$(this);
		obj.data= {
					'mass'	    : myForm.children('div').children("input[name='mass']").attr('value'),
					'comm'	    : myForm.children('div').children("input[name='comm']").attr('value'),
					'text_comm' : myForm.children('div').children("textarea[name='text_comm']").val(),
				  }
			 obj.success= function(data){

                        if(myForm.children('div').children("input[name='mass']").attr('value') ){
                            if(myForm.siblings().is('.show_comm')==false){
                                 myForm.siblings('.content').after('<div class="show_comm" data-index="0"> Показать комментарии </div>');   
                            }
                            myForm.siblings('.show_comm').attr('data-index','0');
                            myForm.parent().siblings('.comment').remove();
                            myForm.siblings('.show_comm').click();
                            
                        }
                        else{
                            if(myForm.siblings().is('.plus')==false){
                                myForm.siblings('.content').after("<div class='plus' ><img data-index='0' class='plus_img' src='static/images/plus.jpg'></div>");
                            }
                            myForm.parent().append(data);
                        }

						myForm.siblings('.add_comm_btn').text('Комментировать').attr('data-index','0');
                        myForm.children('div').children('textarea').val('');
						myForm.hide();
						}
			 obj.url=myForm.attr('action');   

			$.ajax(obj);
	  
	});
	 
	 
	 
});  // кенец загрузки страницы   







// Отмена "Редактирования" поста или коммента, меняем textarea на div
function esc_edit(elem){
			text=$(elem).siblings('.text_edit').children('textarea').val();
			$(elem).siblings('.text_edit').replaceWith(function(){
						return ' <div style="display:none" class="content" >'+escapeHtml(text)+'</div>';
						});
			$('.content',$(elem).parent()).show(400);
			$(elem).html('Редактировать')
}


// экранирование
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

	 
					
