from django.shortcuts import render
from django.http import HttpResponse,HttpResponseRedirect
from .models import Massages,Comments
import logging
import json

# Create your views here.
def index(request):
    mass=Massages.objects.all().order_by('-id')
    return render(request,'enot/index.html',{'mass':mass})
    
    
    
    
def add_post(request):
    if request.user.is_authenticated() and request.user.is_active and request.method=="POST":
        Massages.objects.create(author=request.user,text_massage=request.POST.get('text_mass'))
        
    return HttpResponseRedirect('/')
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    

logging.basicConfig(
	level = logging.DEBUG,
	format = '%(asctime)s %(levelname)s %(message)s',
)