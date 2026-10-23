import CrudPage from '../components/CrudPage';

export default function Abonnements() {
  return (
    <CrudPage
      titre="Abonnements"
      endpoint="abonnements/"
      champs={[
        { name: 'type', label: 'Type', choix: [['mensuel', 'Mensuel'], ['trimestriel', 'Trimestriel'], ['annuel', 'Annuel']] },
        { name: 'prix', label: 'Prix', type: 'number', step: '0.01' },
        { name: 'duree', label: 'Durée (jours)', type: 'number' },
      ]}
      colonnes={[
        { titre: 'Type', valeur: (a) => a.type },
        { titre: 'Prix', valeur: (a) => a.prix },
        { titre: 'Durée (jours)', valeur: (a) => a.duree },
      ]}
    />
  );
}