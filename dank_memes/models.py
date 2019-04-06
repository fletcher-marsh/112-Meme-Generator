from django.db import models

# Create your models here.
class Image(models.Model):
    name = models.CharField()
    img_file =   models.ImageField(upload_to='images/')