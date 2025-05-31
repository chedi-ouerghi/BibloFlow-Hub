import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const adminApi = {
  // Récupérer tous les utilisateurs
  async getAllUsers() {
    try {
      const response = await axios.get(`${API_URL}/admin/users`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Ajouter un avertissement à un utilisateur
  async addAvertissement(userId, message) {
    try {
      const response = await axios.post(
        `${API_URL}/admin/users/${userId}/avertissements`,
        { message },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Récupérer tous les livres
  async getAllLivres() {
    try {
      const response = await axios.get(`${API_URL}/admin/livres`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Créer un nouveau livre
  async createLivre(livreData) {
    try {
      const response = await axios.post(`${API_URL}/admin/livres`, livreData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Mettre à jour un livre
  async updateLivre(id, livreData) {
    try {
      const response = await axios.put(`${API_URL}/admin/livres/${id}`, livreData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Supprimer un livre
  async deleteLivre(id) {
    try {
      const response = await axios.delete(`${API_URL}/admin/livres/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Récupérer tous les emprunts
  async getAllEmprunts() {
    try {
      const response = await axios.get(`${API_URL}/admin/emprunts`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Créer un nouvel emprunt
  async createEmprunt(empruntData) {
    try {
      const response = await axios.post(`${API_URL}/admin/emprunts`, empruntData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Mettre à jour un emprunt
  async updateEmprunt(id, empruntData) {
    try {
      const response = await axios.put(`${API_URL}/admin/emprunts/${id}`, empruntData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Marquer un emprunt comme rendu
  async marquerEmpruntRendu(id) {
    try {
      const response = await axios.put(
        `${API_URL}/admin/emprunts/${id}/retour`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Récupérer tous les auteurs
  async getAllAuteurs() {
    try {
      const response = await axios.get(`${API_URL}/admin/auteurs`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Créer un nouvel auteur
  async createAuteur(auteurData) {
    try {
      const response = await axios.post(`${API_URL}/admin/auteurs`, auteurData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Mettre à jour un auteur
  async updateAuteur(id, auteurData) {
    try {
      const response = await axios.put(`${API_URL}/admin/auteurs/${id}`, auteurData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Supprimer un auteur
  async deleteAuteur(id) {
    try {
      const response = await axios.delete(`${API_URL}/admin/auteurs/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Récupérer toutes les catégories
  async getAllCategories() {
    try {
      const response = await axios.get(`${API_URL}/admin/categories`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Créer une nouvelle catégorie
  async createCategorie(categorieData) {
    try {
      const response = await axios.post(`${API_URL}/admin/categories`, categorieData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Mettre à jour une catégorie
  async updateCategorie(id, categorieData) {
    try {
      const response = await axios.put(`${API_URL}/admin/categories/${id}`, categorieData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Supprimer une catégorie
  async deleteCategorie(id) {
    try {
      const response = await axios.delete(`${API_URL}/admin/categories/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Obtenir les auteurs en attente
  async getPendingAuthors() {
    try {
      const response = await axios.get(`${API_URL}/admin/auteurs/pending`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Valider ou rejeter un auteur
  async validateAuthor(authorId, isValidated) {
    try {
      const response = await axios.put(
        `${API_URL}/auteurs/${authorId}/validate`,
        { isValidated },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};