import { useEffect, useState } from 'react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { useToast } from '../../../components/ui/use-toast';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '../../../components/ui/dialog';

const DialogCategorie = ({ open, onOpenChange, categorie, onSuccess }) => {
  const [formData, setFormData] = useState({
    nom: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (categorie) {
      setFormData({
        nom: categorie.nom || '',
        description: categorie.description || ''
      });
    } else {
      setFormData({
        nom: '',
        description: ''
      });
    }
  }, [categorie]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = categorie
        ? `http://localhost:5000/api/admin/categories/${categorie._id}`
        : 'http://localhost:5000/api/admin/categories';

      const response = await fetch(url, {
        method: categorie ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      toast({
        title: "Succès",
        description: `Catégorie ${categorie ? 'modifiée' : 'créée'} avec succès`
      });

      onSuccess();
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {categorie ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              placeholder="Nom de la catégorie"
              value={formData.nom}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                nom: e.target.value
              }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Textarea
              placeholder="Description de la catégorie"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                description: e.target.value
              }))}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Chargement...' : (categorie ? 'Modifier' : 'Créer')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DialogCategorie;