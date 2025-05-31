import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../components/ui/dialog';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Textarea } from '../../../components/ui/textarea';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { useToast } from '../../../components/ui/use-toast';
import { Plus } from 'lucide-react';

const DialogLivre = ({ isOpen, onClose, livre }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    titre: '',
    isbn: '',
    description: '',
    couvertureUrl: '',
    langue: '',
    nombrePages: '',
    auteur: '',
    nouvelAuteur: {
      nom: '',
      bio: '',
      nationalite: ''
    },
    categories: [],
    nouvelleCategorie: {
      nom: '',
      description: ''
    },
    statut: 'draft'
  });
  const [auteurs, setAuteurs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showNewAuteur, setShowNewAuteur] = useState(false);
  const [showNewCategorie, setShowNewCategorie] = useState(false);

  useEffect(() => {
    if (livre) {
      setFormData({
        titre: livre.titre,
        isbn: livre.isbn,
        description: livre.description,
        couvertureUrl: livre.couvertureUrl,
        langue: livre.langue,
        nombrePages: livre.nombrePages,
        auteur: livre.auteur._id,
        categories: livre.categories.map(cat => cat._id),
        statut: livre.statut
      });
    } else {
      setFormData({
        titre: '',
        isbn: '',
        description: '',
        couvertureUrl: '',
        auteur: '',
        nouvelAuteur: {
          nom: '',
          bio: '',
          nationalite: ''
        },
        categories: [],
        nouvelleCategorie: {
          nom: '',
          description: ''
        },
        statut: 'draft'
      });
    }
  }, [livre]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [auteursRes, categoriesRes] = await Promise.all([
          fetch('http://localhost:5000/api/admin/auteurs', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
          }),
          fetch('http://localhost:5000/api/admin/categories', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
          })
        ]);

        if (!auteursRes.ok || !categoriesRes.ok) {
          throw new Error('Erreur lors du chargement des données');
        }

        const [auteursData, categoriesData] = await Promise.all([
          auteursRes.json(),
          categoriesRes.json()
        ]);

        setAuteurs(auteursData);
        setCategories(categoriesData);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: error.message
        });
      }
    };

    if (isOpen) {
      fetchData();
    }
  }, [isOpen]); // Ne déclencher que lorsque le dialog s'ouvre

  const refreshLists = async () => {
    try {
      const [auteursRes, categoriesRes] = await Promise.all([
        fetch('http://localhost:5000/api/admin/auteurs', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }),
        fetch('http://localhost:5000/api/admin/categories', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        })
      ]);

      const [auteursData, categoriesData] = await Promise.all([
        auteursRes.json(),
        categoriesRes.json()
      ]);

      setAuteurs(Array.isArray(auteursData) ? auteursData : []);
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
    } catch (error) {
      console.error('Erreur lors du rafraîchissement des listes:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!formData.categories.length) {
        throw new Error('Veuillez sélectionner au moins une catégorie');
      }

      // 1. Gérer l'auteur
      let auteurId = formData.auteur;
      let auteurData = null;
      
      if (showNewAuteur && formData.nouvelAuteur.nom) {
        try {
          const auteurResponse = await fetch('http://localhost:5000/api/admin/auteurs', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(formData.nouvelAuteur)
          });

          if (!auteurResponse.ok) {
            throw new Error('Erreur lors de la création de l\'auteur');
          }

          const auteurResult = await auteurResponse.json();
          if (auteurResult && auteurResult.auteur) {
            auteurId = auteurResult.auteur._id;
            // Rafraîchir la liste des auteurs
            await refreshLists();
            // Mettre à jour formData avec le nouvel auteur
            setFormData(prev => ({
              ...prev,
              auteur: auteurId,
              nouvelAuteur: { nom: '', bio: '', nationalite: '' }
            }));
            setShowNewAuteur(false);
          } else {
            throw new Error('Réponse invalide du serveur');
          }
        } catch (error) {
          console.error('Erreur création auteur:', error);
          toast({
            variant: "destructive",
            title: "Erreur",
            description: error.message
          });
          return;
        }
      } else {
        auteurData = auteurs.find(a => a._id === auteurId);
        if (!auteurData) {
          throw new Error('Veuillez sélectionner un auteur valide');
        }
      }

      // 2. Vérifier que les catégories sont des IDs valides
      const categoriesIds = formData.categories.filter(id => 
        categories.some(cat => cat._id === id)
      );

      // 3. Créer ou mettre à jour le livre
      const submitData = {
        titre: formData.titre,
        isbn: formData.isbn,
        description: formData.description,
        couvertureUrl: formData.couvertureUrl,
        langue: formData.langue,
        nombrePages: parseInt(formData.nombrePages, 10),
        categories: categoriesIds,
        auteur: auteurId,
        statut: formData.statut || 'draft'
      };

      console.log('Données à envoyer:', submitData);

      const url = livre
        ? `http://localhost:5000/api/admin/livres/${livre._id}`
        : 'http://localhost:5000/api/admin/livres';

      const response = await fetch(url, {
        method: livre ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(submitData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la sauvegarde du livre');
      }

      toast({
        title: "Succès",
        description: livre 
          ? "Le livre a été mis à jour avec succès"
          : "Le livre a été créé avec succès"
      });

      onClose(true);
    } catch (error) {
      console.error('Erreur détaillée:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose(false)}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {livre ? 'Modifier le livre' : 'Nouveau livre'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="titre">Titre</Label>
              <Input
                id="titre"
                name="titre"
                value={formData.titre}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="isbn">ISBN</Label>
              <Input
                id="isbn"
                name="isbn"
                value={formData.isbn}
                onChange={handleChange}
                required
                title="ISBN doit contenir 10 ou 13 chiffres"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="langue">Langue</Label>
              <Input
                id="langue"
                name="langue"
                value={formData.langue}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nombrePages">Nombre de pages</Label>
              <Input
                id="nombrePages"
                name="nombrePages"
                type="number"
                min="1"
                value={formData.nombrePages}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="couvertureUrl">URL de la couverture</Label>
            <Input
              id="couvertureUrl"
              name="couvertureUrl"
              value={formData.couvertureUrl}
              onChange={handleChange}
              required
              type="url"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="auteur">Auteur</Label>
              {!showNewAuteur ? (
                <div className="space-y-2">
                  <Select
                    defaultValue={formData.auteur}
                    value={formData.auteur}
                    onValueChange={(value) => {
                      setFormData(prev => ({
                        ...prev,
                        auteur: value
                      }));
                    }}
                    required={!showNewAuteur}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Sélectionner un auteur">
                        {formData.auteur && auteurs.length > 0
                          ? (auteurs.find(a => a._id === formData.auteur)?.nom || "Sélectionner un auteur")
                          : "Sélectionner un auteur"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {auteurs.map(auteur => (
                          <SelectItem key={auteur._id} value={auteur._id}>
                            {auteur.nom}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setShowNewAuteur(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Nouvel auteur
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Input
                    placeholder="Nom de l'auteur"
                    value={formData.nouvelAuteur.nom}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      nouvelAuteur: { ...prev.nouvelAuteur, nom: e.target.value }
                    }))}
                    required={showNewAuteur}
                  />
                  <Input
                    placeholder="Biographie"
                    value={formData.nouvelAuteur.bio}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      nouvelAuteur: { ...prev.nouvelAuteur, bio: e.target.value }
                    }))}
                  />
                  <Input
                    placeholder="Nationalité"
                    value={formData.nouvelAuteur.nationalite}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      nouvelAuteur: { ...prev.nouvelAuteur, nationalite: e.target.value }
                    }))}
                  />
                  <div className="flex justify-end space-x-2">
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => setShowNewAuteur(false)}
                    >
                      Annuler
                    </Button>
                    <Button 
                      type="button"
                      onClick={async () => {
                        try {
                          const response = await fetch('http://localhost:5000/api/admin/auteurs', {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                              'Authorization': `Bearer ${localStorage.getItem('token')}`
                            },
                            body: JSON.stringify(formData.nouvelAuteur)
                          });
                          
                          if (!response.ok) {
                            throw new Error('Erreur lors de la création de l\'auteur');
                          }
                          
                          const data = await response.json();
                          setFormData(prev => ({
                            ...prev,
                            auteur: data.auteur._id,
                            nouvelAuteur: { nom: '', bio: '', nationalite: '' }
                          }));
                          
                          await refreshLists();
                          setShowNewAuteur(false);
                          
                          toast({
                            title: "Succès",
                            description: "L'auteur a été créé avec succès"
                          });
                        } catch (error) {
                          toast({
                            variant: "destructive",
                            title: "Erreur",
                            description: error.message
                          });
                        }
                      }}
                    >
                      Créer l'auteur
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="statut">Statut</Label>
              <Select
                value={formData.statut}
                onValueChange={(value) => handleChange({ target: { name: 'statut', value } })}
                required
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="draft">Brouillon</SelectItem>
                    <SelectItem value="published">Publié</SelectItem>
                    <SelectItem value="hidden">Masqué</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="categories">Catégories</Label>
            <div className="space-y-2">
              {!showNewCategorie ? (
                <div className="space-y-2">
                   <div className="max-h-[100px] overflow-y-auto rounded-md border border-input bg-background">
                {categories.map(categorie => (
                  <label
                    key={categorie._id}
                    className="flex items-center space-x-2 px-3 py-2 hover:bg-accent"
                  >
                    <input
                      type="checkbox"
                      value={categorie._id}
                      checked={formData.categories.includes(categorie._id)}
                      onChange={(e) => {
                        const value = e.target.value;
                        const isChecked = e.target.checked;
                        setFormData(prev => ({
                          ...prev,
                          categories: isChecked
                            ? [...prev.categories, value]
                            : prev.categories.filter(id => id !== value)
                        }));
                      }}
                      className="h-4 w-4 rounded border-input"
                    />
                    <span className="text-sm">{categorie.nom}</span>
                  </label>
                ))}
              </div>
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setShowNewCategorie(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Nouvelle catégorie
                  </Button>
                </div>
              ) : (
                <div className="space-y-2 border rounded-md p-4">
                  <Input
                    placeholder="Nom de la catégorie"
                    value={formData.nouvelleCategorie.nom}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      nouvelleCategorie: { ...prev.nouvelleCategorie, nom: e.target.value }
                    }))}
                    required={showNewCategorie}
                  />
                  <Input
                    placeholder="Description"
                    value={formData.nouvelleCategorie.description}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      nouvelleCategorie: { ...prev.nouvelleCategorie, description: e.target.value }
                    }))}
                  />
                  <div className="flex justify-end space-x-2">
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => setShowNewCategorie(false)}
                    >
                      Annuler
                    </Button>
                    <Button 
                      type="button"
                      onClick={async () => {
                        try {
                          const response = await fetch('http://localhost:5000/api/admin/categories', {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                              'Authorization': `Bearer ${localStorage.getItem('token')}`
                            },
                            body: JSON.stringify(formData.nouvelleCategorie)
                          });
                          
                          if (!response.ok) {
                            throw new Error('Erreur lors de la création de la catégorie');
                          }
                          
                          const data = await response.json();
                          setFormData(prev => ({
                            ...prev,
                            categories: [...prev.categories, data.categorie._id],
                            nouvelleCategorie: { nom: '', description: '' }
                          }));
                          
                          await refreshLists();
                          setShowNewCategorie(false);
                          
                          toast({
                            title: "Succès",
                            description: "La catégorie a été créée avec succès"
                          });
                        } catch (error) {
                          toast({
                            variant: "destructive",
                            title: "Erreur",
                            description: error.message
                          });
                        }
                      }}
                    >
                      Créer la catégorie
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onClose(false)}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Sauvegarde...' : livre ? 'Modifier' : 'Créer'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DialogLivre;