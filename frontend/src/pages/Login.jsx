import { useState } from 'react';
import api from '../api';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [erreur, setErreur] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    try {
      const r = await api.post('login/', { username, password });
      localStorage.setItem('token', r.data.token);
      onLogin();
    } catch {
      setErreur('Identifiants incorrects.');
    }
  };

  return (
    <form onSubmit={submit} style={{ maxWidth: 300, margin: '80px auto', display: 'grid', gap: 10 }}>
      <h2>Connexion</h2>
      <input placeholder="Utilisateur" value={username} onChange={(e) => setUsername(e.target.value)} required />
      <input type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} required />
      <button type="submit">Se connecter</button>
      {erreur && <p style={{ color: 'red' }}>{erreur}</p>}
    </form>
  );
}