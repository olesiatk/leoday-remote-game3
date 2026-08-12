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
  { hint: 'High-level programming language named after a British comedy group', answer: 'PYTHON' },
  { hint: 'Object-oriented language known for "write once, run anywhere"', answer: 'JAVA' },
  { hint: 'Programming language that powers the Rails framework', answer: 'RUBY' },
  { hint: "Apple's modern programming language for iOS development", answer: 'SWIFT' },
  { hint: 'JetBrains language now preferred for Android development', answer: 'KOTLIN' },
  { hint: 'Server-side scripting language for web development (abbr.)', answer: 'PHP' },
  { hint: 'Language used to query relational databases (abbr.)', answer: 'SQL' },
  { hint: 'Lightweight data-interchange format (abbr.)', answer: 'JSON' },
  { hint: 'Markup language that predates wide JSON adoption (abbr.)', answer: 'XML' },
  { hint: 'Human-readable format often used for config files', answer: 'YAML' },
  { hint: "JavaScript runtime built on Chrome's V8 engine", answer: 'NODE' },
  { hint: 'Default package manager for Node.js (abbr.)', answer: 'NPM' },
  { hint: 'Progressive JavaScript framework for building UIs', answer: 'VUE' },
  { hint: "Google's TypeScript-based web framework", answer: 'ANGULAR' },
  { hint: 'Popular JavaScript module bundler', answer: 'WEBPACK' },
  { hint: 'JavaScript compiler that transpiles modern syntax', answer: 'BABEL' },
  { hint: 'Predictable state container for JavaScript apps', answer: 'REDUX' },
  { hint: 'Query language for APIs developed by Facebook', answer: 'GRAPHQL' },
  { hint: 'Architectural style for designing web APIs (abbr.)', answer: 'REST' },
  { hint: 'Computing resources delivered over the internet', answer: 'CLOUD' },
  { hint: "Amazon's cloud computing platform (abbr.)", answer: 'AWS' },
  { hint: "Microsoft's cloud computing platform", answer: 'AZURE' },
  { hint: 'Popular open-source automation server', answer: 'JENKINS' },
  { hint: 'Web-based hosting service for Git repositories', answer: 'GITHUB' },
  { hint: 'DevOps platform with built-in CI/CD pipelines', answer: 'GITLAB' },
  { hint: 'Infrastructure as code tool made by HashiCorp', answer: 'TERRAFORM' },
  { hint: 'Agentless automation and configuration management tool', answer: 'ANSIBLE' },
  { hint: 'High-performance web server and reverse proxy', answer: 'NGINX' },
  { hint: 'Widely used open-source web server software', answer: 'APACHE' },
  { hint: 'Popular Linux distribution sponsored by Canonical', answer: 'UBUNTU' },
  { hint: 'Core part of an operating system', answer: 'KERNEL' },
  { hint: 'Command-line interpreter for interacting with an OS', answer: 'SHELL' },
  { hint: 'Common Unix shell and command language (abbr.)', answer: 'BASH' },
  { hint: 'Pattern used to match text (abbr. for regular expression)', answer: 'REGEX' },
  { hint: 'Ordered collection of elements stored under one variable', answer: 'ARRAY' },
  { hint: 'LIFO data structure for storing elements', answer: 'STACK' },
  { hint: 'FIFO data structure for storing elements', answer: 'QUEUE' },
  { hint: 'Piece of data used for authentication, e.g. a JWT', answer: 'TOKEN' },
  { hint: 'Open standard for delegating access without sharing passwords', answer: 'OAUTH' },
  { hint: 'Server that acts as an intermediary for requests', answer: 'PROXY' },
  { hint: 'Document Object Model (abbr.)', answer: 'DOM' },
  { hint: 'CSS preprocessor with nested syntax and variables', answer: 'SASS' },
  { hint: 'CSS preprocessor language influenced by Sass', answer: 'LESS' },
  { hint: 'CSS layout model for one-dimensional layouts', answer: 'FLEXBOX' },
  { hint: 'CSS layout system for two-dimensional layouts', answer: 'GRID' },
  { hint: 'Meta tag controlling how a page renders on mobile', answer: 'VIEWPORT' },
  { hint: 'Design approach that adapts a layout to screen size', answer: 'RESPONSIVE' },
  { hint: 'Software used to access and render web pages', answer: 'BROWSER' },
  { hint: 'HTML element for drawing graphics via JavaScript', answer: 'CANVAS' },
  { hint: 'Vector image format for the web (abbr.)', answer: 'SVG' },
  { hint: 'Small piece of data stored by the browser', answer: 'COOKIE' },
  { hint: 'Browser API for persisting key-value data client-side', answer: 'STORAGE' },
  { hint: 'Modern JavaScript API for making HTTP requests', answer: 'FETCH' },
  { hint: 'Technique for updating a page without a full reload (abbr.)', answer: 'AJAX' },
  { hint: 'JS object representing the eventual completion of an async task', answer: 'PROMISE' },
  { hint: 'Function that remembers its lexical scope', answer: 'CLOSURE' },
  { hint: 'React feature like useState or useEffect', answer: 'HOOK' },
  { hint: 'Data passed from parent to child component in React', answer: 'PROPS' },
  { hint: 'Reusable building block of a UI', answer: 'COMPONENT' },
  { hint: 'Library that manages navigation in a single-page app', answer: 'ROUTER' },
  { hint: 'Output file combining multiple modules for the browser', answer: 'BUNDLE' },
  { hint: 'Process of shrinking code by removing whitespace', answer: 'MINIFY' },
  { hint: 'Describes HTML tags that convey meaning, like <header>', answer: 'SEMANTIC' },
  { hint: 'CSS property for smoothly animating changes', answer: 'TRANSITION' },
  { hint: 'CSS pattern used to target elements', answer: 'SELECTOR' },
  { hint: 'Combined image file used to reduce HTTP requests', answer: 'SPRITE' },
  { hint: 'Small icon shown in a browser tab', answer: 'FAVICON' },
  { hint: 'HTML element for embedding another page', answer: 'IFRAME' },
  { hint: 'Common UI component for site navigation', answer: 'NAVBAR' },
  { hint: 'Protocol for full-duplex communication over a single connection', answer: 'WEBSOCKET' },
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

export default function Bagggiz() {
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
    <div style={{ maxWidth: '100%', boxSizing: 'border-box', fontFamily: "'Source Sans Pro', sans-serif" }}>
      <h3 style={{ color: '#57B12D', margin: '0 0 6px 0', fontFamily: "'Montserrat', sans-serif", fontWeight: 700, textTransform: 'uppercase' }}>🐞 IT Bagggiz</h3>
      <p style={{ color: '#8b949e', fontSize: '12px', margin: '0 0 12px 0' }}>{question.hint}</p>

      <div style={wordBoxStyle}>
        <span style={{ letterSpacing: '2px', fontSize: '16px', fontWeight: 700, color: "white" }}>
          {answerLetters
            .map((ch) => (state.guessed.includes(ch) || state.status === 'lost' ? ch : '_'))
            .join(' ')}
        </span>
      </div>

      <div style={bugRowStyle}>
        {Array.from({ length: MAX_WRONG }).map((_, i) => {
          const active = i < state.wrongCount;
          return (
            <div key={i} style={active ? bugCellActiveStyle : bugCellStyle}>
              {active && <span style={{ fontSize: '14px' }}>🐞</span>}
            </div>
          );
        })}
      </div>

      <p style={{ color: '#8b949e', fontSize: '12px', margin: '10px 0' }}>
        Bugs closing in: {state.wrongCount}/{MAX_WRONG}
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', maxWidth: '100%' }}>
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
          <div style={{ fontSize: '36px' }}>🐞💀</div>
          <p style={{ margin: '6px 0', fontWeight: 700 }}>The bugs got you! Answer: {question.answer}</p>
          <button style={btnStyle} onClick={nextWord}>Try another word</button>
        </div>
      )}
    </div>
  );
}

const wordBoxStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  maxWidth: '100%',
  boxSizing: 'border-box',
  overflowX: 'auto',
  padding: '12px 10px',
  background: '#0d1117',
  border: '1px solid #30363d',
  borderRadius: '8px',
};

const bugRowStyle: CSSProperties = {
  display: 'flex',
  gap: '6px',
  marginTop: '8px',
};

const bugCellStyle: CSSProperties = {
  width: 26,
  height: 26,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#0d1117',
  border: '1px solid #30363d',
  borderRadius: '4px',
  transition: 'border-color 0.2s ease',
};

const bugCellActiveStyle: CSSProperties = {
  ...bugCellStyle,
  border: '1px solid #f85149',
  boxShadow: '0 0 0 1px rgba(248, 81, 73, 0.5)',
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
