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
        <div className="container-register">
            <img src="https://a.slack-edge.com/bv1-13/slack_logo-ebd02d1.svg" alt="img-slack" className="img-slack-register"/>
            <h1 className="title-register">Restablecer contraseña</h1>                
            <h3>Te enviaremos un correo con los pasos para restablecer tu contraseña.</h3>
            <form className="form-register" onSubmit={handleSubmitForgotPassword}>
                <div>
                    <label htmlFor="email">Ingrese el correo con el que se ha registrado</label>
                    <input
                        type="email"
                        placeholder="joedoe@email.com"
                        name="email"
                        id="email"
                        onChange={handleChangeInput}
                        required
                    />
                    <button type="submit">Enviar correo</button>
                </div>
            </form>
        </div>
    )
}

export default ForgotPasswordScreen