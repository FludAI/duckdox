import React, { useState, useEffect } from 'react';

// Helper function to shade colors
const shadeColor = (color, percent) => {
  const num = parseInt(color.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = (num >> 8 & 0x00FF) + amt;
  const B = (num & 0x0000FF) + amt;
  return `#${(1 << 24 | (R < 255 ? R < 1 ? 0 : R : 255) << 16 | (G < 255 ? G < 1 ? 0 : G : 255) << 8 | (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1)}`;
};

// TypeWriter component
const TypewriterText = ({ text, clueText, index }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showClue, setShowClue] = useState(false);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(c => c + 1);
      }, 30);
      return () => clearTimeout(timer);
    } else {
      setShowClue(true);
    }
  }, [currentIndex, text]);

  return (
    <div>
      <div className="font-mono text-lg text-blue-900 leading-relaxed">
        {displayedText}
        <span className="inline-block w-0.5 h-[1em] bg-current ml-0.5 animate-blink">▋</span>
      </div>
      {showClue && index === 1 && (
        <div className="mt-3 text-indigo-500 italic">
          🦆 Hint: Look at the ducks above - they might have a clue to the answer!
        </div>
      )}
    </div>
  );
};

// Duck Shape Component
const DuckShape = ({ x, y, color, birthday, isPaired, rotation }) => {
  return (
    <g transform={`translate(${x},${y}) rotate(${rotation})`} style={{filter: 'drop-shadow(2px 2px 3px rgba(0,0,0,0.2))'}}>
      <defs>
        <linearGradient id={`duckGradient-${x}-${y}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor: color, stopOpacity: 1}} />
          <stop offset="100%" style={{stopColor: shadeColor(color, -10), stopOpacity: 1}} />
        </linearGradient>
        <radialGradient id={`blushGradient-${x}-${y}`}>
          <stop offset="0%" stopColor="#ff9999" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#ff9999" stopOpacity="0" />
        </radialGradient>
      </defs>
      
      {/* Body */}
      <ellipse
        cx="0"
        cy="0"
        rx="15"
        ry="12"
        fill={`url(#duckGradient-${x}-${y})`}
        stroke={isPaired ? '#ff6b6b' : '#444'}
        strokeWidth={isPaired ? 3 : 2}
      />
      
      {/* Head */}
      <circle
        cx="10"
        cy="-5"
        r="8"
        fill={`url(#duckGradient-${x}-${y})`}
        stroke={isPaired ? '#ff6b6b' : '#444'}
        strokeWidth={isPaired ? 3 : 2}
      />
      
      {/* Blush cheeks */}
      <circle
        cx="14"
        cy="-4"
        r="3"
        fill={`url(#blushGradient-${x}-${y})`}
      />
      
      {/* Bill */}
      <path
        d="M16,-7 L24,-5 L16,-3"
        fill="#ff9800"
        stroke="#cc7000"
        strokeWidth="1.5"
      />
      
      {/* Eye with white highlight */}
      <circle cx="12" cy="-7" r="2" fill="#000" />
      <circle cx="12.5" cy="-7.5" r="0.8" fill="#fff" />
      
      {/* Wing detail */}
      <path
        d="M-5,0 Q-2,-5 2,-3"
        fill="none"
        stroke={isPaired ? '#ff6b6b' : '#444'}
        strokeWidth="1.5"
      />
      
      {/* Birthday text */}
      <text
        x="0"
        y="-20"
        textAnchor="middle"
        fontSize="12"
        fill="#1f2937"
        transform={`rotate(${-rotation})`}
        className="font-semibold"
      >
        {birthday}
      </text>
    </g>
  );
};

const DuckPond = () => {
  // SVG dimensions
  const width = 800;
  const height = 500;
  const centerX = width / 2;
  const centerY = height / 2;
  const radiusX = width * 0.35;
  const radiusY = height * 0.35;

  // State
  const [stage, setStage] = useState(0);
  const [classSize, setClassSize] = useState('');
  const [probabilityGuess, setProbabilityGuess] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [ducks, setDucks] = useState([]);
  const [pairs, setPairs] = useState([]);
  const [angleOffsets, setAngleOffsets] = useState([]);
  const [waterOffset, setWaterOffset] = useState(0);
  const [danceAngles, setDanceAngles] = useState({});
  const [showPrize, setShowPrize] = useState(false);
  const [showGuessAnimation, setShowGuessAnimation] = useState(false);

  // Questions
  const questions = [
    "What are the chances of two students in your class having the same birthday?... First we need to know how many students your class has? 🎓",
    "Before we calculate, what do you think is the probability (%) that two students share a birthday? 🤔"
  ];

  // Helper functions
  const calculateProbability = (n) => {
    let prob = 1;
    for (let i = 0; i < n; i++) {
      prob *= (365 - i) / 365;
    }
    return (1 - prob) * 100;
  };

  const calculateDifference = () => {
    const actualProb = calculateProbability(parseInt(classSize));
    return Math.abs(actualProb - parseFloat(probabilityGuess)).toFixed(1);
  };

  const heartShape = (t) => ({
    x: 25 * (16 * Math.pow(Math.sin(t), 3)),
    y: 25 * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t))
  });

  const calculatePosition = (duck, index, total, centerX, centerY, radiusX, radiusY, pairs, danceAngles, angleOffset) => {
    const isPaired = pairs.some(pair => pair.some(d => d.id === duck.id));
    
    if (isPaired) {
      const danceAngle = danceAngles[duck.id] || 0;
      const heartPos = heartShape(danceAngle);
      const nextPos = heartShape(danceAngle + 0.1);
      const rotation = Math.atan2(nextPos.y - heartPos.y, nextPos.x - heartPos.x) * 180 / Math.PI + 90;

      return {
        x: centerX + heartPos.x,
        y: centerY - heartPos.y,
        rotation
      };
    }
    
    const adjustedRadiusX = total > 50 ? radiusX * (1 + ((total - 50) / 100)) : radiusX;
    const adjustedRadiusY = total > 50 ? radiusY * (1 + ((total - 50) / 100)) : radiusY;
    
    const baseAngle = (index / total) * 2 * Math.PI;
    const angle = baseAngle + (angleOffset || 0);
    
    return {
      x: centerX + adjustedRadiusX * Math.cos(angle),
      y: centerY + adjustedRadiusY * Math.sin(angle),
      rotation: (angle * 180 / Math.PI) + 90
    };
  };

  const generateDucks = (size) => {
    const numericSize = parseInt(size);
    const birthdays = Array.from({ length: numericSize }, () => 
      Math.floor(Math.random() * 365) + 1
    );
    
    // More vibrant color palette for ducks
    const duckColors = [
      '#FFD700', // Golden yellow
      '#FFA07A', // Light salmon
      '#98FB98', // Pale green
      '#87CEEB', // Sky blue
      '#DDA0DD', // Plum
      '#F0E68C', // Khaki
      '#FF69B4', // Hot pink
      '#00CED1', // Dark turquoise
    ];
    
    const duckData = birthdays.map((birthday, index) => ({
      id: index,
      birthday,
      dateStr: new Date(2024, 0, birthday)
        .toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      color: duckColors[Math.floor(Math.random() * duckColors.length)],
    }));

    const matchedPairs = duckData.reduce((pairs, duck1, i) => {
      duckData.slice(i + 1).forEach(duck2 => {
        if (duck1.birthday === duck2.birthday) {
          pairs.push([duck1, duck2]);
        }
      });
      return pairs;
    }, []);

    setDucks(duckData);
    setPairs(matchedPairs);
    setAngleOffsets(Array(numericSize).fill(0));
    setDanceAngles(
      matchedPairs.reduce((acc, [d1, d2]) => ({
        ...acc,
        [d1.id]: 0,
        [d2.id]: Math.PI
      }), {})
    );
  };

  const handleShowResults = () => {
    generateDucks(classSize);
    setShowResults(true);
    setStage(2);
    setTimeout(() => setShowGuessAnimation(true), 1000);
    
    const difference = calculateDifference();
    if (difference === "0.0") {
      setTimeout(() => setShowPrize(true), 2000);
    }
  };

  useEffect(() => {
    if (!showResults) return;

    const interval = setInterval(() => {
      setAngleOffsets(prev => prev.map(angle => (angle + 0.005) % (2 * Math.PI)));
      setWaterOffset(prev => (prev + 1) % 20);
      setDanceAngles(prev => 
        Object.fromEntries(
          Object.entries(prev).map(([id, angle]) => [id, (angle + 0.03) % (2 * Math.PI)])
        )
      );
    }, 50);
    
    return () => clearInterval(interval);
  }, [showResults]);

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gradient-to-b from-blue-50 to-slate-50 rounded-2xl shadow-lg">
      <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-900 to-blue-600 text-center mb-8">
        Duck Pond Birthday Paradox 'Pair of Ducks'
      </h1>

      <div className="bg-gradient-to-r from-blue-50 via-white to-blue-50 rounded-2xl border-2 border-blue-200 shadow-lg p-8 mb-8">
        <div className="flex items-center justify-center gap-6 relative">
          {classSize && (
            <div className="text-9xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent leading-none w-48 text-center">
              {classSize}
            </div>
          )}
          
          <div className="relative px-8 border-x-2 border-blue-100">
            <img 
              src="/images/duck-bros.gif" 
              alt="Duck Bros" 
              className="w-36 h-36 mb-5 mx-auto"
            />
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-72 text-center text-sm text-indigo-500 italic">
              Hint: Jordan's #23 'Students' means 50.7% - 😉$0.50 - probability!
              
            </div>
          </div>

          {probabilityGuess && (
            <div className="flex items-center justify-center w-full">
  <span className="text-9xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent leading-none whitespace-nowrap">
    {probabilityGuess}%
  </span>
</div>

          )}
        </div>
      </div>

      {/* Questions */}
      {questions.map((question, index) => (
        stage >= index && (
          <div key={index} className="bg-gradient-to-r from-blue-50 to-gray-50 rounded-xl p-5 mb-5 border border-blue-200/20 shadow-sm">
            <TypewriterText 
              text={question}
              clueText="Look at the ducks above - they might have a clue!"
              index={index}
            />
            {stage === index && (
              <form 
                className="flex items-center gap-4 mt-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (index === 0) {
                    setStage(1);
                  } else {
                    handleShowResults();
                  }
                }}
              >
                {index === 0 ? (
                  <input
                    type="number"
                    value={classSize}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === '' || (Number(value) >= 0 && Number(value) <= 1000)) {
                        setClassSize(value);
                      }
                    }}
                    placeholder="Enter total students #..."
                    className="w-56 px-4 py-2.5 text-base border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none"
                    min="0"
                    max="1000"
                  />
                ) : (
                  <input
                    type="text"
                    value={probabilityGuess}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9.]/g, '');
                      if (value === '' || (Number(value) >= 0 && Number(value) <= 100)) {
                        if (value.split('.').length <= 2 && value.length <= 6) {
                          setProbabilityGuess(value);
                        }
                      }
                    }}
                    onBlur={() => {
                      if (probabilityGuess !== '') {
                        const formatted = Number(probabilityGuess).toFixed(1);
                        setProbabilityGuess(formatted);
                      }
                    }}
                    placeholder="Enter your guess (0-100)..."
                    className="w-56 px-4 py-2.5 text-base border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none"
                  />
                )}
                <button
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-800 text-white text-base font-semibold rounded-lg shadow-md hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200"
                  onClick={() => {
                    if (index === 0) {
                      setStage(1);
                    } else {
                      handleShowResults();
                    }
                  }}
                >
                  {index === 0 ? 'Next' : "Let's Find Out!"}
                </button>
              </form>
            )}
          </div>
        )
      ))}

      {/* Results and Pond Visualization */}
      {showResults && (
        <div>
          <div className="mt-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 border-2 border-blue-600/30 shadow-lg">
            <svg width={width} height={height} className="block mx-auto">
              <defs>
                <pattern 
                  id="waterPattern" 
                  x="0" y="0" 
                  width="20" height="20" 
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d={`M ${waterOffset} 10 Q 10 0, 20 10 T 40 10`}
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.3)"
                    strokeWidth="2"
                  />
                </pattern>
                <linearGradient id="heartGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ff6b6b" />
                  <stop offset="100%" stopColor="#ff8787" />
                </linearGradient>
              </defs>

              {/* Pond Base */}
              <ellipse
                cx={centerX}
                cy={centerY}
                rx={radiusX}
                ry={radiusY}
                fill="rgb(236, 254, 255)"
                stroke="rgb(37, 99, 235)"
                strokeWidth="3"
              />
              
              {/* Water Overlay */}
              <ellipse
                cx={centerX}
                cy={centerY}
                rx={radiusX}
                ry={radiusY}
                fill="url(#waterPattern)"
                fillOpacity="0.5"
              />
              
              {/* Heart Path for Matches */}
              {pairs.length > 0 && (
                <path
                  d={Array.from({ length: 50 }, (_, i) => {
                    const t = (i / 49) * 2 * Math.PI;
                    const pos = heartShape(t);
                    return `${i === 0 ? 'M' : 'L'} ${centerX + pos.x} ${centerY - pos.y}`;
                  }).join(' ') + ' Z'}
                  fill="none"
                  stroke="url(#heartGradient)"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                  opacity="0.4"
                />
              )}
              
              {/* Ducks */}
              {ducks.map((duck, index) => {
                const isPaired = pairs.some(pair => 
                  pair.some(d => d.id === duck.id)
                );
                const pos = calculatePosition(
                  duck, 
                  index, 
                  ducks.length,
                  centerX,
                  centerY,
                  radiusX,
                  radiusY,
                  pairs,
                  danceAngles,
                  angleOffsets[index]
                );
                
                return (
                  <DuckShape
                    key={duck.id}
                    x={pos.x}
                    y={pos.y}
                    color={duck.color}
                    birthday={duck.dateStr}
                    isPaired={isPaired}
                    rotation={pos.rotation}
                  />
                );
              })}

              {/* Results Display */}
              {showGuessAnimation && (
                <g transform={`translate(${centerX},${centerY})`}>
                  <text className="text-2xl font-bold text-blue-600 text-center" y="-20">
                    Your Guess: {probabilityGuess}%
                  </text>
                  <text className="text-2xl font-bold text-green-600 text-center" y="20">
                    Actual: {calculateProbability(parseInt(classSize)).toFixed(1)}%
                  </text>
                  <text className="text-2xl font-bold text-purple-600 text-center" y="60">
                    Difference: {calculateDifference()}%
                  </text>
                </g>
              )}

              {/* Prize Animation */}
              {showPrize && (
                <g transform={`translate(${centerX},${centerY})`}>
                  <text className="text-3xl font-bold text-yellow-500 text-center animate-bounce" y="0">
                    🏆 PERFECT GUESS! 🦆
                  </text>
                </g>
              )}
            </svg>
          </div>

          {/* Results Card */}
          <div className="mt-8 bg-white rounded-xl p-6 border border-slate-200 shadow-lg">
            <h2 className="text-2xl font-bold text-blue-900 mb-4">Results</h2>
            <div className="text-lg space-y-2">
              <p>Total Students: {classSize}</p>
              <p>Your Probability Guess: {probabilityGuess}%</p>
              <p className="text-blue-600 font-medium">
                Actual Probability: {calculateProbability(parseInt(classSize)).toFixed(1)}%
              </p>
            </div>

            {/* Matching Pairs */}
            {pairs.length > 0 && (
              <div className="mt-6 bg-blue-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-2">Matching Pairs:</h3>
                <ul className="space-y-1">
                  {pairs.map((pair, index) => (
                    <li key={index} className="text-blue-900">
                      Student {pair[0].id + 1} and Student {pair[1].id + 1} share birthday {pair[0].dateStr}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Fun Fact */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Fun Fact!</h3>
              <div className="bg-amber-50 rounded-lg p-4 border border-amber-200 text-amber-800">
                With 70 people in a room, the probability reaches 99.9%! 
                This is why even in small groups, finding a shared birthday is 
                much more common than most people expect.
              </div>
            </div>
          </div>

          {/* Prize Display */}
          {showPrize && (
            <div className="text-5xl font-extrabold text-center mt-8 text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 animate-bounce">
              🎉 Congratulations! You're a Duck Pond Pro! 🦆
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DuckPond;