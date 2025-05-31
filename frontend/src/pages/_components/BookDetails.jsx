import { motion } from 'framer-motion';
import { User, Calendar, BookOpen, Bookmark, Info } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../../components/ui/accordion';

const BookMetadata = ({ icon: Icon, label, value }) => (
  <motion.div 
    className="flex items-center gap-4 text-gray-700 group"
    whileHover={{ x: 5 }}
  >
    <div className="p-2 bg-indigo-50 rounded-lg group-hover:bg-indigo-100 
      transition-colors duration-300 group-hover:shadow-md group-hover:shadow-indigo-100/50">
      <Icon className="w-5 h-5 text-indigo-600" />
    </div>
    <div className="flex flex-col">
      <span className="text-xs text-gray-500">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  </motion.div>
);

const BookDetails = ({ livre, isHovered }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <motion.div
      className={`space-y-6 backdrop-blur-xl bg-white/90 rounded-2xl p-8 
        border border-blue-100/50 transition-all duration-500 transform-gpu
        ${isHovered ? 'shadow-2xl shadow-blue-200/20 scale-[1.02]' : 'shadow-xl'}`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div className="space-y-6">
        <motion.h1
          className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-indigo-800 to-gray-900 
            bg-clip-text text-transparent font-serif"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {livre?.titre}
        </motion.h1>

        <motion.div 
          className="grid gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <BookMetadata
            icon={User}
            label="Auteur"
            value={livre?.auteur?.nom}
          />
          
          <BookMetadata
            icon={Calendar}
            label="Date de publication"
            value={formatDate(livre?.datePublication)}
          />
        </motion.div>

        <Accordion type="single" collapsible className="w-full mt-8">
          <AccordionItem value="description">
            <AccordionTrigger className="text-lg font-medium text-gray-800 hover:text-indigo-600
              transition-colors group">
              <div className="flex items-center gap-2">
                <Info className="w-5 h-5" />
                <span>À propos</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-gray-600 leading-relaxed mt-2">{livre?.description}</p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="details">
            <AccordionTrigger className="text-lg font-medium text-gray-800 hover:text-indigo-600
              transition-colors group">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                <span>Détails</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 py-2">
                {livre?.isbn && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">ISBN</span>
                    <span className="font-medium">{livre.isbn}</span>
                  </div>
                )}
                {livre?.langue && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Langue</span>
                    <span className="font-medium">{livre.langue}</span>
                  </div>
                )}
                {livre?.nombrePages && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Nombre de pages</span>
                    <span className="font-medium">{livre.nombrePages}</span>
                  </div>
                )}
                {livre?.editeur && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Éditeur</span>
                    <span className="font-medium">{livre.editeur}</span>
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>

          {livre?.categories?.length > 0 && (
            <AccordionItem value="categories">
              <AccordionTrigger className="text-lg font-medium text-gray-800 hover:text-indigo-600
                transition-colors group">
                <div className="flex items-center gap-2">
                  <Bookmark className="w-5 h-5" />
                  <span>Catégories</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-wrap gap-2 py-2">
                  {livre.categories.map((categorie, index) => (
                    <motion.span
                      key={categorie._id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 * index }}
                      whileHover={{ scale: 1.05 }}
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium 
                        bg-gradient-to-r from-indigo-50 to-blue-50 text-indigo-700
                        border border-indigo-100 shadow-sm hover:shadow-md 
                        hover:border-indigo-200 transition-all duration-300"
                    >
                      {categorie.nom}
                    </motion.span>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>
      </motion.div>
    </motion.div>
  );
};

export default BookDetails;