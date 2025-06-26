import './App.css'
import MusicGame from './components/MusicGame'
import { MultipLayerLobby } from './components/MultipLayerLobby'
import { MultipMusicGame } from './components/MultipMusicGame'
import { MultipMusicGamePage } from './components/MultipMusicGamePage'

import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  useParams
} from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ModeSelect />} />
        <Route path="/single" element={<MusicGame />} />
        <Route path="/multi" element={<MultipLayerLobby />} />
        <Route path="/multi/room/:roomId" element={<MultipLayerLobby />} />
        <Route path="/multi/game/:roomId" element={<MultipMusicGamePage />} />
      </Routes>
    </BrowserRouter>
  )
}

function ModeSelect() {
  const navigate = useNavigate()
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
          onClick={() => navigate('/single')}
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
          onClick={() => navigate('/multi')}
        >
          联机版
        </button>
      </div>
    </div>
  )
}

function MultipMusicGameWrapper() {
  // 这里可以通过 useParams 获取 roomId，后续可用于联机逻辑
  const { roomId } = useParams<{ roomId: string }>()
  return <MultipMusicGame roomId={roomId || ''} />
}

export default App
