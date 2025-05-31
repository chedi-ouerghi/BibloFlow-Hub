import { useState, useEffect } from 'react';
import { FileText } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../components/ui/table';
import { useToast } from '../../../components/ui/use-toast';
import { auteurApi } from '../../../api/auteurapi';
import AnalyseEmprunt from '../_components/AnalyseEmprunt';

const MesEmpruntsPage = () => {
  const [emprunts, setEmprunts] = useState([]);
  const { toast } = useToast();

  const fetchEmprunts = async () => {
    try {
      const data = await auteurApi.getMesEmprunts();
      // S'assurer que emprunts est toujours un tableau
      setEmprunts(Array.isArray(data) ? data : []);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les emprunts"
      });
      // En cas d'erreur, initialiser avec un tableau vide
      setEmprunts([]);
    }
  };

  useEffect(() => {
    fetchEmprunts();
  }, []);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-8">
        <FileText className="w-8 h-8 text-indigo-600" />
        <h1 className="text-2xl font-bold">Suivi des Emprunts</h1>
      </div>

      <div className="mb-8">
        <AnalyseEmprunt emprunts={emprunts} />
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
            </TableRow>
          </TableHeader>
          <TableBody>
            {emprunts && emprunts.length > 0 ? (
              emprunts.map((emprunt) => (
                <TableRow key={emprunt._id}>
                  <TableCell>{emprunt.livreId?.titre || 'N/A'}</TableCell>
                  <TableCell>{emprunt.userId?.username || 'N/A'}</TableCell>
                  <TableCell>{formatDate(emprunt.dateEmprunt)}</TableCell>
                  <TableCell>{formatDate(emprunt.dateRetourPrevue)}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      emprunt.estRendu ? 'bg-green-100 text-green-800' :
                      emprunt.estEnRetard ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {emprunt.estRendu ? 'Rendu' :
                       emprunt.estEnRetard ? 'En retard' : 'En cours'}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4 text-gray-500">
                  Aucun emprunt trouvé
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default MesEmpruntsPage;