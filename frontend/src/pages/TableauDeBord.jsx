import { useEffect, useState } from 'react';
import api from '../api';

function Carte({ titre, valeur, couleur }) {
  return (
    <div className="carte">
      <span className="carte-valeur" style={{ color: couleur }}>{valeur}</span>
      <span className="carte-titre">{titre}</span>
    </div>
  );
}

export default function TableauDeBord() {
  const [d, setD] = useState(null);

  useEffect(() => {
    api.get('tableau-de-bord/').then((r) => setD(r.data));
  }, []);

  if (!d) return <p>Chargement...</p>;

  return (
    <div>
      <h2>Tableau de bord</h2>

      <div className="cartes">
        <Carte titre="Membres" valeur={d.nb_membres} />
        <Carte titre="Coachs" valeur={d.nb_coachs} />
        <Carte titre="En retard de paiement" valeur={d.nb_en_retard} couleur="crimson" />
        <Carte titre="Revenus du mois" valeur={d.revenus_mois.toLocaleString('fr-FR')} couleur="green" />
      </div>

      <h3 style={{ marginTop: 30 }}>Séances du jour</h3>
      {d.seances_du_jour.length === 0 ? (
        <p>Aucune séance aujourd'hui.</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Heure</th><th>Séance</th><th>Coach</th><th>Inscrits</th></tr>
            </thead>
            <tbody>
              {d.seances_du_jour.map((s) => (
                <tr key={s.id}>
                  <td>{s.heure}</td>
                  <td>{s.nom_seance}</td>
                  <td>{s.coach_nom}</td>
                  <td>{s.nb_inscrits} / {s.capacite}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <h3 style={{ marginTop: 30 }}>Membres à relancer</h3>
      {d.membres_en_retard.length === 0 ? (
        <p>Tout le monde est à jour. ✅</p>
      ) : (
        <ul>
          {d.membres_en_retard.map((m) => (
            <li key={m.id}>{m.nom} - {m.telephone}</li>
          ))}
        </ul>
      )}
    </div>
  );
}