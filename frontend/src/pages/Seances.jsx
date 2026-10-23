import CrudPage from '../components/CrudPage';

export default function Seances() {
  return (
    <CrudPage
      titre="Séances"
      endpoint="seances/"
      champs={[
        { name: 'nom_seance', label: 'Nom de la séance' },
        { name: 'date_seance', label: 'Date', type: 'date' },
        { name: 'heure', label: 'Heure', type: 'time' },
        { name: 'capacite', label: 'Capacité', type: 'number' },
        { name: 'coach', label: 'Coach', source: 'coachs/', optionLabel: (c) => c.nom_coach },
      ]}
      colonnes={[
        { titre: 'Séance', valeur: (s) => s.nom_seance },
        { titre: 'Date', valeur: (s) => s.date_seance },
        { titre: 'Heure', valeur: (s) => s.heure },
        { titre: 'Coach', valeur: (s) => s.coach_nom },
        { titre: 'Inscrits', valeur: (s) => `${s.nb_inscrits} / ${s.capacite}` },
      ]}
    />
  );
}