import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, BookOpen, Check } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';

const SuccessAnimation = () => (
  <motion.div
    className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-10"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
  >
    <motion.div
      className="bg-green-100 rounded-full p-4"
      initial={{ scale: 0 }}
      animate={{ scale: [0, 1.2, 1] }}
      transition={{ duration: 0.5 }}
    >
      <Check className="w-8 h-8 text-green-600" />
    </motion.div>
  </motion.div>
);

const EmpruntDialog = ({
  isOpen,
  onClose,
  onConfirm,
  livre,
  etatLivreDepart,
  setEtatLivreDepart,
  empruntSuccess,
  isLoading
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] overflow-hidden">
        <AnimatePresence>
          {empruntSuccess && <SuccessAnimation />}
        </AnimatePresence>

        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            <span>Emprunter {livre?.titre}</span>
          </DialogTitle>
        </DialogHeader>

        <motion.div
          className="grid gap-4 py-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="space-y-2">
            <Label htmlFor="etatLivreDepart" className="text-sm font-medium text-gray-700">
              État du livre
            </Label>
            <motion.div
              whileFocus={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <Textarea
                id="etatLivreDepart"
                value={etatLivreDepart}
                onChange={(e) => setEtatLivreDepart(e.target.value)}
                placeholder="Décrivez l'état actuel du livre (rayures, pages cornées, etc.)"
                className="min-h-[100px] bg-gray-50 border-gray-200 focus:border-indigo-300 
                  focus:ring-2 focus:ring-indigo-500/20 rounded-lg resize-none
                  transition-all duration-200"
              />
            </motion.div>
          </div>

          <motion.div 
            className="flex items-center gap-2 p-4 bg-amber-50 border border-amber-200 rounded-lg"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <AlertCircle className="w-4 h-4 text-amber-700 flex-shrink-0" />
            <p className="text-sm text-amber-700">
              La date de retour sera automatiquement fixée à 14 jours.
            </p>
          </motion.div>
        </motion.div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            className="hover:bg-gray-50"
          >
            Annuler
          </Button>
          <Button
            onClick={onConfirm}
            disabled={!etatLivreDepart.trim() || isLoading}
            className="bg-indigo-600 hover:bg-indigo-700 transition-colors
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <motion.div
                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            ) : (
              "Confirmer l'emprunt"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EmpruntDialog;