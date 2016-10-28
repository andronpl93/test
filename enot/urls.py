from django.conf.urls import url, include
from django.contrib import admin
from . import views

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^accounts/', include('allauth.urls')),
    url(r'^$', views.index),
    url(r'^add/$', views.add_post, name='add_mass'),                        # добавление сообщения
    url(r'^edit/$', views.edit_post, name='edit_mass'),                     # изменение сообщения или комента сообщения
    url(r'^add_comm/$', views.add_comm, name='add_comm'),                   # добавление коммента
    url(r'^show_comm/$', views.show_comm, name='show_comm'),                # Подгрузить ветку с комментами
    url(r'^load_content/$', views.load_content, name='load_content'),       # Подгрузить очередную партию сообщений в ленту. 10 штук, но это не точно

]
