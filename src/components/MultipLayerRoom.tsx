import React, { useState, useEffect } from 'react'
import {
  ReactTogether,
  useConnectedUsers,
  useStateTogether
} from 'react-together'
import { useNavigate } from 'react-router-dom'

interface MultipLayerRoomProps {
  name: string
  roomId: string
  onLeaveRoom: () => void
}

const containerStyle: React.CSSProperties = {
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
  alignItems: 'center',
  position: 'relative'
}

const titleStyle: React.CSSProperties = {
  fontSize: 24,
  fontWeight: 'bold',
  letterSpacing: 2,
  textTransform: 'uppercase',
  color: '#000',
  marginBottom: 24
}

const playerListStyle: React.CSSProperties = {
  width: '100%',
  marginBottom: 24,
  display: 'flex',
  flexDirection: 'column',
  gap: 12
}

const playerItemStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  border: '2px solid #000',
  padding: '8px 16px',
  borderRadius: 0,
  background: '#f8f8f8',
  fontWeight: 'bold'
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

const leaveButtonStyle: React.CSSProperties = {
  position: 'absolute',
  top: 10,
  right: 10,
  background: '#ff4444',
  color: '#fff',
  border: '2px solid #ff4444',
  borderRadius: 0,
  fontSize: 14,
  fontWeight: 'bold',
  padding: '8px 16px',
  cursor: 'pointer',
  boxShadow: '2px 2px 0 #cc0000',
  transition: 'all 0.1s'
}

function MultipLayerRoomContent({
  name,
  onLeaveRoom,
  roomId
}: {
  name: string
  onLeaveRoom: () => void
  roomId: string
}) {
  const users = useConnectedUsers()
  const [playersState, setPlayersState] = useStateTogether('players', {}) as [
    Record<string, { name: string; isReady: boolean; isHost: boolean }>,
    (v: any) => void
  ]
  const [gameStarted, setGameStarted] = useStateTogether('gameStarted', false)
  const navigate = useNavigate()

  const myId = users.find(u => u.isYou)?.userId || ''
  const myState = playersState[myId] || { name, isReady: false, isHost: false }
  const isReady = myState.isReady
  const isHost = myState.isHost

  const joinedUsers = users.slice(0, 2)
  const canStart =
    joinedUsers.length === 2 &&
    joinedUsers.every(u => playersState[u.userId]?.isReady)

  // 用户一进入就设置名字，第一个用户成为房主
  useEffect(() => {
    if (myId && !playersState[myId]) {
      const isFirstUser = Object.keys(playersState).length === 0
      setPlayersState({
        ...playersState,
        [myId]: { name, isReady: false, isHost: isFirstUser }
      })
    }
  }, [myId, name, playersState, setPlayersState])

  // 房主转移逻辑：当房主离开时，转移给下一个用户
  useEffect(() => {
    const currentHost = Object.values(playersState).find(p => p.isHost)
    const hostUser = users.find(u => playersState[u.userId]?.isHost)

    // 如果房主不在当前用户列表中，转移房主权限
    if (currentHost && !hostUser && users.length > 0) {
      const newHostId = users[0].userId
      setPlayersState(
        (
          prev: Record<
            string,
            { name: string; isReady: boolean; isHost: boolean }
          >
        ) => ({
          ...prev,
          [newHostId]: {
            ...prev[newHostId],
            isHost: true
          }
        })
      )
    }
  }, [users, playersState, setPlayersState])

  // 1. 客户端主动清理 - 用户离开时清理自己的状态
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (myId) {
        setPlayersState(
          (
            prev: Record<
              string,
              { name: string; isReady: boolean; isHost: boolean }
            >
          ) => {
            const newState = { ...prev }
            delete newState[myId]
            return newState
          }
        )
      }
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && myId) {
        setPlayersState(
          (
            prev: Record<
              string,
              { name: string; isReady: boolean; isHost: boolean }
            >
          ) => {
            const newState = { ...prev }
            delete newState[myId]
            return newState
          }
        )
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      document.removeEventListener('visibilitychange', handleVisibilityChange)

      // 组件卸载时也清理自己的状态
      if (myId) {
        setPlayersState(
          (
            prev: Record<
              string,
              { name: string; isReady: boolean; isHost: boolean }
            >
          ) => {
            const newState = { ...prev }
            delete newState[myId]
            return newState
          }
        )
      }
    }
  }, [myId, setPlayersState])

  // 3. 空房间清理 - 当所有用户离开时自动清理
  useEffect(() => {
    if (users.length === 0) {
      const timer = setTimeout(() => {
        // 15秒后清理所有房间状态
        setPlayersState({})
      }, 15000)

      return () => clearTimeout(timer)
    }
  }, [users.length, setPlayersState])

  // 所有玩家监听 gameStarted 状态变化
  useEffect(() => {
    if (gameStarted) {
      navigate(`/multi/game/${encodeURIComponent(roomId)}`)
    }
  }, [gameStarted, navigate, roomId])

  function handleReady() {
    setPlayersState({
      ...playersState,
      [myId]: { name, isReady: true, isHost }
    })
  }

  function handleStartGame() {
    if (canStart && isHost) {
      setGameStarted(true)
    }
  }

  // 主动离开房间
  function handleLeaveRoom() {
    if (myId) {
      setPlayersState(
        (
          prev: Record<
            string,
            { name: string; isReady: boolean; isHost: boolean }
          >
        ) => {
          const newState = { ...prev }
          delete newState[myId]
          return newState
        }
      )
    }
    onLeaveRoom() // 调用父组件的离开回调
  }

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <button style={leaveButtonStyle} onClick={handleLeaveRoom}>
          离开房间
        </button>

        <div style={titleStyle}>房间</div>
        <div style={playerListStyle}>
          {joinedUsers.map((u, idx) => (
            <div key={u.userId} style={playerItemStyle}>
              <span>
                {playersState[u.userId]?.name ||
                  u.nickname ||
                  '玩家' + (idx + 1)}
                {playersState[u.userId]?.isHost && ' (房主)'}
              </span>
              <span>
                {playersState[u.userId]?.isReady ? '已准备' : '未准备'}
              </span>
            </div>
          ))}
        </div>
        <div style={buttonRowStyle}>
          {!isReady && !gameStarted && (
            <button style={buttonStyle} onClick={handleReady}>
              Ready
            </button>
          )}
          {canStart && !gameStarted && isReady && isHost && (
            <button style={buttonStyle} onClick={handleStartGame}>
              Start Game
            </button>
          )}
          {canStart && !gameStarted && isReady && !isHost && (
            <div style={{ color: '#666', fontSize: 14 }}>
              等待房主开始游戏...
            </div>
          )}
        </div>
        {gameStarted && (
          <div style={{ marginTop: 24, color: '#008800', fontWeight: 'bold' }}>
            游戏开始！
          </div>
        )}
      </div>
    </div>
  )
}

export function MultipLayerRoom({
  name,
  roomId,
  onLeaveRoom
}: MultipLayerRoomProps) {
  // 使用 localStorage 中的 userId，确保与联机游戏页面使用相同的 session
  const userId = localStorage.getItem('mouth-game-user') || name

  return (
    <ReactTogether
      sessionParams={{
        appId: import.meta.env['VITE_APP_ID'],
        apiKey: import.meta.env['VITE_API_KEY'],
        name: roomId,
        password: 'mouth-game-room'
      }}
      userId={userId}
    >
      <MultipLayerRoomContent
        name={name}
        onLeaveRoom={onLeaveRoom}
        roomId={roomId}
      />
    </ReactTogether>
  )
}
