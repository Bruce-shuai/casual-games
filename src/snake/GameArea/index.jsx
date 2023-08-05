import { useState, useRef } from 'react';
import utils from '../../utils.js';
import GameController from './GameController/index.jsx';
import styles from './style.module.css'
const DEFAULT_FOOD_POSITION = {toTop: -9999, toLeft: -9999}
const DEFAULT_FOOD_COLOR = '#000';
const DEFAULT_SNAKE_POSITION = {toTop: 0, toLeft: 0};

const SNAKE_MOVE_DIRECTION = {
    "RIGHT": 39,
    "BOTTOM": 40,
    "LEFT": 37,
    "TOP": 38,
}

const GAME_AREA = {
    "BOTTOM": 0,
    "TOP": 490,
    "LEFT": 0,
    "RIGHT": 490
}

export const SPEED = {
    "EASY": 200,
    "NORMAL": 130,
    "HARD": 80,
    "KUAI": 40
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
    const timeIntervalRef = useRef(null);
    const snakeRef = useRef(snake);
    const foodRef = useRef(food);


    const initGame = () => {
      randomFood();
      controlSnakeMove();
      clearInterval(timeIntervalRef.current);
      setSnake(() => JSON.parse(JSON.stringify(defaultSnake)));
      setScore(0)
      snakeRef.current = JSON.parse(JSON.stringify(defaultSnake));
    }

    const startGame = () => {
        const snakeAnimation = setInterval(() => {
          // 这里开始，便进入了闭包区域
          if (snakeBeKilled()) {
            // 游戏结束
            gameOver()
          } else {
            // 游戏正常
            eatFood();
            snakeMove();
          }
        }, gameDifficulty)
        timeIntervalRef.current = snakeAnimation;
    }
    
    const gameOver = () => {
        alert('---=游戏结束=---');
        clearInterval(timeIntervalRef.current);
        initGame();
    }

    const snakeBeKilled = () => {
      const snakeHead = snakeRef.current.positions.length - 1;
      const snakeHeadToTop = snakeRef.current.positions[snakeHead].toTop;
      const snakeHeadToLeft = snakeRef.current.positions[snakeHead].toLeft;
      const isSnakeTouchWall = () => {
          return snakeHeadToTop < GAME_AREA.BOTTOM || snakeHeadToTop > GAME_AREA.TOP || snakeHeadToLeft < GAME_AREA.LEFT || snakeHeadToLeft > GAME_AREA.RIGHT
      }
      const isSnakeEatSelf = () => {
        const newSnakePosition = JSON.parse(JSON.stringify(snakeRef.current.positions))
        newSnakePosition.pop();
        for (let i in newSnakePosition) {
          if (newSnakePosition[i].toTop === snakeHeadToTop && newSnakePosition[i].toLeft === snakeHeadToLeft) {
            return true;
          }
        }
      }
      if (isSnakeTouchWall()) return true;
      if (isSnakeEatSelf()) return true;

      return false;
    }
    
    
    const snakeMove = () => {
        if (snakeRef.current.direction === SNAKE_MOVE_DIRECTION.RIGHT) {
            snakeRef.current.positions.push({
              toTop: snakeRef.current.positions[snakeRef.current.positions.length - 1].toTop,
              toLeft: snakeRef.current.positions[snakeRef.current.positions.length - 1].toLeft + 10
            }) 
            snakeRef.current.positions.shift();
            setSnake(prev => {
              prev.positions.push({
                toTop: prev.positions[prev.positions.length - 1].toTop,
                toLeft: prev.positions[prev.positions.length - 1].toLeft + 10
              })
              prev.positions.shift();
              const newSnake = {...prev};
              newSnake.renderTest = prev.renderTest + 1;
              return newSnake;
            })
        }
        else if (snakeRef.current.direction === SNAKE_MOVE_DIRECTION.LEFT) {
          snakeRef.current.positions.push({
            toTop: snakeRef.current.positions[snakeRef.current.positions.length - 1].toTop,
            toLeft: snakeRef.current.positions[snakeRef.current.positions.length - 1].toLeft - 10
          }) 
          snakeRef.current.positions.shift();
          setSnake(prev => {
            prev.positions.push({
              toTop: prev.positions[prev.positions.length - 1].toTop,
              toLeft: prev.positions[prev.positions.length - 1].toLeft - 10
            })
            prev.positions.shift();
            const newSnake = {...prev};
            newSnake.renderTest = prev.renderTest + 1;
            return newSnake;
          })
        }
        else if (snakeRef.current.direction === SNAKE_MOVE_DIRECTION.BOTTOM) {
          snakeRef.current.positions.push({
            toTop: snakeRef.current.positions[snakeRef.current.positions.length - 1].toTop + 10,
            toLeft: snakeRef.current.positions[snakeRef.current.positions.length - 1].toLeft 
          }) 
          snakeRef.current.positions.shift();
          setSnake(prev => {
            prev.positions.push({
              toTop: prev.positions[prev.positions.length - 1].toTop + 10,
              toLeft: prev.positions[prev.positions.length - 1].toLeft
            })
            prev.positions.shift();
            const newSnake = {...prev};
            newSnake.renderTest = prev.renderTest + 1;
            return newSnake;
          })
        }
        else if (snakeRef.current.direction === SNAKE_MOVE_DIRECTION.TOP) {
          snakeRef.current.positions.push({
            toTop: snakeRef.current.positions[snakeRef.current.positions.length - 1].toTop - 10,
            toLeft: snakeRef.current.positions[snakeRef.current.positions.length - 1].toLeft 
          }) 
          snakeRef.current.positions.shift();
          setSnake(prev => {
            prev.positions.push({
              toTop: prev.positions[prev.positions.length - 1].toTop - 10,
              toLeft: prev.positions[prev.positions.length - 1].toLeft
            })
            prev.positions.shift();
            const newSnake = {...prev};
            newSnake.renderTest = prev.renderTest + 1;
            return newSnake;
          })
        }
    }

    const controlSnakeMove = () => {
        window.onkeydown = e => {
            const keyCode = e.keyCode;
            snakeRef.current.direction = Object.entries(SNAKE_MOVE_DIRECTION).find(([, value]) => value === keyCode)[1]
            setSnake(prev =>  {
              
              return {
                ...prev,
                direction: snakeRef.current.direction
              }
            })
        }
    }

    const randomFood = () => {
        const randomNum = () => {
            return Math.floor(Math.random() * GAME_AREA.TOP / 10) * 10
        }
        foodRef.current = {
          position: {
            toTop: randomNum(),
            toLeft: randomNum()
          },
          color: utils.getRandomRgbColor()
        }
        setFood(() => foodRef.current)
    }

    const eatFood = () => {
      const snakeHead = snakeRef.current.positions.length - 1;
      const isSnakeEatFood = snakeRef.current.positions[snakeHead].toTop === foodRef.current.position.toTop && snakeRef.current.positions[snakeHead].toLeft === foodRef.current.position.toLeft;
      if (isSnakeEatFood) {
        setScore(prev => prev + 5);
        randomFood();
        addSnakeLength();
      }
    }

    const addSnakeLength = () => {
      const snakeTailToTop = snakeRef.current.positions[0].toTop;
      const snakeTailToLeft = snakeRef.current.positions[0].toLeft;
      const newTail = {}

      if (snake.direction === SNAKE_MOVE_DIRECTION.RIGHT) {
        newTail.toTop = snakeTailToTop;
        newTail.toLeft = snakeTailToLeft - 5;
      } else if (snake.direction === SNAKE_MOVE_DIRECTION.LEFT) {
        newTail.toTop = snakeTailToTop;
        newTail.toLeft = snakeTailToLeft + 5;
      } else if (snake.direction === SNAKE_MOVE_DIRECTION.BOTTOM) {
        newTail.toTop = snakeTailToTop - 5;
        newTail.toLeft = snakeTailToLeft;
      } else if (snake.direction === SNAKE_MOVE_DIRECTION.TOP) {
        newTail.toTop = snakeTailToTop + 5;
        newTail.toLeft = snakeTailToLeft;
      }

      setSnake(prev => {
        return {
          ...prev,
          positions: [newTail, ...prev.positions]
        }
      })
      snakeRef.current.positions.unshift(newTail);
    }


    const foodStyle = {
      top: food.position.toTop,
      left: food.position.toLeft,
      backgroundColor: food.color
    }

   return (
    <div>
      <GameController handlePlay={() => {
        initGame();
        startGame();
      }} score={score} gameDifficulty={gameDifficulty} handleGameDifficulty={(e) => setGameDifficulty(e.target.value)}/>
      <div className={styles['game-area-wrap']}>
      {
        snake.positions.map((item, index) => {
          return <div className={`${styles['snake-item']} ${index === snake.positions.length - 1 ? styles['head-color'] : ''}`} style={{top: item.toTop, left: item.toLeft}} key={index}>蛇身</div>
        })
      }
      <div className={`${styles['food']}`} style={foodStyle}>食物</div>
    </div>
    </div>
   )
    
}

export default GameArea
