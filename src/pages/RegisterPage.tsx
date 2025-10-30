import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Assurez-vous d'importer useAuth
import './Authentification.css'; 

export const RegisterPage = () => {
  const { register } = useAuth(); 
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    confirmPassword: '',
    birthDate: '',
});
  
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    
    try {
      await register({
        firstname: formData.firstname,
        lastname: formData.lastname,
        email: formData.email,
        password: formData.password,
        birthDate: formData.birthDate,
      });

      navigate('/');

    } catch (err) {
      if (err instanceof Error) setError(err.message || "Échec de l'inscription. L'email est peut-être déjà pris.");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h2>Créer un compte</h2>
        <form onSubmit={handleSubmit}>
          {error && <p className="auth-error">{error}</p>}

          <div className="auth-form-group">
            <label htmlFor="firstname">Prénom</label>
            <input
              type="text"
              id="firstname"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              required
            />
          </div>
          <div className="auth-form-group">
            <label htmlFor="lastname">Nom</label>
            <input
              type="text"
              id="lastname"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              required
            />
          </div>
          <div className="auth-form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="auth-form-group">
            <label htmlFor="birthDate">Date de naissance</label>
            <input
              type="date"
              id="birthDate"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
              required
            />
          </div>
          <div className="auth-form-group">
            <label htmlFor="password">Mot de passe</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
            />
          </div>
          <div className="auth-form-group">
            <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
          
          <button type="submit" className="auth-button">
            S'inscrire
          </button>
        </form>
        <p className="auth-switch-link">
          Déjà un compte ? <Link to="/authentification">Connectez-vous</Link>
        </p>
      </div>
    </div>
  );
};