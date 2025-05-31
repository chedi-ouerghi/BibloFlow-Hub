import React from 'react';
import {UserCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header = ({ user, handleLogout }) => {
  return (
    <header className="sticky top-0 z-50 h-16 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-beige/10">
      <div className="h-full px-8 flex items-center justify-between">
      <div className="flex-shrink-0 flex items-center">
                  <Link to="/" className="text-xl font-bold text-indigo-600">
                    BiblioFlow
                  </Link>
                </div>

        {/* Boutons d'action */}
        <div className="flex items-center space-x-4">
     
          {/* Liens utilisateur */}
          {user ? (
            <>
              {(user.roles.includes('admin') || user.roles.includes('auteur')) && (
                <Link
                  to="/dashboard"
                  className="text-beige hover:bg-beige/5 px-3 py-1.5 rounded-lg text-sm transition-colors"
                >
                  Dashboard
                </Link>
              )}
              {/* Afficher le profil seulement si l'utilisateur n'est ni admin ni auteur */}
              {!(user.roles.includes('admin') || user.roles.includes('auteur')) && (
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 px-3 py-1.5 text-beige hover:bg-beige/5 rounded-lg text-sm transition-colors"
                >
                  <UserCircle className="w-5 h-5" />
                  <span>Profil</span>
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="text-beige hover:bg-beige/5 px-3 py-1.5 rounded-lg text-sm transition-colors"
              >
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-beige hover:bg-beige/5 px-3 py-1.5 rounded-lg text-sm transition-colors"
              >
                Connexion
              </Link>
              <Link
                to="/register"
                className="bg-beige text-black hover:bg-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
              >
                Inscription
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;