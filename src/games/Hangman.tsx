import { useState, type CSSProperties } from 'react';

const MAX_WRONG = 6;
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

interface Question {
  hint: string;
  answer: string;
}

const QUESTIONS: Question[] = [
  { hint: 'Version control system created by Linus Torvalds', answer: 'GIT' },
  { hint: 'Containerization platform with a whale logo', answer: 'DOCKER' },
  { hint: 'Markup language used to structure web pages', answer: 'HTML' },
  { hint: 'Style language used to design web pages', answer: 'CSS' },
  { hint: 'JavaScript library for building user interfaces', answer: 'REACT' },
  { hint: 'Open-source OS kernel started by Linus Torvalds', answer: 'LINUX' },
  { hint: 'Interface that lets programs talk to each other (abbr.)', answer: 'API' },
  { hint: 'Temporary storage that speeds up repeated data access', answer: 'CACHE' },
  { hint: 'Process of finding and fixing errors in code', answer: 'DEBUG' },
  { hint: 'Popular code editor made by Microsoft (abbr.)', answer: 'VSCODE' },
];

interface BugPosition {
  id: string;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  transform?: string;
}

// Bug positions ring the word box like a perimeter instead of a gallows drawing.
const BUG_POSITIONS: BugPosition[] = [
  { id: 'top-left', top: '-14px', left: '-14px' },
  { id: 'top-right', top: '-14px', right: '-14px' },
  { id: 'mid-left', top: '50%', left: '-14px', transform: 'translateY(-50%)' },
  { id: 'mid-right', top: '50%', right: '-14px', transform: 'translateY(-50%)' },
  { id: 'bottom-left', bottom: '-14px', left: '-14px' },
  { id: 'bottom-right', bottom: '-14px', right: '-14px' },
];

type GameStatus = 'playing' | 'won' | 'lost';

interface GameState {
  questionIndex: number;
  guessed: string[];
  wrongCount: number;
  status: GameStatus;
}

function pickQuestionIndex(excludeIndex: number): number {
  if (QUESTIONS.length === 1) return 0;
  let index = excludeIndex;
  while (index === excludeIndex) {
    index = Math.floor(Math.random() * QUESTIONS.length); // NOSONAR - gameplay randomness only
  }
  return index;
}

function initialState(): GameState {
  return { questionIndex: 0, guessed: [], wrongCount: 0, status: 'playing' };
}

export default function Hangman() {
  const [state, setState] = useState<GameState>(initialState());
  const question = QUESTIONS[state.questionIndex];
  const answerLetters = question.answer.split('');

  const guess = (letter: string) => {
    if (state.status !== 'playing' || state.guessed.includes(letter)) return;

    const nextGuessed = [...state.guessed, letter];
    const correct = answerLetters.includes(letter);
    const wrongCount = correct ? state.wrongCount : state.wrongCount + 1;
    const solved = answerLetters.every((ch) => nextGuessed.includes(ch));
    let status: GameStatus = 'playing';
    if (solved) status = 'won';
    else if (wrongCount >= MAX_WRONG) status = 'lost';

    setState({ ...state, guessed: nextGuessed, wrongCount, status });
  };

  const nextWord = () => {
    setState({ ...initialState(), questionIndex: pickQuestionIndex(state.questionIndex) });
  };

  return (
    <div style={{ fontFamily: "'Source Sans Pro', sans-serif" }}>
      <h3 style={{ color: '#57B12D', margin: '0 0 6px 0', fontFamily: "'Montserrat', sans-serif", fontWeight: 700, textTransform: 'uppercase' }}>🐛 IT Hangman</h3>
      <p style={{ color: '#8b949e', fontSize: '12px', margin: '0 0 12px 0' }}>{question.hint}</p>

      <div style={wordBoxStyle}>
        {BUG_POSITIONS.map(({ id, ...pos }, i) => (
          <span
            key={id}
            style={{
              position: 'absolute',
              fontSize: '16px',
              opacity: i < state.wrongCount ? 1 : 0,
              transition: 'opacity 0.2s ease',
              ...pos,
            }}
          >
            🐛
          </span>
        ))}
        <span style={{ letterSpacing: '4px', fontSize: '18px', fontWeight: 700 }}>
          {answerLetters
            .map((ch) => (state.guessed.includes(ch) || state.status === 'lost' ? ch : '_'))
            .join(' ')}
        </span>
      </div>

      <p style={{ color: '#8b949e', fontSize: '12px', margin: '10px 0' }}>
        Bugs closing in: {state.wrongCount}/{MAX_WRONG}
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', maxWidth: 280 }}>
        {ALPHABET.map((letter) => {
          const used = state.guessed.includes(letter);
          const correct = used && answerLetters.includes(letter);
          let style = keyStyle;
          if (used) style = correct ? correctKeyStyle : wrongKeyStyle;
          return (
            <button
              key={letter}
              disabled={used || state.status !== 'playing'}
              onClick={() => guess(letter)}
              style={style}
            >
              {letter}
            </button>
          );
        })}
      </div>

      {state.status === 'won' && (
        <div style={winOverlayStyle}>
          <div style={{ fontSize: '36px' }}>🏆🎉</div>
          <p style={{ margin: '6px 0', fontWeight: 700 }}>You win!</p>
          <button style={btnStyle} onClick={nextWord}>Next word</button>
        </div>
      )}

      {state.status === 'lost' && (
        <div style={loseOverlayStyle}>
          <div style={{ fontSize: '36px' }}>🐛💀</div>
          <p style={{ margin: '6px 0', fontWeight: 700 }}>The bugs got you! Answer: {question.answer}</p>
          <button style={btnStyle} onClick={nextWord}>Try another word</button>
        </div>
      )}
    </div>
  );
}

const wordBoxStyle: CSSProperties = {
  position: 'relative',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '16px 22px',
  background: '#0d1117',
  border: '1px solid #30363d',
  borderRadius: '8px',
};

const keyStyle: CSSProperties = {
  width: 22,
  height: 22,
  fontSize: '10px',
  background: '#21262d',
  color: '#e6edf3',
  border: '1px solid #30363d',
  borderRadius: '4px',
  cursor: 'pointer',
  padding: 0,
};

const correctKeyStyle: CSSProperties = { ...keyStyle, background: '#238636', color: '#ffffff', cursor: 'default' };
const wrongKeyStyle: CSSProperties = { ...keyStyle, background: '#8b1a1a', color: '#ffffff', cursor: 'default' };

const winOverlayStyle: CSSProperties = {
  marginTop: '12px',
  padding: '14px',
  background: 'rgba(87, 177, 45, 0.15)',
  border: '1px solid #57B12D',
  borderRadius: '8px',
  textAlign: 'center',
};

const loseOverlayStyle: CSSProperties = {
  marginTop: '12px',
  padding: '14px',
  background: 'rgba(248, 81, 73, 0.15)',
  border: '1px solid #f85149',
  borderRadius: '8px',
  textAlign: 'center',
};

const btnStyle: CSSProperties = {
  background: '#57B12D',
  color: '#0d1117',
  border: 'none',
  padding: '8px 16px',
  borderRadius: '6px',
  cursor: 'pointer',
  fontWeight: 700,
};
