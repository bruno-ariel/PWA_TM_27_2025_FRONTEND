import React from 'react'
import ENVIROMENT from '../utils/constants/enviroments.js'
import useForm from '../hooks/useForm'

const RegisterScreen = () => {
	const { form_state, handleChangeInput } = useForm ({ username: "", email: "", password: "" })

	const handleSubmitForm = async (event) => {
		event.preventDefault()
		try {
			const res = await fetch(ENVIROMENT.API_URL + "/api/auth/register", {
				method: "POST",
				headers: {
					'Content-Type': 'application/json'

				},
				body: JSON.stringify(form_state)
			})
			const data = await res.json()		
			console.log(data)
		}
		catch (error) {
			console.log(">> Error al crear usuario", error)
		}
	}

	const errores = {
		username: [
		],
		email: [
		],
		password: []
	}

	form_state.email && form_state.email.length > 30 && errores.email.push("El límite de caracteres es 30")
	form_state.email && form_state.email.length < 5 && errores.email.push("El mínimo de caracteres es 5")

	form_state.password && form_state.password.length > 30 && errores.password.push("El máximo de caracteres es 30")
	form_state.password && form_state.password.length < 5 && errores.password.push("El mínimo de caracteres es 5")

	form_state.username && form_state.username.length > 30 && errores.username.push("El límite de caracteres es 30")
	form_state.username && form_state.username.length < 5 && errores.username.push("El mínimo de caracteres es 5")
	return (
		<div className="container-register">
			<img src="https://a.slack-edge.com/bv1-13/slack_logo-ebd02d1.svg" alt="img-slack" className="img-slack-register"/>
			<h1 className="title-register"> Primero introduce tu e-mail, un nombre de usuario y una contraseña </h1>
			<h3> Te sugerimos que uses la <bolt> direccion de correo electronico que usas en tu trabajo</bolt></h3>
			<form onSubmit={handleSubmitForm}>
				<div>
					<label htmlFor="username">Ingresa tu nombre de usuario:</label>
					<input name='username' id='username' value={form_state.username} onChange={handleChangeInput} />
					{errores.username?.map((error, index) => <p key={index} style={{ color: "red" }}>{error}</p>)}
				</div>
				<div>
					<label htmlFor="email">Ingresa tu email:</label>
					<input name='email' id='email' placeholder='joedoe@gmail' value={form_state.email} onChange={handleChangeInput} />
					{errores.email?.map((error, index) => <p key={index} style={{ color: "red" }}>{error}</p>)}
				</div>
				<div>
					<label htmlFor="password">Ingrese su contraseña:</label>
					<input name='password' id='password' value={form_state.password} onChange={handleChangeInput} />
					<button type='submit' disabled={errores.email.length > 0 || errores.password.length || !form_state.email || !form_state.password}>Completar registro</button>
					{errores.password?.map((error, index) => <p key={index} style={{ color: "red" }}>{error}</p>)}
				</div>
			</form>
		</div>
	)
}

export default RegisterScreen