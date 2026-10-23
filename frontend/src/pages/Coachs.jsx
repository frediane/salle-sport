import CrudPage from '../components/CrudPage';

export default function Coachs() {
  return (
    <CrudPage
      titre="Coachs"
      endpoint="coachs/"
      champs={[
        { name: 'nom_coach', label: 'Nom du coach' },
        { name: 'specialite', label: 'Spécialité' },
        { name: 'tel_coach', label: 'Téléphone' },
      ]}
      colonnes={[
        { titre: 'Nom', valeur: (c) => c.nom_coach },
        { titre: 'Spécialité', valeur: (c) => c.specialite },
        { titre: 'Téléphone', valeur: (c) => c.tel_coach },
      ]}
    />
  );
}