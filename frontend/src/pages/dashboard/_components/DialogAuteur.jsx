import React, { useEffect, useState } from 'react';
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

const DialogAuteur = ({ open, onOpenChange, auteur, onSuccess }) => {
  const [formData, setFormData] = useState({
    nom: '',
    bio: '',
    nationalite: ''
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (auteur) {
      setFormData({
        nom: auteur.nom || '',
        bio: auteur.bio || '',
        nationalite: auteur.nationalite || ''
      });
    } else {
      setFormData({
        nom: '',
        bio: '',
        nationalite: ''
      });
    }
  }, [auteur]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = auteur
        ? `http://localhost:5000/api/admin/auteurs/${auteur._id}`
        : 'http://localhost:5000/api/admin/auteurs';

      const response = await fetch(url, {
        method: auteur ? 'PUT' : 'POST',
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
        description: `Auteur ${auteur ? 'modifié' : 'créé'} avec succès`
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
            {auteur ? 'Modifier l\'auteur' : 'Nouvel auteur'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              placeholder="Nom de l'auteur"
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
              placeholder="Biographie de l'auteur"
              value={formData.bio}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                bio: e.target.value
              }))}
            />
          </div>

          <div className="space-y-2">
            <Input
              placeholder="Nationalité"
              value={formData.nationalite}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                nationalite: e.target.value
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
              {loading ? 'Chargement...' : (auteur ? 'Modifier' : 'Créer')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DialogAuteur;