import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import TableauDeBord from './pages/TableauDeBord';
import Membres from './pages/Membres';
import Abonnements from './pages/Abonnements';
import Paiements from './pages/Paiements';
import Coachs from './pages/Coachs';
import Seances from './pages/Seances';
import Participations from './pages/Participations';
import { useState } from 'react';
import Login from './pages/Login';

const liens = [
  ['/', 'Tableau de bord'],
  ['/', 'Membres'],
  ['/abonnements', 'Abonnements'],
  ['/paiements', 'Paiements'],
  ['/coachs', 'Coachs'],
  ['/seances', 'Séances'],
  ['/participations', 'Participations'],
];

export default function App() {
 const [connecte, setConnecte] = useState(!!localStorage.getItem('token'));
 const deconnexion = () => { localStorage.removeItem('token'); setConnecte(false); };

 <nav>
  <button onClick={deconnexion} style={{ marginLeft: 'auto' }}>Déconnexion</button>
 </nav>

if (!connecte) return <Login onLogin={() => setConnecte(true)} />;
  return (
    <BrowserRouter>
      <nav style={{ display: 'flex', gap: 16, padding: 12, background: '#222' }}>
        {liens.map(([chemin, texte]) => (
          <NavLink
            key={chemin}
            to={chemin}
            style={({ isActive }) => ({
              color: isActive ? '#4fc3f7' : 'white',
              textDecoration: 'none',
              fontWeight: isActive ? 'bold' : 'normal',
            })}
          >
            {texte}
          </NavLink>
        ))}
      </nav>

      <div style={{ padding: 20 }}>
        <Routes>
          <Route path="/" element={<TableauDeBord />} />
          <Route path="/" element={<Membres />} />
          <Route path="/abonnements" element={<Abonnements />} />
          <Route path="/paiements" element={<Paiements />} />
          <Route path="/coachs" element={<Coachs />} />
          <Route path="/seances" element={<Seances />} />
          <Route path="/participations" element={<Participations />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}