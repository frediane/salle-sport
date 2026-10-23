import { useEffect, useState } from 'react';
import api from '../api';

export default function Participations() {
  const [membres, setMembres] = useState([]);
  const [seances, setSeances] = useState([]);
  const [participations, setParticipations] = useState([]);
  const [membre, setMembre] = useState('');
  const [seance, setSeance] = useState('');
  const [message, setMessage] = useState(null); // { type: 'ok' | 'erreur', texte }

  const charger = async () => {
    const [m, s, p] = await Promise.all([
      api.get('membres/'),
      api.get('seances/'),
      api.get('participations/'),
    ]);
    setMembres(m.data);
    setSeances(s.data);
    setParticipations(p.data);
  };

    const [version, setVersion] = useState(0);
  const recharger = () => setVersion((v) => v + 1);

  useEffect(() => {
    let actif = true;
    Promise.all([api.get('membres/'), api.get('seances/'), api.get('participations/')])
      .then(([m, s, p]) => {
        if (!actif) return;
        setMembres(m.data);
        setSeances(s.data);
        setParticipations(p.data);
      });
    return () => { actif = false; };
  }, [version]);

  const extraireErreur = (data) => {
    if (!data) return 'Erreur de connexion au serveur.';
    if (data.non_field_errors) return data.non_field_errors.join(' ');
    return Object.values(data).flat().join(' ');
  };

  const inscrire = async (e) => {
    e.preventDefault();
    try {
      await api.post('participations/', { membre, seance });
      setMessage({ type: 'ok', texte: 'Inscription enregistrée.' });
      setMembre('');
      setSeance('');
      recharger();
    } catch (err) {
      setMessage({ type: 'erreur', texte: extraireErreur(err.response?.data) });
    }
  };

  const desinscrire = async (id) => {
    await api.delete(`participations/${id}/`);
    recharger();
  };

  return (
    <div>
      <h2>Participations</h2>

      <form onSubmit={inscrire} style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <select value={membre} onChange={(e) => setMembre(e.target.value)} required>
          <option value="">-- Membre --</option>
          {membres.map((m) => (
            <option key={m.id} value={m.id}>{m.nom} {m.prenom}</option>
          ))}
        </select>

        <select value={seance} onChange={(e) => setSeance(e.target.value)} required>
          <option value="">-- Séance --</option>
          {seances.map((s) => (
            <option key={s.id} value={s.id} disabled={s.places_restantes <= 0}>
              {s.nom_seance} ({s.date_seance} {s.heure}) - {s.places_restantes} place(s)
              {s.places_restantes <= 0 ? ' - COMPLET' : ''}
            </option>
          ))}
        </select>

        <button type="submit">Inscrire</button>
      </form>

      {message && (
        <p style={{ color: message.type === 'ok' ? 'green' : 'red' }}>{message.texte}</p>
      )}

      <table border="1" cellPadding="6" style={{ marginTop: 20 }}>
        <thead>
          <tr><th>Membre</th><th>Séance</th><th></th></tr>
        </thead>
        <tbody>
          {participations.map((p) => (
            <tr key={p.id}>
              <td>{p.membre_nom}</td>
              <td>{p.seance_nom}</td>
              <td><button onClick={() => desinscrire(p.id)}>Désinscrire</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}