import CrudPage from '../components/CrudPage';

export default function Membres() {
  return (
    <CrudPage
      titre="Membres"
      endpoint="membres/"
      recherche
      champs={[
        { name: 'nom', label: 'Nom' },
        { name: 'prenom', label: 'Prénom' },
        { name: 'date_naissance', label: 'Date de naissance', type: 'date' },
        { name: 'telephone', label: 'Téléphone' },
        { name: 'email', label: 'Email', type: 'email' },
        { name: 'abonnement', label: 'Abonnement', source: 'abonnements/',
          optionLabel: (a) => `${a.type} - ${a.prix}` },
      ]}
      colonnes={[
        { titre: 'Nom', valeur: (m) => m.nom },
        { titre: 'Prénom', valeur: (m) => m.prenom },
        { titre: 'Téléphone', valeur: (m) => m.telephone },
        { titre: 'Abonnement', valeur: (m) => m.abonnement_detail?.type },
        { titre: 'Paiement', valeur: (m) => (m.est_a_jour ? '✅ À jour' : '❌ En retard') },
      ]}
    />
  );
}