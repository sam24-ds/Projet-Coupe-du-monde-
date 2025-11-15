// src/pages/LoginPage.tsx

import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import loginBackground from '../img/login_bg.jpg'; 

export const Authentification = () => {
  const { login } = useAuth(); 
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  // ✅ FONCTIONNALITÉ FUSIONNÉE : Récupère l'objet location pour la redirection
  const location = useLocation(); 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await login({ email, password });

      // ✅ FONCTIONNALITÉ FUSIONNÉE : Redirection intelligente vers la page précédente
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });

    } catch (err) { 
      let errorMessage = "Échec de la connexion. Vérifiez vos identifiants.";
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-gray-900 relative p-4"
      style={{ backgroundImage: `url(${loginBackground})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      {/* Overlay (Assombrit l'image pour que le formulaire soit lisible) */}
      <div className="absolute inset-0 bg-black opacity-70 z-0"></div>

      {/* Conteneur du formulaire */}
      <div className="bg-white bg-opacity-70 p-10 rounded-2xl shadow-2xl w-full max-w-md z-10 border-t-4 border-blue-600">
        <h2 className="text-3xl font-black text-gray-800 mb-6 text-center">
          Connexion
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <p className="bg-red-100 text-red-700 p-3 rounded-lg border border-red-300 text-sm font-semibold">
              {error}
            </p>
          )}

          {/* Groupe Email */}
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-bold text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
              placeholder="votre.email@exemple.com"
            />
          </div>

          {/* Groupe Mot de passe */}
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-bold text-gray-700">
              Mot de passe
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
              placeholder="********"
            />
          </div>
          
          {/* Bouton Se connecter */}
          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white font-black py-3 rounded-lg shadow-lg hover:bg-blue-700 transition duration-200 mt-6"
          >
            Se connecter
          </button>
        </form>
        
        {/* Lien Inscription */}
        <p className="text-center text-gray-600 mt-5 text-sm">
          Pas encore de compte ? 
          <Link to="/register" className="text-blue-600 hover:text-blue-800 font-bold ml-1">
            Inscrivez-vous
          </Link>
        </p>
      </div>
    </div>
  );
};