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
    // console.log('dc: ', Block[randomKey as keyof typeof Block])
  }, [])


  useEffect(() => {
    const interval = setInterval(() => {
      setBlockPosition((prev) => ({ ...prev, y: prev.y + 1 })); // 블록 아래로 이동
    }, 500); // 500ms마다 이동
    return () => clearInterval(interval); // 컴포넌트 언마운트 시 정리
  }, []);

  const renderBlock = (rowIndex: number, colIndex: number) => {
    console.log('dd', rowIndex, colIndex, currentBlock)
    // return currentBlock?.some((blockRow: number[], blockRowIndex: number) =>
    //   blockRow.some(
    //     (blockCell, blockColIndex) =>
    //       blockCell &&
    //       rowIndex === blockPosition.y + blockRowIndex &&
    //       colIndex === blockPosition.x + blockColIndex
    //   )
    // );
  };



  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${STAGE_WIDTH}, 20px)`,
        gap: "1px",
      }}
    >
      {/* {field.flatMap((row, rowIndex) =>
        row.map((cell:any, colIndex:any) => {
          const isBlockPart = renderBlock(rowIndex, colIndex);
          return (
            <div
              key={`${rowIndex}-${colIndex}`}
              style={{
                width: "20px",
                height: "20px",
                backgroundColor: isBlockPart ? "blue" : "white",
                border: "1px solid #ccc",
              }}
            ></div>
          );
        })
      )} */}
    </div>
  );
};

export default PlayGround;