from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('inventory.urls')),
    path("report/", include("report.urls")),
    path('api/', include('quiz.urls')),
    path('api/csvtojson/', include('csvtojson.urls')),
]
