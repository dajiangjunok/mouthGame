import React from 'react'
import { ReactTogether } from 'react-together'
import { MultipMusicGame } from './MultipMusicGame'
import { useParams } from 'react-router-dom'
import { gameLevels } from '../data/levels'
import { useStateTogether, useConnectedUsers } from 'react-together'

export function MultipMusicGamePage() {
  const { roomId } = useParams<{ roomId: string }>()
  const userId = localStorage.getItem('mouth-game-user') || 'anonymous'

  return (
    <ReactTogether
      sessionParams={{
        appId: import.meta.env['VITE_APP_ID'],
        apiKey: import.meta.env['VITE_API_KEY'],
        name: roomId || '',
        password: 'mouth-game-room'
      }}
      userId={userId}
    >
      <MultipMusicGame roomId={roomId || ''} />
    </ReactTogether>
  )
}
