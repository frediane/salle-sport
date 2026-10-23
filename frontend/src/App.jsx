import { useState } from 'react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import Login from './pages/Login';
import TableauDeBord from './pages/TableauDeBord';
import Membres from './pages/Membres';
import Abonnements from './pages/Abonnements';
import Paiements from './pages/Paiements';
import Coachs from './pages/Coachs';
import Seances from './pages/Seances';
import Participations from './pages/Participations';

const liens = [
  ['/', 'Tableau de bord'],
  ['/membres', 'Membres'],
  ['/abonnements', 'Abonnements'],
  ['/paiements', 'Paiements'],
  ['/coachs', 'Coachs'],
  ['/seances', 'Séances'],
  ['/participations', 'Participations'],
];

export default function App() {
 const [connecte, setConnecte] = useState(!!localStorage.getItem('token'));
 const deconnexion = () => { localStorage.removeItem('token'); setConnecte(false); };

 
if (!connecte) return <Login onLogin={() => setConnecte(true)} />;
  return (
    <BrowserRouter>
      <nav className="navbar">
        {liens.map(([chemin, texte]) => (
          <NavLink key={chemin} to={chemin}>{texte}</NavLink>
        ))}
        <button className="deconnexion" onClick={deconnexion}>Déconnexion</button>
      </nav>

      <div className="page">
        <Routes>
          <Route path="/" element={<TableauDeBord />} />
          <Route path="/membres" element={<Membres />} />
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