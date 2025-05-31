import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useToast } from '../components/ui/use-toast';

import BookCover from './_components/BookCover';
import BookDetails from './_components/BookDetails';
import CommentSection from './_components/CommentSection';
import RatingSection from './_components/RatingSection';
import EmpruntDialog from './_components/EmpruntDialog';

import {
  getLivreDetails,
  getLivreCommentaires,
  addCommentaire,
  updateCommentaire,
  deleteCommentaire,
  addNote,
  updateNote,
  getUserNote,
  emprunterLivre
} from '../api/publicapi';
import { getCurrentUser, verifierLivreDejaEmprunte } from '../api/authapi';

const LivreDetails = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [livre, setLivre] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [commentaires, setCommentaires] = useState([]);
  const [nouveauCommentaire, setNouveauCommentaire] = useState('');
  const [userNote, setUserNote] = useState(null);
  const [editingCommentaire, setEditingCommentaire] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [showEmpruntDialog, setShowEmpruntDialog] = useState(false);
  const [etatLivreDepart, setEtatLivreDepart] = useState('');
  const [empruntSuccess, setEmpruntSuccess] = useState(false);
  const [empruntExistant, setEmpruntExistant] = useState(false);
  const [joursRestants, setJoursRestants] = useState(0);
  const [isBookHovered, setIsBookHovered] = useState(false);
  const [isEmpruntLoading, setIsEmpruntLoading] = useState(false);
  const currentUser = getCurrentUser();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [livreData, commentairesData, noteData, empruntVerif] = await Promise.all([
          getLivreDetails(id),
          getLivreCommentaires(id),
          currentUser ? getUserNote(id) : Promise.resolve({ note: null }),
          currentUser ? verifierLivreDejaEmprunte(id) : Promise.resolve({ empruntExistant: false })
        ]);

        setLivre(livreData);
        setCommentaires(commentairesData || []);
        setUserNote(noteData.note);
        setEmpruntExistant(empruntVerif.empruntExistant);
        setJoursRestants(empruntVerif.joursRestants || 0);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Une erreur est survenue');
        setLoading(false);
      }
    };

    fetchData();
  }, [id, currentUser]);

  const handleNoteSubmit = async (newNote) => {
    try {
      if (!currentUser) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour noter",
          variant: "destructive"
        });
        return;
      }

      const response = await (userNote ? updateNote(id, newNote) : addNote(id, newNote));
      setUserNote(newNote);
      toast({
        title: "Succès",
        description: userNote ? "Note mise à jour" : "Note ajoutée"
      });

      setLivre(prev => ({
        ...prev,
        noteMoyenne: response.noteMoyenne,
        nombreNotes: response.nombreNotes
      }));
    } catch (err) {
      toast({
        title: "Erreur",
        description: err.message || "Erreur lors de l'ajout de la note",
        variant: "destructive"
      });
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour commenter",
        variant: "destructive"
      });
      return;
    }
    if (!nouveauCommentaire.trim()) {
      toast({
        title: "Erreur",
        description: "Le commentaire ne peut pas être vide",
        variant: "destructive"
      });
      return;
    }
    try {
      const response = await addCommentaire(id, nouveauCommentaire, userNote || 1);
      setCommentaires(prev => [response.commentaire, ...prev]);
      setNouveauCommentaire('');
      toast({
        title: "Succès",
        description: "Commentaire ajouté"
      });
    } catch (err) {
      toast({
        title: "Erreur",
        description: err.message || "Erreur lors de l'ajout du commentaire",
        variant: "destructive"
      });
    }
  };

  const handleUpdateCommentaire = async () => {
    try {
      const response = await updateCommentaire(
        id,
        editingCommentaire._id,
        editingCommentaire.contenu
      );
      
      setCommentaires(prev =>
        prev.map(c =>
          c._id === editingCommentaire._id ? response.commentaire : c
        )
      );
      
      setIsEditDialogOpen(false);
      setEditingCommentaire(null);
      
      toast({
        title: "Succès",
        description: "Commentaire mis à jour"
      });
    } catch (err) {
      toast({
        title: "Erreur",
        description: err.message || "Erreur lors de la mise à jour du commentaire",
        variant: "destructive"
      });
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce commentaire ?')) {
      return;
    }
    
    try {
      await deleteCommentaire(id, commentId);
      setCommentaires(prev => prev.filter(c => c._id !== commentId));
      toast({
        title: "Succès",
        description: "Commentaire supprimé"
      });
    } catch (err) {
      toast({
        title: "Erreur",
        description: err.message || "Erreur lors de la suppression du commentaire",
        variant: "destructive"
      });
    }
  };

  const handleEmprunt = async () => {
    try {
      setIsEmpruntLoading(true);
      if (!currentUser || !currentUser.roles.includes('user')) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté en tant qu'utilisateur pour emprunter",
          variant: "destructive"
        });
        return;
      }

      if (empruntExistant) {
        const verif = await verifierLivreDejaEmprunte(id);
        toast({
          title: "Impossible d'emprunter",
          description: `Vous avez déjà emprunté ce livre et il vous reste ${verif.joursRestants} jours`,
          variant: "destructive"
        });
        return;
      }

      await emprunterLivre(id, { etatLivreDepart });
      setEmpruntSuccess(true);
      
      setTimeout(() => {
        setShowEmpruntDialog(false);
        toast({
          title: "Succès !",
          description: "Le livre a été emprunté avec succès",
          variant: "default",
        });
      }, 1500);
    } catch (err) {
      toast({
        title: "Erreur",
        description: err.message || "Une erreur est survenue lors de l'emprunt",
        variant: "destructive",
      });
    } finally {
      setIsEmpruntLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-gray-50 flex items-center justify-center">
        <motion.div
          className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-gray-50 flex items-center justify-center">
        <div className="text-xl text-red-600 bg-red-50 px-6 py-4 rounded-lg shadow-sm border border-red-100">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Fond immersif avec cercle central */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <motion.div
            className="w-[85vh] h-[85vh] rounded-full opacity-20
              bg-[radial-gradient(circle_at_center,_#4f46e5_0%,_#818cf8_50%,_#c7d2fe_100%)]"
            animate={{
              scale: [1, 1.02, 1],
              opacity: [0.2, 0.25, 0.2],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.8),rgba(255,255,255,0.95))]" />
      </div>
      
      <div className="relative min-h-screen backdrop-blur-[2px] p-8">
        {/* En-tête avec bouton retour */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto"
        >
          <Link to="/">
            <motion.button
              className="group flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-all"
              whileHover={{ x: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative">
                <ArrowLeft className="w-5 h-5 transition-transform group-hover:scale-110" />
                <motion.div
                  className="absolute inset-0 bg-indigo-100 rounded-full -z-10"
                  initial={{ scale: 0 }}
                  whileHover={{ scale: 1.5 }}
                />
              </span>
              <span className="font-medium">Retour</span>
            </motion.button>
          </Link>
        </motion.div>

        {/* Grille principale responsive */}
        <motion.div
          className="max-w-7xl mx-auto mt-8 grid lg:grid-cols-[400px_1fr_400px] md:grid-cols-[1fr_400px] 
            gap-8 relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Colonne gauche - Détails du livre */}
          <div className="order-2 lg:order-1">
            <BookDetails livre={livre} isHovered={isBookHovered} />
          </div>

          {/* Colonne centrale - Couverture et actions */}
          <div className="flex flex-col items-center space-y-8 order-1 lg:order-2">
            <RatingSection userNote={userNote} onRate={handleNoteSubmit} />
            <BookCover livre={livre} onHover={setIsBookHovered} />

            {currentUser && currentUser.roles.includes('user') && !empruntSuccess && (
              <motion.div
                className="w-full max-w-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {empruntExistant ? (
                  <motion.div 
                    className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 backdrop-blur-sm 
                      border border-amber-200 rounded-lg shadow-lg shadow-amber-100/20"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-start text-amber-700 gap-2">
                      <BookOpen className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      <p className="text-sm">
                        Vous avez déjà emprunté ce livre. 
                        Il vous reste {joursRestants} jours avant le retour.
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  <Button
                    onClick={() => setShowEmpruntDialog(true)}
                    className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 
                      hover:to-indigo-600 transition-all duration-300 hover:shadow-lg 
                      hover:shadow-indigo-600/20 rounded-lg"
                  >
                    <BookOpen className="w-5 h-5 mr-2" />
                    Emprunter ce livre
                  </Button>
                )}
              </motion.div>
            )}
          </div>

          {/* Colonne droite - Commentaires */}
          <div className="order-3">
            <CommentSection
              commentaires={commentaires}
              currentUser={currentUser}
              nouveauCommentaire={nouveauCommentaire}
              setNouveauCommentaire={setNouveauCommentaire}
              editingCommentaire={editingCommentaire}
              setEditingCommentaire={setEditingCommentaire}
              isEditDialogOpen={isEditDialogOpen}
              setIsEditDialogOpen={setIsEditDialogOpen}
              handleCommentSubmit={handleCommentSubmit}
              handleUpdateCommentaire={handleUpdateCommentaire}
              handleDeleteComment={handleDeleteComment}
              formatDate={dateString => new Date(dateString).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            />
          </div>
        </motion.div>
      </div>

      <EmpruntDialog
        isOpen={showEmpruntDialog}
        onClose={() => setShowEmpruntDialog(false)}
        onConfirm={handleEmprunt}
        livre={livre}
        etatLivreDepart={etatLivreDepart}
        setEtatLivreDepart={setEtatLivreDepart}
        empruntSuccess={empruntSuccess}
        isLoading={isEmpruntLoading}
      />
    </div>
  );
};

export default LivreDetails;