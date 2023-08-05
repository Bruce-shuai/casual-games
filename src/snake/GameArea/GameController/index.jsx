import { SPEED } from '..';
import styles from './style.module.css';
function GameController({handlePlay, handleGameDifficulty, gameDifficulty, score}) {

  return (
    <div>
      <button className={styles['btn-play']} onClick={handlePlay}>开始</button>
      <select name="gameDifficulty" id="gameDifficulty" value={gameDifficulty} onChange={handleGameDifficulty}>
        <option value={SPEED.EASY}>简单</option>
        <option value={SPEED.NORMAL}>普通</option>
        <option value={SPEED.HARD}>困难</option>
        <option value={SPEED.KUAI}>快手</option>
      </select>
      <p>总分：<span className='score'>{score}</span></p>
      <p className={styles['tips-text']}>提示：键盘 ↑ ↓ ← → 控制蛇方向</p>
    </div>
  )
}

export default GameController
