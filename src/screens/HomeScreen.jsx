import React, { useState } from 'react'
import ENVIROMENT from '../utils/constants/enviroments'
import { getAuthentitedHeaders } from '../fetching/customHeaders'
import { useFetch } from '../hooks/useFetch'
import { Link } from 'react-router-dom'
import Modal from '../Components/Modal'
import useForm from '../hooks/useForm'
import { AddIcon , HandIcon } from '../Icons'

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
            refetch(); // ⬅️ Recargar la lista de workspaces
        } catch (error) {
            console.error("Error al crear workspace:", error);
        }
    };

    return (
        <main className='home-screen'>
            <h1><HandIcon className='hand-icon'/> Bienvenido de vuelta { workspace_response?.data?.user?.username }</h1>
            <div className='workspaces-container'>
                {/* Sección de Workspaces */}
                <div className='workspaces'>
                    {workspace_loading ? (
                        <h2>Cargando...</h2>
                    ) : workspace_error ? (
                        <h2>Error al cargar workspaces</h2> // ⬅️ Manejo de errores
                    ) : workspace_response?.data?.workspaces?.length ? (
                        workspace_response.data.workspaces.map(workspace => (
                            <div key={workspace._id} className="workspace-item">
                                <h3>{workspace.name}</h3>
                                <Link to={`/workspace/${workspace._id}`}>Ir a workspace</Link>
                            </div>
                        ))
                    ) : (
                        <h2>No tienes espacios de trabajo</h2>
                    )}
                </div>

                {/* Sección para crear un nuevo Workspace */}
                <div className='create-workspace'>
                    <span>¿Aún no tienes espacios de trabajo? </span>
                    <button className='btn-modal' onClick={() => setShowModal(true)}> <AddIcon/> Crea un workspace</button>

                    <Modal show={showModal} onClose={() => setShowModal(false)}> {/* ⬅️ Cambié `show` por `isOpen` */}
                        <h2 className="text-lg font-bold">Crear un workspace</h2>
                        <form onSubmit={handleCreateWorkspace}>
                            <input
                                type="text"
                                name="name"
                                value={form_state.name}
                                onChange={handleChangeInput}
                                placeholder="Nombre del canal"
                                className="border p-2 w-full mt-2"
                            />
                            <button type="submit" className="mt-4 bg-green-500 text-white px-4 py-2 rounded">
                                Crear
                            </button>
                        </form>
                    </Modal>
                </div>
            </div>
        </main>
    );
};



export default HomeScreen;