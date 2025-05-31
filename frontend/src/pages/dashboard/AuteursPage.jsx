import React, { useState, useEffect } from 'react';
import { User, Plus, Pencil, Trash2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../components/ui/tooltip";
import { useToast } from '../../components/ui/use-toast';
import DialogAuteur from './_components/DialogAuteur';

const AuteursPage = () => {
  const [auteurs, setAuteurs] = useState([]);
  const [selectedAuteur, setSelectedAuteur] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const fetchAuteurs = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/auteurs', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setAuteurs(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les auteurs"
      });
    }
  };

  useEffect(() => {
    fetchAuteurs();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet auteur ?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/admin/auteurs/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.ok) {
          toast({
            title: "Succès",
            description: "Auteur supprimé avec succès"
          });
          fetchAuteurs();
        } else {
          const error = await response.json();
          throw new Error(error.message);
        }
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
          <User className="w-8 h-8 text-indigo-600" />
          <h1 className="text-2xl font-bold">Gestion des Auteurs</h1>
        </div>
        <Button onClick={() => {
          setSelectedAuteur(null);
          setIsDialogOpen(true);
        }}>
          <Plus className="w-4 h-4 mr-2" />
          Nouvel Auteur
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Nationalité</TableHead>
              <TableHead>Biographie</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {auteurs.map((auteur) => (
              <TableRow key={auteur._id}>
                <TableCell>{auteur.nom}</TableCell>
                <TableCell>{auteur.nationalite || '-'}</TableCell>
                <TableCell>{auteur.bio ? (
                  <div className="max-w-md truncate">{auteur.bio}</div>
                ) : '-'}</TableCell>
                <TableCell className="flex gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            setSelectedAuteur(auteur);
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
                          onClick={() => handleDelete(auteur._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Supprimer</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <DialogAuteur
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        auteur={selectedAuteur}
        onSuccess={() => {
          setIsDialogOpen(false);
          fetchAuteurs();
        }}
      />
    </div>
  );
};

export default AuteursPage;