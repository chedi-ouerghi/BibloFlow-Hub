import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { getCurrentUser } from '../../api/authapi';
import DashboardOverview from '../../pages/dashboard/DashboardOverview';
import LivresPage from '../../pages/dashboard/LivresPage';
import CategoriesPage from '../../pages/dashboard/CategoriesPage';
import AuteursPage from '../../pages/dashboard/AuteursPage';
import UsersPage from '../../pages/dashboard/UsersPage';
import CommentairesPage from '../../pages/dashboard/CommentairesPage';
import EmpruntsPage from '../../pages/dashboard/EmpruntsPage';
import MesLivresPage from '../../pages/dashboard/auteur/MesLivresPage';
import MesEmpruntsPage from '../../pages/dashboard/auteur/MesEmpruntsPage';
import MesAnalysesPage from '../../pages/dashboard/auteur/MesAnalysesPage';
import MesLecteursPage from '../../pages/dashboard/auteur/MesLecteursPage';

const Dashboard = () => {
  const user = getCurrentUser();
  const isAdmin = user?.roles.includes('admin');
  const isAuteur = user?.roles.includes('auteur');

  // Composant pour protéger les routes admin
  const AdminRoute = ({ children }) => {
    return isAdmin ? children : <Navigate to="/dashboard/mes-livres" />;
  };

  // Composant pour protéger les routes auteur
  const AuteurRoute = ({ children }) => {
    return isAuteur ? children : <Navigate to="/dashboard/livres" />;
  };

  return (
    <div className="flex min-h-screen">
      <div className="w-64 flex-shrink-0">
        <Sidebar />
      </div>
      <div className="flex-1 bg-gray-50">
        <div className="p-6">
          <Routes>            {/* Routes Admin */}
            <Route path="overview" element={<AdminRoute><DashboardOverview /></AdminRoute>} />
            <Route path="livres" element={<AdminRoute><LivresPage /></AdminRoute>} />
            <Route path="categories" element={<AdminRoute><CategoriesPage /></AdminRoute>} />
            <Route path="auteurs" element={<AdminRoute><AuteursPage /></AdminRoute>} />
            <Route path="users" element={<AdminRoute><UsersPage /></AdminRoute>} />
            <Route path="commentaires" element={<AdminRoute><CommentairesPage /></AdminRoute>} />
            <Route path="emprunts" element={<AdminRoute><EmpruntsPage /></AdminRoute>} />
            
            {/* Routes Auteur */}
            <Route path="mes-livres" element={<AuteurRoute><MesLivresPage /></AuteurRoute>} />
            <Route path="mes-emprunts" element={<AuteurRoute><MesEmpruntsPage /></AuteurRoute>} />
            <Route path="mes-analyses" element={<AuteurRoute><MesAnalysesPage /></AuteurRoute>} />
            <Route path="mes-lecteurs" element={<AuteurRoute><MesLecteursPage /></AuteurRoute>} />
            
            {/* Redirection par défaut basée sur le rôle */}
            <Route 
              index 
              element={
                isAdmin ? (
                  <Navigate to="overview" replace />
                ) : isAuteur ? (
                  <Navigate to="mes-livres" replace />
                ) : (
                  <Navigate to="/" replace />
                )
              } 
            />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;