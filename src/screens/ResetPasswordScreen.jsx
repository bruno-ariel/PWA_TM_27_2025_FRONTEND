import React from 'react'
import useForm from '../hooks/useForm'
import ENVIROMENT from '../utils/constants/enviroments'

const ResetPasswordScreen = () => {
    //capturamos en token
    const url = new URLSearchParams(window.location.search)
    const reset_token = url.get('reset_token')
    const {form_state, handleChangeInput} = useForm ({password: ''})
    const handleSubmitResetPassword = async (e) => {
        try{
            e.preventDefault()
            const response =await fetch (`${ENVIROMENT.API_URL}/api/auth/reset-password?reset_token=${reset_token}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(form_state)
            })
            const data = await response.json()
            console.log(data)
        }
        catch(error){
            console.error(error)
        }
    }
    return (
        <div className='container-register'>
            <img src="https://a.slack-edge.com/bv1-13/slack_logo-ebd02d1.svg" alt="img-slack" className="img-slack-register"/>
            <h1 className='title-register'> Elije una nueva contraseña </h1>
            <form className='form-reset-password' onSubmit={handleSubmitResetPassword}>
                <div>
                    <label htmlFor='password'> Nueva contraseña: </label>
                    <input type="password" name='password' id='password' placeholder='***********' onChange={handleChangeInput} />
                    <button> Enviar </button>
                </div>
            </form>
        </div>
    )
}

export default ResetPasswordScreen