import React, { useContext, useState } from 'react'
import useForm from '../hooks/useForm'
import ENVIROMENT from '../utils/constants/enviroments'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../Context/AuthContext'

const LoginScreen = () => {
    const { login, isAuthenticatedState } = useContext(AuthContext)
    const [errorMessage, setErrorMessage] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    
    const { form_state, handleChangeInput } = useForm({ email: "", password: "" })
    const url = new URLSearchParams(window.location.search)
    const navigate = useNavigate()
    
    if (url.get('verified')) {
        alert('Cuenta verificada')
    }
    
    const handleSubmitForm = async (e) => {
        try {
            e.preventDefault()
            setIsLoading(true)
            setErrorMessage('')
            
            const response = await fetch(ENVIROMENT.API_URL + '/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(form_state)
            })
            
            // Verificar si la respuesta es exitosa
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`)
            }
            
            const data = await response.json()
            
            // Verificar la estructura de la respuesta
            if (!data) {
                throw new Error('Respuesta vacía del servidor')
            }
            
            // Ajustar según la estructura real de tu API
            const accessToken = data.access_token || 
                                (data.data && data.data.access_token) || 
                                (data.token) || 
                                (data.data && data.data.token)
            
            if (!accessToken) {
                console.error('Estructura de respuesta inesperada:', data)
                throw new Error('El servidor no proporcionó un token de acceso válido')
            }
            
            login(accessToken)
            navigate('/home')
        } catch (error) {
            console.error("Error al loguear", error)
            setErrorMessage(error.message || 'Error al iniciar sesión. Intenta nuevamente.')
        } finally {
            setIsLoading(false)
        }
    }
    
    const errores = {
        email: [],
        password: []
    }
    
    form_state.email && form_state.email.length > 30 && errores.email.push('El email no puede superar los 30 caracteres')
    form_state.email && form_state.email.length < 5 && errores.email.push('El email debe tener al menos 5 caracteres')
    form_state.password && form_state.password.length < 5 && errores.password.push("La contraseña debe tener al menos 5 caracteres")
    
    return (
        <main className='auth-screen'>
            <form onSubmit={handleSubmitForm} className='auth-form'>
                <h1 className='title'>Login</h1>
                
                {errorMessage && (
                    <div className="error-message" style={{color: 'red', marginBottom: '15px'}}>
                        {errorMessage}
                    </div>
                )}
                
                <div className='input-container'>
                    <label htmlFor="email"> Ingresa tu email</label>
                    <input
                        name='email'
                        id='email'
                        placeholder='email@gmail.com'
                        value={form_state.email}
                        onChange={handleChangeInput}
                        disabled={isLoading}
                    />
                    {
                        errores.email.map((error, index) => <p key={index} style={{ color: 'red' }}> {error}</p>)
                    }
                </div>
                <div className='input-container'>
                    <label htmlFor="password"> Ingresa tu contraseña </label>
                    <input
                        type='password'
                        name='password'
                        id='password'
                        value={form_state.password}
                        onChange={handleChangeInput}
                        disabled={isLoading}
                    />
                    {
                        errores.password.map((error, index) => <p key={index} style={{ color: 'red' }}> {error}</p>)
                    }
                </div>
                <button 
                    type='submit' 
                    disabled={
                        errores.email.length ||
                        errores.password.length ||
                        !form_state.email ||
                        !form_state.password ||
                        isLoading
                    }
                >
                    {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
                </button>
                <span>Aún no tienes cuenta ? <Link to={'/register'}>Regístrate</Link></span>
                <Link to={'/forgot-password'}> Olvide mi contraseña </Link>
            </form>
        </main>
    )
}

export default LoginScreen