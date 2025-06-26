import { useState, useEffect } from 'react';
import { MessageSquare, Eye, EyeOff } from 'lucide-react';
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
import { Badge } from '../../components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "../../components/ui/dialog";

const CommentairesPage = () => {
  const [commentaires, setCommentaires] = useState([]);
  const [selectedComment, setSelectedComment] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const fetchCommentaires = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/commentaires', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setCommentaires(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les commentaires"
      });
    }
  };

  useEffect(() => {
    fetchCommentaires();
  }, []);

  const handleModeration = async (commentaireId, nouvelEtat, motif = '') => {
    if (!nouvelEtat && !motif) {
      motif = window.prompt('Veuillez entrer un motif de modération :');
      if (!motif) return; // L'utilisateur a annulé
    }

    try {
      const response = await fetch(`http://localhost:5000/api/admin/commentaires/${commentaireId}/moderation`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          estVisible: nouvelEtat,
          motif: motif
        })
      });

      if (response.ok) {
        toast({
          title: "Succès",
          description: "Le commentaire a été modéré avec succès"
        });
        fetchCommentaires();
      } else {
        throw new Error("Erreur lors de la modération");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message
      });
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    };
    return new Intl.DateTimeFormat('fr-FR', options).format(date);
  };

  const handleCommentClick = (commentaire) => {
    setSelectedComment(commentaire);
    setIsDialogOpen(true);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <MessageSquare className="w-8 h-8 text-indigo-600" />
          <h1 className="text-2xl font-bold">Gestion des Commentaires</h1>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Livre</TableHead>
              <TableHead>Utilisateur</TableHead>
              <TableHead>Commentaire</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>État</TableHead>
              <TableHead>Modération</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {commentaires.map((commentaire) => (
              <TableRow key={commentaire._id}>
                <TableCell>{commentaire.livreId?.titre || 'Livre supprimé'}</TableCell>
                <TableCell>{commentaire.userId?.username || 'Utilisateur supprimé'}</TableCell>
                <TableCell>
                  <div 
                    className="max-w-md truncate cursor-pointer hover:text-indigo-600"
                    onDoubleClick={() => handleCommentClick(commentaire)}
                  >
                    {commentaire.contenu.length > 70 
                      ? `${commentaire.contenu.substring(0, 25)}...`
                      : commentaire.contenu}
                  </div>
                </TableCell>
                <TableCell>{formatDate(commentaire.createdAt)}</TableCell>
                <TableCell>
                  {commentaire.estVisible ? (
                    <Badge variant="success">Visible</Badge>
                  ) : (
                    <Badge variant="destructive">Masqué</Badge>
                  )}
                </TableCell>
                <TableCell>
  {commentaire.dateModeration ? (
    <div className="text-sm">
      <p>Par: {commentaire.moderateurId?.username}</p>
      <p className="text-gray-500">{formatDate(commentaire.dateModeration)}</p>
      <p>
        {commentaire.motifModeration.length > 50
          ? `${commentaire.motifModeration.substring(0, 50)}...`
          : commentaire.motifModeration}
      </p>
    </div>
) : (
  <span className="text-blue-500 italic">pas encore modéré</span>
)}

</TableCell>


                <TableCell>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={commentaire.estVisible ? "destructive" : "outline"}
                          size="icon"
                          onClick={() => handleModeration(commentaire._id, !commentaire.estVisible)}
                        >
                          {commentaire.estVisible ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{commentaire.estVisible ? 'Masquer' : 'Afficher'}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Commentaire complet</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {selectedComment && (
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">
                    Par <span className="font-semibold">{selectedComment.userId?.username || 'Utilisateur supprimé'}</span>
                  </p>
                  <p className="text-gray-900 whitespace-pre-wrap">{selectedComment.contenu}</p>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CommentairesPage;