import React from 'react';

interface NextBlockProps {
  blocks: number[][][];
}

const NextBlock = ({ blocks }: NextBlockProps) => {
  return (
    <div className="w-[100px]">
      <div style={{ marginBottom: 4 }}>다음 블록</div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          padding: '8px',
          border: '1px solid #ccc',
          backgroundColor: '#fafafa',
        }}
      >
        {blocks.map((block, blockIndex) => {
          const cols = block?.[0]?.length ?? 0;
          return (
            <div
              key={blockIndex}
              style={{
                display: 'flex',
                justifyContent: 'center',
                opacity: blockIndex === 0 ? 1 : 0.6 - blockIndex * 0.1,
              }}
            >
              <div
                style={{
                  display: 'inline-grid',
                  gridTemplateColumns: `repeat(${cols}, 20px)`,
                  gap: '1px',
                }}
              >
                {block?.map((row, rowIndex) =>
                  row.map((cell, colIndex) => (
                    <div
                      key={`${rowIndex}-${colIndex}`}
                      style={{
                        width: '20px',
                        height: '20px',
                        backgroundColor: cell ? 'blue' : 'transparent',
                        border: cell ? '1px solid #ccc' : '1px solid transparent',
                      }}
                    />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NextBlock;
