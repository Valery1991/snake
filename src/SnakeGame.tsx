import { useState, useEffect, useRef, FC } from 'react';

type Point = {
  x: number,
  y: number
}

const initialSnake: Point[] = [{ x: 2, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 0 }];
const initialDirection: Point = { x: 1, y: 0 };
const initialApple: Point = { x: 10, y: 10 };

const SnakeGame: FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [direction, setDirection] = useState<Point>(initialDirection);
  const [snake, setSnake] = useState<Point[]>(initialSnake);
  const [apple, setApple] = useState<Point>(initialApple);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  const keyDownHandler = (event: any) => {
    const newDirection: Point = { x: direction.x, y: direction.y };
    switch(event.code) {
      case 'ArrowUp':
        if (direction.y !== 1) newDirection.y = -1; newDirection.x = 0;
        break;
      case 'ArrowRight':
        if (direction.x !== -1) newDirection.x = 1; newDirection.y = 0;
        break;
      case 'ArrowDown':
        if (direction.y !== -1) newDirection.y = 1; newDirection.x = 0;
        break;
      case 'ArrowLeft':
        if (direction.x !== 1) newDirection.x = -1; newDirection.y = 0;
        break;
    }
    setDirection(newDirection);
  }

  useEffect(() => {
    if (!gameStarted || isPaused) return;
    window.addEventListener('keydown', keyDownHandler);
    return () => window.removeEventListener('keydown', keyDownHandler);
  }, [direction, gameStarted, isPaused]);

  useEffect(() => {
    if (!gameStarted || isPaused) return;
    const interval = setInterval(() => {
      const newSnake = [...snake];
      const newHead = { x: newSnake[0].x + direction.x, y: newSnake[0].y + direction.y };

      if (
        newHead.x < 0 || newHead.x >= 40 ||
        newHead.y < 0 || newHead.y >= 20 ||
        newSnake.find(part => part.x === newHead.x && part.y === newHead.y)
      ) {
        setGameOver(true);
        return;
      }

      newSnake.unshift(newHead);
      if (newHead.x === apple.x && newHead.y === apple.y) {
        setApple({ x: Math.floor(Math.random() * 40), y: Math.floor(Math.random() * 20) });
        setScore(prevScore => prevScore + 50);
      } else {
        newSnake.pop();
      }
      setSnake(newSnake);
    }, 100);
    return () => clearInterval(interval);
  }, [snake, direction, apple, score, gameStarted, isPaused]);

  const draw = (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#5b8dde';
    ctx.fillRect(0, 0, 800, 400);
    ctx.strokeStyle = 'black';
    ctx.strokeRect(0, 0, 800, 400);
    snake.forEach(part => {
      ctx.fillStyle = '#36ff5a';
      ctx.fillRect(part.x * 20, part.y * 20, 20, 20);
    });
    ctx.fillStyle = '#c40000';
    ctx.fillRect(apple.x * 20, apple.y * 20, 20, 20);
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 390);
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || gameOver || !gameStarted) {
      return;
    }
    draw(canvas);
  }, [snake, apple, score, gameOver, gameStarted]);

  const startGame = () => {
    setGameStarted(true);
  };

  const restartGame = () => {
    setDirection(initialDirection);
    setSnake(initialSnake);
    setApple(initialApple);
    setGameOver(false);
    setScore(0);
    setGameStarted(false);
    setIsPaused(false);
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  if (!gameStarted) {
    return (
      <button className="px-4 py-2 font-semibold text-base bg-cyan-500 text-white rounded-full shadow-sm hover:scale-105 hover:bg-gradient-to-b hover:from-purple-400 transition-all duration-500 ease-in-out" onClick={startGame}>Start Game</button>
    )
  }

  if (gameOver) {
    return (
      <div className="flex flex-col gap-5">
        <h1 className="text-xl font-semibold">Game Over</h1>
        <p>Your score: {score}</p>
        <button className="px-4 py-2 font-semibold text-base bg-cyan-500 text-white rounded-full shadow-sm hover:scale-105 hover:bg-gradient-to-b hover:from-purple-400 transition-all duration-500 ease-in-out" onClick={restartGame}>Restart</button>
      </div>
    )
  }

  return (
    <div>
      <canvas ref={canvasRef} width="800" height="400" />
      <button className="px-4 py-2 font-semibold text-base bg-cyan-500 text-white rounded-full shadow-sm hover:scale-105 hover:bg-gradient-to-b hover:from-purple-400 transition-all duration-500 ease-in-out" onClick={togglePause}>{isPaused ? 'Resume' : 'Pause'}</button>
    </div>
  );
};

export default SnakeGame;
