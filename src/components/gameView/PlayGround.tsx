'use client';
import { Block } from '@/constants/Block';
import { field, STAGE_WIDTH } from '@/constants/Board';
import { random } from 'lodash';
import React, { useEffect, useState } from 'react';
import { clearLine } from 'readline';

const PlayGround = () => {
  const [currentBlock, setCurrentBlock] = useState<any>([]); // 현재 블록
  const [blockPosition, setBlockPosition] = useState({ x: 4, y: 0 }); // 블록 위치
  const [isFrozen, setIsFrozen] = useState(false);
  const [board, setBoard] = useState(field);

  useEffect(() => {
    spawnNewBlock();
  }, []);

  const spawnNewBlock = () => {
    const keys = Object.keys(Block);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    setCurrentBlock(Block[randomKey as keyof typeof Block]);
    setBlockPosition({ x: 4, y: 0 });
    setIsFrozen(false);
  };


  useEffect(() => {
    const interval = setInterval(() => {
      if (!isFrozen) {
        moveBlock('down');
      }
    }, 500);
    return () => clearInterval(interval);
  }, [blockPosition, isFrozen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isFrozen) return;

      switch (e.key) {
        case 'ArrowLeft':
          moveBlock('left');
          break;
        case 'ArrowRight':
          moveBlock('right');
          break;
        case 'ArrowDown':
          moveBlock('down');
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
  }, [blockPosition, currentBlock, isFrozen]);


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

    setBlockPosition({ ...blockPosition, y: newY });

    handleFreeze(newY);
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



  const handleFreeze = (freezeY?: number) => {
    setIsFrozen(true);

    setBoard((prevBoard) => {
      const newBoard = prevBoard.map((row) => [...row]);

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

      return newBoard;
    });

    // 새로운 블록 생성
    setTimeout(() => {
      spawnNewBlock();
      setIsFrozen(false);
    }, 1000);
  };


  // O 블록이라면 blockRow = [1 1 0 0], blockRowIndw 0 
  // O 블록이라면 blockRow = [1 1 0 0], blockRowIndw 1
  const renderBlock = (rowIndex: number, colIndex: number): boolean => {
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
      return true;
    }

    return board[rowIndex][colIndex] === 1;
  };



  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${STAGE_WIDTH}, 20px)`,
        gap: "1px",
      }}
    >
      {board.map((row, rowIndex) =>
        row.map((cell: any, colIndex: any) => {

          const isBlockPart = renderBlock(rowIndex, colIndex);
          return (
            <div
              key={`${rowIndex}-${colIndex}`}
              style={{
                width: "20px",
                height: "20px",
                backgroundColor: isBlockPart ? "blue" : "white",
                // backgroundColor: 'red',
                border: "1px solid #ccc",
              }}
              data-row={rowIndex}
              data-col={colIndex}
            ></div>
          );
        })
      )}
    </div>
  );
};

export default PlayGround;