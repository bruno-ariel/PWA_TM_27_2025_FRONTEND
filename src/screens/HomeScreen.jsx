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
        <main className='home-screen'>
            <h1>Bienvenido de vuelta {/* nombre del usuario */} </h1>

            <div className='workspaces-container'>
                {/* Sección de Workspaces */}
                <div className='workspaces'>
                    {
                        workspace_loading ? (
                            <h2>Cargando...</h2>
                        ) : workspace_response?.data?.workspaces?.length > 0 ? (
                            workspace_response.data.workspaces.map(workspace => (
                                <div key={workspace._id} className="workspace-item">
                                    <h3>{workspace.name}</h3>
                                    <Link to={`/workspace/${workspace._id}`}>Ir a workspace</Link>
                                </div>
                            ))
                        ) : (
                            <h2>No tienes espacios de trabajo</h2>
                        )
                    }
                </div>
                {/* Sección para crear un nuevo Workspace */}
                <div className='create-workspace'>
                    <span>¿Aún no tienes espacios de trabajo? </span>
                    <Link to="/workspace/new"> Crea un nuevo espacio de trabajo aquí</Link>
                </div>
            </div>
        </main>
    );
}

export default HomeScreen