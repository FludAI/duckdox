import React, { useState, useEffect } from 'react';

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
  heartText: {
    fontSize: '24px',
    fontWeight: 'bold',
    textAnchor: 'middle',
    dominantBaseline: 'middle',
    fill: '#ff6b6b',
    filter: 'drop-shadow(2px 2px 2px rgba(0,0,0,0.3))',
  },
  prizeText: {
    fontSize: '48px',
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#ffd700',
    textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
    animation: 'bounce 1s infinite',
  },
  duckGif: {
    width: '150px',
    height: '150px',
    marginBottom: '20px',
    display: 'block',
    margin: '0 auto',
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
  // New result text styles
  resultText: {
    fontSize: '32px',
    fontWeight: 'bold',
    textAnchor: 'middle',
    dominantBaseline: 'middle',
    filter: 'drop-shadow(2px 2px 2px rgba(0,0,0,0.3))',
  },
  guessText: {
    fontSize: '32px',
    fontWeight: 'bold',
    textAnchor: 'middle',
    dominantBaseline: 'middle',
    filter: 'drop-shadow(2px 2px 2px rgba(0,0,0,0.3))',
    fill: '#ff6b6b',
  },
  actualText: {
    fontSize: '32px',
    fontWeight: 'bold',
    textAnchor: 'middle',
    dominantBaseline: 'middle',
    filter: 'drop-shadow(2px 2px 2px rgba(0,0,0,0.3))',
    fill: '#4CAF50',
  },
  differenceText: {
    fontSize: '32px',
    fontWeight: 'bold',
    textAnchor: 'middle',
    dominantBaseline: 'middle',
    filter: 'drop-shadow(2px 2px 2px rgba(0,0,0,0.3))',
    fill: '#9C27B0',
  },
};

// TypeWriter component with clue
const TypewriterText = ({ text, clueText }) => {
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
      <div style={styles.monospaceText}>
        {displayedText}
        <span style={styles.cursor}>▋</span>
      </div>
      {showClue && (
        <div style={{ marginTop: '12px', color: '#6366f1', fontStyle: 'italic'             }}>
            {classSize}
          </div>
        )}

        {/* Center duck image with hint */}
        <div style={{position: 'relative'}}>
          <img 
            src="/images/duck-bros.gif" 
            alt="Duck Bros - MJ (23) and 50 Cent" 
            style={styles.duckGif}
          />
          <div style={{
            position: 'absolute',
            bottom: '-25px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '300px',
            textAlign: 'center',
            fontSize: '14px',
            color: '#6366f1',
            fontStyle: 'italic'
          }}>
            Hint: Jordan's #23 means 50.7% probability!
            The $0.50 is a nod to 50 Cent 😉
          </div>
        </div>

        {/* Right number */}
        {probabilityGuess && (
          <div style={{
            fontSize: '150px',
            fontWeight: 'bold',
            color: 'rgb(239, 68, 68)',
            lineHeight: '150px',
            width: '200px',
            textAlign: 'center',
            fontFamily: 'system-ui'
          }}>
            {probabilityGuess}%
          </div>
        )}
      </div>

      {questions.map((question, index) => (
        stage >= index && (
          <div key={index} style={styles.questionBox}>
            <TypewriterText 
              text={question} 
              clueText="Look at the ducks above - they might have a clue!"
            />
            {stage === index && (
              <form 
                style={styles.flexContainer}
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
                    style={styles.input}
                    min="0"
                    max="1000"
                    aria-label="Number of students in class"
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
                    style={styles.input}
                    aria-label="Probability guess percentage"
                  />
                )}
                <button
                  type="submit"
                  style={styles.button}
                  onMouseOver={(e) => Object.assign(e.target.style, styles.buttonHover)}
                  onMouseOut={(e) => e.target.style.backgroundColor = styles.button.backgroundColor}
                >
                  {index === 0 ? 'Next' : "Let's Find Out!"}
                </button>
              </form>
            )}
          </div>
        )
      ))}

      {showResults && (
        <div>
          <div style={styles.pondContainer}>
            <svg width={width} height={height} style={{ display: 'block', margin: '0 auto' }}>
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

              {/* Animated Guess Display */}
              {showGuessAnimation && (
                <g transform={`translate(${centerX},${centerY})`}>
                  <text style={styles.guessText} y="-40">
                    Your Guess: {probabilityGuess}%
                  </text>
                  <text style={styles.actualText} y="0">
                    Actual: {calculateProbability(parseInt(classSize))}%
                  </text>
                  <text style={styles.differenceText} y="40">
                    Difference: {calculateDifference()}%
                  </text>
                </g>
              )}

              {/* Prize Animation */}
              {showPrize && (
                <g transform={`translate(${centerX},${centerY})`}>
                  <text style={{...styles.heartText, fill: '#ffd700'}} y="0">
                    🏆 PERFECT GUESS! 🦆
                  </text>
                </g>
              )}
            </svg>
          </div>

          {/* Prize Display */}
          {showPrize && (
            <div style={styles.prizeText}>
              🎉 Congratulations! You're a Duck Pond Pro! 🦆
            </div>
          )}

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
                Actual Probability: {calculateProbability(parseInt(classSize))}%
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

            <div style={{marginTop: '16px'}}>
              <h3 style={{fontSize: '16px', fontWeight: '600', marginBottom: '8px', color: 'rgb(30, 58, 138)'}}>
                Fun Fact!
              </h3>
              <div style={{
                backgroundColor: 'rgb(254, 249, 195)',
                borderRadius: '6px',
                padding: '16px',
                border: '1px solid rgb(234, 179, 8)',
                color: 'rgb(161, 98, 7)'
              }}>
                With 70 people in a room, the probability reaches 99.9%! 
                This is why even in small groups, finding a shared birthday is 
                much more common than most people expect.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DuckPond;
