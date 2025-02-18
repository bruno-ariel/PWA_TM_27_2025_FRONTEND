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
                <button className="btn-modal" onClick={() => setShowModal(true)}><AddIcon className='icon'/>
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
                    <button type="submit" className="btn-modal">
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

const Channel = () => {
    const { workspace_id, channel_id } = useParams();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [content, setContent] = useState(""); 

    useEffect(() => {
        const fetchMessages = async () => {
            setLoading(true);
            try {
                const response = await fetch(
                    ENVIROMENT.API_URL + `/api/channel/${workspace_id}/${channel_id}`,
                    {
                        method: "GET",
                        headers: getAuthentitedHeaders(),
                    }
                );
                const data = await response.json();
                setMessages(data?.data?.messages || []);
            } catch (error) {
                console.error("Error fetching messages:", error);
            }
            setLoading(false);
        };

        fetchMessages();
    }, [channel_id]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!content.trim()) return;

        await fetch(
            ENVIROMENT.API_URL + `/api/channel/${workspace_id}/${channel_id}/send-message`,
            {
                method: "POST",
                headers: getAuthentitedHeaders(),
                body: JSON.stringify({ content }),
            }
        );

        setContent(""); 
    };

    return (
        <div className="chat-box">
            <div className="messages-container">
                {loading ? (
                    <h2>Cargando...</h2>
                ) : (
                    messages.map((message) => (
                        <div key={message._id} className="message">
                            <h4>{message.sender.username}</h4>
                            <p>{message.content}</p>
                        </div>
                    ))
                )}
            </div>

            {/* Chatbox siempre presente */}
            <form className="message-form" onSubmit={handleSendMessage}>
                <input
                    type="text"
                    placeholder="Escribe un mensaje..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
                <button type="submit">Enviar</button>
            </form>
        </div>
    );
};

export default WorkspaceScreen;
