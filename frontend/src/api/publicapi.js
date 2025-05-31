import axios from 'axios';
import { getCurrentUser } from './authapi';

const API_URL = 'http://localhost:5000/api';

// Récupérer tous les livres
export const getAllLivres = async ({ search, categorie, page = 1, limit = 20 } = {}) => {
  try {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (categorie) params.append('categorie', categorie);
    params.append('page', page);
    params.append('limit', limit);

    const response = await axios.get(`${API_URL}/livres?${params.toString()}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Récupérer les livres recommandés
export const getLivresRecommandes = async () => {
  try {
    const response = await axios.get(`${API_URL}/livres/recommandes`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Récupérer les détails d'un livre
export const getLivreDetails = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/livres/${id}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Récupérer toutes les catégories
export const getCategories = async () => {
  try {
    const response = await axios.get(`${API_URL}/categories`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Récupérer tous les auteurs
export const getAuteurs = async () => {
  try {
    const response = await axios.get(`${API_URL}/auteurs`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Récupérer les commentaires d'un livre
export const getLivreCommentaires = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/livres/${id}/commentaires`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Ajouter un commentaire à un livre (protégé)
export const addCommentaire = async (livreId, contenu, note) => {
  try {
    const user = getCurrentUser();
    const response = await axios.post(
      `${API_URL}/livres/${livreId}/commentaires`,
      { contenu, note },
      { headers: { Authorization: `Bearer ${user.accessToken}` } }
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Récupérer les commentaires d'un utilisateur (protégé)
export const getUserCommentaires = async (id) => {
  try {
    const user = getCurrentUser();
    const response = await axios.get(`${API_URL}/users/${id}/commentaires`, {
      headers: { Authorization: `Bearer ${user.accessToken}` }
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Récupérer les avertissements de l'utilisateur connecté (protégé)
export const getAvertissements = async () => {
  try {
    const user = getCurrentUser();
    const response = await axios.get(`${API_URL}/me/avertissements`, {
      headers: { Authorization: `Bearer ${user.accessToken}` }
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Ajouter une note à un livre
export const addNote = async (livreId, note) => {
  try {
    const user = getCurrentUser();
    const response = await axios.post(
      `${API_URL}/livres/${livreId}/note`,
      { note },
      { headers: { Authorization: `Bearer ${user.accessToken}` } }
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Mettre à jour une note
export const updateNote = async (livreId, note) => {
  try {
    const user = getCurrentUser();
    const response = await axios.put(
      `${API_URL}/livres/${livreId}/note`,
      { note },
      { headers: { Authorization: `Bearer ${user.accessToken}` } }
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Récupérer la note d'un utilisateur pour un livre
export const getUserNote = async (livreId) => {
  try {
    const user = getCurrentUser();
    const response = await axios.get(
      `${API_URL}/livres/${livreId}/note`,
      { headers: { Authorization: `Bearer ${user.accessToken}` } }
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Mettre à jour un commentaire
export const updateCommentaire = async (livreId, commentaireId, contenu) => {
  try {
    const user = getCurrentUser();
    const response = await axios.put(
      `${API_URL}/livres/${livreId}/commentaires/${commentaireId}`,
      { contenu },
      { headers: { Authorization: `Bearer ${user.accessToken}` } }
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Supprimer un commentaire (protégé)
export const deleteCommentaire = async (livreId, commentaireId) => {
  try {
    const user = getCurrentUser();
    const response = await axios.delete(
      `${API_URL}/livres/${livreId}/commentaires/${commentaireId}`,
      { headers: { Authorization: `Bearer ${user.accessToken}` } }
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Emprunter un livre
export const emprunterLivre = async (livreId, data) => {
  try {
    const user = getCurrentUser();
    if (!user || !user.accessToken) {
      throw new Error('Non autorisé');
    }
    
    const response = await axios.post(
      `${API_URL}/emprunts/${livreId}`,
      data,
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
      throw error.response.data;
    }
    throw error;
  }
};

// Récupérer des livres similaires
export const getSimilarBooks = async (livreId) => {
  try {
    const response = await axios.get(`${API_URL}/livres/${livreId}/similar`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};