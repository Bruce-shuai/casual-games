import { useState, useEffect } from 'react';
import utils from '../../utils.js';
import GameController from './GameController/index.jsx';
import styles from './style.module.css'
const DEFAULT_FOOD_POSITION = {"toTop": -9999, "toLeft": -9999}
const DEFAULT_FOOD_COLOR = '#000';
const DEFAULT_SNAKE_POSITION = {"toTop": 0, "toLeft": 0};

const SNAKE_MOVE_DIRECTION = {
    "RIGHT": 37,
    "BOTTOM": 38,
    "LEFT": 39,
    "TOP": 40,
}

const GAME_AREA = {
    "BOTTOM": 0,
    "TOP": 500,
    "LEFT": 0,
    "RIGHT": 500
}

const SPEED = {
    "EASY": 100,
    "NORMAL": 200,
    "HARD": 300,
    "KUAI": 400
}
const defaultSnake = {
  positions: [DEFAULT_SNAKE_POSITION],
  direction: SNAKE_MOVE_DIRECTION.RIGHT,
  renderTest: 0
}

function GameArea() {
    const [food, setFood] = useState({
        position: DEFAULT_FOOD_POSITION,
        color: DEFAULT_FOOD_COLOR
    });
    const [snake, setSnake] = useState(defaultSnake)
    const [score, setScore] = useState(0);
    const [gameDifficulty, setGameDifficulty] = useState(SPEED.NORMAL);
    const [timeInterval, setTimeInterval] = useState(null);
    const initGame = () => {
      randomFood();
      controlSnakeMove();
      clearInterval(timeInterval);
      // setSnake(defaultSnake);
    }
    // 由于snake是对象，所以postion的变化不会触发渲染
    useEffect(() => {

    }, [snake.positions])

    const startGame = () => {
        const snakeAnimation = setInterval(() => {
          if (snakeBeKilled()) {
            // 游戏结束
            gameOver()
          } else {
            // 游戏正常
            eatFood();
            snakeMove();
          }
        }, gameDifficulty)
        setTimeInterval(snakeAnimation);
    }
    
    const gameOver = () => {
        // alert('---=游戏结束=---');
        clearInterval(timeInterval);
        initGame();
    }

    const snakeMove = () => {
        
        const snakeHead = snake.positions.length - 1;
        const snakeHeadToTop = snake.positions[snakeHead].toTop;
        const snakeHeadToLeft = snake.positions[snakeHead].toLeft;
        
        const newSnakeHead = {}
        if (snake.direction === SNAKE_MOVE_DIRECTION.RIGHT) {
            setSnake(prev => {
              prev.positions.push({
                toTop: prev.positions[prev.positions.length - 1].toTop,
                toLeft: prev.positions[prev.positions.length - 1].toLeft + 10
              })
              prev.positions.shift();
              const newSnake = {...prev};
              newSnake.renderTest = prev.renderTest + 1;
              console.log('newSnake', newSnake)
              return newSnake;
            })
        }
        else if (snake.direction === SNAKE_MOVE_DIRECTION.LEFT) {
            
          setSnake(prev =>  {
            newSnakeHead.toTop = snakeHeadToTop
            newSnakeHead.toLeft = snakeHeadToLeft - 10
            prev.positions.push(newSnakeHead);
            prev.positions.shift();
            return prev;
            })
        }
        else if (snake.direction === SNAKE_MOVE_DIRECTION.BOTTOM) {
            setSnake(prev =>  {
              newSnakeHead.toTop = snakeHeadToTop + 10
              newSnakeHead.toLeft = snakeHeadToLeft
              prev.positions.push(newSnakeHead);
              prev.positions.shift();
              return prev;
            })
        }
        else if (snake.direction === SNAKE_MOVE_DIRECTION.TOP) {
            setSnake(prev => {
              newSnakeHead.toTop = snakeHeadToTop - 10
              newSnakeHead.toLeft = snakeHeadToLeft
              prev.positions.push(newSnakeHead);
            prev.positions.shift();
            return prev;
            })
        }
    }

    const controlSnakeMove = () => {
        window.onkeydown = e => {
            const keyCode = e.keyCode;
            const snakeNextDirection = Object.entries(SNAKE_MOVE_DIRECTION).find(([, value]) => value === keyCode);
            setSnake(prev =>  {
              return {
                ...prev,
                direction: snakeNextDirection
              }

            })
        }
    }

    const randomFood = () => {
        const randomNum = () => {
            return Math.floor(Math.random() * GAME_AREA.TOP / 10) * 10
        }
        setFood(prev => {
          return {
            ...prev,
            "position": {
                "toTop": randomNum(),
                "toLeft": randomNum()
            },
            "color": utils.getRandomRgbColor()
          }
        })
    }

    const eatFood = () => {
      const snakeHead = snake.positions.length - 1;
      const isSnakeEatFood = snake.positions[snakeHead].toTop === food.position.toTop && snake.positions[snakeHead].toLeft === food.position.toLeft;
      if (isSnakeEatFood) {
        setScore(prev => prev + 10);
        randomFood();
        addSnakeLength();
      }
    }

    const addSnakeLength = () => {
      const snakeTailToTop = snake.positions[0].toTop;
      const snakeTailToLeft = snake.positions[0].toLeft;
      const newTail = {}

      if (snake.direction === SNAKE_MOVE_DIRECTION.RIGHT) {
        newTail.toTop = snakeTailToTop;
        newTail.toLeft = snakeTailToLeft - 10;
      } else if (snake.direction === SNAKE_MOVE_DIRECTION.LEFT) {
        newTail.toTop = snakeTailToTop;
        newTail.toLeft = snakeTailToLeft + 10;
      } else if (snake.direction === SNAKE_MOVE_DIRECTION.BOTTOM) {
        newTail.toTop = snakeTailToTop - 10;
        newTail.toLeft = snakeTailToLeft;
      } else if (snake.direction === SNAKE_MOVE_DIRECTION.TOP) {
        newTail.toTop = snakeTailToTop + 10;
        newTail.toLeft = snakeTailToLeft;
      }

      setSnake(prev => {
        return {
          ...prev,
          positions: [newTail, ...prev.positions]
        }
      })
    }

    const snakeBeKilled = () => {
      const snakeHead = snake.positions.length - 1;
      const snakeHeadToTop = snake.positions[snakeHead].toTop;
      const snakeHeadToLeft = snake.positions[snakeHead].toLeft;
      const isSnakeTouchWall = () => {
          return snakeHeadToTop < GAME_AREA.BOTTOM || snakeHeadToTop > GAME_AREA.TOP || snakeHeadToLeft < GAME_AREA.LEFT || snakeHeadToLeft > GAME_AREA.RIGHT
      }
      const isSnakeEatSelf = () => {
        for (let body of snake.positions) {
          if (body === snake.positions[snakeHead]) continue;
          if (body.toTop === snakeHeadToTop && body.toLeft === snakeHeadToLeft) {
            return true;
          }
        }
      }
      if (isSnakeTouchWall()) return true;
      if (isSnakeEatSelf()) return true;

      return false;
    }


   return (
    <div>
      <GameController handlePlay={() => {
        initGame();
        startGame();
      }} score={score} gameDifficulty={gameDifficulty} handleGameDifficulty={(e) => setGameDifficulty(e.target.value)}/>
      <div>{snake.renderTest}</div>
      <div className={styles['game-area-wrap']}>
      {
        snake.positions.map((item, index) => {
          return <div className={`${styles['snake-item']} ${index === snake.positions.length - 1 ? styles['head-color'] : ''}`} style={{top: item.toTop, left: item.toLeft}} key={index}>蛇身</div>
        })
      }
      <div className={styles['food']}>食物</div>
    </div>
    </div>
   )
    
}

export default GameArea