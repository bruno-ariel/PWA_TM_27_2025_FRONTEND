import React, { useContext } from 'react'
import useForm from '../hooks/useForm'
import ENVIROMENT from '../utils/constants/enviroments'
import { Link , useNavigate } from 'react-router-dom'
import { AuthContext } from '../Context/AuthContext'

const LoginScreen = () => {

    const {login , isAuthenticatedState } = useContext(AuthContext)
    console.log(isAuthenticatedState)

    const {form_state, handleChangeInput} = useForm({email:"", password:""})
    const url = new URLSearchParams(window.location.search) 
    const navigate = useNavigate()
    if(url.get('verified')){
        alert('Cuenta verificada')
    }
    const handleSubmitForm = async (e) =>{
        try{
            e.preventDefault()
            const response = await fetch(ENVIROMENT.API_URL + '/api/auth/login', {
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json'
            },
                body: JSON.stringify(form_state)
        })
            const data = await response.json()
            console.log(data)
            if(!data.ok){
                alert(data.message || 'Error al loguear')
                return
            }            
            login(data.data.access_token)
            navigate('/home')
        }
        catch(error){
            console.error("error al loguear",error)
        }
    }
    const errores = {
        email: [],
        password: []
    }
    form_state.email && form_state.email.length > 30 && errores.email.push('El email no puede superar los 30 caracteres')
    form_state.email && form_state.email.length < 5 && errores.email.push('El email debe tener al menos 5 caracteres')
    form_state.password && form_state.password.length < 5 && errores.password.push("La contraseña debe tener al menos 5 caracteres")
    return(
        <main className='auth-screen'>
            <form onSubmit={handleSubmitForm} className='auth-form'>
                <h1 className='title'>Login</h1>
                <div className='input-container'>
                    <label htmlFor="email"> Ingresa tu email</label>
                    <input
                        name='email'
                        id='email'
                        placeholder='email@gmail.com'
                        value={form_state.email}
                        onChange={handleChangeInput}
                    />
                    {
                        errores.email.map((error, index) => <p key={index}style={{color: 'red'}}> {error}</p>)
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
                    />
                    {
                        errores.password.map((error, index) => <p key={index} style={{color: 'red'}}> {error}</p>)
                    }
                </div>
                <button type='submit' disabled={
                        errores.email.length ||
                        errores.password.length ||
                        !form_state.email ||
                        !form_state.password
                        }>
                        Iniciar sesion
                </button>
                <span>Aún no tienes cuenta ? <Link to={'/register'}>Regístrate</Link></span>
                <Link to={'/forgot-password'}> Olvide mi contraseña </Link>
            </form>
        </main>
    )
}

export default LoginScreen