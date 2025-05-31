const BASE_URL = 'http://localhost:5000/api';

class AuteurApi {
  constructor() {
    this.token = localStorage.getItem('token');
  }

  async getMesLivres() {
    try {
      const response = await fetch(`${BASE_URL}/auteur/livres`, {
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Une erreur est survenue');
      }

      return data;
    } catch (error) {
      throw new Error(error.message || 'Erreur lors de la récupération des livres');
    }
  }

  async publierLivre(livreData) {
    try {
      console.log('Envoi des données:', livreData); // Debug log
      const response = await fetch(`${BASE_URL}/auteur/livres`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`
        },
        body: JSON.stringify({
          titre: livreData.titre,
          isbn: livreData.isbn,
          description: livreData.description,
          couvertureUrl: livreData.couvertureUrl,
          langue: livreData.langue,
          nombrePages: parseInt(livreData.nombrePages, 10),
          categories: livreData.categories
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Une erreur est survenue');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erreur détaillée:', error);
      throw new Error(error.message || 'Erreur lors de la création du livre');
    }
  }

  async updateLivre(id, livreData) {
    try {
      const response = await fetch(`${BASE_URL}/auteur/livres/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`
        },
        body: JSON.stringify(livreData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Une erreur est survenue');
      }

      return data;
    } catch (error) {
      throw new Error(error.message || 'Erreur lors de la mise à jour du livre');
    }
  }

  async demanderSuppression(id) {
    try {
      const response = await fetch(`${BASE_URL}/auteur/livres/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Une erreur est survenue');
      }

      return data;
    } catch (error) {
      throw new Error(error.message || 'Erreur lors de la suppression du livre');
    }
  }

  async getMesEmprunts() {
    try {
      const response = await fetch(`${BASE_URL}/auteur/emprunts`, {
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Une erreur est survenue');
      }

      return data;
    } catch (error) {
      throw new Error(error.message || 'Erreur lors de la récupération des emprunts');
    }
  }

  async getMesAnalyses() {
    try {
      const response = await fetch(`${BASE_URL}/auteur/analyses`, {
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Une erreur est survenue');
      }

      return data;
    } catch (error) {
      throw new Error(error.message || 'Erreur lors de la récupération des analyses');
    }
  }

  async getMesLecteurs() {
    try {
      const response = await fetch(`${BASE_URL}/auteur/lecteurs`, {
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Une erreur est survenue');
      }

      return data;
    } catch (error) {
      throw new Error(error.message || 'Erreur lors de la récupération des lecteurs');
    }
  }
}

export const auteurApi = new AuteurApi();