import React, { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useFetch } from '../hooks/useFetch'
import ENVIROMENT from '../utils/constants/enviroments'
import { getAuthentitedHeaders } from '../fetching/customHeaders'
import useForm from '../hooks/useForm'
import Modal from '../Components/Modal'
import { AddIcon } from '../Icons'

const WorkspaceScreen = () => {
    const { workspace_id, channel_id } = useParams();
    
    const { data: channels_data, loading: channels_loading, refetch } = useFetch(
        ENVIROMENT.API_URL + `/api/channel/${workspace_id}`,
        {
            method: "GET",
            headers: getAuthentitedHeaders(),
        }
    );

    const [showModal, setShowModal] = useState(false); 
    const { form_state, handleChangeInput, resetForm } = useForm({ name: '' });

    const handleCreateChannel = async (e) => {
        e.preventDefault();

        if (!form_state.name.trim()) return;

        await fetch(ENVIROMENT.API_URL + `/api/channel/${workspace_id}`, {
            method: 'POST',
            headers: getAuthentitedHeaders(),
            body: JSON.stringify({ name: form_state.name }),
        });

        setShowModal(false);
        resetForm();
        refetch();
    };

    return (
        <div className="workspace-container">
            <aside className="sidebar">
                <h3>Canales</h3>
                {channels_loading ? (
                    <p>Cargando...</p>
                ) : (
                    <ChannelsList 
                        channel_list={channels_data?.data?.channels} 
                        workspace_id={workspace_id} 
                    />
                )}
                {/* Botón para abrir el modal */}
                <button className="btn-modal" onClick={() => setShowModal(true)}><AddIcon/>
                    agregar canales
                </button>
            </aside>
            <main className="chat-container">
                {channels_data?.data?.channels?.length > 0 ? (
                    channel_id ? (
                        <Channel workspace_id={workspace_id} channel_id={channel_id} />
                    ) : (
                        <h3>Selecciona un canal para verlo</h3>
                    )
                ) : (
                    <h3>Aún no hay canales</h3>
                )}
            </main>

            {/* Modal para crear canal */}
            <Modal show={showModal} onClose={() => setShowModal(false)}>
                <h2 className="text-lg font-bold">Crear un nuevo canal</h2>
                <form onSubmit={handleCreateChannel}>
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
    );
};

const ChannelsList = ({ channel_list, workspace_id }) => {
    return (
        <div className="channels-list">
            {channel_list.map((channel) => (
                <Link
                    key={channel._id}
                    className="channel-link"
                    to={`/workspace/${workspace_id}/${channel._id}`}
                >
                    # {channel.name}
                </Link>
            ))}
        </div>
    );
};

const Channel = ({ workspace_id, channel_id }) => {
    const { data: channel_data, loading: channel_loading } = useFetch(
        ENVIROMENT.API_URL + `/api/channel/${workspace_id}/${channel_id}`,
        {
            method: "GET",
            headers: getAuthentitedHeaders(),
        }
    );

    const { form_state, handleChangeInput } = useForm({ content: "" });

    const handleSubmitNewMessage = async (e) => {
        e.preventDefault();
        await fetch(
            ENVIROMENT.API_URL + `/api/channel/${workspace_id}/${channel_id}/send-message`,
            {
                method: "POST",
                headers: getAuthentitedHeaders(),
                body: JSON.stringify(form_state),
            }
        );
    };

    return (
        <div className="chat-box">
            <div className="messages-container">
                {channel_loading ? (
                    <h2>Cargando...</h2>
                ) : (
                    channel_data?.data?.messages.map((message) => (
                        <div key={message._id} className="message">
                            <h4>{message.sender.username}</h4>
                            <p>{message.content}</p>
                        </div>
                    ))
                )}
            </div>
            <form className="message-form" onSubmit={handleSubmitNewMessage}>
                <input
                    type="text"
                    placeholder="Escribe un mensaje..."
                    name="content"
                    onChange={handleChangeInput}
                    value={form_state.content}
                />
                <button type="submit">Enviar</button>
            </form>
        </div>
    );
};

export default WorkspaceScreen;
