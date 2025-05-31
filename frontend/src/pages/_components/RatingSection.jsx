import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, AlertCircle } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../components/ui/alert-dialog";

const RatingSection = ({ userNote, onRate }) => {
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pendingRating, setPendingRating] = useState(null);

  const handleRatingClick = (rating) => {
    setPendingRating(rating);
    setIsConfirmOpen(true);
  };

  const handleConfirmRating = () => {
    onRate(pendingRating);
    setIsConfirmOpen(false);
    setPendingRating(null);
  };

  const starVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    hover: { scale: 1.2, rotate: 360 },
    tap: { scale: 0.9 }
  };

  const containerVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <>
      <motion.div 
        className="flex flex-col items-center justify-center space-y-4"
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        <motion.div 
          className="flex items-center justify-center space-x-2 relative"
          whileHover={{ scale: 1.05 }}
        >
          {[1, 2, 3, 4, 5].map((rating) => (
            <motion.button
              key={rating}
              variants={starVariants}
              whileHover="hover"
              whileTap="tap"
              onHoverStart={() => setHoveredRating(rating)}
              onHoverEnd={() => setHoveredRating(0)}
              onClick={() => handleRatingClick(rating)}
              className="p-2 focus:outline-none relative"
            >
              <Star 
                className={`w-8 h-8 transition-colors duration-200 ${
                  (hoveredRating ? hoveredRating >= rating : userNote >= rating)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
              {hoveredRating === rating && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-8 left-1/2 transform -translate-x-1/2
                    bg-gray-900 text-white px-2 py-1 rounded text-xs whitespace-nowrap"
                >
                  {rating} étoile{rating > 1 ? 's' : ''}
                </motion.div>
              )}
            </motion.button>
          ))}
        </motion.div>

        <AnimatePresence mode="wait">
          {userNote && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center"
            >
              <span className="text-sm font-medium bg-gradient-to-r from-indigo-600 to-blue-600 
                bg-clip-text text-transparent">
                Votre note : {userNote}/5
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-500" />
              Confirmer votre note
            </AlertDialogTitle>
            <AlertDialogDescription>
              Voulez-vous vraiment donner une note de {pendingRating} étoile{pendingRating > 1 ? 's' : ''} ?
              Cette action est définitive.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmRating}>
              Confirmer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default RatingSection;