from django.contrib import admin
from .models import Abonnement, Membre, Paiement, Coach, Seance, Participation

admin.site.register([Abonnement, Membre, Paiement, Coach, Seance, Participation])