import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerAuteur } from '../../api/authapi';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { motion } from 'framer-motion';

const RegisterAuteur = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    nom: '',
    nationalite: '',
    bio: ''
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

    // Nom validation
    if (formData.nom.length < 2 || formData.nom.length > 50) {
      setError('Le nom doit contenir entre 2 et 50 caractères');
      return false;
    }

    // Nationalite validation
    if (formData.nationalite.length < 2 || formData.nationalite.length > 50) {
      setError('La nationalité doit contenir entre 2 et 50 caractères');
      return false;
    }

    // Bio validation
    if (formData.bio.length < 10 || formData.bio.length > 1000) {
      setError('La biographie doit contenir entre 10 et 1000 caractères');
      return false;
    }

    return true;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    try {
      const { confirmPassword, ...registrationData } = formData;
      await registerAuteur(registrationData);
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
      className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4 sm:p-6 md:p-8"
    >
      <div className="w-full max-w-7xl flex flex-col lg:flex-row gap-8 items-center">
        {/* Left Section - Hero */}
        <motion.div 
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex-1 w-full lg:w-1/2 space-y-6 text-center lg:text-left"
        >
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-200 to-blue-500 bg-clip-text text-transparent">
            Rejoignez-nous en tant qu'auteur
          </h1>
          <p className="text-gray-400 text-lg md:text-xl">
            Partagez vos œuvres avec notre communauté de lecteurs passionnés.
          </p>
        </motion.div>

        {/* Right Section - Register Form */}
        <motion.div 
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="w-full max-w-md"
        >
          <div className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/10">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-200 p-4 rounded-xl">
                  {error}
                </div>
              )}

              {/* Informations de base */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nom d'utilisateur
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/5 text-white rounded-xl border border-white/10 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
                  placeholder="Votre nom d'utilisateur"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/5 text-white rounded-xl border border-white/10 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
                  placeholder="votre@email.com"
                />
              </div>

              {/* Mot de passe */}
              <div>
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
                    className="w-full px-4 py-3 bg-white/5 text-white rounded-xl border border-white/10 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
                    placeholder="Ex: Livre2024! (min. 6 caractères, 1 lettre, 1 chiffre)"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500"
                  >
                    {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                  </button>
                </div>
              </div>

              <div>
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
                    className="w-full px-4 py-3 bg-white/5 text-white rounded-xl border border-white/10 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500"
                  >
                    {showConfirmPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                  </button>
                </div>
              </div>

              {/* Informations d'auteur */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nom complet
                </label>
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/5 text-white rounded-xl border border-white/10 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
                  placeholder="Votre nom complet"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nationalité
                </label>
                <input
                  type="text"
                  name="nationalite"
                  value={formData.nationalite}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/5 text-white rounded-xl border border-white/10 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
                  placeholder="Votre nationalité"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Biographie
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/5 text-white rounded-xl border border-white/10 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 min-h-[100px]"
                  placeholder="Parlez-nous de vous..."
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  required
                  className="w-4 h-4 rounded border-gray-600 text-blue-500 focus:ring-blue-500"
                />
                <label className="ml-2 block text-sm text-gray-300">
                  J'accepte les{' '}
                  <Link to="/terms" className="text-blue-500 hover:text-blue-400">
                    Conditions d'utilisation
                  </Link>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
              >
                S'inscrire en tant qu'auteur
              </button>

              <p className="text-center text-gray-400 mt-6">
                Déjà membre ?{' '}
                <Link to="/login" className="text-blue-500 hover:text-blue-400">
                  Se connecter
                </Link>
              </p>
            </form>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default RegisterAuteur;