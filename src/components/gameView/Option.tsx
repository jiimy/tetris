import React from 'react';
import type { GameOptions } from './GameView';

interface OptionProps {
  options: GameOptions;
  setOptions: React.Dispatch<React.SetStateAction<GameOptions>>;
}

const Option = ({ options, setOptions }: OptionProps) => {
  return (
    <div
      style={{
        marginTop: 16,
        padding: 12,
        border: '1px solid #ccc',
        borderRadius: 4,
        display: 'inline-block',
      }}
    >
      <div style={{ fontWeight: 'bold', marginBottom: 8 }}>옵션</div>
      <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
        <input
          type="checkbox"
          checked={options.randomBlock}
          onChange={(e) =>
            setOptions((prev) => ({ ...prev, randomBlock: e.target.checked }))
          }
        />
        <span>랜덤블록 (3×3 안에서 2~7칸 랜덤 모양)</span>
      </label>
    </div>
  );
};

export default Option;
