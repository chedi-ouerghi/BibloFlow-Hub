import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const bookStyles = {
  bookContainer: `
    relative w-[300px] perspective-[1000px]
    group
    before:content-[''] before:absolute before:left-[-5px] before:top-0 
    before:w-[5px] before:h-full before:bg-gradient-to-r 
    before:from-gray-300 before:to-gray-100 before:transform-gpu
    before:origin-right before:skew-y-[45deg]
    after:content-[''] after:absolute after:bottom-[-15px] 
    after:left-0 after:w-full after:h-[15px] 
    after:bg-gradient-to-b after:from-gray-300 after:to-gray-100
    after:transform-gpu after:origin-top after:skew-x-[45deg]
  `,
  bookWrapper: `
    relative w-full aspect-[3/4] rounded-xl overflow-hidden 
    shadow-[0_15px_30px_rgba(0,0,0,0.3)] transform-gpu
    transition-all duration-700 ease-out cursor-pointer
    hover:rotate-y-[-20deg] group-hover:shadow-[0_15px_50px_rgba(0,0,0,0.5)]
  `,
  bookCover: `
    relative w-full h-full transform-gpu backface-hidden
    transition-transform duration-500
  `,
  bookSpine: `
    absolute left-0 top-0 w-[30px] h-full
    bg-gradient-to-r from-gray-800 to-gray-700
    transform-gpu origin-left rotate-y-[90deg]
    opacity-0 group-hover:opacity-100
    transition-opacity duration-500
  `,
  bookShadow: `
    absolute bottom-0 left-0 w-full h-[20px]
    bg-gradient-to-t from-black/20 to-transparent
    transform-gpu translate-y-full group-hover:translate-y-0
    transition-transform duration-500
  `
};

const BookCover = ({ livre, onHover }) => {
  return (
    <motion.div
      className={bookStyles.bookContainer}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      onHoverStart={() => onHover && onHover(true)}
      onHoverEnd={() => onHover && onHover(false)}
    >
      <motion.div
        className={bookStyles.bookWrapper}
        whileHover={{
          rotateY: -30,
          transition: { duration: 0.8, ease: "easeOut" }
        }}
      >
        <img
          src={livre?.couvertureUrl || "https://via.placeholder.com/400x600"}
          alt={livre?.titre}
          className={bookStyles.bookCover}
        />
        <div className={bookStyles.bookSpine} />
        <div className={bookStyles.bookShadow} />
        
        {livre?.noteMoyenne && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1 z-10"
          >
            <Star className="w-5 h-5 text-yellow-400 fill-current" />
            <span className="font-medium">{livre.noteMoyenne.toFixed(1)}</span>
          </motion.div>
        )}

        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          initial={{ x: '-100%' }}
          whileHover={{ x: '200%' }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
      </motion.div>
    </motion.div>
  );
};

export default BookCover;