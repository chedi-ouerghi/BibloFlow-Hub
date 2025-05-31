import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../../api/authapi';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    general: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [touched, setTouched] = useState({
    email: false,
    password: false
  });

  const validateField = (name, value) => {
    switch (name) {
      case 'email':
        if (!value) return 'L\'email est requis';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return 'Veuillez entrer une adresse email valide';
        }
        return '';
      case 'password':
        if (!value) return 'Le mot de passe est requis';
        if (value.length < 6) {
          return 'Le mot de passe doit contenir au moins 6 caractères';
        }
        return '';
      default:
        return '';
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    setErrors(prev => ({
      ...prev,
      [name]: validateField(name, formData[name])
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (touched[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: validateField(name, value),
        general: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    try {
      setIsLoading(true);
      const response = await login(formData.email, formData.password);
      
      console.log('Response from server:', response); // Debug log

      if (response && response.accessToken) {  // Vérifier accessToken au lieu du status
        const userRole = Array.isArray(response.roles) ? response.roles[0] : response.roles;
        
        console.log('User role:', userRole); // Debug log
        
        // Force page reload and redirection
        window.location.href = userRole === 'admin' 
          ? '/dashboard'
          : userRole === 'auteur' 
            ? '/dashboard'
            : '/';
      } else {
        setErrors(prev => ({
          ...prev,
          general: response.message || "Erreur lors de la connexion"
        }));
      }
    } catch (err) {
      console.error('Login error:', err);
      setErrors(prev => ({
        ...prev,
        general: err.message || "Une erreur est survenue lors de la connexion"
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const inputClasses = (fieldName) => `
    w-full px-4 py-3 bg-white/5 text-white rounded-xl 
    border transition-all duration-200
    ${touched[fieldName] && errors[fieldName]
      ? 'border-red-500/50 focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20'
      : 'border-white/10 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20'}
    ${touched[fieldName] && !errors[fieldName] && formData[fieldName]
      ? 'border-green-500/50'
      : ''}
  `;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4 sm:p-6 md:p-8 overflow-hidden"
    >
      <div className="w-full max-w-7xl flex flex-col lg:flex-row gap-8 items-center">
        {/* Left Section - Hero */}
        <motion.div 
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex-1 w-full lg:w-1/2 space-y-6 text-center lg:text-left"
        >
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-200 to-blue-500 bg-clip-text text-transparent"
          >
            Bienvenue dans votre BiblioFlow numérique
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-400 text-lg md:text-xl max-w-xl mx-auto lg:mx-0"
          >
            Découvrez une collection unique de livres et gérez vos lectures en toute simplicité.
          </motion.p>
          
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap gap-4 justify-center lg:justify-start"
          >
            {['📚 +10k Livres', '🌟 Note moyenne 4.8', '👥 +5k Lecteurs'].map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="px-4 py-2 bg-white/5 rounded-full text-gray-300 backdrop-blur-sm"
              >
                {item}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right Section - Login Form */}
        <motion.div 
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="w-full max-w-md"
        >
          <motion.div 
            className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/10"
            whileHover={{ boxShadow: "0 0 50px rgba(255,255,255,0.1)" }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <AnimatePresence>
                {errors.general && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-red-500/10 border border-red-500/50 text-red-200 p-4 rounded-xl"
                  >
                    {errors.general}
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Adresse email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    className={inputClasses('email')}
                    placeholder="votre@email.com"
                  />
                  {touched.email && errors.email && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-red-400 text-sm mt-1"
                    >
                      {errors.email}
                    </motion.p>
                  )}
                </div>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Mot de passe
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    className={inputClasses('password')}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors"
                  >
                    {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                  </button>
                  {touched.password && errors.password && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-red-400 text-sm mt-1"
                    >
                      {errors.password}
                    </motion.p>
                  )}
                </div>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex items-center justify-between"
              >
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-600 text-blue-500 focus:ring-blue-500 focus:ring-offset-0 bg-white/5"
                  />
                  <span className="text-sm text-gray-300">Se souvenir de moi</span>
                </label>
                <a href="#" className="text-sm text-blue-500 hover:text-blue-400">
                  Mot de passe oublié ?
                </a>
              </motion.div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-200"
                disabled={isLoading}
              >
                {isLoading ? 'Chargement...' : 'Se connecter'}
              </motion.button>

              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-center text-gray-400 mt-6"
              >
                Pas encore de compte ?{' '}
                <Link 
                  to="/register" 
                  className="text-blue-500 hover:text-blue-400 font-medium"
                >
                  S'inscrire
                </Link>
              </motion.p>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Login;