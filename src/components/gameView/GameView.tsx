import React from 'react';
import PlayGround from './PlayGround';
import Score from './Score';

const GameView = () => {
  return (
    <div>
      {/* 전체 화면 */}
      <PlayGround />
      <Score />
    </div>
  );
};

export default GameView;