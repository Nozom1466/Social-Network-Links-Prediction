from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("ajax-add/", views.nx_algos),
    path("save_file/", views.save_file)
]