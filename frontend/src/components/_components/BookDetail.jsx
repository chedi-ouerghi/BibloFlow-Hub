import React from 'react';
import { Link } from 'react-router-dom';
import { X, Star, Book, User, Tag, ExternalLink, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const BookDetail = ({ livre, setSelectedLivre }) => {
  return (
    <motion.div
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '100%', opacity: 0 }}
      transition={{ 
        type: "spring",
        damping: 25,
        stiffness: 250,
        mass: 1
      }}
      className="w-[380px] bg-white/95 backdrop-blur-md flex flex-col h-[calc(100vh-60px)] fixed right-4 top-[60px] rounded-2xl shadow-2xl border border-gray-100"
    >
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="p-3 border-b flex justify-between items-center bg-white/50 backdrop-blur-sm rounded-t-2xl"
      >
        <h2 className="text-lg font-semibold text-gray-900">Détails du livre</h2>
        <motion.button
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
          onClick={() => setSelectedLivre(null)}
          className="p-1 rounded-lg hover:bg-gray-100 text-gray-600"
        >
          <X className="w-5 h-5" />
        </motion.button>
      </motion.div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <div className="relative aspect-[2/3] rounded-xl overflow-hidden shadow-lg group">
          <motion.img
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            src={livre.couvertureUrl || "https://i.pinimg.com/736x/32/5d/37/325d373b833e37a3d226dda872d3ac6d.jpg"}
            alt={livre.titre}
            className="w-full h-full object-cover"
          />
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          />
        </div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="space-y-4"
        >
          <h1 className="text-2xl font-bold text-gray-900">{livre.titre}</h1>
          
          <div className="flex items-center gap-3">
            {livre.noteMoyenne && (
              <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span className="text-sm font-medium text-yellow-700">
                  {livre.noteMoyenne.toFixed(1)}
                </span>
              </div>
            )}
            {livre.nombrePages && (
              <div className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-lg">
                <Book className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium text-blue-700">
                  {livre.nombrePages} pages
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 text-gray-600">
            <User className="w-4 h-4" />
            <span className="text-sm">Par {livre.auteur?.nom || 'Auteur inconnu'}</span>
          </div>

          {livre.description && (
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-gray-600 text-sm leading-relaxed"
            >
              {livre.description}
            </motion.p>
          )}

          {livre.categories && livre.categories.length > 0 && (
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-2"
            >
              {livre.categories.map((categorie) => (
                <span
                  key={categorie._id}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-100"
                >
                  {categorie.nom}
                </span>
              ))}
            </motion.div>
          )}
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex gap-3"
        >
          <Link
            to={`/livre/${livre._id}`}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
          >
            <ExternalLink className="w-4 h-4" />
            Voir plus
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default BookDetail;