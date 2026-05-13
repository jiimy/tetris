'use client';
import { Block } from '@/constants/Block';
import { field, STAGE_WIDTH } from '@/constants/Board';
import { random } from 'lodash';
import React, { useEffect, useState } from 'react';
import { clearLine } from 'readline';
import NextBlock from './NextBlock';
import type { GameOptions } from './GameView';

const NEXT_BLOCK_COUNT = 3; // 미리보기로 보여줄 다음 블록 개수
const RANDOM_BLOCK_GRID = 3; // 랜덤블록이 배치되는 정사각형 범위

// 블록 낙하 속도 배수 (1 = 기본, 2 = 2배 빠름, 3 = 3배 빠름 ...)
const SPEED = 2;

// 위 SPEED 값에 따라 자동으로 계산되는 인터벌(ms)
const BASE_FALL_INTERVAL = 500; // SPEED = 1 일 때 일반 낙하 간격
const BASE_SOFT_DROP_INTERVAL = 50; // SPEED = 1 일 때 ArrowDown 홀드 낙하 간격
const NORMAL_FALL_INTERVAL = BASE_FALL_INTERVAL / SPEED;
const SOFT_DROP_INTERVAL = BASE_SOFT_DROP_INTERVAL / SPEED;

// 채워진 셀이 있는 영역만 잘라서 반환 (회전/충돌 검사를 자연스럽게)
const trimBlock = (grid: number[][]): number[][] => {
  let top = grid.length;
  let bottom = -1;
  let left = grid[0].length;
  let right = -1;

  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x]) {
        if (y < top) top = y;
        if (y > bottom) bottom = y;
        if (x < left) left = x;
        if (x > right) right = x;
      }
    }
  }

  if (bottom === -1) return grid;
  return grid.slice(top, bottom + 1).map((row) => row.slice(left, right + 1));
};

// 3x3 범위 안에서 2~7개의 셀을 자유롭게(인접하지 않아도 됨) 랜덤 배치한 블록 생성
const generateRandomCustomBlock = (): number[][] => {
  const cellCount = Math.floor(Math.random() * 6) + 2; // 2~7
  const grid: number[][] = Array.from({ length: RANDOM_BLOCK_GRID }, () =>
    Array(RANDOM_BLOCK_GRID).fill(0)
  );

  // 3x3 안의 모든 좌표를 만들고 셔플 후 앞에서 cellCount개를 선택
  const cells: Array<[number, number]> = [];
  for (let y = 0; y < RANDOM_BLOCK_GRID; y++) {
    for (let x = 0; x < RANDOM_BLOCK_GRID; x++) {
      cells.push([y, x]);
    }
  }
  for (let i = cells.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cells[i], cells[j]] = [cells[j], cells[i]];
  }

  for (let i = 0; i < cellCount; i++) {
    const [y, x] = cells[i];
    grid[y][x] = 1;
  }

  return trimBlock(grid);
};

const getRandomBlock = (randomBlockEnabled: boolean): number[][] => {
  if (randomBlockEnabled) {
    return generateRandomCustomBlock();
  }
  const keys = Object.keys(Block);
  const randomKey = keys[Math.floor(Math.random() * keys.length)];
  return Block[randomKey as keyof typeof Block];
};

interface PlayGroundProps {
  options?: GameOptions;
}

const DEFAULT_OPTIONS: GameOptions = { randomBlock: false };

const PlayGround = ({ options = DEFAULT_OPTIONS }: PlayGroundProps) => {
  const [currentBlock, setCurrentBlock] = useState<any>([]); // 현재 블록
  const [nextBlocks, setNextBlocks] = useState<number[][][]>(() =>
    Array.from({ length: NEXT_BLOCK_COUNT }, () => getRandomBlock(options.randomBlock))
  ); // 다음 블록들 (3개 미리보기)
  const [blockPosition, setBlockPosition] = useState({ x: 4, y: 0 }); // 블록 위치
  const [isFrozen, setIsFrozen] = useState(false);
  const [board, setBoard] = useState(field);
  const [isGameStarted, setIsGameStarted] = useState(false); // 게임 시작 여부
  const [isPaused, setIsPaused] = useState(false); // 게임 일시정지 여부
  const [score, setScore] = useState(0); // 점수
  const [isSoftDropping, setIsSoftDropping] = useState(false); // ArrowDown 홀드 중 빠른 낙하 여부
  const [isGameOver, setIsGameOver] = useState(false); // 게임 오버 여부 (다음 블록이 들어갈 자리 없음)

  useEffect(() => {
    if (isGameStarted && !isPaused) {
      spawnNewBlock();
    }
  }, [isGameStarted]);

  // 게임 시작 전 옵션이 바뀌면 다음 블록 미리보기를 옵션에 맞게 재생성
  useEffect(() => {
    if (!isGameStarted) {
      setNextBlocks(
        Array.from({ length: NEXT_BLOCK_COUNT }, () => getRandomBlock(options.randomBlock))
      );
    }
  }, [options.randomBlock, isGameStarted]);

  const spawnNewBlock = () => {
    setCurrentBlock(nextBlocks[0]);
    setNextBlocks((prev) => [...prev.slice(1), getRandomBlock(options.randomBlock)]);
    setBlockPosition({ x: 4, y: 0 });
    setIsFrozen(false);
  };

  const resetGame = () => {
    setIsGameStarted(false);
    setIsPaused(false);
    setIsFrozen(false);
    setIsSoftDropping(false);
    setIsGameOver(false);
    setBoard(field);
    setScore(0);
    setCurrentBlock([]);
    setBlockPosition({ x: 4, y: 0 });
    setNextBlocks(
      Array.from({ length: NEXT_BLOCK_COUNT }, () => getRandomBlock(options.randomBlock))
    );
  };

  useEffect(() => {
    if (isGameStarted && !isPaused && !isGameOver) {
      const interval = setInterval(() => {
        if (!isFrozen) {
          moveBlock('down');
        }
      }, isSoftDropping ? SOFT_DROP_INTERVAL : NORMAL_FALL_INTERVAL);
      return () => clearInterval(interval);
    }
  }, [blockPosition, isFrozen, isGameStarted, isPaused, isSoftDropping, isGameOver]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !isGameStarted) {
        setIsGameStarted(true);
        return;
      }

      if (isFrozen || !isGameStarted || isPaused || isGameOver) return;

      switch (e.key) {
        case 'ArrowLeft':
          moveBlock('left');
          break;
        case 'ArrowRight':
          moveBlock('right');
          break;
        case 'ArrowDown':
          if (!e.repeat) {
            setIsSoftDropping(true);
            moveBlock('down');
          }
          break;
        case 'ArrowUp':
          rotateBlock();
          break;
        case ' ': // Spacebar
          dropBlock();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [blockPosition, currentBlock, isFrozen, isGameStarted, isPaused, isGameOver]);

  useEffect(() => {
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        setIsSoftDropping(false);
      }
    };

    window.addEventListener('keyup', handleKeyUp);
    return () => window.removeEventListener('keyup', handleKeyUp);
  }, []);

  const moveBlock = (direction: 'left' | 'right' | 'down') => {
    setBlockPosition((prev) => {
      const newPosition = { ...prev };

      if (direction === 'left' && !checkCollision(prev.y, prev.x - 1)) {
        newPosition.x -= 1;
      }
      if (direction === 'right' && !checkCollision(prev.y, prev.x + 1)) {
        newPosition.x += 1;
      }
      if (direction === 'down') {
        if (!checkCollision(prev.y + 1, prev.x)) {
          newPosition.y += 1;
        } else {
          handleFreeze(prev.y);
        }
      }

      return newPosition;
    });
  };

  const rotateBlock = () => {
    if (!currentBlock) return;

    const rotatedBlock = currentBlock[0].map((_: any, index: string | number) =>
      currentBlock.map((row: { [x: string]: any; }) => row[index]).reverse()
    );

    if (!checkCollision(blockPosition.y, blockPosition.x, rotatedBlock)) {
      setCurrentBlock(rotatedBlock);
    }
  };

  const dropBlock = () => {
    let newY = blockPosition.y;
    while (!checkCollision(newY + 1, blockPosition.x)) {
      newY += 1;
    }

    handleFreeze(newY, true);
  };

  const checkCollision = (y: number, x: number, testBlock = currentBlock): boolean => {
    return testBlock.some((blockRow: number[], blockRowIndex: number) =>
      blockRow.some(
        (blockCell, blockColIndex) =>
          blockCell &&
          (y + blockRowIndex >= field.length ||
            x + blockColIndex < 0 ||
            x + blockColIndex >= STAGE_WIDTH ||
            board[y + blockRowIndex]?.[x + blockColIndex]) // 이미 고정된 블록과 겹치면 충돌
      )
    );
  };

  const checkFullLines = () => {
    setBoard((prevBoard) => {
      const newBoard = prevBoard.filter(row => row.some((cell: any) => cell === 0));
      const linesCleared = prevBoard.length - newBoard.length;
      const emptyRows = Array.from({ length: linesCleared }, () => Array(STAGE_WIDTH).fill(0));
      setScore((prevScore) => prevScore + linesCleared * 10 * linesCleared); // 점수 계산
      return [...emptyRows, ...newBoard];
    });
  };

  // 주어진 보드에서 특정 블록이 (y, x) 위치에 충돌하는지 검사 (state 의존 없는 순수 헬퍼)
  const wouldCollide = (
    targetBoard: number[][],
    block: number[][],
    y: number,
    x: number
  ): boolean => {
    return block.some((blockRow, blockRowIndex) =>
      blockRow.some((blockCell, blockColIndex) => {
        if (!blockCell) return false;
        const ny = y + blockRowIndex;
        const nx = x + blockColIndex;
        return (
          ny >= targetBoard.length ||
          nx < 0 ||
          nx >= STAGE_WIDTH ||
          !!targetBoard[ny]?.[nx]
        );
      })
    );
  };

  const handleFreeze = (freezeY?: number, immediate = false) => {
    setIsFrozen(true);

    // 보드에 현재 블록을 고정하고, 가득 찬 라인이 있으면 제거한 새 보드 계산
    let newBoard = board.map((row) => [...row]);

    currentBlock.forEach((blockRow: number[], blockRowIndex: number) => {
      blockRow.forEach((blockCell, blockColIndex) => {
        if (blockCell) {
          const y = (freezeY ?? blockPosition.y) + blockRowIndex;
          const x = blockPosition.x + blockColIndex;

          if (y >= 0 && y < newBoard.length && x >= 0 && x < newBoard[0].length) {
            newBoard[y][x] = 1; // 블록 고정
          }
        }
      });
    });

    const filtered = newBoard.filter((row) => row.some((cell: any) => cell === 0));
    const linesCleared = newBoard.length - filtered.length;
    if (linesCleared > 0) {
      const emptyRows = Array.from({ length: linesCleared }, () => Array(STAGE_WIDTH).fill(0));
      newBoard = [...emptyRows, ...filtered];
      setScore((prevScore) => prevScore + linesCleared * 10 * linesCleared);
    }

    setBoard(newBoard);

    // 다음 블록이 시작 위치(4,0)에 들어갈 수 없으면 게임 오버 → 다음 블록 갱신 중단
    const nextBlock = nextBlocks[0];
    if (nextBlock && wouldCollide(newBoard, nextBlock, 0, 4)) {
      setIsGameOver(true);
      setIsSoftDropping(false);
      return;
    }

    // Space로 떨어뜨린 경우: 즉시 다음 블록 생성
    if (immediate) {
      if (!isPaused) {
        spawnNewBlock();
      }
      return;
    }

    // 자연 낙하로 바닥에 닿은 경우: 0.3초 안에 아무 키 입력이 없으면 즉시 다음 블록 생성
    // (입력이 있으면 타이머를 리셋하여 다시 0.3초 대기)
    let spawned = false;
    let timerId: ReturnType<typeof setTimeout>;

    const triggerSpawn = () => {
      if (spawned) return;
      spawned = true;
      window.removeEventListener('keydown', onAnyKey);
      if (!isPaused) {
        spawnNewBlock();
      }
    };

    const onAnyKey = (e: KeyboardEvent) => {
      if (e.repeat) return;
      clearTimeout(timerId);
      timerId = setTimeout(triggerSpawn, 300);
    };

    window.addEventListener('keydown', onAnyKey);
    timerId = setTimeout(triggerSpawn, 300);
  };

  const getGhostY = (): number => {
    let ghostY = blockPosition.y;
    while (!checkCollision(ghostY + 1, blockPosition.x)) {
      ghostY += 1;
    }
    return ghostY;
  };

  const renderBlock = (rowIndex: number, colIndex: number): 'current' | 'ghost' | 'fixed' | 'empty' => {
    // 움직이는 블록 렌더링
    if (
      currentBlock?.some((blockRow: number[], blockRowIndex: number) =>
        blockRow.some((blockCell, blockColIndex) =>
          blockCell &&
          rowIndex === blockPosition.y + blockRowIndex &&
          colIndex === blockPosition.x + blockColIndex
        )
      )
    ) {
      return 'current';
    }

    // 고스트(착지 예상 위치) 블록 렌더링
    if (isGameStarted && !isFrozen && currentBlock?.length) {
      const ghostY = getGhostY();
      if (
        ghostY !== blockPosition.y &&
        currentBlock.some((blockRow: number[], blockRowIndex: number) =>
          blockRow.some((blockCell: number, blockColIndex: number) =>
            blockCell &&
            rowIndex === ghostY + blockRowIndex &&
            colIndex === blockPosition.x + blockColIndex
          )
        )
      ) {
        return 'ghost';
      }
    }

    return board[rowIndex][colIndex] === 1 ? 'fixed' : 'empty';
  };

  return (
    <div>
      {!isGameStarted && (
        <button onClick={() => setIsGameStarted(true)}>게임 시작 (Enter)</button>
      )}
      {isGameStarted && (
        <button onClick={() => setIsPaused(!isPaused)}>
          {isPaused ? '게임 재개' : '일시정지'}
        </button>
      )}
      {isGameStarted && (
        <button onClick={resetGame}>게임 초기화</button>
      )}
      {isGameOver && (
        <div style={{ color: 'red', fontWeight: 'bold', marginTop: 4 }}>
          GAME OVER - 게임 초기화를 눌러 다시 시작하세요
        </div>
      )}
      <div>점수: {score}</div>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${STAGE_WIDTH}, 20px)`,
            gap: "1px",
          }}
        >
          {board.map((row, rowIndex) =>
            row.map((cell: any, colIndex: any) => {
              const cellType = renderBlock(rowIndex, colIndex);
              const backgroundColor =
                cellType === 'current' || cellType === 'fixed'
                  ? 'blue'
                  : cellType === 'ghost'
                  ? 'rgba(0, 0, 255, 0.2)'
                  : 'white';
              const border =
                cellType === 'ghost'
                  ? '1px dashed blue'
                  : '1px solid #ccc';
              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  style={{
                    width: "20px",
                    height: "20px",
                    backgroundColor,
                    border,
                  }}
                  data-row={rowIndex}
                  data-col={colIndex}
                ></div>
              );
            })
          )}
        </div>
        <NextBlock blocks={nextBlocks} />
      </div>
    </div>
  );
};

export default PlayGround;