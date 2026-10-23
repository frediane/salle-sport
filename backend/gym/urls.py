from rest_framework.routers import DefaultRouter
from django.urls import path
from .views import tableau_de_bord 
from .views import (AbonnementViewSet, MembreViewSet, PaiementViewSet,
                    CoachViewSet, SeanceViewSet, ParticipationViewSet)

router = DefaultRouter()
router.register('abonnements', AbonnementViewSet)
router.register('membres', MembreViewSet)
router.register('paiements', PaiementViewSet)
router.register('coachs', CoachViewSet)
router.register('seances', SeanceViewSet)
router.register('participations', ParticipationViewSet)

urlpatterns = [path('tableau-de-bord/', tableau_de_bord)] + router.urls