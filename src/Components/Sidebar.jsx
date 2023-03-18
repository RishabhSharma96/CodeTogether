import React, { useEffect, useRef, useState } from 'react'
import { initSocket } from '../socket'
import { useNavigate, useLocation, Navigate, useParams } from 'react-router-dom'
import '../Styles/SidebarStyles.css'
import Client from './Client'
import ACTIONS from '../Actions.js'
import toast from 'react-hot-toast'
import Code from './Code'

export default function Sidebar() {

    const location = useLocation()
    const reactNavigator = useNavigate()
    const socketRef = useRef(null)
    const params = useParams()

    const [clients, setClients] = useState([])
    const [syncedCode, setSyncedCode] = useState("")

    useEffect(() => {
        const init = async () => {
            socketRef.current = await initSocket()

            socketRef.current.on('connect_error', (err) => handleErrors(err))
            socketRef.current.on('connect_failed', (err) => handleErrors(err))

            const handleErrors = (e) => {
                console.log(e)
                toast.error("Socket Connection Failed, try again later")
                reactNavigator("/")
            }

            socketRef.current.emit(ACTIONS.JOIN, {
                roomID: params.id,
                username: localStorage.getItem('username')
            })

            socketRef.current.on(ACTIONS.JOINED, ({ clients, username, socketID }) => {
                if (username !== localStorage.getItem('username')) {
                    toast.success(`${username} joined the room`)
                }
                setClients(clients)

                // socketRef.current.emit(ACTIONS.SYNC_CODE , {
                //     code : codeRef.current,
                //     socketID
                // })
                // console.log(codeRef.current)

            })

            socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketID, username }) => {
                toast.success(`${username} left the room`)
                setClients((prev) => {
                    return prev.filter((client) => client.socketID !== socketID)
                })
            })
        }

        init();

        return () => {
            socketRef.current.disconnect()
            socketRef.current.off(ACTIONS.JOINED)
            socketRef.current.off(ACTIONS.DISCONNECTED)
        }

    }, [])

    if (!location.state) {
        return <Navigate to="/" />
    }

    const handleCopyID = async () => {
        try {
            await navigator.clipboard.writeText(params.id)
            toast.success("RoomID copied to clipboard")
        }
        catch (err) {
            toast.error("Could not copy ROOMID")
            console.log(err)
        }
    }

    const handleCopyCode = async () => {
        try {
            await navigator.clipboard.writeText(syncedCode)
            toast.success("Code copied to clipboard")
        }
        catch (err) {
            toast.error("Could not copy Code")
            console.log(err)
        }
    }

    const handleLeave = () => {
        localStorage.removeItem("username")
        toast.success("Logged out Successfully")
        reactNavigator("/")
    }

    return (
        <div id="main-codeScreen">
            <div className='sidebar'>

                <div>
                    <div id="sidebar-heading">CodeTogether</div>
                    <div className="connected-components">
                        <div className="connected">Connected Mates 💜</div>
                        <div className="people">
                            {clients.map((client) => {
                                return (
                                    <Client key={client.socketID} username={client.username} />
                                )
                            })}
                        </div>
                    </div>
                </div>

                <div className='buttons-sidebar-wrapper'>
                    <div className="buttons-sidebar">
                        <div className="writer">
                            <div className="typewriter">
                                <div className="slide"><i></i></div>
                                <div className="paper"></div>
                                <div className="keyboard"></div>
                            </div>
                        </div>
                        <div className="sidebar-btn-1">
                            <div className="uiverse" onClick={handleCopyID}>
                                <span className="tooltip">Copy ID</span>
                                <span className='uiverse-btn-info'>
                                    Copy Room ID
                                </span>
                            </div>
                        </div>
                        <div className="sidebar-btn-2">
                            <div className="uiverse" onClick={handleCopyCode}
                                style={{ backgroundColor: "white", color: "black" }}>
                                <span className="tooltip">Copy Code</span>
                                <span className='uiverse-btn-info'>
                                    Copy Code
                                </span>
                            </div>
                        </div>
                        <div className="sidebar-btn-2">
                            <div className="uiverse" onClick={handleLeave}>
                                <span className='uiverse-btn-info'>
                                    Leave Room
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            <Code socketRef={socketRef} roomID={params.id} setSyncedCode={setSyncedCode} />

        </div>
    )
}
