from django.shortcuts import render
from django.http import HttpResponse,HttpResponseRedirect
from .models import Massages,Comments
import logging


count_post=0 #Количество сообщений которые загружены в ленту


def index(request):
	global count_post
	count_post=0
	return render(request,'enot/index.html')
	
  # Добавление поста  
def add_post(request):
	if request.user.is_authenticated() and request.user.is_active and request.method=="POST":
		Massages.objects.create(author=request.user,text_massage=request.POST.get('text_mass'))
	return HttpResponseRedirect('/')
	
 #Изменение поста или комментария
def edit_post(request):
	if request.user.is_authenticated() and request.user.is_active and request.method=="POST" :
		if request.POST.get('id_mass') != None:
			mass=Massages.objects.get(id=request.POST.get('id_mass'))
			if mass.author==request.user:	   
				mass.text_massage=request.POST.get('text')
				mass.save()   
		if request.POST.get('id_comm') != None:
			comm=Comments.objects.get(id=request.POST.get('id_comm'))
			if comm.author==request.user:	   
				comm.text_massage=request.POST.get('text')
				comm.save()
	return HttpResponse(True)
	
	# Добавление комментария к посту или к комментарию
def add_comm(request): 
	if request.user.is_authenticated() and request.user.is_active and request.method=="POST" :
		form=request.POST
		if form.get('mass'):
			mass=Massages.objects.get(id=int(form.get("mass")))
			Comments.objects.create(author=request.user,text_massage=form.get('text_comm'),answer_massage=mass)
		
		if form.get('comm'):
			comm=Comments.objects.get(id=int(form.get("comm")))
			Comments.objects.create(author=request.user,text_massage=form.get('text_comm'),answer_comment=comm)
	return HttpResponseRedirect('/')

# Подгрузить комментарии к посту	
def show_comm(request): 
	logging.debug(0)
	if request.method=="POST" :
		comm=Comments.objects.filter(answer_massage=Massages.objects.get(id=int(request.POST.get('id_mass'))))
		logging.debug(1)
	return render(request,'enot/comments.html',{'comm':comm})
	
# Реализация "Бесконечной ленты"
def load_content(request):
	global count_post
	mass=Massages.objects.all().order_by('id').reverse()[count_post:10+count_post]
	if not len(mass):
		return HttpResponse ("")
	count_post+=10
	return render(request,'enot/content.html',{'mass':mass})	
	
	
	
	
	
	
	
	
	
	
	

logging.basicConfig(
	level = logging.DEBUG,
	format = '%(asctime)s %(levelname)s %(message)s',
)