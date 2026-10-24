from datetime import date, timedelta
from rest_framework import serializers
from .models import Abonnement, Membre, Paiement, Coach, Seance, Participation


class AbonnementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Abonnement
        fields = '__all__'


class MembreSerializer(serializers.ModelSerializer):
    abonnement_detail = AbonnementSerializer(source='abonnement', read_only=True)
    est_a_jour = serializers.SerializerMethodField()

    class Meta:
        model = Membre
        fields = '__all__'

    def get_est_a_jour(self, obj):
        return obj.est_a_jour()

class PaiementSerializer(serializers.ModelSerializer):
    membre_nom = serializers.CharField(source='membre.__str__', read_only=True)

    class Meta:
        model = Paiement
        fields = '__all__'


class CoachSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coach
        fields = '__all__'


class SeanceSerializer(serializers.ModelSerializer):
    coach_nom = serializers.CharField(source='coach.nom_coach', read_only=True)
    nb_inscrits = serializers.SerializerMethodField()
    places_restantes = serializers.SerializerMethodField()

    class Meta:
        model = Seance
        fields = ['id', 'nom_seance', 'date_seance', 'heure', 'capacite',
                  'coach', 'coach_nom', 'nb_inscrits', 'places_restantes']

    def get_nb_inscrits(self, obj):
        return obj.participation_set.count()

    def get_places_restantes(self, obj):
        return obj.capacite - obj.participation_set.count()


class ParticipationSerializer(serializers.ModelSerializer):
    membre_nom = serializers.CharField(source='membre.__str__', read_only=True)
    seance_nom = serializers.CharField(source='seance.nom_seance', read_only=True)

    class Meta:
        model = Participation
        fields = '__all__'

    def validate(self, data):
        seance = data['seance']
        if seance.participation_set.count() >= seance.capacite:
            raise serializers.ValidationError("Cette séance est complète.")
        return data