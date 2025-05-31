import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../../components/ui/dialog';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Label } from '../../../../components/ui/label';
import { Textarea } from '../../../../components/ui/textarea';
import { useToast } from '../../../../components/ui/use-toast';
import { auteurApi } from '../../../../api/auteurapi';

const DialogLivreAuteur = ({ isOpen, onClose, livre }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    titre: '',
    isbn: '',
    description: '',
    couvertureUrl: '',
    langue: '',
    nombrePages: '',
    categories: []
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (livre) {
      setFormData({
        titre: livre.titre,
        isbn: livre.isbn,
        description: livre.description,
        couvertureUrl: livre.couvertureUrl,
        categories: livre.categories.map(cat => cat._id),
        langue: livre.langue || '',
        nombrePages: livre.nombrePages || ''
      });
    } else {
      setFormData({
        titre: '',
        isbn: '',
        description: '',
        couvertureUrl: '',
        categories: [],
        langue: '',
        nombrePages: ''
      });
    }
  }, [livre]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/categories', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        const data = await response.json();
        setCategories(Array.isArray(data) ? data : []);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les catégories"
        });
      }
    };
    fetchCategories();
  }, [toast]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = {
        titre: formData.titre,
        isbn: formData.isbn,
        description: formData.description,
        couvertureUrl: formData.couvertureUrl,
        langue: formData.langue,
        nombrePages: parseInt(formData.nombrePages, 10), // Convertir en nombre
        categories: formData.categories
      };

      console.log('Données à envoyer:', submitData); // Debug log

      let response;
      if (livre) {
        response = await auteurApi.updateLivre(livre._id, submitData);
        toast({
          title: "Succès",
          description: response.message || "Livre mis à jour avec succès"
        });
      } else {
        response = await auteurApi.publierLivre(submitData);
        toast({
          title: "Succès",
          description: response.message || "Livre créé avec succès (en attente de validation)"
        });
      }

      onClose(true);
    } catch (error) {
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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {livre ? 'Modifier le livre' : 'Nouveau livre'}
          </DialogTitle>
          {!livre && (
            <p className="text-sm text-muted-foreground mt-2">
              Note : Votre livre sera initialement en statut "brouillon". Un administrateur devra le valider pour qu'il soit publié.
            </p>
          )}
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="titre">Titre</Label>
            <Input
              id="titre"
              name="titre"
              value={formData.titre}
              onChange={handleChange}
              required
              maxLength={100}
              className="h-8"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="isbn">ISBN</Label>
              <Input
                id="isbn"
                name="isbn"
                value={formData.isbn}
                onChange={handleChange}
                required
                pattern="[0-9]{10}|[0-9]{13}"
                title="ISBN doit contenir 10 ou 13 chiffres"
                className="h-8"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="langue">Langue</Label>
              <Input
                id="langue"
                name="langue"
                value={formData.langue}
                onChange={handleChange}
                required
                className="h-8"
              />
            </div>
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
              className="h-8"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={3}
              maxLength={500}
              className="resize-none"
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
              className="h-8"
            />
          </div>

          <div className="space-y-2">
            <Label>Catégories</Label>
            <div className="max-h-[100px] overflow-y-auto rounded-md border p-1 space-y-1">
              {categories.map(categorie => (
                <label
                  key={categorie._id}
                  className="flex items-center space-x-2 px-2 py-1 hover:bg-accent rounded-sm text-sm"
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
                    className="h-3 w-3"
                  />
                  <span>{categorie.nom}</span>
                </label>
              ))}
            </div>
          </div>

          {livre && livre.statut === 'draft' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-yellow-800">
                Ce livre est en attente de validation par un administrateur.
              </p>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onClose(false)}
              className="h-8"
            >
              Annuler
            </Button>
            <Button type="submit" disabled={loading} className="h-8">
              {loading ? 'Sauvegarde...' : livre ? 'Modifier' : 'Créer'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DialogLivreAuteur;