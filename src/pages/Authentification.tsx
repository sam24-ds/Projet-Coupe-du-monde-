// src/pages/LoginPage.tsx

import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Authentification.css'; 

export const Authentification = () => {
  // On récupère la fonction 'login' de notre contexte
  const { login } = useAuth(); 
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const location = useLocation(); 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      // On appelle la fonction 'login' du contexte
      await login({ email, password });

      const from = location.state?.from?.pathname || '/';

      navigate(from, { replace: true });

    } catch (err) { 
      let errorMessage = "Échec de la connexion.";
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
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
            />
          </div>
          
          <button type="submit" className="auth-button">
            Se connecter
          </button>
        </form>
        <p className="auth-switch-link">
          Pas encore de compte ? <Link to="/register">Inscrivez-vous</Link>
        </p>
      </div>
    </div>
  );
};