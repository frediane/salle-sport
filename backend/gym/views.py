from datetime import date
from django.db.models import Sum
from rest_framework import viewsets, filters 
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Abonnement, Membre, Paiement, Coach, Seance, Participation
from .serializers import (AbonnementSerializer, MembreSerializer, PaiementSerializer,
                          CoachSerializer, SeanceSerializer, ParticipationSerializer)


class AbonnementViewSet(viewsets.ModelViewSet):
    queryset = Abonnement.objects.all()
    serializer_class = AbonnementSerializer


class MembreViewSet(viewsets.ModelViewSet):
    queryset = Membre.objects.select_related('abonnement').all()
    serializer_class = MembreSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['nom', 'prenom', 'email', 'telephone']


class PaiementViewSet(viewsets.ModelViewSet):
    queryset = Paiement.objects.select_related('membre').all()
    serializer_class = PaiementSerializer


class CoachViewSet(viewsets.ModelViewSet):
    queryset = Coach.objects.all()
    serializer_class = CoachSerializer


class SeanceViewSet(viewsets.ModelViewSet):
    queryset = Seance.objects.select_related('coach').all()
    serializer_class = SeanceSerializer


class ParticipationViewSet(viewsets.ModelViewSet):
    queryset = Participation.objects.select_related('membre', 'seance').all()
    serializer_class = ParticipationSerializer


@api_view(['GET'])
def tableau_de_bord(request):
    aujourdhui = date.today()
    membres = list(Membre.objects.select_related('abonnement'))
    en_retard = [m for m in membres if not m.est_a_jour()]

    revenus = Paiement.objects.filter(
        date_paiement__year=aujourdhui.year,
        date_paiement__month=aujourdhui.month,
    ).aggregate(total=Sum('montant'))['total'] or 0

    seances_jour = Seance.objects.filter(date_seance=aujourdhui).order_by('heure')

    return Response({
        'nb_membres': len(membres),
        'nb_coachs': Coach.objects.count(),
        'nb_en_retard': len(en_retard),
        'membres_en_retard': [
            {'id': m.id, 'nom': str(m), 'telephone': m.telephone} for m in en_retard
        ],
        'revenus_mois': float(revenus),
        'seances_du_jour': SeanceSerializer(seances_jour, many=True).data,
    })