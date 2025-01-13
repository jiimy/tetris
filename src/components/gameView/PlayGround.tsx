'use client';
import { Block } from '@/constants/Block';
import { field, STAGE_WIDTH } from '@/constants/Board';
import { random } from 'lodash';
import React, { useEffect, useState } from 'react';
import { clearLine } from 'readline';

const PlayGround = () => {
  const [currentBlock, setCurrentBlock] = useState<any>([]); // 현재 블록
  const [blockPosition, setBlockPosition] = useState({ x: 4, y: 0 }); // 블록 위치

  useEffect(() => {
    const keys = Object.keys(Block);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    setCurrentBlock(Block[randomKey as keyof typeof Block]);
  }, [])


  useEffect(() => {
    const interval = setInterval(() => {
      // setBlockPosition((prev) => {
      //   if (prev.y < field.length - 4) {
      //     return { ...prev, y: prev.y + 1 };
      //   } else {
      //     return prev;
      //   }
      // });
      moveBlock('down');

    }, 500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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
  }, [blockPosition, currentBlock]);

  const moveBlock = (direction: 'left' | 'right' | 'down') => {
    setBlockPosition((prev) => {
      const newPosition = { ...prev };
      if (direction === 'left' && prev.x > 0) newPosition.x -= 1;
      if (direction === 'right' && prev.x < STAGE_WIDTH - currentBlock[0].length) newPosition.x += 1;
      if (direction === 'down' && prev.y < field.length - currentBlock.length) newPosition.y += 1;
      return newPosition;
    });
  };

  const rotateBlock = () => {
    if (!currentBlock) return;
    const rotatedBlock = currentBlock[0].map((_: any, index: any) =>
      currentBlock.map((row: any) => row[index]).reverse()
    );

    setCurrentBlock(rotatedBlock);
  };

  const dropBlock = () => {
    setBlockPosition((prev) => ({ ...prev, y: field.length - currentBlock.length }));
  };


  const renderBlock = (rowIndex: number, colIndex: number): any => {
    if (
      currentBlock?.some((blockRow: number[], blockRowIndex: number) =>
        // O 블록이라면 blockRow = [1 1 0 0], blockRowIndw 0 
        // O 블록이라면 blockRow = [1 1 0 0], blockRowIndw 1
        blockRow.some((blockCell, blockColIndex) =>
          blockCell &&
          rowIndex === blockPosition.y + blockRowIndex &&
          colIndex === blockPosition.x + blockColIndex
        )
      )
    ) {
      return true;
    }
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${STAGE_WIDTH}, 20px)`,
        gap: "1px",
      }}
    >
      {field.map((row, rowIndex) =>
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