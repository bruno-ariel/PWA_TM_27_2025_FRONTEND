import React from 'react'
import ENVIROMENT from '../utils/constants/enviroments'
import { getAuthentitedHeaders } from '../fetching/customHeaders'
import { useFetch } from '../hooks/useFetch'
import { Link } from 'react-router-dom'

const HomeScreen = () => {
    const {
        data: workspace_response,
        error: workspace_error,
        loading: workspace_loading
    } = useFetch(ENVIROMENT.API_URL + '/api/workspace', {
        method: 'GET',
        headers: getAuthentitedHeaders()
    })
    return (
        <div className='home-container'>
            <h1 className='welcome-title'>👋 ¡Hola de nuevo!</h1>
    
            <div className='workspaces-box'>
                <p className='workspace-header'>Espacios de trabajo para usuario@email.com</p>
    
                <div className='workspace-card'>
                    <div className='workspace-info'>
                        <img src="workspace-logo.png" alt="Workspace Logo" className='workspace-logo'/>
                        <div>
                            <h3>PWI TM</h3>
                            <p className='workspace-members'>👤 1 miembro</p>
                        </div>
                    </div>
                    <button className='btn-start'>INICIAR SLACK</button>
                </div>
    
                <p className='see-more'>Ver más ▼</p>
            </div>
    
            <div className='create-workspace-box'>
                <div className='create-workspace-content'>
                    <img src="illustration.png" alt="Illustration" className='workspace-illustration'/>
                    <p>¿Quieres usar Slack con otro equipo?</p>
                </div>
                <button className='btn-create'>CREAR UN NUEVO ESPACIO DE TRABAJO</button>
            </div>
        </div>
    );
}

export default HomeScreen