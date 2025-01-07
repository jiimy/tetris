import { field, STAGE_WIDTH } from '@/constants/Board';
import React from 'react';

const Map = () => {
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${STAGE_WIDTH}, 20px)` }}>
      {field.flat().map((cell, index) => (
        <div
          key={index}
          style={{
            width: "20px",
            height: "20px",
            backgroundColor: cell ? "blue" : "white",
            border: "1px solid #ccc",
          }}
        />
      ))}
    </div>
  );
};

export default Map;