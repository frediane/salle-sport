import CrudPage from '../components/CrudPage';

export default function Paiements() {
  return (
    <CrudPage
      titre="Paiements"
      endpoint="paiements/"
      champs={[
        { name: 'membre', label: 'Membre', source: 'membres/', optionLabel: (m) => `${m.nom} ${m.prenom}` },
        { name: 'date_paiement', label: 'Date', type: 'date' },
        { name: 'montant', label: 'Montant', type: 'number', step: '0.01' },
      ]}
      colonnes={[
        { titre: 'Membre', valeur: (p) => p.membre_nom },
        { titre: 'Date', valeur: (p) => p.date_paiement },
        { titre: 'Montant', valeur: (p) => p.montant },
      ]}
    />
  );
}