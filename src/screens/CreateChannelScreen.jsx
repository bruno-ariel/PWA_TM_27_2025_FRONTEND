import React from 'react'
import { useNavigate } from 'react-router-dom'
import useForm from '../hooks/useForm'
import ENVIROMENT from '../utils/constants/enviroments'
import { getAuthentitedHeaders } from '../fetching/customHeaders'

const CreateChannelScreen = () => {
    const navigate = useNavigate()
    const {handleChangeInput, form_state} = useForm({name : ''})

    const handleCreateChannel = async (e) => {
        e.preventDefault()
        const response = await fetch(ENVIROMENT.API_URL + '/api/channel/${workspace_id}', {
            method: 'POST',
            headers: getAuthentitedHeaders(),
            body: JSON.stringify(form_state)
        })
        const data = await response.json()
        navigate('/home')
    }
    return (
    <div>
        <h1>Crear un nuevo canal</h1>
        <form onSubmit={handleCreateChannel}>
            <div>
                <label htmlFor='name'></label>
                <input 
                id='name' 
                type='text' 
                name='name' 
                placeholder='nombre del canal' 
                onChange={handleChangeInput}
                value={form_state.name}
                />
            </div>
            <button type='submit'> Crear canal </button>
        </form>
    </div>
    )
}

export default CreateChannelScreen