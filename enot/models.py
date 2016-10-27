from django.db import models
from django.utils.timezone import datetime
from django.contrib import admin
from django.contrib.auth.models import User

# Create your models here.
class Massages(models.Model):
    date=models.DateTimeField(auto_now=True)
    author=models.ForeignKey(User,on_delete=models.CASCADE)
    text_massage=models.TextField()
    def __str__(self):
        return str(self.id)


class Comments(models.Model):
    date=models.DateTimeField(auto_now=True)
    author = models.ForeignKey(User,on_delete=models.CASCADE)
    text_massage=models.TextField()
    answer_massage=models.ForeignKey(Massages,on_delete=models.CASCADE,null=True,blank=True)
    answer_comment=models.ForeignKey('self',on_delete=models.CASCADE,null=True,blank=True)
    def __str__(self):
        return str(self.id)
