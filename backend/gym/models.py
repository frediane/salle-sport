from datetime import date, timedelta
from django.db import models


class Abonnement(models.Model):
    TYPES = [
        ('mensuel', 'Mensuel'),
        ('trimestriel', 'Trimestriel'),
        ('annuel', 'Annuel'),
    ]
    type = models.CharField(max_length=20, choices=TYPES)
    prix = models.DecimalField(max_digits=10, decimal_places=2)
    duree = models.PositiveIntegerField(help_text="Durée en jours")

    def __str__(self):
        return f"{self.type} - {self.prix}"


class Membre(models.Model):
    nom = models.CharField(max_length=100)
    prenom = models.CharField(max_length=100)
    date_naissance = models.DateField()
    telephone = models.CharField(max_length=20)
    email = models.EmailField(unique=True)
    # Un membre possède UN seul abonnement (cardinalité 1,1)
    abonnement = models.ForeignKey(
        Abonnement, on_delete=models.PROTECT, related_name='membres'
    )

    def __str__(self):
        return f"{self.nom} {self.prenom}"

    def est_a_jour(self):
        """À jour = le dernier paiement couvre encore la durée de l'abonnement."""
        dernier = self.paiements.order_by('-date_paiement').first()
        if not dernier:
            return False
        fin = dernier.date_paiement + timedelta(days=self.abonnement.duree)
        return fin >= date.today()

        
class Paiement(models.Model):
    date_paiement = models.DateField()
    montant = models.DecimalField(max_digits=10, decimal_places=2)
    # Un membre effectue plusieurs paiements
    membre = models.ForeignKey(
        Membre, on_delete=models.CASCADE, related_name='paiements'
    )

    def __str__(self):
        return f"{self.membre} - {self.montant} ({self.date_paiement})"


class Coach(models.Model):
    nom_coach = models.CharField(max_length=100)
    specialite = models.CharField(max_length=100)
    tel_coach = models.CharField(max_length=20)

    def __str__(self):
        return self.nom_coach


class Seance(models.Model):
    nom_seance = models.CharField(max_length=100)
    date_seance = models.DateField()
    heure = models.TimeField()
    capacite = models.PositiveIntegerField()
    # Une séance est animée par UN seul coach
    coach = models.ForeignKey(
        Coach, on_delete=models.PROTECT, related_name='seances'
    )
    # Table PARTICIPATION (association n,n entre Membre et Séance)
    membres = models.ManyToManyField(
        Membre, through='Participation', related_name='seances'
    )

    def __str__(self):
        return f"{self.nom_seance} - {self.date_seance} {self.heure}"


class Participation(models.Model):
    membre = models.ForeignKey(Membre, on_delete=models.CASCADE)
    seance = models.ForeignKey(Seance, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('membre', 'seance')   # clé primaire composée

    def __str__(self):
        return f"{self.membre} -> {self.seance}"