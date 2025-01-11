import React, { useState, useEffect } from 'react';

// Base styles object
const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '24px',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: 'rgb(30, 58, 138)',
    textAlign: 'center',
    marginBottom: '24px',
  },
  questionBox: {
    backgroundColor: 'rgb(239, 246, 255)',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '16px',
  },
  input: {
    width: '200px',
    padding: '8px 12px',
    fontSize: '16px',
    border: '1px solid rgb(209, 213, 219)',
    borderRadius: '6px',
    marginRight: '12px',
    outline: 'none',
  },
  button: {
    backgroundColor: 'rgb(37, 99, 235)',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '6px',
    border: 'none',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  buttonHover: {
    backgroundColor: 'rgb(29, 78, 216)',
  },
  flexContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginTop: '12px',
  },
  monospaceText: {
    fontFamily: 'ui-monospace, monospace',
    fontSize: '18px',
  },
  cursor: {
    display: 'inline-block',
    width: '2px',
    height: '1em',
    backgroundColor: 'currentColor',
    marginLeft: '2px',
    animation: 'blink 1s step-start infinite',
  },
  pondContainer: {
    marginTop: '24px',
    backgroundColor: 'rgb(236, 254, 255)',
    borderRadius: '12px',
    padding: '24px',
    border: '2px solid rgb(37, 99, 235)',
  },
  resultsCard: {
    backgroundColor: 'white',
    borderRadius: '8px',
    border: '1px solid rgb(209, 213, 219)',
    padding: '20px',
    marginTop: '24px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  },
  expandable: {
    backgroundColor: 'white',
    borderRadius: '8px',
    border: '1px solid rgb(209, 213, 219)',
    marginTop: '16px',
  },
  expandableHeader: {
    width: '100%',
    padding: '16px',
    textAlign: 'left',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  expandableContent: {
    padding: '0 16px 16px',
  },
  mathBox: {
    backgroundColor: 'rgb(239, 246, 255)',
    borderRadius: '6px',
    padding: '16px',
    marginTop: '12px',
  },
  matchingPairs: {
    backgroundColor: 'rgb(239, 246, 255)',
    borderRadius: '6px',
    padding: '16px',
    marginTop: '16px',
  },
};

// TypeWriter component
const TypewriterText = ({ text }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(c => c + 1);
      }, 30);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, text]);

  return (
    <div style={styles.monospaceText}>
      {displayedText}
      <span style={styles.cursor}>▋</span>
    </div>
  );
};

// Expandable component
const Expandable = ({ title, children, isOpen, onToggle }) => {
  return (
    <div style={styles.expandable}>
      <button 
        style={styles.expandableHeader}
        onClick={onToggle}
      >
        <span style={{ fontWeight: '500', fontSize: '16px' }}>{title}</span>
        <span style={{ 
          transform: isOpen ? 'rotate(180deg)' : 'rotate(0)',
          transition: 'transform 0.2s',
        }}>▼</span>
      </button>
      {isOpen && (
        <div style={styles.expandableContent}>
          {children}
        </div>
      )}
    </div>
  );
};

// Duck Shape Component
const DuckShape = ({ x, y, color, birthday, isPaired, rotation }) => (
  <g transform={`translate(${x},${y}) rotate(${rotation})`}>
    <ellipse
      cx="0"
      cy="0"
      rx="15"
      ry="12"
      fill={color || '#ffd700'}
      stroke={isPaired ? '#ff6b6b' : '#000'}
      strokeWidth={isPaired ? 3 : 1}
    />
    <circle
      cx="10"
      cy="-5"
      r="8"
      fill={color || '#ffd700'}
      stroke={isPaired ? '#ff6b6b' : '#000'}
      strokeWidth={isPaired ? 3 : 1}
    />
    <path
      d="M16,-7 L24,-5 L16,-3"
      fill="#ff9800"
      stroke="#000"
      strokeWidth="1"
    />
    <circle cx="12" cy="-7" r="1.5" fill="#000" />
    <text
      x="0"
      y="-20"
      textAnchor="middle"
      fontSize="12"
      fill="#1f2937"
      transform={`rotate(${-rotation})`}
      style={{ fontWeight: 500 }}
    >
      {birthday}
    </text>
  </g>
);

// Helper Functions
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
  
  const baseAngle = (index / total) * 2 * Math.PI;
  const angle = baseAngle + (angleOffset || 0);
  return {
    x: centerX + radiusX * Math.cos(angle),
    y: centerY + radiusY * Math.sin(angle),
    rotation: (angle * 180 / Math.PI) + 90
  };
};

// Main Component
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
  const [isExplanationOpen, setIsExplanationOpen] = useState(false);

  const questions = [
    "What are the chances of two students in your class having the same birthday?... First we need to know how many students your class has? 🎓",
    "Before we calculate, what do you think is the probability (%) that two students share a birthday? 🤔"
  ];

  // Probability calculation
  const calculateProbability = (n) => {
    let prob = 1;
    for (let i = 0; i < n; i++) {
      prob *= (365 - i) / 365;
    }
    return (1 - prob) * 100;
  };

  // Generate random birthdays and set up ducks
  const generateDucks = (size) => {
    const numericSize = parseInt(size);
    const birthdays = Array.from({ length: numericSize }, () => 
      Math.floor(Math.random() * 365) + 1
    );
    
    const duckData = birthdays.map((birthday, index) => ({
      id: index,
      birthday,
      dateStr: new Date(2024, 0, birthday)
        .toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      color: `hsl(${Math.random() * 60 + 30}, 70%, ${Math.random() * 20 + 70}%)`,
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

  // Animation effect
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
    <div style={styles.container}>
      <h1 style={styles.title}>Duck Pond Birthday Paradox 'Pair of Ducks'</h1>

      {/* Questions Section */}
      {questions.map((question, index) => (
        stage >= index && (
          <div key={index} style={styles.questionBox}>
            <TypewriterText text={question} />
            {stage === index && (
              <div style={styles.flexContainer}>
                <input
                  type="number"
                  value={index === 0 ? classSize : probabilityGuess}
                  onChange={(e) => {
                    if (index === 0) setClassSize(e.target.value);
                    else setProbabilityGuess(e.target.value);
                  }}
                  placeholder={index === 0 ? "Enter total students #..." : "Enter your guess (0-100)..."}
                  style={styles.input}
                />
                <button
                  style={styles.button}
                  onMouseOver={e => Object.assign(e.target.style, styles.buttonHover)}
                  onMouseOut={e => e.target.style.backgroundColor = styles.button.backgroundColor}
                  onClick={() => {
                    if (index === 0) {
                      setStage(1);
                    } else {
                      generateDucks(classSize);
                      setShowResults(true);
                      setStage(2);
                    }
                  }}
                >
                  {index === 0 ? 'Next' : "Let's Find Out!"}
                </button>
              </div>
            )}
          </div>
        )
      ))}

      {/* Visualization and Results */}
      {showResults && (
        <>
          <div style={styles.pondContainer}>
            <svg width={width} height={height} style={{ display: 'block', margin: '0 auto' }}>
              {/* Water Pattern */}
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
                  stroke="#ff6b6b"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                  opacity="0.3"
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
            </svg>
          </div>

          {/* Results Card */}
          <div style={styles.resultsCard}>
            <h2 style={{...styles.title, marginTop: 0}}>Results</h2>
            <div style={{fontSize: '18px', marginBottom: '16px'}}>
              <p style={{marginBottom: '8px'}}>
                Total Students: {classSize}
              </p>
              <p style={{marginBottom: '8px'}}>
                Your Probability Guess: {probabilityGuess}%
              </p>
              <p style={{color: 'rgb(37, 99, 235)', fontWeight: '500'}}>
                Actual Probability: {calculateProbability(parseInt(classSize)).toFixed(1)}%
              </p>
            </div>

            {/* Matching Pairs */}
            {pairs.length > 0 && (
              <div style={styles.matchingPairs}>
                <h3 style={{fontSize: '16px', fontWeight: '600', marginBottom: '8px'}}>
                  Matching Pairs:
                </h3>
                <ul style={{listStyle: 'none', margin: 0, padding: 0}}>
                  {pairs.map((pair, index) => (
                    <li key={index} style={{color: 'rgb(30, 58, 138)', marginBottom: '4px'}}>
                      Student {pair[0].id + 1} and Student {pair[1].id + 1} share birthday {pair[0].dateStr}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Math Explanation */}
            <Expandable 
              title="Learn More About the Math Behind the Paradox"
              isOpen={isExplanationOpen}
              onToggle={() => setIsExplanationOpen(!isExplanationOpen)}
            >
              <div style={{fontSize: '16px', lineHeight: '1.6'}}>
                <p style={{marginBottom: '16px'}}>
                  In a group of {classSize} people, what's the probability that at least two share the same birthday?
                  Let's break down why this is so surprising!
                </p>

                <div style={styles.mathBox}>
                  <h4 style={{fontSize: '16px', fontWeight: '600', marginBottom: '12px', color: 'rgb(30, 58, 138)'}}>
                    1. Counting pairs instead of individuals
                  </h4>
                  <ul style={{paddingLeft: '20px', marginBottom: '12px'}}>
                    <li>
                      In your group of {classSize} students, there are{' '}
                      <span style={{fontWeight: '500'}}>
                        {(parseInt(classSize) * (parseInt(classSize) - 1) / 2)}
                      </span> possible pairs
                    </li>
                    <li>We calculate this using the formula: n(n-1)/2</li>
                    <li>Each of these pairs is a chance for a birthday match!</li>
                  </ul>
                </div>

                <div style={styles.mathBox}>
                  <h4 style={{fontSize: '16px', fontWeight: '600', marginBottom: '12px', color: 'rgb(30, 58, 138)'}}>
                    2. The Math Behind It
                  </h4>
                  <ul style={{paddingLeft: '20px', marginBottom: '12px'}}>
                    <li>First person can have any birthday: 365/365</li>
                    <li>Second person must pick a different day: 364/365</li>
                    <li>Third person has 363/365 choices</li>
                    <li>This continues until we've placed all {classSize} people</li>
                    <li>
                      The formula becomes:
                      <br />
                      <span style={{
                        fontFamily: 'monospace',
                        backgroundColor: 'white',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        display: 'inline-block',
                        marginTop: '4px'
                      }}>
                        1 - (365/365 × 364/365 × ... × {365-parseInt(classSize)+1}/365)
                      </span>
                    </li>
                  </ul>
                </div>

                <div style={{
                  backgroundColor: 'rgb(254, 249, 195)',
                  borderRadius: '6px',
                  padding: '16px',
                  marginTop: '16px',
                  border: '1px solid rgb(234, 179, 8)'
                }}>
                  <h4 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    marginBottom: '8px',
                    color: 'rgb(161, 98, 7)'
                  }}>
                    Fun Fact!
                  </h4>
                  <p>
                    With 70 people in a room, the probability reaches 99.9%! 
                    This is why even in small groups, finding a shared birthday is 
                    much more common than most people expect.
                  </p>
                </div>
              </div>
            </Expandable>
          </div>
        </>
      )}
    </div>
  );
};

export default DuckPond;