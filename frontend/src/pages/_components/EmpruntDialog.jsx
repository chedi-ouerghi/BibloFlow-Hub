import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, BookOpen, Check } from 'lucide-react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Button } from '../../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { differenceInCalendarDays } from "date-fns";

const SuccessAnimation = () => (
  // Animation de succès avec Framer Motion
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
  const [dateRetourPrevue, setDateRetourPrevue] = useState(new Date());
  const joursRestants = differenceInCalendarDays(dateRetourPrevue, new Date());

  // Calculer les dates min et max
  const dateMin = new Date();
  dateMin.setDate(dateMin.getDate() + 1);
  const dateMax = new Date();
  dateMax.setDate(dateMax.getDate() + 30);

  const handleConfirm = () => {
    // Format the data according to the backend expectations
    onConfirm({ 
      dateRetourPrevue: dateRetourPrevue.toISOString(),
      etatLivreDepart,
      livreId: livre._id
    });
  };

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
            <Label>Date de retour prévue</Label>
            <div className="calendar-container p-2 border rounded-lg">
              <Calendar
                onChange={setDateRetourPrevue}
                value={dateRetourPrevue}
                minDate={dateMin}
                maxDate={dateMax}
                locale="fr-FR"
                className="w-full border-none"
                tileClassName="rounded-lg hover:bg-indigo-50"
                view="month"
              />
              <p className="text-sm text-gray-500 mt-2 text-center">
                Date sélectionnée : {dateRetourPrevue.toLocaleDateString('fr-FR')}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="etatLivreDepart">État du livre</Label>
            <Textarea
              id="etatLivreDepart"
              value={etatLivreDepart}
              onChange={(e) => setEtatLivreDepart(e.target.value)}
              placeholder="Décrivez l'état actuel du livre"
              className="min-h-[100px]"
            />
          </div>

          <motion.div 
            className="flex items-center gap-2 p-4 bg-amber-50 border border-amber-200 rounded-lg"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <AlertCircle className="w-4 h-4 text-amber-700 flex-shrink-0" />
           <p className="text-sm text-amber-700">
  {joursRestants > 1
    ? `Il reste ${joursRestants} jours avant la date de retour.`
    : joursRestants === 1
    ? `Il reste 1 jour avant la date de retour.`
    : `La date de retour est aujourd'hui.`}
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
            onClick={handleConfirm}
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