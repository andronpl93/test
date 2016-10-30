from django.contrib import admin,messages
from .models import Massages,Comments
from django.contrib.auth.models import User

# Register your models here.




class UserAdmin(admin.ModelAdmin):
    list_display = ('id', 'username','first_name','last_name','email','is_staff')
class MassagesAdmin(admin.ModelAdmin):
    list_display = ('id','date', 'author','text_massage')
    

admin.site.register(Massages,MassagesAdmin)
admin.site.register(Comments)
    
admin.site.unregister(User)
admin.site.register(User, UserAdmin)

