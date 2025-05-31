import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Book } from 'lucide-react';

const SimilarBooks = ({ similarBooks, currentLivreId }) => {
  // Si pas de livres similaires ou seulement le livre actuel, ne rien afficher
  if (!similarBooks || similarBooks.length === 0 || 
      (similarBooks.length === 1 && similarBooks[0]._id === currentLivreId)) {
    return null;
  } 

  // Filtrer le livre actuel des suggestions
  const livresFiltres = similarBooks.filter(livre => livre._id !== currentLivreId);

  if (livresFiltres.length === 0) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-xl 
          border border-gray-100/50 hover:shadow-2xl transition-shadow duration-500"
      >
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-3 mb-6 
          pb-4 border-b border-gray-100">
          <span className="flex items-center gap-2 bg-indigo-50 px-3 py-1.5 rounded-full">
            <Book className="w-5 h-5 text-indigo-600" />
            <span className="bg-gradient-to-r from-indigo-600 to-indigo-500 
              bg-clip-text text-transparent">
              Livres similaires
            </span>
          </span>
        </h3>

        <div className="flex flex-col gap-4">
          {livresFiltres.map((livre) => (
            <motion.div
              key={livre._id}
              whileHover={{ scale: 1.02, x: 8 }}
              whileTap={{ scale: 0.98 }}
              className="group relative"
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Link to={`/livre/${livre._id}`} className="block">
                <div className="flex gap-4 p-4 rounded-xl bg-gradient-to-r from-gray-50/50 to-white/50 
                  hover:from-indigo-50/50 hover:to-white/80 transition-all duration-300 
                  border border-gray-100 hover:border-indigo-200 hover:shadow-lg 
                  hover:shadow-indigo-100/20 relative overflow-hidden">
                  
                  {/* Image avec effet de survol */}
                  <div className="relative group-hover:translate-y-[-2px] transition-transform duration-300">
                    <div className="w-20 h-28 rounded-lg overflow-hidden shadow-md 
                      group-hover:shadow-xl transition-shadow duration-300">
                      <img
                                      src={livre.couverture || livre.couvertureUrl}
                        alt={livre.titre}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null; // Éviter les boucles infinies
                          e.target.src = '/placeholder-book.png'; // Image par défaut si erreur
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent 
                        opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </div>

                  {/* Informations du livre */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <h4 className="font-medium text-gray-800 group-hover:text-indigo-600 
                        transition-colors duration-300 text-lg leading-snug line-clamp-1">
                        {livre.titre}
                      </h4>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                        {livre.auteur?.nom}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-50 
                        text-indigo-600 font-medium border border-indigo-100/50
                        group-hover:bg-indigo-100 transition-colors duration-300">
                        {livre.categories?.[0]?.nom}
                      </span>
                      <span className="flex items-center gap-1 text-amber-500">
                        <span className="text-xs">★</span>
                        <span className="text-sm font-medium">
                          {livre.noteMoyenne?.toFixed(1)}
                        </span>
                      </span>
                    </div>
                  </div>

                  {/* Effet de hover avec gradient */}
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/0 to-indigo-600/0 
                    group-hover:from-indigo-50/0 group-hover:to-indigo-50/20 
                    transition-all duration-500 pointer-events-none" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SimilarBooks;
