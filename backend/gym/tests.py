from datetime import date, time
from django.contrib.auth.models import User
from django.test import TestCase
from rest_framework.test import APIClient
from .models import Abonnement, Membre, Coach, Seance


class ParticipationTest(TestCase):
    def setUp(self):
        ab = Abonnement.objects.create(type='mensuel', prix=50000, duree=30)
        self.m1 = Membre.objects.create(nom='A', prenom='A', date_naissance=date(2000, 1, 1),
                                        telephone='1', email='a@a.com', abonnement=ab)
        self.m2 = Membre.objects.create(nom='B', prenom='B', date_naissance=date(2000, 1, 1),
                                        telephone='2', email='b@b.com', abonnement=ab)
        coach = Coach.objects.create(nom_coach='C', specialite='Fitness', tel_coach='3')
        self.seance = Seance.objects.create(nom_seance='Yoga', date_seance=date.today(),
                                            heure=time(8, 0), capacite=1, coach=coach)
        self.client = APIClient()
        self.client.force_authenticate(user=User.objects.create_user('test', password='x'))

    def test_seance_complete(self):
        r1 = self.client.post('/api/participations/', {'membre': self.m1.id, 'seance': self.seance.id})
        self.assertEqual(r1.status_code, 201)
        r2 = self.client.post('/api/participations/', {'membre': self.m2.id, 'seance': self.seance.id})
        self.assertEqual(r2.status_code, 400)   # séance pleinefrom django.test import TestCase

# Create your tests here.
