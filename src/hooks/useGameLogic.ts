import { useState, useEffect, useCallback, useRef } from 'react'
import { gameLevels } from '../data/levels'

interface PersonState {
  index: number
  isMouthOpen: boolean
  isPlayer: boolean
}

interface GameAction {
  personIndex: number // 小人索引 (0-4)
  startTime: number // 开始张嘴时间 (毫秒)
  duration: number // 张嘴持续时间 (毫秒)
}

interface GameState {
  currentLevel: number
  lives: number
  score: number
  gamePhase:
    | 'waiting'
    | 'demo'
    | 'countdown'
    | 'playing'
    | 'result'
    | 'gameOver'
  playerIndex: number // 玩家控制的小人索引
  isPlayerMouthOpen: boolean
  demoStartTime: number
  playStartTime: number
  currentTime: number
}

// const COUNTDOWN_DURATION = 3000 // 3秒倒计时 (暂未使用)

export function useGameLogic() {
  const [gameState, setGameState] = useState<GameState>({
    currentLevel: 0,
    lives: 3,
    score: 0,
    gamePhase: 'waiting',
    playerIndex: -1, // 初始时未选择玩家，等待开始游戏时随机
    isPlayerMouthOpen: false,
    demoStartTime: 0,
    playStartTime: 0,
    currentTime: 0
  })

  const [demoPersons, setDemoPersons] = useState<PersonState[]>([])
  const [playPersons, setPlayPersons] = useState<PersonState[]>([])
  const [countdown, setCountdown] = useState(0)
  const [errorMessage, setErrorMessage] = useState('')

  const animationFrameRef = useRef<number | undefined>(undefined)
  const playerActionsRef = useRef<{ startTime: number; endTime: number }[]>([])

  // 初始化小人状态
  const initializePersons = useCallback(() => {
    const persons: PersonState[] = Array.from({ length: 5 }, (_, index) => ({
      index,
      isMouthOpen: false,
      isPlayer: gameState.playerIndex >= 0 && index === gameState.playerIndex
    }))
    return persons
  }, [gameState.playerIndex])

  // 检查当前时间应该张嘴的小人
  const getActivePersons = useCallback(
    (actions: GameAction[], currentTime: number, startTime: number) => {
      const relativeTime = currentTime - startTime
      return actions
        .filter(
          action =>
            relativeTime >= action.startTime &&
            relativeTime <= action.startTime + action.duration
        )
        .map(action => action.personIndex)
    },
    []
  )

  // 检查玩家表现 - 严格检查顺序，宽松检查时机和时长
  const checkPlayerPerformance = useCallback(() => {
    const currentLevel = gameLevels[gameState.currentLevel]
    const playerActions = currentLevel.actions.filter(
      action => action.personIndex === gameState.playerIndex
    )
    const recordedActions = playerActionsRef.current

    let hasError = false
    let errorMessage = ''

    // 1. 严格检查：玩家是否在不该张嘴的时候张嘴了
    for (const recordedAction of recordedActions) {
      const recordedStart = recordedAction.startTime
      const recordedEnd = recordedAction.endTime

      // 检查这个时间段是否有对应的预期动作
      const hasValidAction = playerActions.some(expectedAction => {
        const expectedStart = expectedAction.startTime
        const expectedEnd = expectedAction.startTime + expectedAction.duration

        // 宽松的时间重叠检查：只要有部分重叠就算有效
        const overlapStart = Math.max(recordedStart, expectedStart - 600) // 允许提前600ms
        const overlapEnd = Math.min(recordedEnd, expectedEnd + 600) // 允许延后600ms

        return overlapStart < overlapEnd
      })

      if (!hasValidAction) {
        hasError = true
        errorMessage = '错误的张嘴时机！不该张嘴时张嘴了'
        break
      }
    }

    // 2. 宽松检查：玩家是否遗漏了应该张嘴的动作
    if (!hasError) {
      let missedActions = 0

      for (const expectedAction of playerActions) {
        const expectedStart = expectedAction.startTime
        const expectedEnd = expectedAction.startTime + expectedAction.duration

        // 查找是否有对应的玩家动作（宽松匹配）
        const hasMatchingAction = recordedActions.some(recordedAction => {
          const recordedStart = recordedAction.startTime
          const recordedEnd = recordedAction.endTime

          // 宽松的时间重叠检查
          const overlapStart = Math.max(recordedStart, expectedStart - 600)
          const overlapEnd = Math.min(recordedEnd, expectedEnd + 600)

          return overlapStart < overlapEnd
        })

        if (!hasMatchingAction) {
          missedActions++
        }
      }

      // 如果遗漏了超过一半的动作，算作失败
      if (
        playerActions.length > 0 &&
        missedActions > playerActions.length / 2
      ) {
        hasError = true
        errorMessage = '遗漏了太多张嘴动作！'
      }
    }

    // 3. 特殊情况：如果没有要求动作，但玩家张嘴了，算作错误
    if (playerActions.length === 0 && recordedActions.length > 0) {
      hasError = true
      errorMessage = '不该张嘴时张嘴了！'
    }

    if (hasError) {
      // 玩家出错
      setGameState(prev => ({
        ...prev,
        lives: prev.lives - 1,
        gamePhase: prev.lives <= 1 ? 'gameOver' : 'result'
      }))
      setErrorMessage(errorMessage || '出错了！点击重试')
    } else {
      // 玩家成功
      setGameState(prev => ({
        ...prev,
        score: prev.score + 10,
        currentLevel: prev.currentLevel + 1,
        gamePhase:
          prev.currentLevel + 1 >= gameLevels.length ? 'gameOver' : 'result'
      }))
      setErrorMessage('')
    }

    playerActionsRef.current = []
  }, [gameState.currentLevel, gameState.playerIndex])

  // 更新游戏时间和动画
  const updateGame = useCallback(() => {
    const now = Date.now()
    setGameState(prev => ({ ...prev, currentTime: now }))

    if (gameState.gamePhase === 'demo' && gameState.demoStartTime > 0) {
      const currentLevel = gameLevels[gameState.currentLevel]
      const activePersonIndexes = getActivePersons(
        currentLevel.actions,
        now,
        gameState.demoStartTime
      )

      setDemoPersons(prev =>
        prev.map(person => ({
          ...person,
          isMouthOpen: activePersonIndexes.includes(person.index)
        }))
      )

      // 检查demo是否结束
      if (now - gameState.demoStartTime >= currentLevel.totalDuration) {
        setGameState(prev => ({ ...prev, gamePhase: 'countdown' }))
        setCountdown(3)
        return
      }
    }

    if (gameState.gamePhase === 'playing' && gameState.playStartTime > 0) {
      const currentLevel = gameLevels[gameState.currentLevel]
      const activePersonIndexes = getActivePersons(
        currentLevel.actions,
        now,
        gameState.playStartTime
      )

      // 更新非玩家小人
      setPlayPersons(prev =>
        prev.map(person => ({
          ...person,
          isMouthOpen: person.isPlayer
            ? gameState.isPlayerMouthOpen
            : activePersonIndexes.includes(person.index)
        }))
      )

      // 检查游戏是否结束
      if (now - gameState.playStartTime >= currentLevel.totalDuration) {
        checkPlayerPerformance()
        return
      }
    }

    if (gameState.gamePhase === 'demo' || gameState.gamePhase === 'playing') {
      animationFrameRef.current = requestAnimationFrame(updateGame)
    }
  }, [
    gameState.gamePhase,
    gameState.demoStartTime,
    gameState.playStartTime,
    gameState.currentLevel,
    gameState.isPlayerMouthOpen,
    getActivePersons,
    checkPlayerPerformance
  ])

  // 开始游戏 - 每次开始时随机选择玩家位置
  const startGame = useCallback(() => {
    if (gameState.currentLevel >= gameLevels.length) {
      setGameState(prev => ({ ...prev, gamePhase: 'gameOver' }))
      return
    }

    // 只有在第一次开始游戏时（currentLevel为0）才随机选择玩家位置
    const shouldRandomizePlayer = gameState.currentLevel === 0
    const newPlayerIndex = shouldRandomizePlayer
      ? Math.floor(Math.random() * 5)
      : gameState.playerIndex

    setGameState(prev => ({
      ...prev,
      playerIndex: newPlayerIndex,
      gamePhase: 'demo',
      demoStartTime: Date.now(),
      isPlayerMouthOpen: false
    }))

    // 使用新的玩家位置初始化小人
    const initPersonsWithPlayer = () => {
      return Array.from({ length: 5 }, (_, index) => ({
        index,
        isMouthOpen: false,
        isPlayer: index === newPlayerIndex
      }))
    }

    setDemoPersons(initPersonsWithPlayer())
    setPlayPersons(initPersonsWithPlayer())
    playerActionsRef.current = []
  }, [gameState.currentLevel, gameState.playerIndex])

  // 重试当前关卡 - 保持相同的关卡和玩家位置
  const retryLevel = useCallback(() => {
    // 确保不改变玩家位置，直接重新开始当前关卡
    setDemoPersons(initializePersons())
    setPlayPersons(initializePersons())
    setGameState(prev => ({
      ...prev,
      gamePhase: 'demo',
      demoStartTime: Date.now(),
      isPlayerMouthOpen: false
      // 注意：不改变 playerIndex 和 currentLevel
    }))
    playerActionsRef.current = []
  }, [gameState.playerIndex, gameState.currentLevel, initializePersons])

  // 下一关 - 保持玩家位置不变
  const nextLevel = useCallback(() => {
    // 不改变玩家位置，只进入下一关
    startGame()
  }, [startGame])

  // 重置游戏 - 重置到初始状态，等待下次开始游戏时随机选择玩家
  const resetGame = useCallback(() => {
    setGameState({
      currentLevel: 0,
      lives: 3,
      score: 0,
      gamePhase: 'waiting',
      playerIndex: -1, // 重置为未选择状态
      isPlayerMouthOpen: false,
      demoStartTime: 0,
      playStartTime: 0,
      currentTime: 0
    })
    setErrorMessage('')
    playerActionsRef.current = []
  }, [])

  // 启动动画循环
  useEffect(() => {
    if (gameState.gamePhase === 'demo' || gameState.gamePhase === 'playing') {
      animationFrameRef.current = requestAnimationFrame(updateGame)
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [gameState.gamePhase, updateGame])

  // 倒计时逻辑
  useEffect(() => {
    if (gameState.gamePhase === 'countdown' && countdown > 0) {
      const timer = setTimeout(() => {
        if (countdown === 1) {
          setGameState(prev => ({
            ...prev,
            gamePhase: 'playing',
            playStartTime: Date.now()
          }))
          setCountdown(0)
        } else {
          setCountdown(prev => prev - 1)
        }
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [gameState.gamePhase, countdown])

  return {
    gameState,
    demoPersons,
    playPersons,
    countdown,
    errorMessage,
    startGame,
    retryLevel,
    nextLevel,
    resetGame,
    setGameState,
    setCountdown,
    playerActionsRef
  }
}
