import './App.css'
import MusicGame from './components/MusicGame'
import { MultipLayerLobby } from './components/MultipLayerLobby'
import React, { useState } from 'react'

function App() {
  const [mode, setMode] = useState<'select' | 'single' | 'multi'>('select')

  if (mode === 'single') return <MusicGame />
  if (mode === 'multi') return <MultipLayerLobby />

  // 选择页面样式
  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#fff',
        color: '#000',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Courier New, Monaco, Menlo, monospace'
      }}
    >
      <div
        style={{
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
        }}
      >
        <div
          style={{
            fontSize: 28,
            fontWeight: 'bold',
            letterSpacing: 2,
            textTransform: 'uppercase',
            color: '#000',
            marginBottom: 24
          }}
        >
          选择游戏模式
        </div>
        <button
          style={{
            background: '#000',
            color: '#fff',
            border: '2px solid #000',
            borderRadius: 0,
            fontSize: 18,
            fontWeight: 'bold',
            padding: '12px 32px',
            cursor: 'pointer',
            minWidth: 180,
            marginBottom: 20,
            boxShadow: '4px 4px 0 #000',
            transition: 'all 0.1s'
          }}
          onClick={() => setMode('single')}
        >
          单机版
        </button>
        <button
          style={{
            background: '#fff',
            color: '#000',
            border: '2px solid #000',
            borderRadius: 0,
            fontSize: 18,
            fontWeight: 'bold',
            padding: '12px 32px',
            cursor: 'pointer',
            minWidth: 180,
            boxShadow: '4px 4px 0 #000',
            transition: 'all 0.1s'
          }}
          onClick={() => setMode('multi')}
        >
          联机版
        </button>
      </div>
    </div>
  )
}

export default App
