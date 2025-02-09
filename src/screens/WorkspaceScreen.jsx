import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useFetch } from '../hooks/useFetch'
import ENVIROMENT from '../utils/constants/enviroments'
import { getAuthentitedHeaders } from '../fetching/customHeaders'
import useForm from '../hooks/useForm'


const WorkspaceScreen = () => {
    const { workspace_id, channel_id } = useParams();
    
    const { data: channels_data, loading: channels_loading } = useFetch(
        ENVIROMENT.API_URL + `/api/channel/${workspace_id}`,
        {
            method: "GET",
            headers: getAuthentitedHeaders(),
        }
    );

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
                <Link className="add-channel" to={`/channel/new`}>
                    + Añadir Canal
                </Link>
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
                    #{channel.name}
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
        const newMessage = { 
            _id: Date.now().toString(), // Generar un ID temporal
            sender: { username: "Tú" }, // Puedes cambiarlo por datos reales
            content: form_state.content
        };
    
        setMessages((prev) => [...prev, newMessage]); // Agregar mensaje localmente
    
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
}

const [messages, setMessages] = useState ([]);
const { data: channel_data, loading: channel_loading } = useFetch(
    ENVIROMENT.API_URL + `/api/channel/${workspace_id}/${channel_id}`,
    {
        method: "GET",
        headers: getAuthentitedHeaders(),
    }
);

useEffect(() => {
    if (channel_data?.data?.messages) {
        setMessages(channel_data.data.messages);
    }
}, [channel_data]);

// Polling cada 3 segundos
useEffect(() => {
    const interval = setInterval(async () => {
        const response = await fetch(
            ENVIROMENT.API_URL + `/api/channel/${workspace_id}/${channel_id}`,
            {
                method: "GET",
                headers: getAuthentitedHeaders(),
            }
        );
        const updatedData = await response.json();
        setMessages(updatedData.data.messages);
    }, 3000);

    return () => clearInterval(interval);
}, [workspace_id, channel_id]);


export default WorkspaceScreen;
