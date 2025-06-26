import React, { useState } from 'react'
import { MultipLayerRoom } from './MultipLayerRoom'
// import { ReactTogether } from 'react-together'
{
  /* <ReactTogether
sessionParams={{
  appId: import.meta.env['VITE_APP_ID'],
  apiKey: import.meta.env['VITE_API_KEY'],

  // The options below will make every user immediately join session 'hello-world'
  name: 'mouth-game',
  password: 'super-secret!!'
}}
> */
}

const lobbyContainerStyle: React.CSSProperties = {
  minHeight: '100vh',
  background: '#fff',
  color: '#000',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  fontFamily: 'Courier New, Monaco, Menlo, monospace'
}

const cardStyle: React.CSSProperties = {
  background: '#fff',
  border: '4px solid #000',
  boxShadow: '8px 8px 0 #000',
  padding: 32,
  borderRadius: 0,
  minWidth: 320,
  maxWidth: 400,
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
}

const titleStyle: React.CSSProperties = {
  fontSize: 28,
  fontWeight: 'bold',
  letterSpacing: 2,
  textTransform: 'uppercase',
  color: '#000',
  marginBottom: 24
}

const labelStyle: React.CSSProperties = {
  fontWeight: 'bold',
  marginBottom: 8,
  color: '#000',
  alignSelf: 'flex-start'
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  fontSize: 16,
  border: '2px solid #000',
  borderRadius: 0,
  marginBottom: 20,
  background: '#fff',
  color: '#000',
  outline: 'none',
  fontFamily: 'inherit',
  boxSizing: 'border-box'
}

const buttonRowStyle: React.CSSProperties = {
  display: 'flex',
  gap: 16,
  width: '100%',
  justifyContent: 'center',
  marginTop: 12
}

const buttonStyle: React.CSSProperties = {
  background: '#000',
  color: '#fff',
  border: '2px solid #000',
  borderRadius: 0,
  fontSize: 16,
  fontWeight: 'bold',
  padding: '10px 24px',
  cursor: 'pointer',
  minWidth: 120,
  transition: 'all 0.1s',
  boxShadow: '4px 4px 0 #000'
}

const buttonWhiteStyle: React.CSSProperties = {
  ...buttonStyle,
  background: '#fff',
  color: '#000'
}

export function MultipLayerLobby() {
  const [name, setName] = useState('')
  const [roomId, setRoomId] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [enterRoom, setEnterRoom] = useState<null | {
    name: string
    roomId: string
  }>(null)

  function handleEnterRoom(e: React.FormEvent, type: 'create' | 'join') {
    e.preventDefault()
    setError('')
    if (!name.trim() || !roomId.trim()) {
      setError('请输入 Name 和 Room ID')
      return
    }
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      localStorage.setItem('mouth-game-user', name.trim())
      setEnterRoom({ name: name.trim(), roomId: roomId.trim() })
    }, 500)
  }

  // 处理离开房间
  function handleLeaveRoom() {
    setEnterRoom(null)
  }

  if (enterRoom) {
    return (
      <MultipLayerRoom
        name={enterRoom.name}
        roomId={enterRoom.roomId}
        onLeaveRoom={handleLeaveRoom}
      />
    )
  }

  return (
    <div style={lobbyContainerStyle}>
      <form style={cardStyle}>
        <div style={titleStyle}>MULTIPLAYER LOBBY</div>
        <label style={labelStyle} htmlFor="name">
          Name
        </label>
        <input
          id="name"
          type="text"
          style={inputStyle}
          placeholder="Enter your name"
          value={name}
          onChange={e => setName(e.target.value)}
          disabled={isLoading}
        />
        <label style={labelStyle} htmlFor="roomId">
          Room ID
        </label>
        <input
          id="roomId"
          type="text"
          style={inputStyle}
          placeholder="Enter room id"
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
          disabled={isLoading}
        />
        {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
        <div style={buttonRowStyle}>
          <button
            type="submit"
            style={buttonStyle}
            disabled={isLoading}
            onClick={e => handleEnterRoom(e, 'create')}
          >
            {isLoading ? 'Creating...' : 'Create Room'}
          </button>
          <button
            type="button"
            style={buttonWhiteStyle}
            disabled={isLoading}
            onClick={e => handleEnterRoom(e, 'join')}
          >
            {isLoading ? 'Joining...' : 'Join Room'}
          </button>
        </div>
      </form>
    </div>
  )
}
