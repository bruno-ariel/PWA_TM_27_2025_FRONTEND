import React from 'react'
import useForm from '../hooks/useForm'
import ENVIROMENT from '../utils/constants/enviroments'

const ForgotPasswordScreen = () => {
    const {form_state, handleChangeInput} = useForm({email:''})
    const handleSubmitForgotPassword = async (e) => {
        try{
            e.preventDefault()
            const response = await fetch(ENVIROMENT.API_URL + '/api/auth/forgot-password', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(form_state)
            })
            const data = await response.json()
            if(data.ok){
                alert('Se envio el mail de verificacion')
            }
        }
        catch(error){
            console.error(error)
        }
    }
    return (
        <div className="forgot-container">
            <div className="forgot-card">
                <h1>Restablecer contraseña</h1>
                <p>Te enviaremos un correo con los pasos para restablecer tu contraseña.</p>
                <form onSubmit={handleSubmitForgotPassword}>
                    <label htmlFor="email">Ingresa tu correo registrado:</label>
                    <input
                        type="email"
                        placeholder="joedoe@email.com"
                        name="email"
                        id="email"
                        onChange={handleChangeInput}
                        required
                    />
                    <button type="submit">Enviar correo</button>
                </form>
            </div>
        </div>
    )
}

export default ForgotPasswordScreen