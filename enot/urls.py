from django.conf.urls import url, include
from django.contrib import admin
from . import views

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^accounts/', include('allauth.urls')),
    url(r'^$', views.index),
    url(r'^add/$', views.add_post, name='add_mass'),
    url(r'^edit/$', views.add_post, name='edit_mass'),

]
