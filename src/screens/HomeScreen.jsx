import React, { useState } from 'react'
import ENVIROMENT from '../utils/constants/enviroments'
import { getAuthentitedHeaders } from '../fetching/customHeaders'
import { useFetch } from '../hooks/useFetch'
import { Link } from 'react-router-dom'
import Modal from '../Components/Modal'
import useForm from '../hooks/useForm'
import { AddIcon , HandIcon, RocketIcon } from '../Icons'

const HomeScreen = () => {
    const {
        data: workspace_response,
        error: workspace_error,
        loading: workspace_loading,
        refetch 
    } = useFetch(ENVIROMENT.API_URL + '/api/workspace', {
        method: 'GET',
        headers: getAuthentitedHeaders()
    });

    const [showModal, setShowModal] = useState(false);
    const { form_state, handleChangeInput, resetForm } = useForm({ name: '' });

    const handleCreateWorkspace = async (e) => {
        e.preventDefault();

        if (!form_state.name.trim()) return;

        try {
            await fetch(ENVIROMENT.API_URL + '/api/workspace', {
                method: 'POST',
                headers: getAuthentitedHeaders(),
                body: JSON.stringify({ name: form_state.name }),
            });

            setShowModal(false);
            resetForm();
            refetch();
        } catch (error) {
            console.error("Error al crear workspace:", error);
        }
    };

    return (
        <main className='home-screen'>
            <img src="https://a.slack-edge.com/bv1-13/slack_logo-ebd02d1.svg" alt="img-slack" className="img-slack-register"/>
            <h1 className='title-register'><HandIcon className='hand-icon'/>
            Bienvenido de vuelta { workspace_response?.data?.user?.username }</h1>
            <span>Elige uno de los siguientes espacios de trabajo para volver a trabajar con tu equipo.</span>
            <div className='workspaces-container'>
                {/* Sección de Workspaces */}
                <div className='workspaces'>
                    {workspace_loading ? (
                        <h2>Cargando...</h2>
                    ) : workspace_error ? (
                        <h2>Error al cargar workspaces</h2>
                    ) : workspace_response?.data?.workspaces?.length ? (
                        workspace_response.data.workspaces.map(workspace => (
                            <div key={workspace._id} className="workspace-item">
                                <h3>{workspace.name}</h3>
                                <Link to={`/workspace/${workspace._id}`}>Ir al espacio de trabajo <RocketIcon/> </Link>
                            </div>
                        ))
                    ) : (
                        <h2>No tienes espacios de trabajo</h2>
                    )}
                </div>
                {/* Sección para crear un nuevo Workspace */}
                <div className='create-workspace'>
                    <h2>¿Aún no tienes espacios de trabajo? </h2>
                    <img src='https://a.slack-edge.com/bv1-13/get-started-workspaces-icon-88e0cb1.svg' alt='img-workspace' className='img-workspace'></img>
                    <button 
                        className='btn-modal' 
                        onClick={() => setShowModal(true)}>
                            <AddIcon className='icon'/> Crea un workspace
                    </button>
                    <Modal show={showModal} onClose={() => setShowModal(false)}>
                        <form onSubmit={handleCreateWorkspace}>
                            <input
                                type="text"
                                name="name"
                                value={form_state.name}
                                onChange={handleChangeInput}
                                placeholder="Nombre del canal"
                            />
                            <button type="submit"></button>
                        </form>
                    </Modal>
                </div>
            </div>
        </main>
    );
};



export default HomeScreen;