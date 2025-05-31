import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  BookOpen, 
  Grid, 
  Users, 
  MessageSquare,
  User,
  Archive,
  Activity,
  UserCheck,
  Library
} from 'lucide-react';
import { getCurrentUser } from '../../api/authapi';

const Sidebar = () => {
  const user = getCurrentUser();
  const isAdmin = user?.roles.includes('admin');
  const isAuteur = user?.roles.includes('auteur');

  const NavItem = ({ to, icon: Icon, children }) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ease-in-out transform hover:scale-102 ${
          isActive 
            ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg' 
            : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-600'
        }`
      }
    >
      <Icon size={20} className="flex-shrink-0" />
      <span className="font-medium">{children}</span>
    </NavLink>
  );

  return (
    <div className="h-full bg-white border-r shadow-sm">
      <div className="p-4 border-b">
        <div className="mt-8 px-4 py-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <User size={20} className="text-gray-500" />
            <div>
              <p className="text-sm font-medium text-gray-700">{user?.username}</p>
              <p className="text-xs text-gray-500">{isAdmin ? 'Administrateur' : 'Auteur'}</p>
            </div>
          </div>
        </div>
      </div>

      <nav className="space-y-1 p-4">
        {isAdmin ? (
          <div className="space-y-1">            <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Administration
            </div>
            <NavItem to="/dashboard/overview" icon={Grid}>Vue d'ensemble</NavItem>
            <NavItem to="/dashboard/livres" icon={BookOpen}>Livres</NavItem>
            <NavItem to="/dashboard/categories" icon={Grid}>Catégories</NavItem>
            <NavItem to="/dashboard/auteurs" icon={User}>Auteurs</NavItem>
            <NavItem to="/dashboard/emprunts" icon={Archive}>Emprunts</NavItem>
            <NavItem to="/dashboard/users" icon={Users}>Utilisateurs</NavItem>
            <NavItem to="/dashboard/commentaires" icon={MessageSquare}>Commentaires</NavItem>
          </div>
        ) : isAuteur ? (
          <div className="space-y-1">
            <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Espace Auteur
            </div>
            <NavItem to="/dashboard/mes-livres" icon={BookOpen}>Mes Livres</NavItem>
            <NavItem to="/dashboard/mes-emprunts" icon={Archive}>Suivi des Emprunts</NavItem>
            <NavItem to="/dashboard/mes-analyses" icon={Activity}>Analyses</NavItem>
            <NavItem to="/dashboard/mes-lecteurs" icon={UserCheck}>Mes Lecteurs</NavItem>
          </div>
        ) : null}
      </nav>
    </div>
  );
};

export default Sidebar;