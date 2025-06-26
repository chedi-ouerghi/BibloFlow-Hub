import { useState, useEffect } from 'react';
import { BookOpen, Plus, Pencil, Trash2, Eye, EyeOff, Slash } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "../../components/ui/tooltip";
import DialogLivre from './_components/DialogLivre';
import AnalyseLivre from './_components/AnalyseLivre';
import { useToast } from '../../components/ui/use-toast';

const LivresPage = () => {
  const [livres, setLivres] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedLivre, setSelectedLivre] = useState(null);
  const { toast } = useToast();

  const fetchLivres = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/livres', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error('Erreur lors de la récupération des livres');
      const data = await response.json();
      setLivres(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message
      });
    }
  };

  useEffect(() => {
    fetchLivres();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce livre ?')) return;

    try {
      const response = await fetch(`http://localhost:5000/api/admin/livres/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) throw new Error('Erreur lors de la suppression');

      toast({
        title: "Succès",
        description: "Le livre a été supprimé avec succès"
      });

      fetchLivres();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message
      });
    }
  };

  const handleEdit = (livre) => {
    setSelectedLivre(livre);
    setIsDialogOpen(true);
  };

  const handleCreate = () => {
    setSelectedLivre(null);
    setIsDialogOpen(true);
  };

  const handleDialogClose = (refresh = false) => {
    setIsDialogOpen(false);
    setSelectedLivre(null);
    if (refresh) fetchLivres();
  };

const getStatutIcon = (statut) => {
  switch (statut) {
    case 'draft':
      return <EyeOff className="h-4 w-4" />;
    case 'published':
      return <Eye className="h-4 w-4" />;
    case 'hidden':
      return <Slash className="h-4 w-4" />;
    default:
      return <Eye className="h-4 w-4" />;
  }
};

const getStatusBadgeStyle = (statut) => {
  const styles = {
    published: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    draft: 'bg-amber-50 text-amber-700 border border-amber-200',
    hidden: 'bg-rose-50 text-rose-700 border border-rose-200'
  };
  return `px-3 py-1 rounded-full text-xs font-medium ${styles[statut] || styles.draft}`;
};

  const handleToggleStatut = async (livre) => {
  const nextStatut = {
    draft: 'published',
    published: 'hidden',
    hidden: 'draft',
  }[livre.statut];

  try {
    const response = await fetch(`http://localhost:5000/api/admin/livres/${livre._id}/statut`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ statut: nextStatut })
    });

    if (!response.ok) throw new Error('Échec de la mise à jour du statut');

    toast({
      title: 'Succès',
      description: `Le statut a été mis à jour en "${nextStatut}"`
    });

    fetchLivres(); // refresh la liste
  } catch (error) {
    toast({
      variant: 'destructive',
      title: 'Erreur',
      description: error.message
    });
  }
};


  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <BookOpen className="w-8 h-8 text-indigo-600" />
          <h1 className="text-2xl font-bold">Gestion des Livres</h1>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Nouveau livre
        </Button>
      </div>

      <Tabs defaultValue="analyse" className="w-full">
        <TabsList>
          <TabsTrigger value="analyse">Analyse</TabsTrigger>
          <TabsTrigger value="table">Table</TabsTrigger>
        </TabsList>
        
        <TabsContent value="analyse">
          <AnalyseLivre livres={livres} />
        </TabsContent>
        
        <TabsContent value="table">
          <div className="rounded-xl overflow-hidden border bg-white shadow-sm">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="font-semibold">Titre</TableHead>
                  <TableHead className="font-semibold">ISBN</TableHead>
                  <TableHead className="font-semibold">Auteur</TableHead>
                  <TableHead className="font-semibold">Langue</TableHead>
                  <TableHead className="font-semibold w-24">Pages</TableHead>
                  <TableHead className="font-semibold">Catégories</TableHead>
                  <TableHead className="font-semibold">Statut</TableHead>
                  <TableHead className="text-right font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {livres.map((livre) => (
                  <TableRow key={livre._id} className="hover:bg-gray-50/50 transition-colors">
                    <TableCell className="font-medium">{livre.titre}</TableCell>
                    <TableCell className="font-mono text-sm">{livre.isbn}</TableCell>
                    <TableCell>{livre.auteur?.nom || 'N/A'}</TableCell>
                    <TableCell>{livre.langue || 'N/A'}</TableCell>
                    <TableCell className="text-center">
                      {livre.nombrePages ? 
                        <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs">
                          {livre.nombrePages}
                        </span> : 'N/A'
                      }
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {livre.categories?.map(cat => (
                          <span key={cat._id} 
                            className="inline-flex items-center px-2 py-1 rounded-full 
                              text-xs bg-gray-100 text-gray-700">
                            {cat.nom}
                          </span>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={getStatusBadgeStyle(livre.statut)}>
                        {livre.statut === 'published' ? 'Publié' :
                         livre.statut === 'draft' ? 'Brouillon' : 'Masqué'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleToggleStatut(livre)}
                                className="hover:bg-gray-100"
                              >
                                {getStatutIcon(livre.statut)}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Changer statut</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEdit(livre)}
                                className="hover:bg-gray-100"
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
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDelete(livre._id)}
                                className="hover:bg-red-100 text-red-600"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Supprimer</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      <DialogLivre
        isOpen={isDialogOpen}
        onClose={handleDialogClose}
        livre={selectedLivre}
      />
    </div>
  );
};

export default LivresPage;