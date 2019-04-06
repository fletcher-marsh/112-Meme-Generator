from django.shortcuts import render

# Create your views here.
# Create your views here.
from dank_memes.models import *
from dank_memes.serializers import *
from rest_framework import generics, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
import cv2

import random

@api_view(["GET"])
def retrieve_random_meme(request):
    all_possible_images = Image.objects.all()
    image_to_meme = random.shuffle(all_possible_images).pop()
    image_path = image_to_meme.img_file.path
    image = cv2.imread(image_path)
    
    
    

@api_view(["POST"])
def give_me_meme_pls(request):
    print(request.data)
    # request.data #<-- holds all the phat juice, retrieve 

    #replace 'image_juice' with a real thing
    image_path = './images/{}'.format(request.data['name'])
    cv2.imwrite(image_path, request.data['image_juice'])
    image_serializer = ImageSerializer(request.data)
    if (image_serializer.is_valid()):
        image_serializer.save() #save to db
        return Response(image_serializer.data, status=status.HTTP_201_CREATED)
    else:
        return Response(image_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

