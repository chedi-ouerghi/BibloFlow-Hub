import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Fonction pour obtenir les headers d'authentification
const authHeader = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.accessToken) {
    return { Authorization: `Bearer ${user.accessToken}` };
  }
  return {};
};

export const register = async (username, email, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/signup`, {
      username,
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const registerAuteur = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/auth/signup-auteur`, userData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/signin`, {
      email,
      password,
    });

    const data = response.data;
    
    if (data.accessToken) {  // Vérifier uniquement accessToken
      const roles = Array.isArray(data.roles) ? data.roles : [data.roles];
      
      const userData = {
        id: data.id,
        username: data.username,
        email: data.email,
        roles: roles,
        accessToken: data.accessToken
      };
      
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', data.accessToken);
      
      return userData;  // Retourner userData au lieu de data
    }
    
    throw new Error(data.message || "Email ou mot de passe incorrect");
  } catch (error) {
    console.error('Login API error:', error);
    throw new Error(error.response?.data?.message || "Erreur de connexion au serveur");
  }
};

export const logout = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  if (userStr) return JSON.parse(userStr);
  return null;
};

export const updateProfile = async (userData) => {
  try {
    const user = getCurrentUser();
    const response = await axios.put(
      `${API_URL}/me`, 
      userData,
      { headers: { Authorization: `Bearer ${user.accessToken}` } }
    );
    
    // Mettre à jour les informations stockées localement
    const updatedUser = { ...user, ...response.data.user };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getAvertissements = async () => {
  try {
    const user = getCurrentUser();
    const response = await axios.get(
      `${API_URL}/me/avertissements`,
      { headers: { Authorization: `Bearer ${user.accessToken}` } }
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const marquerAvertissementLu = async (avertissementId) => {
  try {
    const user = getCurrentUser();
    if (!user || !user.accessToken) {
      throw new Error('Non autorisé');
    }

    const response = await axios.put(
      `${API_URL}/me/avertissements/${avertissementId}/lu`,
      {},
      {
        headers: { 
          'Authorization': `Bearer ${user.accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Erreur lors du marquage de l\'avertissement');
    }
    throw error;
  }
};

export const emprunterLivre = async (livreId, etatLivreDepart) => {
  const response = await axios.post(
    `${API_URL}/user/emprunts/${livreId}`,
    { etatLivreDepart },
    { headers: authHeader() }
  );
  return response.data;
};

export const getMesEmprunts = async () => {
  const response = await axios.get(
    `${API_URL}/mes-emprunts`,
    { headers: authHeader() }
  );
  return response.data;
};

export const verifierLivreDejaEmprunte = async (livreId) => {
  try {
    const user = getCurrentUser();
    if (!user || !user.accessToken) {
      throw new Error('Non autorisé');
    }

    const response = await axios.get(
      `${API_URL}/me/emprunts/${livreId}/verification`,
      { headers: authHeader() }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Intercepteur pour ajouter le token aux requêtes
axios.interceptors.request.use(
  (config) => {
    const user = getCurrentUser();
    if (user && user.accessToken) {
      config.headers.Authorization = `Bearer ${user.accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs d'authentification
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);