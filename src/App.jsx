import { useState } from 'react';
import Snake from './snake';

function App() {
  const [game, setGame] = useState();

  const handleChoose = (gameName) => {
    setGame(gameName);
  }

  const GameBtn = () => {
    return <div>
      <button className='btn' onClick={() => handleChoose('snake')}>贪吃蛇</button>
      <button className='btn' onClick={() => handleChoose('fly-bird')}>飞翔的鸟(敬请期待...)</button>
      
    </div>
  }


  const chooseGame = () => {
    switch (game) {
      case 'snake':
        return <Snake handleGoBack={() =>  setGame(null)} />
      default:
        return <GameBtn />
    }
  }
  return (
    <div className="App">
      <h1 className=''>休闲小游戏</h1>
      {chooseGame()}
    </div>
  )
}

export default App
