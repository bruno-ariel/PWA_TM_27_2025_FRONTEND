import React from 'react'
import { useNavigate } from 'react-router-dom'
import useForm from '../hooks/useForm'
import ENVIROMENT from '../utils/constants/enviroments'
import { getAuthentitedHeaders } from '../fetching/customHeaders'

const CreateChannelScreen = () => {
    const navigate = useNavigate();
    const { handleChangeInput, form_state } = useForm({ name: '' });

    const handleCreateChannel = async (e) => {
        e.preventDefault();
        const response = await fetch(ENVIROMENT.API_URL + `/api/channel/${workspace_id}`, {
            method: 'POST',
            headers: getAuthentitedHeaders(),
            body: JSON.stringify(form_state)
        });
        const data = await response.json();
        navigate('/workspace');
    };

    return (
        <div className="create-channel-container">
            <form onSubmit={handleCreateChannel} className="create-channel-form">
                <h1>Crear un canal</h1>
                
                <div className="input-container">
                    <span className="channel-hash">#</span>
                    <input 
                        id="name" 
                        type="text" 
                        name="name" 
                        placeholder="Por ejemplo, planificación-presupuesto" 
                        onChange={handleChangeInput}
                        value={form_state.name}
                        maxLength={80}
                    />
                    <span className="char-counter">{80 - form_state.name.length}</span>
                </div>

                <p className="channel-description">
                    Los canales son el lugar donde se producen las conversaciones sobre un tema. 
                    Usa un nombre que sea fácil de encontrar y comprender.
                </p>

                <button type="submit" className="create-button">Siguiente</button>
            </form>
        </div>
    );
};

export default CreateChannelScreen