import React, { useState, useEffect, useCallback } from 'react';
import { Book, Plus, Pencil, Trash2 } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../../components/ui/tooltip";
import { useToast } from '../../../components/ui/use-toast';
import DialogLivreAuteur from './_components/DialogLivreAuteur';
import { auteurApi } from '../../../api/auteurapi';

const MesLivresPage = () => {
  const [livres, setLivres] = useState([]);
  const [selectedLivre, setSelectedLivre] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const fetchLivres = useCallback(async () => {
    try {
      const data = await auteurApi.getMesLivres();
      setLivres(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger vos livres"
      });
    }
  }, [toast]);

  useEffect(() => {
    fetchLivres();
  }, [fetchLivres]);

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir demander la suppression de ce livre ?')) {
      try {
        await auteurApi.demanderSuppression(id);
        toast({
          title: "Succès",
          description: "Votre demande de suppression a été envoyée à l'administration"
        });
        fetchLivres();
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: error.message
        });
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Book className="w-8 h-8 text-indigo-600" />
          <h1 className="text-2xl font-bold">Mes Livres</h1>
        </div>
        <Button onClick={() => {
          setSelectedLivre(null);
          setIsDialogOpen(true);
        }}>
          <Plus className="w-4 h-4 mr-2" />
          Nouveau Livre
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Titre</TableHead>
              <TableHead>ISBN</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Date de publication</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {livres.map((livre) => (
              <TableRow key={livre._id}>
                <TableCell>{livre.titre}</TableCell>
                <TableCell>{livre.isbn}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    livre.statut === 'published' ? 'bg-green-100 text-green-800' :
                    livre.statut === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {livre.statut === 'published' ? 'Publié' :
                     livre.statut === 'draft' ? 'Brouillon' : 'Masqué'}
                  </span>
                </TableCell>
                <TableCell>
                  {new Date(livre.datePublication).toLocaleDateString('fr-FR')}
                </TableCell>
                <TableCell className="flex gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            setSelectedLivre(livre);
                            setIsDialogOpen(true);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Modifier</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDelete(livre._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Demander la suppression</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <DialogLivreAuteur
        isOpen={isDialogOpen}
        onClose={(refresh = false) => {
          setIsDialogOpen(false);
          if (refresh) fetchLivres();
        }}
        livre={selectedLivre}
      />
    </div>
  );
};

export default MesLivresPage;