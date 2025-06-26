import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Star,
  Clock,
  Play,
  BookmarkPlus,
  Loader2
} from 'lucide-react';
import { getLivresRecommandes } from '../../api/publicapi';
import Sidebar from './Sidebar';
import Header from './Header';
import { Link } from 'react-router-dom';

const HeroSection = ({ user, handleLogout }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [recommendedBooks, setRecommendedBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const fetchRecommendedBooks = async () => {
      try {
        const data = await getLivresRecommandes();
        setRecommendedBooks(data.slice(0, 5));
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching recommended books:', error);
        setIsLoading(false);
      }
    };
    fetchRecommendedBooks();
  }, []);

  useEffect(() => {
    if (recommendedBooks.length > 0) {
      const timer = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % recommendedBooks.length);
      }, 9000);
      return () => clearInterval(timer);
    }
  }, [recommendedBooks.length]);

  const ImageSkeleton = () => (
    <div className="w-[180px] sm:w-[250px] md:w-[300px] h-auto aspect-[2/3] rounded-lg bg-gradient-to-br from-blue-900/50 to-gray-900/50 animate-pulse" />
  );

  const currentBook = recommendedBooks[currentIndex] || {};

  const baseLayout = (content) => (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-950 to-blue-900 overflow-hidden">
      <Header user={user} handleLogout={handleLogout} />
      <div className="flex min-h-[calc(100vh-64px)]">
        <Sidebar />
        <div className="flex-1 overflow-hidden p-4 sm:p-6 md:p-8 relative">
          <div className="absolute inset-0 bg-gradient-radial from-white/5 to-transparent pointer-events-none" />
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="h-full w-full max-w-[1920px] mx-auto"
          >
            {content}
          </motion.div>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return baseLayout(
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
      </div>
    );
  }

  if (recommendedBooks.length === 0) {
    return baseLayout(
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-200 text-lg font-sans">Aucun livre recommandé disponible</p>
      </div>
    );
  }

  return baseLayout(
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="relative h-screen rounded-3xl bg-gradient-to-br from-gray-900/90 via-blue-900/80 to-blue-800/70 p-6 sm:p-8 md:p-12 shadow-2xl ring-1 ring-blue-500/20 backdrop-blur-lg"
    >
      <div className="absolute top-0 left-0 right-0 h-2 overflow-hidden rounded-t-3xl">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600"
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      <div className="absolute top-4 left-4 flex items-center space-x-2 text-sm text-blue-300/80 font-sans">
        <span>{currentIndex + 1}</span>
        <span>/</span>
        <span>{recommendedBooks.length}</span>
      </div>

      <div className="relative h-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center pt-8">
        <motion.div 
          className="space-y-8"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.div
            key={currentBook._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <h1 className="font-sans text-4xl sm:text-5xl lg:text-6xl text-gray-200 leading-tight tracking-tight">
              {currentBook.titre}
            </h1>
            <p className="text-blue-300/80 font-light">
              Par <span className="text-blue-400 font-medium">{currentBook.auteur?.nom}</span>
            </p>
            
            <div className="flex flex-wrap items-center gap-6 text-sm">
              {currentBook.noteMoyenne && (
                <div className="flex items-center">
                  <Star className="w-6 h-6 text-yellow-400 fill-yellow-400 mr-2" />
                  <span className="text-gray-200 font-sans">{currentBook.noteMoyenne.toFixed(1)}</span>
                </div>
              )}
              {currentBook.nombrePages && (
                <div className="flex items-center text-blue-300/80">
                  <Clock className="w-5 h-5 mr-2" />
                  <span className="font-sans">{currentBook.nombrePages} pages</span>
                </div>
              )}
            </div>

            <p className="text-blue-300/70 line-clamp-4 leading-relaxed max-w-xl font-light">
              {currentBook.description}
            </p>

            <div className="flex flex-wrap gap-4 pt-6">
              <Link 
                to={`/livre/${currentBook._id}`}
                className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-sans font-medium hover:from-blue-600 hover:to-blue-700 transition-all hover:scale-105 shadow-lg hover:shadow-[0_0_20px_rgba(59,130,246,0.5)]"
              >
                <Play className="w-5 h-5 mr-2" />
                Voir le livre
              </Link>
              <button className="flex items-center px-6 py-3 border border-blue-400/50 text-blue-400 rounded-lg font-sans font-medium hover:bg-blue-400/10 transition-all hover:scale-105 shadow-lg hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                <BookmarkPlus className="w-5 h-5 mr-2" />
                Ajouter à ma liste
              </button>
            </div>
          </motion.div>
        </motion.div>

        <div className="flex items-center justify-center lg:justify-end min-h-[400px]">
          <motion.div
            key={currentBook._id}
            initial={{ opacity: 0, scale: 0.9, rotateY: 45 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              rotateY: 15,
              y: [0, -15, 0]
            }}
            transition={{ 
              duration: 0.8, 
              ease: "easeOut",
              y: {
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }
            }}
            className="relative group"
            whileHover={{ rotateY: 0, scale: 1.05 }}
          >
            <div 
              className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-lg -rotate-6 scale-110 transition-all duration-500 group-hover:scale-115 group-hover:from-blue-500/30 group-hover:to-blue-600/30 blur-md" 
            />
            {!imageLoaded && <ImageSkeleton />}
            <motion.img
              src={currentBook.couvertureUrl}
              alt={currentBook.titre}
              initial={{ opacity: 0 }}
              animate={{ opacity: imageLoaded ? 1 : 0 }}
              transition={{ duration: 0.5 }}
              onLoad={() => setImageLoaded(true)}
              className="w-[220px] sm:w-[300px] md:w-[400px] h-auto aspect-[2/3] object-cover rounded-lg shadow-[0_0_30px_rgba(59,130,246,0.4)] transform perspective-[1200px] transition-all duration-500 hover:shadow-[0_0_60px_rgba(59,130,246,0.6)] group-hover:rotate-y-0"
            />
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex justify-center space-x-3">
        {recommendedBooks.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex ? 'bg-blue-500 w-8 shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'bg-blue-400/50 hover:bg-blue-400/80'
            }`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default HeroSection;