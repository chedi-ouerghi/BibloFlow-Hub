import { useState, useEffect } from 'react';
import { PieChart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { useToast } from '../../../components/ui/use-toast';
import { auteurApi } from '../../../api/auteurapi';

const MesAnalysesPage = () => {
  const [analyses, setAnalyses] = useState([]);
  const { toast } = useToast();

  const fetchAnalyses = async () => {
    try {
      const data = await auteurApi.getMesAnalyses();
      // Transformer les données en tableau si nécessaire
      const analysesArray = data.commentaires ? [{
        commentaires: data.commentaires,
        notes: data.notes,
        statistiques: data.statistiques
      }] : [];
      setAnalyses(analysesArray);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les analyses"
      });
      setAnalyses([]); // Initialiser avec un tableau vide en cas d'erreur
    }
  };

  useEffect(() => {
    fetchAnalyses();
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
        <PieChart className="w-8 h-8 text-indigo-600" />
        <h1 className="text-2xl font-bold">Analyses de mes Livres</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {analyses && analyses.length > 0 ? (
          analyses.map((analyse, index) => (
            <Card key={index} className="shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle>Analyse globale</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 bg-indigo-50 rounded-lg">
                      <p className="text-2xl font-bold text-indigo-600">
                        {analyse.statistiques?.totalCommentaires || 0}
                      </p>
                      <p className="text-sm text-gray-600">Commentaires</p>
                    </div>
                    <div className="p-4 bg-amber-50 rounded-lg">
                      <p className="text-2xl font-bold text-amber-600">
                        {analyse.statistiques?.totalNotes || 0}
                      </p>
                      <p className="text-sm text-gray-600">Notes</p>
                    </div>
                    <div className="p-4 bg-emerald-50 rounded-lg">
                      <p className="text-2xl font-bold text-emerald-600">
                        {analyse.statistiques?.moyenneNotes?.toFixed(1) || '0.0'}
                      </p>
                      <p className="text-sm text-gray-600">Note moyenne</p>
                    </div>
                  </div>

                  {/* Liste des commentaires */}
                  {analyse.commentaires && analyse.commentaires.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Commentaires récents</h3>
                      <div className="space-y-3">
                        {analyse.commentaires.slice(0, 5).map((commentaire) => (
                          <div 
                            key={commentaire._id} 
                            className="p-3 bg-gray-50 rounded-lg"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <p className="font-medium text-gray-900">
                                {commentaire.userId?.username || 'Anonyme'}
                              </p>
                              <span className="text-sm text-gray-500">
                                {formatDate(commentaire.createdAt)}
                              </span>
                            </div>
                            <p className="text-gray-600">{commentaire.contenu}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-2 text-center py-8 text-gray-500">
            Aucune analyse disponible
          </div>
        )}
      </div>
    </div>
  );
};

export default MesAnalysesPage;