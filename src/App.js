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
  const [selectedHistory, setSelectedHistory] = useState([]);
  const [remainingNames, setRemainingNames] = useState(defaultNames);

  const handleNamesInput = (value) => {
    setNamesInput(value);
    const namesList = value.trim() ? value.split('\n').filter(name => name.trim()) : defaultNames;
    setNames(namesList);
    setRemainingNames(namesList);
    
    if (!isSpinning.some(spinning => spinning)) {
      const randomName = namesList[Math.floor(Math.random() * namesList.length)];
      setReels([randomName, randomName, randomName]);
    }
  };

  const resetGame = () => {
    setSelectedHistory([]);
    setRemainingNames([...names]);
    setResult(null);
    setShowResult(false);
    setReels([names[0], names[0], names[0]]);
  };

  const selectAnother = () => {
    if (result) {
      setSelectedHistory([...selectedHistory, { name: result, time: new Date().toLocaleTimeString() }]);
      setShowResult(false);
      setResult(null);
    }
    setReels([remainingNames[0], remainingNames[0], remainingNames[0]]);
    setTimeout(() => spin(), 100);
  };

  const spin = () => {
    if (remainingNames.length === 0) return;

    setIsSpinning([true, true, true]);
    setResult(null);
    setShowResult(false);
    
    const availableNames = remainingNames.filter(name => !selectedHistory.some(history => history.name === name));
    if (availableNames.length === 0) return;

    const finalName = availableNames[Math.floor(Math.random() * availableNames.length)];
    setSpinSpeeds([100, 80, 60]);

    const reelIntervals = [null, null, null];
    const stopTimes = [2000, 2800, 3500];

    [0, 1, 2].forEach(reelIndex => {
      reelIntervals[reelIndex] = setInterval(() => {
        setReels(prevReels => {
          const newReels = [...prevReels];
          newReels[reelIndex] = availableNames[Math.floor(Math.random() * availableNames.length)];
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
            setRemainingNames(prevNames => prevNames.filter(name => name !== finalName));
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
          <div className="fixed-slot-area">
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
              <div className="button-container">
                {result && (
                  <button 
                    onClick={selectAnother} 
                    disabled={isSpinning.some(spinning => spinning) || remainingNames.length === 0}
                    className="spin-button"
                  >
                    {remainingNames.length === 0 ? '全員選ばれました' : 'もう1人選ぶ'}
                  </button>
                )}
                <button 
                  onClick={result ? resetGame : spin} 
                  disabled={isSpinning.some(spinning => spinning)}
                  className={`spin-button ${result ? 'reset-button' : ''}`}
                >
                  {isSpinning.some(spinning => spinning) 
                    ? '選択中...' 
                    : result 
                      ? 'リセット'
                      : '開始'}
                </button>
              </div>
            </div>
          </div>
          <div className="scrollable-results">
            {result && showResult && !isSpinning.some(spinning => spinning) && (
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

            {[...selectedHistory].reverse().map((item, index) => (
              <div key={`history-${index}`} className="previous-result">
                <div className="history-result">
                  {item.name}
                </div>
                <h3>さん、お願いします！</h3>
              </div>
            ))}
          </div>
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