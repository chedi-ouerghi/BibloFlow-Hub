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

const HeroSection = ({user,handleLogout}) => {
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
    <div className="w-[180px] sm:w-[250px] md:w-[300px] h-auto aspect-[2/3] rounded-lg bg-gradient-to-br from-gray-800 to-gray-700 animate-pulse" />
  );

  const currentBook = recommendedBooks[currentIndex] || {};

  const baseLayout = (content) => (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#0a0a0a] to-[#121212]">
      <Header user={user} handleLogout={handleLogout} />
      <div className="flex min-h-[calc(100vh-64px)]">
        <Sidebar />
        <div className="flex-1 overflow-hidden p-4 sm:p-6 md:p-8">
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
        <Loader2 className="w-6 h-6 text-beige animate-spin" />
      </div>
    );
  }

  if (recommendedBooks.length === 0) {
    return baseLayout(
      <div className="flex items-center justify-center h-full">
        <p className="text-beige text-lg">Aucun livre recommandé disponible</p>
      </div>
    );
  }

  return baseLayout(
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="relative h-full rounded-3xl bg-gradient-to-br from-gray-900/90 via-black to-[#0a0a0a] p-6 sm:p-8 md:p-12 shadow-[0_0_50px_rgba(0,0,0,0.3)] backdrop-blur-sm"
    >
      <div className="absolute top-0 left-0 right-0 h-1.5 overflow-hidden rounded-t-3xl">
        <motion.div
          className="h-full bg-gradient-to-r from-beige/80 via-beige/40 to-beige/20"
          initial={{ x: '-100%', width: '100%' }}
          animate={{ x: '100%' }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "linear",
            repeatType: 'loop'
          }}
        />
      </div>
      
      <div className="absolute top-4 left-4 flex items-center space-x-2 text-sm text-beige/70">
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
            className="space-y-4"
          >
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-beige leading-tight">
              {currentBook.titre}
            </h1>
            <p className="text-gray-400">
              Par <span className="text-beige/90">{currentBook.auteur?.nom}</span>
            </p>
            
            <div className="flex flex-wrap items-center gap-4 text-sm">
              {currentBook.noteMoyenne && (
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400 mr-1" />
                  <span className="text-beige">{currentBook.noteMoyenne.toFixed(1)}</span>
                </div>
              )}
              {currentBook.nombrePages && (
                <div className="flex items-center text-gray-400">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>{currentBook.nombrePages} pages</span>
                </div>
              )}
            </div>

            <p className="text-gray-400 line-clamp-4 leading-relaxed max-w-xl">
              {currentBook.description}
            </p>

            <div className="flex flex-wrap gap-3 pt-4">
              <Link 
                to={`/livre/${currentBook._id}`}
                className="flex items-center px-5 py-2.5 bg-beige text-black rounded-lg font-medium hover:bg-beige/90 transition-all transform hover:scale-105"
              >
                <Play className="w-4 h-4 mr-2" />
                Voir le livre
              </Link>
              <button className="flex items-center px-5 py-2.5 border border-beige/30 text-beige rounded-lg font-medium hover:bg-beige/10 transition-all transform hover:scale-105">
                <BookmarkPlus className="w-4 h-4 mr-2" />
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
              rotateY: 10,
              y: [0, -10, 0]
            }}
            transition={{ 
              duration: 0.7, 
              ease: "easeOut",
              y: {
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }
            }}
            className="relative group"
          >
            <div 
              className="absolute inset-0 bg-gradient-to-br from-beige/30 to-transparent rounded-lg transform -rotate-6 scale-105 
              transition-all duration-500 group-hover:scale-110 group-hover:from-beige/40 blur-sm" 
            />
            {!imageLoaded && <ImageSkeleton />}
            <motion.img
              src={currentBook.couvertureUrl}
              alt={currentBook.titre}
              initial={{ opacity: 0 }}
              animate={{ opacity: imageLoaded ? 1 : 0 }}
              transition={{ duration: 0.5 }}
              onLoad={() => setImageLoaded(true)}
              className="w-[220px] sm:w-[300px] md:w-[380px] h-auto aspect-[2/3] object-cover rounded-lg shadow-2xl 
                transform perspective-1000 transition-all duration-500 
                hover:scale-105 hover:shadow-[0_0_50px_rgba(255,255,255,0.15)]
                group-hover:rotate-y-0 group-hover:translate-x-2"
            />
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex justify-center space-x-2">
        {recommendedBooks.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex ? 'bg-beige w-6' : 'bg-gray-600 hover:bg-gray-500'
            }`}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default HeroSection;