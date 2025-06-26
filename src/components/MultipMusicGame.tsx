import React from 'react'
import { useConnectedUsers, useStateTogether } from 'react-together'
import { gameLevels } from '../data/levels'
import MultipMusicGameContent from './MultipMusicGameContent'

interface MultipMusicGameProps {
  roomId: string
}

const gameContainerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  height: '100vh',
  width: '100vw',
  backgroundColor: '#f8f9fa',
  fontFamily: '"Courier New", "Monaco", "Menlo", monospace',
  overflow: 'hidden',
  position: 'relative',
  backgroundImage: `
    linear-gradient(90deg, #e9ecef 1px, transparent 1px),
    linear-gradient(180deg, #e9ecef 1px, transparent 1px)
  `,
  backgroundSize: '20px 20px'
}

const leftPanelStyle: React.CSSProperties = {
  width: '300px',
  minWidth: '300px',
  height: '100vh',
  padding: '20px',
  backgroundColor: '#fff',
  border: '4px solid #000',
  borderTop: 'none',
  borderLeft: 'none',
  borderBottom: 'none',
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
  overflowY: 'auto',
  color: '#000'
}

const headerStyle: React.CSSProperties = {
  textAlign: 'center',
  marginBottom: '20px',
  padding: '20px',
  border: '4px solid #303030',
  borderRadius: '0',
  backgroundColor: '#f3f0ed',
  boxShadow: '8px 8px 0px #303030',
  position: 'relative',
  color: '#000'
}

const titleStyle: React.CSSProperties = {
  fontSize: '28px',
  fontWeight: 'bold',
  color: '#000',
  marginBottom: '10px',
  letterSpacing: '2px',
  textTransform: 'uppercase',
  textShadow: 'none'
}

const playerCardsStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  marginBottom: '12px',
  color: '#000'
}

const playerCardStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  border: '2px solid #000',
  padding: '16px',
  borderRadius: 0,
  background: '#f8f8f8',
  fontWeight: 'bold',
  color: '#000',
  minHeight: '90px',
  boxShadow: '2px 2px 0 #000',
  minWidth: '0',
  width: '100%'
}

const playerNameStyle: React.CSSProperties = {
  fontSize: '18px',
  fontWeight: 'bold',
  color: '#000',
  marginBottom: '8px',
  letterSpacing: 1
}

const playerStatsStyle: React.CSSProperties = {
  display: 'flex',
  gap: '18px',
  fontSize: '15px',
  color: '#000',
  fontWeight: 'bold'
}

const ruleStyle: React.CSSProperties = {
  textAlign: 'left',
  fontSize: '15px',
  color: '#000',
  backgroundColor: '#f3f0ed',
  padding: '16px',
  borderRadius: '0',
  border: '3px solid #303030',
  boxShadow: '6px 6px 0px #303030',
  fontWeight: 'bold'
}

const rightGameAreaStyle: React.CSSProperties = {
  flex: 1,
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '20px',
  position: 'relative',
  overflow: 'hidden',
  willChange: 'filter'
}

export function MultipMusicGame({ roomId }: MultipMusicGameProps) {
  const users = useConnectedUsers()
  const [gameInfo, setGameInfo] = useStateTogether('gameInfo', {}) as [
    Record<
      string,
      { name: string; lives: number; score: number; level: number }
    >,
    (v: any) => void
  ]
  const [playersState] = useStateTogether('players', {}) as [
    Record<string, { name: string; isReady: boolean; isHost: boolean }>,
    (v: any) => void
  ]
  const userId =
    typeof window !== 'undefined'
      ? localStorage.getItem('mouth-game-user') || ''
      : ''
  // 初始化：如果本地没有信息则写入
  React.useEffect(() => {
    if (userId && !gameInfo[userId]) {
      setGameInfo({
        ...gameInfo,
        [userId]: {
          name: playersState[userId]?.name || userId,
          lives: 3,
          score: 0,
          level: 1
        }
      })
    }
  }, [userId, gameInfo, setGameInfo, playersState])

  console.log('users', users)
  console.log('userId', userId)
  console.log('playersState', playersState)
  console.log('gameInfo', gameInfo)

  const joinedUsers = users.slice(0, 2)
  const totalLevels = gameLevels.length
  // 当前关卡 = 所有玩家的最大 level
  const currentLevel = Math.max(
    ...joinedUsers.map(u => gameInfo[u.userId]?.level || 1)
  )

  return (
    <div style={gameContainerStyle}>
      {/* 左侧信息面板 */}
      <div style={leftPanelStyle}>
        <div style={headerStyle}>
          <h1 style={titleStyle}>联机对战</h1>
          <div
            style={{
              fontWeight: 'bold',
              color: '#000',
              fontSize: 18,
              marginTop: 8
            }}
          >
            🎯 关卡：{currentLevel} / {totalLevels}
          </div>
        </div>
        <div style={playerCardsStyle}>
          {joinedUsers.map((u, idx) => {
            const info = gameInfo[u.userId] || {
              name: playersState[u.userId]?.name || u.userId,
              lives: '-',
              score: '-',
              level: '-'
            }
            return (
              <div key={u.userId} style={playerCardStyle}>
                <div style={playerNameStyle}>{info.name}</div>
                <div style={playerStatsStyle}>
                  <span>❤️ 生命: {info.lives}</span>
                  <span>⭐ 积分: {info.score}</span>
                </div>
              </div>
            )
          })}
        </div>
        <div style={ruleStyle}>
          <h3 style={{ margin: '0 0 10px 0', color: '#000', fontSize: '16px' }}>
            🎮 游戏规则
          </h3>
          <p style={{ margin: '5px 0', fontSize: '14px' }}>
            1. 观看第一排小牛马的示例表演
          </p>
          <p style={{ margin: '5px 0', fontSize: '14px' }}>
            2. 倒计时后，第二排开始模仿
          </p>
          <p style={{ margin: '5px 0', fontSize: '14px' }}>
            3. 你控制你的小牛马
          </p>
          <p style={{ margin: '5px 0', fontSize: '14px' }}>4. 按住空格键张嘴</p>
          <p style={{ margin: '5px 0', fontSize: '14px' }}>
            5. 跟随示例的节奏和时机
          </p>
        </div>
      </div>
      {/* 右侧游戏区域 */}
      <div style={rightGameAreaStyle}>
        {/* 游戏内容区域，留空，后续你可自行实现 */}
        <div
          style={{
            width: '100%',
            maxWidth: '800px',
            minHeight: '600px',
            border: '4px solid #303030',
            borderRadius: '0',
            backgroundColor: '#f3f0ed',
            boxShadow: '8px 8px 0px #303030',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 28,
            color: '#bbb',
            fontWeight: 'bold',
            letterSpacing: 2
          }}
        >
          {/* 游戏区内容留空 */}
          <MultipMusicGameContent />
        </div>
      </div>
    </div>
  )
}
