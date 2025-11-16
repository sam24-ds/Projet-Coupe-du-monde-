// src/pages/RegisterPage.tsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 

// Importation de l'image de fond
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
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition duration-200 peer text-gray-900"
                            placeholder=" "
                        />
                        <label 
                            htmlFor="firstname"
                            className={`absolute left-3 text-gray-500 text-sm transition-all duration-200 bg-white px-1 pointer-events-none
                                ${formData.firstname ? '-top-2 left-2 text-blue-600 text-xs' : 'top-3 peer-focus:-top-2 peer-focus:left-2 peer-focus:text-blue-600 peer-focus:text-xs'}`}
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
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition duration-200 peer text-gray-900"
                            placeholder=" "
                        />
                        <label 
                            htmlFor="lastname"
                            className={`absolute left-3 text-gray-500 text-sm transition-all duration-200 bg-white px-1 pointer-events-none
                                ${formData.lastname ? '-top-2 left-2 text-blue-600 text-xs' : 'top-3 peer-focus:-top-2 peer-focus:left-2 peer-focus:text-blue-600 peer-focus:text-xs'}`}
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
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition duration-200 peer text-gray-900"
                            placeholder=" "
                        />
                        <label 
                            htmlFor="email"
                            className={`absolute left-3 text-gray-500 text-sm transition-all duration-200 bg-white px-1 pointer-events-none
                                ${formData.email ? '-top-2 left-2 text-blue-600 text-xs' : 'top-3 peer-focus:-top-2 peer-focus:left-2 peer-focus:text-blue-600 peer-focus:text-xs'}`}
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
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition duration-200 peer text-gray-900"
                            onFocus={(e) => e.target.type = 'date'} 
                            onBlur={(e) => {if(!e.target.value) e.target.type = 'text'}}
                            placeholder=" " 
                        />
                        <label 
                            htmlFor="birthDate"
                            className={`absolute left-3 text-gray-500 text-sm transition-all duration-200 bg-white px-1 pointer-events-none
                                ${formData.birthDate ? '-top-2 left-2 text-blue-600 text-xs' : 'top-3 peer-focus:-top-2 peer-focus:left-2 peer-focus:text-blue-600 peer-focus:text-xs'}`}
                        >
                            Date de naissance
                        </label>
                    </div>

                    {/* Mot de passe */}
                    <div className="relative group">
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            minLength={6}
                            className="w-full p-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition duration-200 peer text-gray-900"
                            placeholder=" "
                        />
                        <label 
                            htmlFor="password"
                            className={`absolute left-3 text-gray-500 text-sm transition-all duration-200 bg-white px-1 pointer-events-none
                                ${formData.password ? '-top-2 left-2 text-blue-600 text-xs' : 'top-3 peer-focus:-top-2 peer-focus:left-2 peer-focus:text-blue-600 peer-focus:text-xs'}`}
                        >
                            Mot de passe
                        </label>
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 transition duration-200"
                        >
                            {showPassword ? (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            )}
                        </button>
                    </div>

                    {/* Confirmer le mot de passe */}
                    <div className="relative group">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            className="w-full p-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition duration-200 peer text-gray-900"
                            placeholder=" "
                        />
                        <label 
                            htmlFor="confirmPassword"
                            className={`absolute left-3 text-gray-500 text-sm transition-all duration-200 bg-white px-1 pointer-events-none
                                ${formData.confirmPassword ? '-top-2 left-2 text-blue-600 text-xs' : 'top-3 peer-focus:-top-2 peer-focus:left-2 peer-focus:text-blue-600 peer-focus:text-xs'}`}
                        >
                            Confirmer le mot de passe
                        </label>
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 transition duration-200"
                        >
                            {showConfirmPassword ? (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            )}
                        </button>
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