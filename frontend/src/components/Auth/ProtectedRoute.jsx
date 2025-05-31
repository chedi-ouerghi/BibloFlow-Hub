import React from 'react';
import { Navigate } from 'react-router-dom';
import { getCurrentUser } from '../../api/authapi';

const ProtectedRoute = ({ children, roles }) => {
  const user = getCurrentUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Si des rôles sont spécifiés, vérifier que l'utilisateur a au moins l'un d'entre eux
  if (roles && !roles.some(role => user.roles.includes(role))) {
    return <Navigate to="/" replace />;
  }

  // Retourner les composants enfants au lieu de Outlet
  return children;
};

export default ProtectedRoute;