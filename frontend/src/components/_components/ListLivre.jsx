import React, { useState, useEffect, useCallback } from 'react';
import { Search, Star, Tag, User, Library,  BookOpen, ChevronLeft, ChevronRight, BookmarkPlus, Home } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Tooltip from '@radix-ui/react-tooltip';
import { TooltipProvider } from '../ui/tooltip';
import * as userAPI from '../../api/publicapi';
import BookDetail from './BookDetail';

const menuItems = [
  { icon: <Home className="w-5 h-5" />, label: 'Accueil', path: '/', active: false },
  { icon: <BookOpen className="w-5 h-5" />, label: 'Bibliothèque', path: '/library', active: true },
];

const fadeInItem = (index) => ({
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  transition: { delay: index * 0.1, duration: 0.6, ease: 'easeInOut' },
});

const Sidebar = () => {
  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
      className="w-20 h-screen bg-gradient-to-b from-beige-100/80 to-gray-100/80 backdrop-blur-md border-r border-gray-300 text-gray-700 shadow-xl relative z-50"
      style={{
        backgroundImage: 'url("/textures/paper-light.png")',
        backgroundSize: 'cover',
        backgroundBlendMode: 'overlay',
      }}
    >
      <div className="flex flex-col items-center pt-8 space-y-8">
        {/* Menu items */}
        {menuItems.map((item, index) => (
          <Tooltip.Provider key={index} delayDuration={100}>
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <motion.button
                  {...fadeInItem(index)}
                  whileHover={{ 
                    scale: 1.1,
                    backgroundColor: item.active ? 'rgba(209, 250, 229, 0.8)' : 'rgba(255, 255, 255, 0.6)'
                  }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 border-2
                    ${item.active
                      ? 'bg-green-100/80 text-green-700 shadow-md border-green-300/80'
                      : 'text-gray-600 border-transparent hover:border-gray-300/50'
                    }`}
                >
                  {item.icon}
                </motion.button>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content
                  className="px-3 py-1.5 text-sm font-medium text-white bg-gray-800/90 rounded-lg shadow-lg backdrop-blur-sm border border-gray-700"
                  side="right"
                  sideOffset={10}
                >
                  {item.label}
                  <Tooltip.Arrow className="fill-gray-800/90" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </Tooltip.Provider>
        ))}

        {/* Bouton Nouvelle Collection */}
        <div className="mt-auto pb-8">
          <Tooltip.Provider delayDuration={100}>
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <motion.button
                  whileHover={{ scale: 1.1, backgroundColor: 'rgba(255, 255, 255, 0.6)' }}
                  whileTap={{ scale: 0.95 }}
                  className="w-12 h-12 rounded-xl flex items-center justify-center bg-white/20 border-2 border-gray-300/50 text-gray-700 hover:border-gray-400/50 transition-all duration-300"
                >
                  <BookmarkPlus className="w-5 h-5" />
                </motion.button>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content
                  className="px-3 py-1.5 text-sm font-medium text-white bg-gray-800/90 rounded-lg shadow-lg backdrop-blur-sm border border-gray-700"
                  side="right"
                  sideOffset={10}
                >
                  Nouvelle Collection
                  <Tooltip.Arrow className="fill-gray-800/90" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </Tooltip.Provider>
        </div>
      </div>
    </motion.div>
  );
};


const BookCard = ({ livre, onSelect, isSelected }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ 
        y: -12, 
        scale: 1.02, 
        transition: { duration: 0.2, ease: "easeOut" },
        boxShadow: "0 25px 35px -5px rgba(0, 0, 0, 0.1), 0 10px 15px -5px rgba(0, 0, 0, 0.04)"
      }}
      className={`group cursor-pointer rounded-2xl overflow-hidden bg-white/90 backdrop-blur-sm hover:bg-white transition-all duration-300 ${
        isSelected ? 'ring-2 ring-[#2563eb] shadow-xl' : 'shadow-md hover:shadow-xl'
      }`}
      onClick={() => onSelect(livre)}
    >
      <div className="relative pb-[140%] overflow-hidden">
        <motion.img
          initial={{ scale: 1.1 }}
          whileHover={{ scale: 1.15 }}
          transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
          src={livre.couvertureUrl || "https://i.pinimg.com/736x/32/5d/37/325d373b833e37a3d226dda872d3ac6d.jpg"}
          alt={livre.titre}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {livre.noteMoyenne && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-sm font-medium shadow-lg flex items-center gap-1"
          >
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span>{livre.noteMoyenne.toFixed(1)}</span>
          </motion.div>
        )}
      </div>
      <motion.div 
        className="p-4 space-y-2"
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="font-semibold text-gray-800 truncate group-hover:text-primary transition-colors">
          {livre.titre}
        </h3>
        <div className="space-y-1">
          <p className="text-sm text-gray-600 flex items-center gap-1">
            <User className="w-4 h-4" />
            {livre.auteur?.nom || 'Auteur inconnu'}
          </p>
          <p className="text-sm text-gray-600 flex items-center gap-1">
            <Tag className="w-4 h-4" />
            {livre.categories && livre.categories.length > 0
              ? livre.categories.map((cat, index) => (
                  <span key={index} className="inline-flex">
                    {cat.nom}{index < livre.categories.length - 1 ? ', ' : ''}
                  </span>
                ))
              : 'Non catégorisé'}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

const RecommendedBookCard = ({ livre, onSelect }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05, boxShadow: "0 25px 30px -12px rgba(0, 0, 0, 0.25)" }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex-shrink-0 w-[200px] h-[320px] relative rounded-xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300"
      onClick={() => onSelect(livre)}
    >
      <img
        src={livre.couvertureUrl || "https://i.pinimg.com/736x/32/5d/37/325d373b833e37a3d226dda872d3ac6d.jpg"}
        alt={livre.titre}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent">
        <div className="absolute bottom-0 p-4 text-white">
          <h3 className="text-lg font-bold line-clamp-2">{livre.titre}</h3>
          <div className="flex items-center gap-2 mt-2">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm">{livre.noteMoyenne?.toFixed(1) || '0.0'}</span>
          </div>
          <p className="text-sm text-gray-300 mt-1 line-clamp-1">
            {livre.auteur?.nom || 'Auteur inconnu'}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

const SkeletonCard = () => {
  return (
    <div className="rounded-2xl bg-white/90 shadow-md overflow-hidden animate-pulse">
      <div className="relative pb-[140%] bg-gray-200" />
      <div className="p-4 space-y-3">
        <div className="h-5 bg-gray-200 rounded-md w-3/4" />
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded-md w-1/2" />
          <div className="h-4 bg-gray-200 rounded-md w-2/3" />
        </div>
      </div>
    </div>
  );
};

const ListLivre = () => {
  const [livres, setLivres] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLivre, setSelectedLivre] = useState(null);
  const [noResults, setNoResults] = useState(false);
  const [recommendedBooks, setRecommendedBooks] = useState([]);
  const [carouselIndex, setCarouselIndex] = useState(0);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoriesResponse = await userAPI.getCategories();
        setCategories(categoriesResponse);
      } catch (err) {
        console.error('Erreur lors du chargement des catégories:', err);
      }
    };
    loadCategories();
  }, []);

  const fetchLivres = useCallback(async () => {
    try {
      setLoading(true);
      setNoResults(false);
      const livresResponse = await userAPI.getAllLivres({
        search: searchTerm || undefined,
        categorie: selectedCategory || undefined,
        page: 1,
        limit: 20
      });
      
      setLivres(livresResponse.livres);
      setNoResults(livresResponse.livres.length === 0);
      setError(null);
    } catch (err) {
      setError('Une erreur est survenue lors du chargement des livres');
      console.error('Erreur:', err);
      setLivres([]);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedCategory]);

  const fetchRecommendedBooks = useCallback(async () => {
    try {
      const response = await userAPI.getLivresRecommandes();
      setRecommendedBooks(response);
    } catch (err) {
      console.error('Erreur lors du chargement des livres recommandés:', err);
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchLivres();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [fetchLivres]);

  useEffect(() => {
    fetchRecommendedBooks();
  }, [fetchRecommendedBooks]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setSelectedLivre(null);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setSelectedLivre(null);
  };

  const handleSelectLivre = async (livre) => {
    try {
      const response = await userAPI.getLivreDetails(livre._id);
      setSelectedLivre(response);
    } catch (err) {
      console.error('Erreur lors du chargement des détails:', err);
    }
  };

  const nextSlide = () => {
    setCarouselIndex((prev) => 
      prev + 1 >= Math.ceil(recommendedBooks.length / 4) ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCarouselIndex((prev) => 
      prev - 1 < 0 ? Math.ceil(recommendedBooks.length / 4) - 1 : prev - 1
    );
  };

  return (
    <TooltipProvider>
      <div className="flex w-full min-h-screen bg-[#f8f9fa] overflow-x-hidden relative">
        {/* Background décoratif */}
        <div className="absolute inset-0 z-[-1] pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-green-50/30 to-purple-50/40" />
          <svg
            className="absolute inset-0 w-full h-full opacity-[0.03]"
            viewBox="0 0 100 100"
            preserveAspectRatio="xMidYMid slice"
          >
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
            </pattern>
            <rect width="100" height="100" fill="url(#grid)"/>
          </svg>
        </div>

        <div className="sticky top-0 h-screen z-0">
          <Sidebar />
        </div>
        <div className="flex-1 max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-8 font-['Inter']">
          {/* Recommended Books Section */}
          {recommendedBooks.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-12"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Livres Recommandés</h2>
              <div className="relative">
                <motion.div
                  className="flex gap-6 overflow-hidden relative"
                  initial={false}
                >
                  <motion.div
                    className="flex gap-6"
                    animate={{ x: -carouselIndex * (208 * 4) }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  >
                    {recommendedBooks.map((livre) => (
                      <RecommendedBookCard
                        key={livre._id}
                        livre={livre}
                        onSelect={handleSelectLivre}
                      />
                    ))}
                  </motion.div>
                </motion.div>
                {recommendedBooks.length > 4 && (
                  <>
                    <button
                      onClick={prevSlide}
                      className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-12 h-12 rounded-full bg-white/90 shadow-lg backdrop-blur-sm flex items-center justify-center hover:bg-white transition-all"
                    >
                      <ChevronLeft className="w-6 h-6 text-gray-700" />
                    </button>
                    <button
                      onClick={nextSlide}
                      className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-12 h-12 rounded-full bg-white/90 shadow-lg backdrop-blur-sm flex items-center justify-center hover:bg-white transition-all"
                    >
                      <ChevronRight className="w-6 h-6 text-gray-700" />
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          )}

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="sticky top-4 mb-8 z-1"
          >
            <div className="bg-white/95 backdrop-blur-lg shadow-lg rounded-2xl p-6 transition-all duration-300 border border-gray-100">
              <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="w-full md:w-48">
                  <div className="flex items-center gap-2 bg-gray-50 p-2.5 rounded-xl">
                    <Tag className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <select
                      className="w-full bg-transparent border-none text-sm text-gray-700 focus:outline-none focus:ring-0 cursor-pointer"
                      value={selectedCategory}
                      onChange={handleCategoryChange}
                    >
                      <option value="">Toutes les catégories</option>
                      {categories.map((category) => (
                        <option key={category._id} value={category._id}>
                          {category.nom}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex-1 w-full md:w-auto">
                  <div className="relative flex items-center">
                    <Search className="absolute left-4 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Cherchez un livre par Titre"
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-shadow duration-200"
                      value={searchTerm}
                      onChange={handleSearch}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4 flex-shrink-0">
                  <button
                    className="px-6 py-3 bg-green-600 text-white text-sm font-medium rounded-xl hover:bg-green-700 shadow-sm hover:shadow-md transition-all duration-200 ease-in-out transform hover:-translate-y-0.5"
                    onClick={fetchLivres}
                  >
                    Rechercher
                  </button>
                  
                  <span className="hidden md:inline-flex items-center px-4 py-2 bg-gray-50 text-sm text-gray-500 rounded-xl">
                    {livres.length} résultat{livres.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-between items-center mb-8"
          >
            <h2 className="text-[#1f2937] text-2xl sm:text-3xl font-bold tracking-tight">Tous les livres</h2>
            <span className="md:hidden text-sm text-[#1f2937]/70">
              {livres.length} résultat{livres.length !== 1 ? 's' : ''}
            </span>
          </motion.div>

          <div className="relative min-h-[400px]">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 sm:gap-8">
                {[...Array(10)].map((_, index) => (
                  <SkeletonCard key={index} />
                ))}
              </div>
            ) : error ? (
              <div className="flex items-center justify-center h-[400px]">
                <div className="text-center space-y-4 p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg max-w-md mx-auto">
                  <h2 className="text-2xl font-bold text-red-600">Erreur</h2>
                  <p className="text-gray-600">{error}</p>
                  <button
                    onClick={fetchLivres}
                    className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors duration-200 shadow-md hover:shadow-lg"
                  >
                    Réessayer
                  </button>
                </div>
              </div>
            ) : noResults ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center h-[400px] p-8 bg-white/80 backdrop-blur-sm rounded-2xl"
              >
                <div className="mb-6">
                  <Search className="w-20 h-20 text-gray-300" />
                </div>
                <h3 className="text-2xl font-bold text-gray-700 mb-3">
                  Aucun livre trouvé
                </h3>
                <p className="text-gray-500 max-w-md text-center">
                  Aucun livre ne correspond à votre recherche. Essayez avec d'autres termes ou catégories.
                </p>
              </motion.div>
            ) : (
              <div className="relative">
                <motion.div
                  layout
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 sm:gap-8"
                >
                  <AnimatePresence>
                    {livres.map((livre) => (
                      <BookCard
                        key={livre._id}
                        livre={livre}
                        onSelect={handleSelectLivre}
                        isSelected={selectedLivre?._id === livre._id}
                      />
                    ))}
                  </AnimatePresence>
                </motion.div>
              </div>
            )}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {selectedLivre && (
            <BookDetail livre={selectedLivre} setSelectedLivre={setSelectedLivre} />
          )}
        </AnimatePresence>
      </div>
    </TooltipProvider>
  );
};

export default ListLivre;