import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { useFetch } from '../hooks/useFetch'
import ENVIROMENT from '../utils/constants/enviroments'
import { getAuthentitedHeaders } from '../fetching/customHeaders'
import useForm from '../hooks/useForm'

const WorkspaceScreen = () => {
    const {workspace_id, channel_id} = useParams()

    
    const {
        data: channels_data, 
        error: channels_error, 
        loading: channels_loading
    } = useFetch(ENVIROMENT.API_URL + `/api/channel/${workspace_id}` , {
        method: 'GET',
        headers: getAuthentitedHeaders()
    })
    
    return (
    <div>
        {
            channels_loading 
            ? <h2>cargando</h2>
            : <ChannelsList channel_list={channels_data.data.channels} workspace_id={workspace_id}/>
        }
        <div>
            {
                channel_id
                ? <Channel workspace_id={workspace_id} channel_id={channel_id}/>
                : <h2> aun no hay canales </h2>
            }
        </div>
        <div>
            <h2> añadir canales </h2>
            <Link to={`/channel/${workspace_id}`}>crear un nuevo canal</Link>
        </div>
    </div>
    )
}

const ChannelsList = ({channel_list, workspace_id}) =>{
    return (
        <div style={{display: 'flex', flexDirection: 'column' , gap: '10px'}}>
            {
                channel_list.map(channel =>{
                    return (
                        <Link 
                            key={channel._id} 
                            to={`/workspace/${workspace_id}/${channel._id}`}
                        >
                            #{channel.name}
                        </Link>
                    )
                })
            }
        </div>
    )
}

const Channel = ( { workspace_id, channel_id } ) => {
    const {
        data: channel_data,
        loading: channel_loading,
        error: channel_error
    } = useFetch(ENVIROMENT.API_URL + `/api/channel/${workspace_id}/${channel_id}`, {
        method: 'GET',
        headers: getAuthentitedHeaders()
    })

    const {form_state, handleChangeInput} = useForm({content: ''})
    const handleSubmitNewMessage = async (e) => {
        e.preventDefault()
        const response = await fetch(ENVIROMENT.API_URL + `/api/channel/${workspace_id}/${channel_id}/send-message`, {
            method: 'POST',
            headers: getAuthentitedHeaders(),
            body: JSON.stringify(form_state)
        })
        const responseData = await response.json()
        console.log(responseData)
    }
    return (
        <div>
            {
                channel_loading
                ? <h2>cargando</h2>
                : channel_data.data.messages.map(message => {
                    return (
                        <div key={message._id}>
                            <h4>Author:{message.sender.username}</h4>
                            <p>{message.content}</p>
                        </div>
                    )
                })
            }
            <form onSubmit={handleSubmitNewMessage}>
                <input 
                type="text" 
                placeholder='enviar mensaje' 
                name='content' 
                onChange={handleChangeInput} 
                value={form_state.content}/>
                <button type='submit'>Enviar</button>
            </form>
        </div>
    )
}

export default WorkspaceScreen