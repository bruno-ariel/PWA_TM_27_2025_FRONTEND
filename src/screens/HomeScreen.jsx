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
            <h1> Bienvenido de vuelta {/* nombre del usuario */} </h1>
            <div className='workspaces'>
                <div>
                    {
                    workspace_loading
                    ? <h2>cargando </h2>
                    : (
                        workspace_response.data.workspaces.length ? 
                        workspace_response.data.workspaces.map(workspace => {
                            return (
                                <div key={workspace._id}>
                                    <h3>{workspace.name}</h3>
                                    <Link to={`/workspace/${workspace._id}`}>ir a workspace</Link>
                                </div>
                            )
                        })
                        : <h2> No tienes espacios de trabajo </h2>
                )
                    }
                </div>
            </div>
            <div className='create-workspace'>
                <span> Aun no tienes espacios de trabajo ? </span>
                <Link to="/workspace/new"> Crea un espacio de trabajo aqui </Link>
            </div>
        </main>
    )
}

export default HomeScreen