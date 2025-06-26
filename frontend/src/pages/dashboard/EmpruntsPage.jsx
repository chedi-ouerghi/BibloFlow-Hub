import { useState, useEffect } from 'react';
import { BookOpen, Plus } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../components/ui/select";
import { useToast } from '../../components/ui/use-toast';
import AnalyseEmprunt from './_components/AnalyseEmprunt';

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

const EmpruntsPage = () => {
  const [emprunts, setEmprunts] = useState([]);
  const [filtreStatut, setFiltreStatut] = useState('all');
  const [statistiques, setStatistiques] = useState({
    total: 0,
    enCours: 0,
    enRetard: 0
  });
  const { toast } = useToast();

  const fetchEmprunts = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/emprunts`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error('Erreur lors de la récupération des emprunts');
      const data = await response.json();
      setEmprunts(data.emprunts);
      setStatistiques(data.statistiques);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message
      });
    }
  };

  useEffect(() => {
    fetchEmprunts();
  }, [filtreStatut]);

  const handleCreerEmprunt = async () => {
    // À implémenter : Ouvrir une fenêtre de dialogue pour créer un nouvel emprunt
    console.log("Créer un emprunt");
  };

  const handleRendreEmprunt = async (empruntId) => {
    if (!window.confirm('Confirmez-vous le retour de ce livre ?')) return;

    try {
      const response = await fetch(`http://localhost:5000/api/admin/emprunts/${empruntId}/retour`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Erreur lors du retour du livre');

      toast({
        title: "Succès",
        description: "Le livre a été marqué comme rendu"
      });

      fetchEmprunts();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message
      });
    }
  };

  const handleUpdateStatut = async (empruntId, nouvelEtat) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/emprunts/${empruntId}/statut`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ etat: nouvelEtat })
      });

      if (!response.ok) throw new Error('Erreur lors de la mise à jour du statut');

      toast({
        title: "Succès",
        description: "Le statut a été mis à jour"
      });

      fetchEmprunts();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message
      });
    }
  };

  const getStatutBadgeClass = (emprunt) => {
    if (emprunt.estRendu) return 'bg-green-100 text-green-800';
    if (emprunt.etat === 'en_retard') return 'bg-red-100 text-red-800';
    return 'bg-yellow-100 text-yellow-800';
  };

  const getStatutText = (emprunt) => {
    if (emprunt.estRendu) return 'Rendu';
    if (emprunt.etat === 'en_retard') return 'En retard';
    return 'En cours';
  };

  const getFilteredEmprunts = () => {
    switch (filtreStatut) {
      case 'en_cours':
        return emprunts.filter(emprunt => !emprunt.estRendu && emprunt.etat !== 'en_retard');
      case 'en_retard':
        return emprunts.filter(emprunt => emprunt.etat === 'en_retard');
      default:
        return emprunts;
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <BookOpen className="w-8 h-8 text-indigo-600" />
          <div>
            <h1 className="text-2xl font-bold">Gestion des Emprunts</h1>
            <div className="flex gap-4 mt-2">
              <div className="text-sm text-gray-500">
                Total: <span className="font-bold">{statistiques.total}</span>
              </div>
              <div className="text-sm text-yellow-500">
                En cours: <span className="font-bold">{statistiques.enCours}</span>
              </div>
              <div className="text-sm text-red-500">
                En retard: <span className="font-bold">{statistiques.enRetard}</span>
              </div>
            </div>
          </div>
        </div>
        <Button onClick={handleCreerEmprunt}>
          <Plus className="w-4 h-4 mr-2" />
          Nouvel emprunt
        </Button>
      </div>

      <Tabs defaultValue="analyse" className="w-full">
        <TabsList>
          <TabsTrigger value="analyse">Analyse</TabsTrigger>
          <TabsTrigger value="table">Table</TabsTrigger>
        </TabsList>
        
        <TabsContent value="analyse">
          <AnalyseEmprunt emprunts={emprunts} statistiques={statistiques} />
        </TabsContent>
        
        <TabsContent value="table">
          <div className="mb-4">
            <Select value={filtreStatut} onValueChange={setFiltreStatut}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les emprunts</SelectItem>
                <SelectItem value="en_cours">En cours</SelectItem>
                <SelectItem value="en_retard">En retard</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Livre</TableHead>
                  <TableHead>Emprunteur</TableHead>
                  <TableHead>Date d'emprunt</TableHead>
                  <TableHead>Date de retour prévue</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {getFilteredEmprunts().map((emprunt) => (
                  <TableRow key={emprunt._id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {emprunt.livreId.titre}
                        <span className="text-xs text-gray-500">
                          ({emprunt.livreId.isbn})
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{emprunt.userId.username}</TableCell>
                    <TableCell>
                      {formatDate(emprunt.dateEmprunt)}
                    </TableCell>
                    <TableCell>
                      {formatDate(emprunt.dateRetourPrevue)}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatutBadgeClass(emprunt)}`}>
                        {getStatutText(emprunt)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {!emprunt.estRendu && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRendreEmprunt(emprunt._id)}
                          >
                            Rendre
                          </Button>
                        )}
                        <Select onValueChange={(value) => handleUpdateStatut(emprunt._id, value)}>
                          <SelectTrigger className="w-[130px]">
                            <SelectValue placeholder="Changer statut" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en_cours">En cours</SelectItem>
                            <SelectItem value="en_retard">En retard</SelectItem>
                            <SelectItem value="rendu">Rendu</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmpruntsPage;