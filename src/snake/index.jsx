import GameArea from './GameArea';
const Snake = ({ handleGoBack }) => {
    return <div>
        <button onClick={handleGoBack} className='btn'>返回目录</button>
        <GameArea />
    </div>
}

export default Snake;