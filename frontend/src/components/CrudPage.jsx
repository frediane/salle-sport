import { useEffect, useState } from 'react';
import api from '../api';

export default function CrudPage({ titre, endpoint, champs, colonnes, recherche = false }) {
  const vide = Object.fromEntries(champs.map((c) => [c.name, '']));
  const [lignes, setLignes] = useState([]);
  const [options, setOptions] = useState({});
  const [form, setForm] = useState(vide);
  const [editId, setEditId] = useState(null);
  const [terme, setTerme] = useState('');
  const [erreur, setErreur] = useState('');
  const [version, setVersion] = useState(0);

  const recharger = () => setVersion((v) => v + 1);

  
  useEffect(() => {
    let actif = true;
    api.get(endpoint, { params: terme ? { search: terme } : {} })
      .then((res) => { if (actif) setLignes(res.data); });
    return () => { actif = false; };
  }, [endpoint, terme, version]);

  
  const sourcesCle = JSON.stringify(
    champs.filter((c) => c.source).map((c) => [c.name, c.source])
  );
  useEffect(() => {
    let actif = true;
    const sources = JSON.parse(sourcesCle);
    Promise.all(sources.map(([nom, url]) => api.get(url).then((r) => [nom, r.data])))
      .then((paires) => { if (actif) setOptions(Object.fromEntries(paires)); });
    return () => { actif = false; };
  }, [sourcesCle]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const annuler = () => { setEditId(null); setForm(vide); setErreur(''); };

  const modifier = (ligne) => {
    setEditId(ligne.id);
    setForm(Object.fromEntries(champs.map((c) => [c.name, ligne[c.name] ?? ''])));
    setErreur('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await api.put(`${endpoint}${editId}/`, form);
      } else {
        await api.post(endpoint, form);
      }
      annuler();
      recharger();
    } catch (err) {
      setErreur(JSON.stringify(err.response?.data));
    }
  };

  const supprimer = async (id) => {
    if (window.confirm('Confirmer la suppression ?')) {
      try {
        await api.delete(`${endpoint}${id}/`);
        recharger();
      } catch {
        setErreur("Suppression impossible : cet élément est utilisé ailleurs.");
      }
    }
  };


  const renderChamp = (c) => {
    if (c.source) {
      return (
        <select key={c.name} name={c.name} value={form[c.name]} onChange={handleChange} required>
          <option value="">-- {c.label} --</option>
          {(options[c.name] || []).map((o) => (
            <option key={o.id} value={o.id}>{c.optionLabel(o)}</option>
          ))}
        </select>
      );
    }
    if (c.choix) {
      return (
        <select key={c.name} name={c.name} value={form[c.name]} onChange={handleChange} required>
          <option value="">-- {c.label} --</option>
          {c.choix.map(([valeur, texte]) => (
            <option key={valeur} value={valeur}>{texte}</option>
          ))}
        </select>
      );
    }
    return (
      <input
        key={c.name}
        name={c.name}
        type={c.type || 'text'}
        step={c.step}
        placeholder={c.label}
        value={form[c.name]}
        onChange={handleChange}
        required
      />
    );
  };

  return (
    <div>
      <h2>{titre}</h2>

      <form onSubmit={handleSubmit} className="form-grid">
        {champs.map(renderChamp)}
        <button type="submit">{editId ? 'Enregistrer' : 'Ajouter'}</button>
        {editId && <button type="button" onClick={annuler}>Annuler</button>}
      </form>
      {erreur && <p style={{ color: 'red' }}>{erreur}</p>}

      {recherche && (
        <input
          style={{ marginTop: 16 }}
          placeholder="🔍 Rechercher..."
          value={terme}
          onChange={(e) => setTerme(e.target.value)}
        />
      )}

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              {colonnes.map((c) => <th key={c.titre}>{c.titre}</th>)}
              <th></th>
            </tr>
          </thead>
          <tbody>
            {lignes.map((l) => (
              <tr key={l.id}>
                {colonnes.map((c) => <td key={c.titre}>{c.valeur(l)}</td>)}
                <td>
                  <button onClick={() => modifier(l)}>Modifier</button>{' '}
                  <button onClick={() => supprimer(l.id)}>Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}