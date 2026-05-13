'use client';
import React, { useState } from 'react';
import PlayGround from './PlayGround';
import Option from './Option';

export interface GameOptions {
  randomBlock: boolean;
}

const GameView = () => {
  const [options, setOptions] = useState<GameOptions>({
    randomBlock: false,
  });

  return (
    <div>
      {/* 전체 화면 */}
      <PlayGround options={options} />
      <Option options={options} setOptions={setOptions} />
    </div>
  );
};

export default GameView;
