import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../../api/authapi';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    // Username validation
    if (!/^[a-zA-Z0-9_-]{3,20}$/.test(formData.username)) {
      setError('Le nom d\'utilisateur doit contenir entre 3 et 20 caractères et ne peut contenir que des lettres, chiffres, tirets et underscores');
      return false;
    }

    // Email validation
    if (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[\w-]{2,}$/.test(formData.email)) {
      setError('Veuillez fournir un email valide');
      return false;
    }

    // Password validation (corrected to match backend)
    if (formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return false;
    }
    
    if (!/^(?=.*[A-Za-z])(?=.*\d).*$/.test(formData.password)) {
      setError('Le mot de passe doit contenir au moins une lettre et un chiffre');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    try {
      await register(formData.username, formData.email, formData.password);
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Une erreur est survenue lors de l\'inscription');
    }
  };

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
            Rejoignez notre communauté de lecteurs
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-400 text-lg md:text-xl max-w-xl mx-auto lg:mx-0"
          >
            Créez votre compte pour accéder à une expérience de lecture unique et personnalisée.
          </motion.p>
          
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap gap-4 justify-center lg:justify-start"
          >
            {['📚 Accès illimité', '🌟 Notes personnalisées', '👥 Communauté active'].map((item, index) => (
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

        {/* Right Section - Register Form */}
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
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-red-500/10 border border-red-500/50 text-red-200 p-4 rounded-xl"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nom d'utilisateur
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/5 text-white rounded-xl border border-white/10 focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all duration-200"
                  placeholder="Votre nom d'utilisateur"
                />
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Adresse email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/5 text-white rounded-xl border border-white/10 focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all duration-200"
                  placeholder="votre@email.com"
                />
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
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
                    required
                    className="w-full px-4 py-3 bg-white/5 text-white rounded-xl border border-white/10 focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all duration-200"
                    placeholder="Ex: Livre2024! (min. 6 caractères, 1 lettre, 1 chiffre)"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-amber-500 transition-colors"
                  >
                    {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                  </button>
                </div>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Confirmer le mot de passe
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white/5 text-white rounded-xl border border-white/10 focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all duration-200"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-amber-500 transition-colors"
                  >
                    {showConfirmPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                  </button>
                </div>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="flex items-center"
              >
                <input
                  type="checkbox"
                  required
                  className="w-4 h-4 rounded border-gray-600 text-blue-500 focus:ring-blue-500 focus:ring-offset-0 bg-white/5"
                />
                <label className="ml-2 block text-sm text-gray-300">
                  J'accepte les{' '}
                  <Link to="/terms" className="text-blue-500 hover:text-blue-400">
                    Conditions d'utilisation
                  </Link>
                  {' '}et la{' '}
                  <Link to="/privacy" className="text-blue-500 hover:text-blue-400">
                    Politique de confidentialité
                  </Link>
                </label>
              </motion.div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-200"
              >
                Créer un compte
              </motion.button>

              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="text-center text-gray-400 mt-6"
              >
                Déjà membre ?{' '}
                <Link 
                  to="/login" 
                  className="text-blue-500 hover:text-blue-400 font-medium"
                >
                  Se connecter
                </Link>
              </motion.p>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.0 }}
                className="text-center text-gray-400"
              >
                Vous êtes un auteur ?{' '}
                <Link 
                  to="/register-auteur" 
                  className="text-blue-500 hover:text-blue-400 font-medium"
                >
                  S'inscrire en tant qu'auteur
                </Link>
              </motion.p>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Register;