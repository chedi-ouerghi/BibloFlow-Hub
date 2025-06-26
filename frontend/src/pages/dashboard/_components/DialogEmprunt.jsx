import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../../components/ui/dialog';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../../components/ui/select";
import { useToast } from '../../../components/ui/use-toast';

const DialogEmprunt = ({ isOpen, onClose, emprunt = null }) => {
  const [users, setUsers] = useState([]);
  const [livres, setLivres] = useState([]);
  const [formData, setFormData] = useState({
    userId: '',
    livreId: '',
    dateRetourPrevue: '',
    commentaires: {
      etatLivreDepart: ''
    }
  });
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      fetchUsersAndLivres();
      if (emprunt) {
        setFormData({
          userId: emprunt.userId._id,
          livreId: emprunt.livreId._id,
          dateRetourPrevue: new Date(emprunt.dateRetourPrevue).toISOString().split('T')[0],
          commentaires: {
            etatLivreDepart: emprunt.commentaires?.etatLivreDepart || ''
          }
        });
      }
    }
  }, [isOpen, emprunt]);

  const fetchUsersAndLivres = async () => {
    try {
      const [usersResponse, livresResponse] = await Promise.all([
        fetch('http://localhost:5000/api/admin/users', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }),
        fetch('http://localhost:5000/api/admin/livres', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
      ]);

      const usersData = await usersResponse.json();
      const livresData = await livresResponse.json();

      // Filtrer les livres qui ne sont pas déjà empruntés
      const livresDisponibles = livresData.filter(livre => 
        !livre.estEmprunte || (emprunt && livre._id === emprunt.livreId._id)
      );

      setUsers(usersData);
      setLivres(livresDisponibles);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les données"
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = emprunt
        ? `http://localhost:5000/api/admin/emprunts/${emprunt._id}`
        : 'http://localhost:5000/api/admin/emprunts';
      
      const response = await fetch(url, {
        method: emprunt ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la sauvegarde');
      }

      toast({
        title: "Succès",
        description: `Emprunt ${emprunt ? 'modifié' : 'créé'} avec succès`
      });

      onClose(true);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message
      });
    }
  };

  const handleChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{emprunt ? 'Modifier l\'emprunt' : 'Nouvel emprunt'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="user">Utilisateur</Label>
              <Select
                value={formData.userId}
                onValueChange={(value) => handleChange('userId', value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un utilisateur" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user._id} value={user._id}>
                      {user.username}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="livre">Livre</Label>
              <Select
                value={formData.livreId}
                onValueChange={(value) => handleChange('livreId', value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un livre" />
                </SelectTrigger>
                <SelectContent>
                  {livres.map((livre) => (
                    <SelectItem key={livre._id} value={livre._id}>
                      {livre.titre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateRetour">Date de retour prévue</Label>
              <Input
                id="dateRetour"
                type="date"
                value={formData.dateRetourPrevue}
                onChange={(e) => handleChange('dateRetourPrevue', e.target.value)}
                required
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="etatLivre">État du livre au départ</Label>
              <Input
                id="etatLivre"
                value={formData.commentaires.etatLivreDepart}
                onChange={(e) => handleChange('commentaires.etatLivreDepart', e.target.value)}
                placeholder="Description de l'état du livre"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onClose()}>
              Annuler
            </Button>
            <Button type="submit">
              {emprunt ? 'Modifier' : 'Créer'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DialogEmprunt;