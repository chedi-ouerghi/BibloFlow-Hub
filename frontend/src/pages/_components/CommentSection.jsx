import { motion, AnimatePresence } from 'framer-motion';
import { User, Edit, Trash2, MessageSquare, MessageCircle, MessagesSquare } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Textarea } from '../../components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../components/ui/accordion';

const CommentCard = ({ commentaire, currentUser, onEdit, onDelete, formatDate }) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="group bg-white/60 backdrop-blur-sm rounded-lg p-4 hover:shadow-lg transition-all duration-300
      hover:bg-white/80 border border-transparent hover:border-blue-100"
  >
    <div className="flex items-start gap-3">
      <motion.div
        className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-100 to-blue-100 flex items-center justify-center
          group-hover:from-indigo-200 group-hover:to-blue-200 transition-colors duration-300"
        whileHover={{ scale: 1.1 }}
      >
        <User className="w-4 h-4 text-indigo-600" />
      </motion.div>
      <div className="flex-1">
        <div className="flex justify-between items-center">
          <motion.h4 
            className="font-medium text-gray-900"
            whileHover={{ scale: 1.02 }}
          >
            {commentaire.userId?.username || 'Utilisateur'}
          </motion.h4>
          <span className="text-xs text-gray-500">
            {formatDate(commentaire.createdAt)}
          </span>
        </div>
        <p className="mt-2 text-gray-700 leading-relaxed">{commentaire.contenu}</p>
        {currentUser && currentUser.id === commentaire.userId?._id && (
          <motion.div 
            className="flex gap-2 mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(commentaire)}
              className="hover:bg-indigo-50"
            >
              <Edit className="w-3 h-3 mr-1" />
              Modifier
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(commentaire._id)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-3 h-3 mr-1" />
              Supprimer
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  </motion.div>
);

const CommentSection = ({
  commentaires,
  currentUser,
  nouveauCommentaire,
  setNouveauCommentaire,
  editingCommentaire,
  setEditingCommentaire,
  isEditDialogOpen,
  setIsEditDialogOpen,
  handleCommentSubmit,
  handleUpdateCommentaire,
  handleDeleteComment,
  formatDate
}) => {
  const commentInputVariants = {
    focus: { scale: 1.02, transition: { duration: 0.2 } },
    blur: { scale: 1, transition: { duration: 0.2 } }
  };

  return (
    <motion.div
      className="flex flex-col h-[calc(100vh-12rem)] backdrop-blur-xl bg-white/90 rounded-2xl 
        shadow-xl border border-blue-100/50 overflow-hidden
        hover:shadow-2xl hover:shadow-blue-200/20 transition-all duration-500"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <div className="flex-none p-6 border-b border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-indigo-500" />
          <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
            Avis Lecteurs ({commentaires.length})
          </span>
        </h2>
      </div>

      <div className="flex-1 overflow-hidden">
        <Accordion 
          type="single" 
          collapsible 
          className="w-full h-full flex flex-col"
          defaultValue="comments-list"
        >
          <AccordionItem value="new-comment" className="flex-none border-b border-gray-100">
            <AccordionTrigger className="px-6 py-4 text-lg font-medium text-gray-800 hover:text-indigo-600
              transition-colors group">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                <span>Ajouter un commentaire</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-4">
              <form onSubmit={handleCommentSubmit} className="space-y-4">
                <motion.div
                  variants={commentInputVariants}
                  whileFocus="focus"
                  whileBlur="blur"
                >
                  <Textarea
                    value={nouveauCommentaire}
                    onChange={(e) => setNouveauCommentaire(e.target.value)}
                    placeholder={currentUser ? "Votre avis compte..." : "Connectez-vous pour commenter"}
                    className="min-h-[100px] bg-white/50 backdrop-blur-sm border-gray-200 
                      focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300
                      rounded-lg resize-none"
                    disabled={!currentUser}
                  />
                </motion.div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    {nouveauCommentaire.length}/500
                  </span>
                  <Button
                    type="submit"
                    disabled={!currentUser || !nouveauCommentaire.trim()}
                    className="bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 
                      hover:to-indigo-600 text-white shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    Publier
                  </Button>
                </div>
              </form>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="comments-list" className="flex-1 overflow-hidden">
            <AccordionTrigger className="px-6 py-4 text-lg font-medium text-gray-800 hover:text-indigo-600
              transition-colors group sticky top-0 bg-white/95 backdrop-blur-sm z-10 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <MessagesSquare className="w-5 h-5" />
                <span>Commentaires récents</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="overflow-y-auto h-[calc(100vh-20rem)] custom-scrollbar">
              <div className="space-y-4 p-6">
                <AnimatePresence>
                  {commentaires.map((commentaire) => (
                    <CommentCard
                      key={commentaire._id}
                      commentaire={commentaire}
                      currentUser={currentUser}
                      onEdit={setEditingCommentaire}
                      onDelete={handleDeleteComment}
                      formatDate={formatDate}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="w-5 h-5 text-indigo-600" />
              <span>Modifier le commentaire</span>
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-4">
            <Textarea
              value={editingCommentaire?.contenu || ''}
              onChange={(e) =>
                setEditingCommentaire(prev => ({
                  ...prev,
                  contenu: e.target.value
                }))
              }
              className="min-h-[100px] bg-white/50 backdrop-blur-sm border-gray-200 
                focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300
                rounded-lg resize-none"
            />
            <p className="text-sm text-gray-500">
              {editingCommentaire?.contenu?.length || 0}/500 caractères
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
              className="hover:bg-gray-50"
            >
              Annuler
            </Button>
            <Button 
              onClick={handleUpdateCommentaire}
              disabled={!editingCommentaire?.contenu || editingCommentaire.contenu.length > 500}
              className="bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 
                hover:to-indigo-600 text-white shadow-md hover:shadow-lg transition-all duration-300"
            >
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default CommentSection;