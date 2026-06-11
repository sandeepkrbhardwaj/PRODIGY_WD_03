/**
 * Task-03 — Tic-Tac-Toe  |  script.js
 * Features: PvP, Player vs AI (minimax), scoreboard, win detection
 */

'use strict';

/* ── Constants ── */
const WINS = [
  [0,1,2],[3,4,5],[6,7,8],   // rows
  [0,3,6],[1,4,7],[2,5,8],   // cols
  [0,4,8],[2,4,6]            // diags
];

// Win line coordinates in SVG viewBox (3×3 grid)
// Each cell centre: col+0.5, row+0.5
const WIN_LINES = {
  '012': { x1:.5, y1:.5, x2:2.5, y2:.5  },
  '345': { x1:.5, y1:1.5, x2:2.5, y2:1.5 },
  '678': { x1:.5, y1:2.5, x2:2.5, y2:2.5 },
  '036': { x1:.5, y1:.5, x2:.5,  y2:2.5 },
  '147': { x1:1.5, y1:.5, x2:1.5, y2:2.5 },
  '258': { x1:2.5, y1:.5, x2:2.5, y2:2.5 },
  '048': { x1:.5, y1:.5, x2:2.5, y2:2.5 },
  '246': { x1:2.5, y1:.5, x2:.5,  y2:2.5 },
};
let difficulty = 'hard';

/* ── State ── */
let board      = Array(9).fill(null);
let current    = 'X';
let gameOver   = false;
let mode       = 'pvp';   // 'pvp' | 'ai'
let scores     = { X: 0, O: 0, draws: 0 };

/* ── DOM ── */
const cells         = document.querySelectorAll('.cell');
const boardEl       = document.getElementById('board');
const turnMark      = document.getElementById('turnMark');
const turnText      = document.getElementById('turnText');
const resultOverlay = document.getElementById('resultOverlay');
const resultEmoji   = document.getElementById('resultEmoji');
const resultTitle   = document.getElementById('resultTitle');
const resultSub     = document.getElementById('resultSub');
const nameO         = document.getElementById('nameO');
const numX          = document.getElementById('numX');
const numO          = document.getElementById('numO');
const numDraws      = document.getElementById('numDraws');
const winLineSvg    = document.getElementById('winLineSvg');
const winLineEl     = document.getElementById('winLine');
const scoreX        = document.getElementById('scoreX');
const scoreO        = document.getElementById('scoreO');
const difficultySelect = document.getElementById('difficulty');
difficultySelect.addEventListener('change', () => {
  difficulty = difficultySelect.value;
});
const gamesPlayed = document.getElementById('gamesPlayed');
const xWins = document.getElementById('xWins');
const oWins = document.getElementById('oWins');
const drawCount = document.getElementById('drawCount');



/* ── Mode ── */
function setMode(m) {
  mode = m;
  document.getElementById('modePvP').classList.toggle('active',  m === 'pvp');
  document.getElementById('modePvAI').classList.toggle('active', m === 'ai');
  nameO.textContent = m === 'ai' ? 'AI Bot' : 'Player O';
  fullReset();
}

/* ── Handle Click ── */
function handleClick(idx) {
  if (gameOver || board[idx]) return;
  if (mode === 'ai' && current === 'O') return; // AI's turn

  placeMove(idx, current);

  const result = checkResult();
  if (result) { endGame(result); return; }

  switchTurn();

  if (mode === 'ai' && current === 'O' && !gameOver) {
    boardEl.classList.add('ai-thinking');
    setTimeout(aiMove, 450);
  }
  const difficulty =
document.getElementById('difficulty').value;
}

function placeMove(idx, player) {
  board[idx] = player;
  const cell = cells[idx];
  cell.classList.add('taken', player.toLowerCase());
  cell.innerHTML = `<span class="mark-inner">${player}</span>`;
}

function switchTurn() {
  current = current === 'X' ? 'O' : 'X';
  updateTurnUI();
}

function updateTurnUI() {

  const turnX = document.getElementById('turnX');
  const turnO = document.getElementById('turnO');

  if(current === 'X'){

    turnX.classList.add('x-active');
    turnO.classList.remove('o-active');

    turnText.textContent = 'Player X';

  }else{

    turnO.classList.add('o-active');
    turnX.classList.remove('x-active');

    turnText.textContent =
      mode === 'ai'
      ? 'AI Bot'
      : 'Player O';
  }

  scoreX.classList.toggle(
    'active-turn',
    current === 'X'
  );

  scoreO.classList.toggle(
    'active-turn',
    current === 'O'
  );
}

/* ── Result check ── */
function checkResult() {
  for (const combo of WINS) {
    const [a, b, c] = combo;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], combo };
    }
  }
  if (board.every(Boolean)) return { winner: null, combo: null }; // draw
  return null;
}

function endGame({ winner, combo }) {
  gameOver = true;
  boardEl.classList.remove('ai-thinking');

  if (winner) {
    scores[winner]++;
    updateScores();

    // Highlight winning cells
    combo.forEach(i => cells[i].classList.add('win-cell', winner.toLowerCase()));

    // Draw win line
    const key = combo.join('');
    const coords = WIN_LINES[key];
    if (coords) {
      winLineEl.setAttribute('x1', coords.x1);
      winLineEl.setAttribute('y1', coords.y1);
      winLineEl.setAttribute('x2', coords.x2);
      winLineEl.setAttribute('y2', coords.y2);
      winLineSvg.style.display = 'block';
    }

    // Result overlay
    const name = winner === 'X'
      ? 'Player X'
      : (mode === 'ai' ? 'AI Bot' : 'Player O');

    setTimeout(() => showResult(
      winner === 'X' ? '🎉' : (mode === 'ai' ? '🤖' : '🎉'),
      `${name} Wins!`,
      winner === 'X' ? 'Well played!' : (mode === 'ai' ? 'Better luck next time!' : 'Brilliant!')
    ), 700);

  } else {
    scores.draws++;
    updateScores();
    setTimeout(() => showResult('🤝', "It's a Draw!", 'Great game, both sides!'), 400);
  }
}

function showResult(emoji, title, sub) {
  resultEmoji.textContent = emoji;
  resultTitle.textContent = title;
  resultSub.textContent   = sub;
  resultOverlay.classList.add('show');
}

function updateScores() {

  numX.textContent = scores.X;
  numO.textContent = scores.O;
  numDraws.textContent = scores.draws;

  xWins.textContent = scores.X;
  oWins.textContent = scores.O;
  drawCount.textContent = scores.draws;

  gamesPlayed.textContent =
    scores.X + scores.O + scores.draws;
}

/* ── AI (Minimax) ── */
function aiMove() {

  boardEl.classList.remove('ai-thinking');

  if(difficulty === 'easy'){

      const empty =
      board
      .map((v,i)=>v?null:i)
      .filter(v=>v!==null);

      const move =
      empty[Math.floor(Math.random()*empty.length)];

      placeMove(move,'O');
  }

  else if(difficulty === 'medium'){

      if(Math.random() < 0.5){

          const empty =
          board
          .map((v,i)=>v?null:i)
          .filter(v=>v!==null);

          const move =
          empty[Math.floor(Math.random()*empty.length)];

          placeMove(move,'O');

      }else{

          const best = minimax(board,'O',0);
          placeMove(best.index,'O');
      }
  }

  else{

      const best = minimax(board,'O',0);
      placeMove(best.index,'O');
  }

  const result = checkResult();

  if(result){
      endGame(result);
      return;
  }

  switchTurn();
}

function minimax(state, player, depth) {
  const result = checkResult();
  if (result) {
    if (result.winner === 'O')  return { score:  10 - depth };
    if (result.winner === 'X')  return { score: -10 + depth };
    if (result.winner === null) return { score: 0 };
  }

  const moves = [];
  state.forEach((cell, i) => {
    if (cell) return;
    const newState = [...state];
    newState[i] = player;

    // Temporarily update board for recursion
    const saved = board[i];
    board[i] = player;
    const score = minimax(newState, player === 'O' ? 'X' : 'O', depth + 1).score;
    board[i] = saved;

    moves.push({ index: i, score });
  });

  if (player === 'O') {
    return moves.reduce((best, m) => m.score > best.score ? m : best, { score: -Infinity });
  } else {
    return moves.reduce((best, m) => m.score < best.score ? m : best, { score: +Infinity });
  }
}

/* ── New Game (keep scores) ── */
function newGame() {
  board    = Array(9).fill(null);
  current  = 'X';
  gameOver = false;

  cells.forEach(cell => {
    cell.className = 'cell';
    cell.innerHTML = '';
  });

  winLineSvg.style.display = 'none';
  resultOverlay.classList.remove('show');
  updateTurnUI();
}

/* ── Full Reset (clear scores too) ── */
function fullReset() {
  scores = { X: 0, O: 0, draws: 0 };
  updateScores();
  newGame();
}

/* ── Keyboard shortcuts ── */
document.addEventListener('keydown', e => {
  if (e.code === 'KeyN') newGame();
  if (e.code === 'Escape') resultOverlay.classList.remove('show');
});


