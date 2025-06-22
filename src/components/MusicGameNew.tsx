import React, { useEffect, useState } from 'react'
import PersonRow from './PersonRow'
import { useGameLogic } from '../hooks/useGameLogic'
import { useKeyboardControl } from '../hooks/useKeyboardControl'
import { useBackgroundMusic } from '../hooks/useBackgroundMusic'
import { gameLevels } from '../data/levels'

// 称号系统 - 新的分数要求
const getTitleByScore = (score: number): string => {
  if (score < 50) return '小笨嘴'
  if (score < 100) return '小嘴抹了蜜'
  if (score < 150) return '意大利嘴炮'
  if (score < 200) return '嘴强王者'
  return '传说嘴神' // 200分以上的超级称号
}

function MusicGame() {
  const {
    gameState,
    demoPersons,
    playPersons,
    // countdown,
    errorMessage,
    startGame,
    retryLevel,
    nextLevel,
    resetGame,
    setGameState,
    playerActionsRef
  } = useGameLogic()

  useKeyboardControl({ gameState, setGameState, playerActionsRef })

  const {
    isPlaying: isBGMPlaying,
    isLoaded: isBGMLoaded,
    error: bgmError,
    isMuted,
    volume,
    startBGM,
    stopBGM,
    // pauseBGM,
    // resumeBGM,
    toggleMute,
    setVolume
  } = useBackgroundMusic()

  const [showMusicPrompt, setShowMusicPrompt] = useState(true)
  const [userHasInteracted, setUserHasInteracted] = useState(false)

  // 游戏开始时启动背景音乐
  useEffect(() => {
    console.log('游戏状态变化:', {
      gamePhase: gameState.gamePhase,
      isBGMLoaded,
      isBGMPlaying,
      bgmError
    })
    // 不自动播放，等待用户交互
  }, [gameState.gamePhase, isBGMLoaded, isBGMPlaying, startBGM, bgmError])

  // 处理用户首次交互，启动音乐
  const handleUserInteraction = async () => {
    setUserHasInteracted(true)
    if (isBGMLoaded && !isBGMPlaying && !isMuted) {
      await startBGM()
    }
  }

  // 启动音乐的函数
  const handleStartMusic = async () => {
    setShowMusicPrompt(false)
    setUserHasInteracted(true)
    if (isBGMLoaded && !isMuted) {
      await startBGM()
    }
  }

  // 游戏结束时停止背景音乐
  useEffect(() => {
    if (gameState.gamePhase === 'gameOver') {
      stopBGM()
    }
  }, [gameState.gamePhase, stopBGM])

  // 样式定义 - 卡通像素风格
  const gameContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: '24px',
    padding: '20px',
    minHeight: '100vh',
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

  const headerStyle: React.CSSProperties = {
    textAlign: 'center',
    marginBottom: '20px',
    padding: '20px',
    border: '4px solid #303030',
    borderRadius: '0',
    backgroundColor: '#f3f0ed',
    boxShadow: '8px 8px 0px #303030',
    position: 'relative'
  }

  const titleStyle: React.CSSProperties = {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#303030',
    marginBottom: '10px',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    textShadow: 'none'
  }

  const statsStyle: React.CSSProperties = {
    display: 'flex',
    gap: '20px',
    fontSize: '16px',
    fontWeight: 'bold',
    justifyContent: 'center',
    flexWrap: 'wrap'
  }

  const livesStyle: React.CSSProperties = {
    color: '#303030',
    backgroundColor: '#f3f0ed',
    border: '2px solid #303030',
    padding: '8px 12px',
    borderRadius: '0',
    boxShadow: '4px 4px 0px #303030'
  }

  const scoreStyle: React.CSSProperties = {
    color: '#303030',
    backgroundColor: '#f3f0ed',
    border: '2px solid #303030',
    padding: '8px 12px',
    borderRadius: '0',
    boxShadow: '4px 4px 0px #303030'
  }

  const levelStyle: React.CSSProperties = {
    color: '#303030',
    backgroundColor: '#f3f0ed',
    border: '2px solid #303030',
    padding: '8px 12px',
    borderRadius: '0',
    boxShadow: '4px 4px 0px #303030'
  }

  const buttonStyle: React.CSSProperties = {
    padding: '16px 32px',
    fontSize: '18px',
    fontWeight: 'bold',
    border: '4px solid #303030',
    borderRadius: '0',
    cursor: 'pointer',
    backgroundColor: '#f3f0ed',
    color: '#303030',
    transition: 'all 0.1s ease',
    boxShadow: '6px 6px 0px #303030',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    fontFamily: '"Courier New", "Monaco", "Menlo", monospace'
  }

  const musicControlStyle: React.CSSProperties = {
    position: 'absolute',
    top: '20px',
    right: '20px',
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
    zIndex: 200,
    padding: '12px',
    backgroundColor: '#f3f0ed',
    border: '3px solid #303030',
    borderRadius: '0',
    boxShadow: '4px 4px 0px #303030'
  }

  const musicButtonStyle: React.CSSProperties = {
    padding: '8px 12px',
    fontSize: '14px',
    fontWeight: 'bold',
    border: '2px solid #303030',
    borderRadius: '0',
    cursor: 'pointer',
    backgroundColor: isMuted ? '#fff' : '#fff',
    color: '#303030',
    transition: 'all 0.1s ease',
    boxShadow: '2px 2px 0px #303030'
  }

  const volumeSliderStyle: React.CSSProperties = {
    width: '80px',
    height: '4px',
    borderRadius: '2px',
    outline: 'none',
    cursor: 'pointer'
  }

  const musicPromptStyle: React.CSSProperties = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#f3f0ed',
    padding: '30px',
    borderRadius: '0',
    border: '4px solid #303030',
    boxShadow: '12px 12px 0px #303030',
    zIndex: 2000,
    textAlign: 'center',
    maxWidth: '400px',
    fontFamily: '"Courier New", "Monaco", "Menlo", monospace'
  }

  const musicPromptButtonStyle: React.CSSProperties = {
    padding: '12px 24px',
    fontSize: '16px',
    fontWeight: 'bold',
    border: '3px solid #303030',
    borderRadius: '0',
    cursor: 'pointer',
    backgroundColor: '#f3f0ed',
    color: '#303030',
    transition: 'all 0.1s ease',
    margin: '0 8px',
    boxShadow: '4px 4px 0px #303030',
    textTransform: 'uppercase'
  }

  const countdownOverlayStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    fontSize: '120px',
    fontWeight: 'bold',
    color: '#303030',
    textShadow: 'none',
    fontFamily: '"Courier New", "Monaco", "Menlo", monospace',
    border: '8px solid #303030',
    margin: '20px',
    borderRadius: '0'
  }

  const gameContentStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '24px',
    width: '100%',
    maxWidth: '800px',
    flex: 1,
    justifyContent: 'center'
  }

  const gameAreaStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '24px',
    minHeight: '400px',
    width: '100%',
    justifyContent: 'center',
    padding: '20px',
    border: '4px solid #303030',
    borderRadius: '0',
    backgroundColor: '#f3f0ed',
    boxShadow: '8px 8px 0px #303030'
  }

  const overlayStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
    gap: '20px',
    border: '4px solid #303030',
    borderRadius: '0',
    margin: '4px'
  }

  const instructionStyle: React.CSSProperties = {
    textAlign: 'center',
    fontSize: '16px',
    color: '#303030',
    backgroundColor: '#f3f0ed',
    padding: '16px',
    borderRadius: '0',
    border: '3px solid #303030',
    boxShadow: '6px 6px 0px #303030',
    fontFamily: '"Courier New", "Monaco", "Menlo", monospace',
    fontWeight: 'bold'
  }

  const errorStyle: React.CSSProperties = {
    textAlign: 'center',
    fontSize: '18px',
    color: '#303030',
    backgroundColor: '#f3f0ed',
    padding: '20px',
    borderRadius: '0',
    border: '4px solid #303030',
    boxShadow: '8px 8px 0px #303030',
    fontFamily: '"Courier New", "Monaco", "Menlo", monospace',
    fontWeight: 'bold'
  }

  const resultStyle: React.CSSProperties = {
    textAlign: 'center',
    fontSize: '18px',
    color: '#303030',
    backgroundColor: '#f3f0ed',
    padding: '20px',
    borderRadius: '0',
    border: '4px solid #303030',
    boxShadow: '8px 8px 0px #303030',
    fontFamily: '"Courier New", "Monaco", "Menlo", monospace',
    fontWeight: 'bold'
  }

  // 基础游戏区域 - 始终显示两排小人
  const baseGameArea = (
    <div style={gameAreaStyle}>
      <PersonRow persons={demoPersons} label="示例表演" />
      <PersonRow persons={playPersons} label="模仿表演" />
      <div style={instructionStyle}>
        {gameState.gamePhase === 'demo' && (
          <p>请仔细观看示例表演，记住节奏！</p>
        )}
        {gameState.gamePhase === 'countdown' && (
          <p>准备好！按住空格键控制你的小人张嘴</p>
        )}
        {gameState.gamePhase === 'playing' && (
          <p>按住空格键控制你的小人张嘴！</p>
        )}
      </div>
    </div>
  )

  // 根据游戏状态渲染不同的覆盖层
  const renderOverlay = () => {
    switch (gameState.gamePhase) {
      case 'waiting':
        return (
          <div style={overlayStyle}>
            <div style={instructionStyle}>
              <p>欢迎来到嘴炮游戏！</p>
              <p>游戏规则：</p>
              <p>1. 观看第一排小人的示例表演</p>
              <p>2. 倒计时后，第二排开始模仿</p>
              <p>3. 你控制YOU上的小人，按住空格键张嘴</p>
              <p>4. 跟随示例的节奏，准确模仿张嘴时机和时长</p>
              <p>5. 你有3次生命，出错会扣除生命</p>
            </div>
            <button
              style={buttonStyle}
              onClick={async () => {
                await handleUserInteraction()
                startGame()
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = '#303030'
                e.currentTarget.style.color = '#fff'
                e.currentTarget.style.transform = 'translate(2px, 2px)'
                e.currentTarget.style.boxShadow = '4px 4px 0px #303030'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = '#fff'
                e.currentTarget.style.color = '#303030'
                e.currentTarget.style.transform = 'translate(0px, 0px)'
                e.currentTarget.style.boxShadow = '6px 6px 0px #303030'
              }}
            >
              开始游戏
            </button>
          </div>
        )

      case 'result':
        return (
          <div style={overlayStyle}>
            {errorMessage ? (
              <div style={errorStyle}>
                <p>{errorMessage}</p>
                <p>剩余生命: {gameState.lives}</p>
              </div>
            ) : (
              <div style={resultStyle}>
                <p>太棒了！成功通过第 {gameState.currentLevel} 关！</p>
                <p>获得 10 积分</p>
              </div>
            )}

            {errorMessage ? (
              <button
                style={buttonStyle}
                onClick={retryLevel}
                onMouseEnter={e => {
                  e.currentTarget.style.backgroundColor = '#303030'
                  e.currentTarget.style.color = '#fff'
                  e.currentTarget.style.transform = 'translate(2px, 2px)'
                  e.currentTarget.style.boxShadow = '4px 4px 0px #303030'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.backgroundColor = '#fff'
                  e.currentTarget.style.color = '#303030'
                  e.currentTarget.style.transform = 'translate(0px, 0px)'
                  e.currentTarget.style.boxShadow = '6px 6px 0px #303030'
                }}
              >
                重试
              </button>
            ) : (
              <button
                style={buttonStyle}
                onClick={nextLevel}
                onMouseEnter={e => {
                  e.currentTarget.style.backgroundColor = '#303030'
                  e.currentTarget.style.color = '#fff'
                  e.currentTarget.style.transform = 'translate(2px, 2px)'
                  e.currentTarget.style.boxShadow = '4px 4px 0px #303030'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.backgroundColor = '#fff'
                  e.currentTarget.style.color = '#303030'
                  e.currentTarget.style.transform = 'translate(0px, 0px)'
                  e.currentTarget.style.boxShadow = '6px 6px 0px #303030'
                }}
              >
                下一关
              </button>
            )}
          </div>
        )

      case 'gameOver':
        const title = getTitleByScore(gameState.score)
        return (
          <div style={overlayStyle}>
            <div style={resultStyle}>
              <h2>游戏结束！</h2>
              <p>最终得分: {gameState.score}</p>
              <p>
                获得称号: <strong>{title}</strong>
              </p>
              <p>
                完成关卡: {gameState.currentLevel} / {gameLevels.length}
              </p>
            </div>

            <button
              style={buttonStyle}
              onClick={resetGame}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = '#303030'
                e.currentTarget.style.color = '#fff'
                e.currentTarget.style.transform = 'translate(2px, 2px)'
                e.currentTarget.style.boxShadow = '4px 4px 0px #303030'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = '#fff'
                e.currentTarget.style.color = '#303030'
                e.currentTarget.style.transform = 'translate(0px, 0px)'
                e.currentTarget.style.boxShadow = '6px 6px 0px #303030'
              }}
            >
              重新开始
            </button>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div style={gameContainerStyle}>
      {/* 音乐控制 */}
      <div style={musicControlStyle}>
        {userHasInteracted && (
          <>
            <button
              style={musicButtonStyle}
              onClick={toggleMute}
              title={isMuted ? '开启音乐' : '关闭音乐'}
            >
              {isMuted ? '🔇' : '🎵'}
            </button>
            {!isMuted && (
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={e => setVolume(parseFloat(e.target.value))}
                style={volumeSliderStyle}
                title="音量控制"
              />
            )}
            <div style={{ fontSize: '12px', color: '#303030' }}>
              {isBGMPlaying ? '🎵' : '⏸️'}
            </div>
          </>
        )}
        {!userHasInteracted && isBGMLoaded && (
          <div
            style={{ fontSize: '12px', color: '#3b82f6', fontWeight: 'bold' }}
          >
            🎵 音乐就绪
          </div>
        )}
        {bgmError && (
          <span style={{ fontSize: '11px', color: '#ef4444' }}>音乐不可用</span>
        )}
      </div>

      <div style={headerStyle}>
        <h1 style={titleStyle}>嘴炮游戏</h1>
        <div style={statsStyle}>
          <span style={livesStyle}>❤️ 生命: {gameState.lives}</span>
          <span style={scoreStyle}>⭐ 积分: {gameState.score}</span>
          <span style={levelStyle}>
            🎯 关卡: {gameState.currentLevel + 1} / {gameLevels.length}
          </span>
        </div>
      </div>

      <div style={gameContentStyle}>
        <div style={{ position: 'relative', width: '100%' }}>
          {baseGameArea}
          {renderOverlay()}
        </div>
      </div>

      {/* 倒计时浮层 */}
      {gameState.gamePhase === 'countdown' && (
        <div style={countdownOverlayStyle}>Go!</div>
      )}

      {/* 音乐播放提示 */}
      {showMusicPrompt && isBGMLoaded && !userHasInteracted && (
        <div style={musicPromptStyle}>
          <h3 style={{ color: '#1e40af', marginBottom: '16px' }}>
            🎵 背景音乐
          </h3>
          <p
            style={{
              color: '#374151',
              marginBottom: '20px',
              lineHeight: '1.5'
            }}
          >
            检测到背景音乐文件！
            <br />
            是否要播放背景音乐来增强游戏体验？
          </p>
          <div>
            <button
              style={musicPromptButtonStyle}
              onClick={handleStartMusic}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = '#303030'
                e.currentTarget.style.color = '#fff'
                e.currentTarget.style.transform = 'translate(2px, 2px)'
                e.currentTarget.style.boxShadow = '2px 2px 0px #303030'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = '#fff'
                e.currentTarget.style.color = '#303030'
                e.currentTarget.style.transform = 'translate(0px, 0px)'
                e.currentTarget.style.boxShadow = '4px 4px 0px #303030'
              }}
            >
              🎵 播放音乐
            </button>
            <button
              style={{ ...musicPromptButtonStyle, backgroundColor: '#6b7280' }}
              onClick={() => setShowMusicPrompt(false)}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = '#303030'
                e.currentTarget.style.color = '#fff'
                e.currentTarget.style.transform = 'translate(2px, 2px)'
                e.currentTarget.style.boxShadow = '2px 2px 0px #303030'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = '#fff'
                e.currentTarget.style.color = '#303030'
                e.currentTarget.style.transform = 'translate(0px, 0px)'
                e.currentTarget.style.boxShadow = '4px 4px 0px #303030'
              }}
            >
              🔇 静音游戏
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default MusicGame
