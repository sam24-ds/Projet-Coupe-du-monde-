// src/pages/RegisterPage.tsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 

// ✅ PARTIE RAJOUTÉE : Importation de l'image de fond (doit être le même chemin que LoginPage)
import loginBackground from '../img/login_bg.jpg'; 

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
        // Fond de page avec image, centrage et relative
        <div 
          className="min-h-screen flex items-center justify-center bg-gray-900 relative p-4"
          style={{ backgroundImage: `url(${loginBackground})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
            {/* Overlay (Assombrit l'image pour que le formulaire soit lisible) */}
            <div className="absolute inset-0 bg-black opacity-70 z-0"></div>

            {/* Conteneur du formulaire */}
            {/* Fond semi-transparent (bg-opacity-70) et bordure bleue (border-blue-600) */}
            <div className="bg-white bg-opacity-70 p-8 rounded-2xl shadow-2xl w-full max-w-md z-10 border-t-4 border-blue-600">
                <h2 className="text-3xl font-extrabold text-gray-900 text-center">Créer un compte</h2>
                
                <form onSubmit={handleSubmit} className="space-y-5">
                    {error && (
                        <p className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md text-sm text-center">
                            {error}
                        </p>
                    )}

                    {/* Prénom */}
                    <div className="relative group">
                        <input
                            type="text"
                            id="firstname"
                            name="firstname"
                            value={formData.firstname}
                            onChange={handleChange}
                            required
                            // ✅ CORRECTION: Assure que le texte tapé est noir (text-gray-900)
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition duration-200 peer text-gray-900"
                            placeholder=" "
                        />
                        <label 
                            htmlFor="firstname"
                            // ✅ CORRECTION: Le fond du label doit être blanc pour masquer la valeur derrière
                            className="absolute left-3 top-3 text-gray-500 text-sm transition-all duration-200 
                                       peer-placeholder-shown:top-3 peer-placeholder-shown:text-base 
                                       peer-focus:-top-2 peer-focus:left-2 peer-focus:text-blue-600 peer-focus:text-xs 
                                       bg-white px-1 pointer-events-none"
                        >
                            Prénom
                        </label>
                    </div>

                    {/* Nom */}
                    <div className="relative group">
                        <input
                            type="text"
                            id="lastname"
                            name="lastname"
                            value={formData.lastname}
                            onChange={handleChange}
                            required
                            // ✅ CORRECTION: Assure que le texte tapé est noir (text-gray-900)
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition duration-200 peer text-gray-900"
                            placeholder=" "
                        />
                        <label 
                            htmlFor="lastname"
                            // ✅ CORRECTION: Le fond du label doit être blanc pour masquer la valeur derrière
                            className="absolute left-3 top-3 text-gray-500 text-sm transition-all duration-200 
                                       peer-placeholder-shown:top-3 peer-placeholder-shown:text-base 
                                       peer-focus:-top-2 peer-focus:left-2 peer-focus:text-blue-600 peer-focus:text-xs 
                                       bg-white px-1 pointer-events-none"
                        >
                            Nom
                        </label>
                    </div>

                    {/* Email */}
                    <div className="relative group">
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            // ✅ CORRECTION: Assure que le texte tapé est noir (text-gray-900)
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition duration-200 peer text-gray-900"
                            placeholder=" "
                        />
                        <label 
                            htmlFor="email"
                            // ✅ CORRECTION: Le fond du label doit être blanc pour masquer la valeur derrière
                            className="absolute left-3 top-3 text-gray-500 text-sm transition-all duration-200 
                                       peer-placeholder-shown:top-3 peer-placeholder-shown:text-base 
                                       peer-focus:-top-2 peer-focus:left-2 peer-focus:text-blue-600 peer-focus:text-xs 
                                       bg-white px-1 pointer-events-none"
                        >
                            Email
                        </label>
                    </div>

                    {/* Date de naissance */}
                    <div className="relative group">
                        <input
                            type="date"
                            id="birthDate"
                            name="birthDate"
                            value={formData.birthDate}
                            onChange={handleChange}
                            required
                            // ✅ CORRECTION: Assure que le texte tapé est noir (text-gray-900)
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition duration-200 peer text-gray-900"
                            onFocus={(e) => e.target.type = 'date'} 
                            onBlur={(e) => {if(!e.target.value) e.target.type = 'text'}}
                            placeholder=" " 
                        />
                        <label 
                            htmlFor="birthDate"
                            // ✅ CORRECTION: Le fond du label doit être blanc pour masquer la valeur derrière
                            className="absolute left-3 top-3 text-gray-500 text-sm transition-all duration-200 
                                       peer-placeholder-shown:top-3 peer-placeholder-shown:text-base 
                                       peer-focus:-top-2 peer-focus:left-2 peer-focus:text-blue-600 peer-focus:text-xs 
                                       bg-white px-1 pointer-events-none
                                       peer-not(:placeholder-shown):-top-2 peer-not(:placeholder-shown):left-2 peer-not(:placeholder-shown):text-blue-600 peer-not(:placeholder-shown):text-xs"
                        >
                            Date de naissance
                        </label>
                    </div>

                    {/* Mot de passe */}
                    <div className="relative group">
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            minLength={6}
                            // ✅ CORRECTION: Assure que le texte tapé est noir (text-gray-900)
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition duration-200 peer text-gray-900"
                            placeholder=" "
                        />
                        <label 
                            htmlFor="password"
                            // ✅ CORRECTION: Le fond du label doit être blanc pour masquer la valeur derrière
                            className="absolute left-3 top-3 text-gray-500 text-sm transition-all duration-200 
                                       peer-placeholder-shown:top-3 peer-placeholder-shown:text-base 
                                       peer-focus:-top-2 peer-focus:left-2 peer-focus:text-blue-600 peer-focus:text-xs 
                                       bg-white px-1 pointer-events-none"
                        >
                            Mot de passe
                        </label>
                    </div>

                    {/* Confirmer le mot de passe */}
                    <div className="relative group">
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            // ✅ CORRECTION: Assure que le texte tapé est noir (text-gray-900)
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition duration-200 peer text-gray-900"
                            placeholder=" "
                        />
                        <label 
                            htmlFor="confirmPassword"
                            // ✅ CORRECTION: Le fond du label doit être blanc pour masquer la valeur derrière
                            className="absolute left-3 top-3 text-gray-500 text-sm transition-all duration-200 
                                       peer-placeholder-shown:top-3 peer-placeholder-shown:text-base 
                                       peer-focus:-top-2 peer-focus:left-2 peer-focus:text-blue-600 peer-focus:text-xs 
                                       bg-white px-1 pointer-events-none"
                        >
                            Confirmer le mot de passe
                        </label>
                    </div>
                    
                    {/* Bouton d'inscription */}
                    <button 
                        type="submit" 
                        className="w-full bg-blue-600 text-white font-black py-3 rounded-lg shadow-lg hover:bg-blue-700 transition duration-200 mt-6"
                    >
                        S'inscrire
                    </button>
                </form>
                
                {/* Lien vers la page de connexion */}
                <p className="text-center text-gray-600 mt-5 text-sm">
                    Déjà un compte ? 
                    <Link to="/authentification" className="text-blue-600 hover:text-blue-800 font-bold ml-1">
                      Connectez-vous
                    </Link>
                </p>
            </div>
        </div>
    );
};