// src/pages/Authentification.tsx

import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Authentification.css'; 

export const Authentification = () => {
  const { login } = useAuth(); 
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || "/";

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await login({ email, password });
      
      // Petit délai pour s'assurer que l'état est mis à jour
      setTimeout(() => {
        navigate(from, { replace: true, state: {} });
      }, 100);

    } catch (err) {
      let errorMessage = "Échec de la connexion. Vérifiez vos identifiants.";
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h2>Connexion</h2>
        <form onSubmit={handleSubmit}>
          {error && <p className="auth-error">{error}</p>}

          <div className="auth-form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="auth-form-group">
            <label htmlFor="password">Mot de passe</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          
          <button type="submit" className="auth-button" disabled={isLoading}>
            {isLoading ? 'Connexion en cours...' : 'Se connecter'}
          </button>
        </form>
        <p className="auth-switch-link">
          Pas encore de compte ? <Link to="/register">Inscrivez-vous</Link>
        </p>
      </div>
    </div>
  );
};