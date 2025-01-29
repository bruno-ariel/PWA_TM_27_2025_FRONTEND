import React from 'react'
import useForm from '../hooks/useForm'
import { useFetch } from '../hooks/useFetch'
import ENVIROMENT from '../utils/constants/enviroments'
import { getAuthentitedHeaders } from '../fetching/customHeaders'
import { useNavigate } from 'react-router-dom'

const CreateWorkspaceScreen = () => {
    const navigate = useNavigate()
    const {handleChangeInput, form_state} = useForm({name: ''})
    const handleCreateWorkspace = async (e) => {
        e.preventDefault()
        const response = await fetch(ENVIROMENT.API_URL + '/api/workspace', {
            method: 'POST',
            headers: getAuthentitedHeaders(),
            body: JSON.stringify(form_state)
        })
        const data = await response.json()
        navigate('/home')
    }
    return (
    <div>
        <h1>Crear un nuevo espacio de trabajo</h1>
        <form onSubmit={handleCreateWorkspace}>
            <div>
                <label htmlFor='name'></label>
                <input 
                id='name' 
                type='text' 
                name='name' 
                placeholder='nombre del espacio de trabajo' 
                onChange={handleChangeInput}
                value={form_state.name}
                />
            </div>
            <button type='submit'> Crear espacio </button>
        </form>
    </div>
    )
}

export default CreateWorkspaceScreen