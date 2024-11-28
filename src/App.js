import React, { useState } from 'react';
import './App.css';

function App() {
  const defaultNames = ['名前1', '名前2', '名前3', '名前4', '名前5'];
  const [reels, setReels] = useState([defaultNames[0], defaultNames[0], defaultNames[0]]);
  const [namesInput, setNamesInput] = useState('');
  const [isSpinning, setIsSpinning] = useState([false, false, false]);
  const [names, setNames] = useState(defaultNames);
  const [result, setResult] = useState(null);
  const [spinSpeeds, setSpinSpeeds] = useState([0, 0, 0]);
  const [showResult, setShowResult] = useState(false);

  const handleNamesInput = (value) => {
    setNamesInput(value);
    const namesList = value.trim() ? value.split('\n').filter(name => name.trim()) : defaultNames;
    setNames(namesList);
  };

  const spin = () => {
    setIsSpinning([true, true, true]);
    setResult(null);
    setShowResult(false);
    
    const finalName = names[Math.floor(Math.random() * names.length)];
    setSpinSpeeds([100, 80, 60]);

    const reelIntervals = [null, null, null];
    const stopTimes = [2000, 2800, 3500];

    [0, 1, 2].forEach(reelIndex => {
      reelIntervals[reelIndex] = setInterval(() => {
        setReels(prevReels => {
          const newReels = [...prevReels];
          newReels[reelIndex] = names[Math.floor(Math.random() * names.length)];
          return newReels;
        });
      }, spinSpeeds[reelIndex]);

      const slowdownStart = stopTimes[reelIndex] - 800;
      
      setTimeout(() => {
        const slowdownInterval = setInterval(() => {
          setSpinSpeeds(prev => {
            const newSpeeds = [...prev];
            newSpeeds[reelIndex] = Math.min(400, newSpeeds[reelIndex] * 1.2);
            return newSpeeds;
          });
        }, 100);

        setTimeout(() => {
          clearInterval(reelIntervals[reelIndex]);
          clearInterval(slowdownInterval);
          
          setReels(prevReels => {
            const newReels = [...prevReels];
            newReels[reelIndex] = finalName;
            return newReels;
          });
          
          setIsSpinning(prev => {
            const newSpinning = [...prev];
            newSpinning[reelIndex] = false;
            return newSpinning;
          });

          if (reelIndex === 2) {
            setResult(finalName);
            setTimeout(() => {
              setShowResult(true);
            }, 500);
          }
        }, 800);
      }, slowdownStart);
    });
  };

  return (
    <div className="app">
      <h1 className="title">指名スロット</h1>
      <div className="game-container">
        <div className="slot-section">
          <div className="slot-machine">
            <div className="reels">
              {reels.map((name, index) => (
                <div 
                  key={index} 
                  className={`reel ${isSpinning[index] ? 'spinning' : ''}`}
                  style={{
                    animationDuration: isSpinning[index] ? `${spinSpeeds[index]}ms` : '0ms'
                  }}
                >
                  {name}
                </div>
              ))}
            </div>
            <button 
              onClick={spin} 
              disabled={isSpinning.some(spinning => spinning) || names.length === 0}
              className="spin-button"
            >
              {isSpinning.some(spinning => spinning) ? '選択中...' : '開始'}
            </button>
          </div>

          {result && (
            <div className={`result-section ${showResult ? 'show-result' : ''}`}>
              <div className="result">
                {result}
                <span className="star star-1">★</span>
                <span className="star star-2">★</span>
                <span className="star star-3">★</span>
                <span className="star star-4">★</span>
                <span className="star star-5">★</span>
              </div>
              <h3>さん、お願いします！</h3>
            </div>
          )}
        </div>

        <div className="player-section">
          <textarea
            value={namesInput}
            onChange={(e) => handleNamesInput(e.target.value)}
            placeholder={`名前1\n名前2\n名前3\n名前4\n名前5`}
            className="names-input"
            rows={10}
          />
        </div>
      </div>
    </div>
  );
}

export default App; 