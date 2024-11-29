import React, { useState, useEffect } from 'react';
import './SlotMachine.css';

const SlotMachine = ({ names }) => {
  const [reels, setReels] = useState([0, 0, 0]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState('');

  // namesが変更されたときにリールをランダムに更新
  useEffect(() => {
    if (!isSpinning && names.length > 0) {
      setReels(reels.map(() => Math.floor(Math.random() * names.length)));
    }
  }, [names, isSpinning]);

  const reelColors = [
    '#FFE4E1',
    '#E0FFFF',
    '#F0FFF0'
  ];

  const spin = () => {
    if (isSpinning || names.length === 0) return;
    
    setIsSpinning(true);
    setResult('');

    // スピン中のアニメーション
    const spinInterval = setInterval(() => {
      setReels(reels => 
        reels.map(() => Math.floor(Math.random() * names.length))
      );
    }, 100);

    // 5秒後に停止
    setTimeout(() => {
      clearInterval(spinInterval);
      const selectedIndex = Math.floor(Math.random() * names.length);
      setReels([selectedIndex, selectedIndex, selectedIndex]);
      setIsSpinning(false);
      setResult(names[selectedIndex]);
    }, 5000);
  };

  return (
    <div className="slot-machine">
      <div className="reels">
        {reels.map((reelIndex, i) => (
          <div key={i} className={`reel ${isSpinning ? 'spinning' : ''}`}>
            {names[reelIndex] || '？'}
          </div>
        ))}
      </div>
      <button 
        onClick={spin}
        disabled={isSpinning || names.length === 0}
      >
        {isSpinning ? '回転中...' : 'スタート！'}
      </button>
      {result && (
        <div className="result">
          <div className="selected-name">{result}</div>
          <h2>さん、お願いします！</h2>
        </div>
      )}
    </div>
  );
};

export default SlotMachine; 