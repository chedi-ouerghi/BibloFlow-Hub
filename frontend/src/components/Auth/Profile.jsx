import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, getAvertissements, marquerAvertissementLu, getMesEmprunts } from '../../api/authapi';
import { Star, Tag, BookOpen, Calendar, Clock, Info, AlertCircle, ChevronRight, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import DialogProfile from './DialogProfile';

const DashboardCard = ({ title, icon: Icon, children, className }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden ${className}`}
  >
    <div className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white p-4">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-indigo-50 rounded-lg">
          <Icon className="w-5 h-5 text-indigo-600" />
        </div>
        <h2 className="font-semibold text-gray-900">{title}</h2>
      </div>
    </div>
    <div className="p-5">{children}</div>
  </motion.div>
);

const StatBox = ({ title, value, icon: Icon, color }) => (
  <motion.div
    whileHover={{ y: -2, scale: 1.02 }}
    className={`p-4 rounded-xl border ${color} flex items-center gap-4`}
  >
    <div className={`p-3 rounded-lg ${color.replace('border-', 'bg-').replace('100', '50')}`}>
      <Icon className={`w-6 h-6 ${color.replace('border-', 'text-').replace('100', '600')}`} />
    </div>
    <div>
      <p className="text-sm text-gray-600">{title}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  </motion.div>
);

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [avertissements, setAvertissements] = useState([]);
  const [emprunts, setEmprunts] = useState([]);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('en_cours');

  useEffect(() => {
    const loadUser = async () => {
      const currentUser = getCurrentUser();
      if (!currentUser) {
        navigate('/login');
        return;
      }
      setUser(currentUser);

      try {
        const [avertissementsData, empruntsData] = await Promise.all([
          getAvertissements(),
          getMesEmprunts()
        ]);
        setAvertissements(avertissementsData);
        setEmprunts(empruntsData);
      } catch (err) {
        console.error('Erreur lors du chargement des données:', err);
      }
    };

    loadUser();
  }, [navigate]);

  const handleMarquerLu = async (avertissementId) => {
    try {
      await marquerAvertissementLu(avertissementId);
      setAvertissements(avertissements.map(avert => 
        avert._id === avertissementId ? { ...avert, estLu: true } : avert
      ));
    } catch (err) {
      console.error('Erreur lors du marquage de l\'avertissement:', err);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-[#1D3557] to-[#457B9D]">
        <div className="text-white text-lg">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header Amélioré */}
      <header className="relative h-48 bg-gradient-to-br from-gray-900/90 via-blue-900/80 to-blue-800/70 overflow-hidden">
        <div className="absolute inset-0 bg-pattern opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 h-full flex items-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-white">Mon Profil</h1>
            <p className="text-white/80">Gérez vos informations et suivez vos emprunts</p>
          </div>
        </div>
      </header>

      {/* Contenu Principal */}
      <main className="max-w-7xl mx-auto px-4 -mt-16 pb-12 relative z-10">
        {/* Carte de Profil */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 bg-white rounded-2xl shadow-xl border border-gray-100 p-6"
        >
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="relative">
              <div className="w-32 h-32 rounded-2xl overflow-hidden border-4 border-white shadow-lg">
                <img
                  src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.username}`}
                  alt={user?.username}
                  className="w-full h-full object-cover"
                />
              </div>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -bottom-3 -right-3 bg-gradient-to-r from-indigo-500 to-blue-500 
                  rounded-full p-2 shadow-lg"
              >
                <Star className="w-5 h-5 text-white" />
              </motion.div>
            </div>

            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold text-gray-900">{user?.username}</h2>
              <p className="text-gray-600">{user?.email}</p>
              <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
                {user?.roles.map((role, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 rounded-full text-sm font-medium 
                      bg-gradient-to-r from-indigo-50 to-blue-50 text-indigo-600 
                      border border-indigo-100/50 shadow-sm"
                  >
                    {role}
                  </span>
                ))}
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowEditDialog(true)}
              className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-blue-500 
                text-white rounded-xl shadow-lg hover:shadow-xl 
                transition-all duration-200"
            >
              Modifier le profil
            </motion.button>
          </div>
        </motion.div>

        {/* Grille des Statistiques */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <StatBox
            title="Emprunts en cours"
            value={emprunts.filter(e => !e.estRendu).length}
            icon={BookOpen}
            color="border-blue-100"
          />
          <StatBox
            title="Livres rendus"
            value={emprunts.filter(e => e.estRendu).length}
            icon={Check}
            color="border-green-100"
          />
          <StatBox
            title="Avertissements"
            value={avertissements.filter(a => !a.estLu).length}
            icon={AlertCircle}
            color="border-amber-100"
          />
        </div>

        {/* Section des Emprunts */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <DashboardCard title="Mes Emprunts" icon={BookOpen}>
              <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                <h3 className="text-xl font-bold text-gray-900 uppercase flex items-center mb-4 md:mb-0">
                  <BookOpen className="mr-3 h-6 w-6 text-[#457B9D]" />
                  Mes Emprunts
                </h3>
                
                <div className="flex bg-gray-100 p-1 rounded-lg">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTab('en_cours')}
                    className={`px-6 py-2 rounded-lg text-sm font-bold uppercase tracking-wide transition-all ${
                      activeTab === 'en_cours' ? 'bg-[#FFD700] text-gray-900 shadow-sm' : 'text-gray-600'
                    }`}
                  >
                    En cours
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTab('rendus')}
                    className={`px-6 py-2 rounded-lg text-sm font-bold uppercase tracking-wide transition-all ${
                      activeTab === 'rendus' ? 'bg-[#FFD700] text-gray-900 shadow-sm' : 'text-gray-600'
                    }`}
                  >
                    Rendus
                  </motion.button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {emprunts
                  .filter(emprunt => activeTab === 'en_cours' ? !emprunt.estRendu : emprunt.estRendu)
                  .map((emprunt) => (
                    <motion.div
                      key={emprunt._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ y: -2 }}
                      className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
                    >
                      <div className="p-6 flex flex-col md:flex-row">
                        <div className="w-full md:w-1/6 mb-4 md:mb-0">
                          <div className="relative w-full h-40 md:h-32 rounded-xl overflow-hidden bg-gray-100">
                            <img
                              src={emprunt.livreId.couvertureUrl || "https://via.placeholder.com/150"}
                              alt={emprunt.livreId.titre}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                        
                        <div className="w-full md:w-5/6 md:pl-6">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="text-lg font-bold text-gray-900 uppercase">{emprunt.livreId.titre}</h4>
                              <p className="text-gray-600 mt-1">ISBN: {emprunt.livreId.isbn}</p>
                            </div>
                            <ChevronRight className="h-5 w-5 text-gray-400" />
                          </div>
                          
                          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center">
                              <Calendar className="h-5 w-5 text-[#457B9D] mr-3" />
                              <div>
                                <p className="text-sm text-gray-500">Date d'emprunt</p>
                                <p className="font-medium text-gray-700">
                                  {new Date(emprunt.dateEmprunt).toLocaleDateString('fr-FR')}
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex items-center">
                              <Clock className="h-5 w-5 text-[#457B9D] mr-3" />
                              <div>
                                <p className="text-sm text-gray-500">
                                  {emprunt.estRendu ? 'Rendu le' : 'À rendre avant le'}
                                </p>
                                <p className={`font-medium ${
                                  !emprunt.estRendu && emprunt.estEnRetard ? 'text-red-600' : 'text-gray-700'
                                }`}>
                                  {emprunt.estRendu
                                    ? new Date(emprunt.dateRetourEffective).toLocaleDateString('fr-FR')
                                    : new Date(emprunt.dateRetourPrevue).toLocaleDateString('fr-FR')}
                                </p>
                              </div>
                            </div>
                          </div>

                          {!emprunt.estRendu && emprunt.estEnRetard && (
                            <motion.div 
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="mt-6"
                            >
                              <div className="inline-flex items-center px-4 py-2 bg-red-50 text-red-700 rounded-full">
                                <AlertCircle className="h-5 w-5 mr-2" />
                                <span className="text-sm font-bold uppercase">En retard de {emprunt.dureeRetard} jour(s)</span>
                              </div>
                            </motion.div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}

                {emprunts.filter(emprunt => activeTab === 'en_cours' ? !emprunt.estRendu : emprunt.estRendu).length === 0 && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-white rounded-2xl shadow-sm border-2 border-dashed border-gray-300 py-12 text-center"
                  >
                    <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-4 text-lg font-bold text-gray-900 uppercase">
                      Aucun emprunt {activeTab === 'en_cours' ? 'en cours' : 'rendu'}
                    </h3>
                    <p className="mt-2 text-gray-600 max-w-md mx-auto">
                      {activeTab === 'en_cours' 
                        ? "Vous n'avez pas d'emprunts en cours pour le moment."
                        : "Vous n'avez pas encore rendu de livres."}
                    </p>
                  </motion.div>
                )}
              </div>
            </DashboardCard>
          </div>

          <div>
            <DashboardCard title="Avertissements" icon={AlertCircle}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900 uppercase flex items-center">
                  <Tag className="mr-3 h-6 w-6 text-[#457B9D]" />
                  Mes Avertissements
                </h3>
                {avertissements.filter(a => !a.estLu).length > 0 && (
                  <span className="px-4 py-2 bg-[#1D3557] text-white text-sm font-bold uppercase rounded-full tracking-wide">
                    {avertissements.filter(a => !a.estLu).length} non lu(s)
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4">
                {avertissements.map((avert) => (
                  <motion.div
                    key={avert._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -2 }}
                    className={`p-6 rounded-2xl transition-all ${
                      avert.estLu 
                        ? 'bg-white border border-gray-200' 
                        : 'bg-[#457B9D]/10 border-2 border-[#1D3557]/20'
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div className="mb-4 md:mb-0">
                        <div className="flex items-start">
                          <p className={`font-bold ${avert.estLu ? 'text-gray-900' : 'text-[#1D3557]'}`}>
                            {avert.message}
                          </p>
                          {!avert.estLu && (
                            <span className="ml-3 px-2 py-1 bg-[#FFD700] text-gray-900 text-xs font-bold uppercase rounded-md tracking-wide">
                              Nouveau
                            </span>
                          )}
                        </div>
                        <p className="mt-2 text-sm text-gray-600">
                          {new Date(avert.dateCreation).toLocaleDateString('fr-FR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      
                      {!avert.estLu && (
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleMarquerLu(avert._id)}
                          className="px-6 py-2 bg-[#FFD700] hover:bg-[#FFC000] text-gray-900 font-bold uppercase rounded-lg text-sm tracking-wide transition-colors"
                        >
                          Marquer comme lu
                        </motion.button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </DashboardCard>
          </div>
        </div>
      </main>

      {/* Footer Amélioré */}
      <footer className="bg-gradient-to-r from-gray-900 to-indigo-900 py-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/80 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} Bibliothèque - Tous droits réservés
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-white hover:text-[#FFD700] transition-colors">
              <Info className="h-5 w-5" />
            </a>
            <a href="#" className="text-white hover:text-[#FFD700] transition-colors">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
              </svg>
            </a>
            <a href="#" className="text-white hover:text-[#FFD700] transition-colors">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
          </div>
        </div>
      </footer>

      <DialogProfile 
        isOpen={showEditDialog} 
        onClose={() => setShowEditDialog(false)}
        user={user}
        onUpdate={(updatedUser) => {
          setUser(updatedUser);
          setShowEditDialog(false);
        }}
      />
    </div>
  );
};

export default Profile;