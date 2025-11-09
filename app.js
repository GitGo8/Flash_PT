// app.js — main logic for the flashcard webapp
const ptEl = document.getElementById('pt');
const enEl = document.getElementById('en');
const progressEl = document.getElementById('progress');
const statusEl = document.getElementById('status');
const countInput = document.getElementById('count');
const intervalInput = document.getElementById('interval');
const startBtn = document.getElementById('start');
const pauseBtn = document.getElementById('pause');
const resumeBtn = document.getElementById('resume');
const shuffleBtn = document.getElementById('shuffle');

let pool = (window.WORDS || []).slice();
let sequence = [];
let currentIndex = 0;
let timer = null;
let remainingMs = 0;
let intervalMs = parseInt(intervalInput.value || '10', 10) * 1000;
let isPaused = false;

function pickSequence(count){
  const c = Math.min(Math.max(1, count), pool.length);
  const copy = pool.slice();
  // Fisher-Yates shuffle then take first c
  for(let i = copy.length -1; i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [copy[i],copy[j]] = [copy[j],copy[i]];
  }
  return copy.slice(0,c);
}

function showCard(idx){
  const item = sequence[idx];
  if(!item) return;
  ptEl.textContent = item.pt;
  enEl.textContent = item.en;
  statusEl.textContent = `${idx+1} / ${sequence.length}`;
  progressEl.max = sequence.length;
  progressEl.value = idx+1;
}

function start(){
  clearTimer();
  sequence = pickSequence(parseInt(countInput.value,10));
  currentIndex = 0;
  intervalMs = parseInt(intervalInput.value,10)*1000;
  isPaused = false;
  showCard(currentIndex);
  scheduleNext();
}

function scheduleNext(){
  clearTimer();
  remainingMs = intervalMs;
  timer = setTimeout(() => {
    currentIndex++;
    if(currentIndex >= sequence.length){
      // finished
      currentIndex = sequence.length - 1;
      // stop
      clearTimer();
      return;
    }
    showCard(currentIndex);
    scheduleNext();
  }, remainingMs);
}

function clearTimer(){
  if(timer){
    clearTimeout(timer);
    timer = null;
  }
}

function pause(){
  if(!timer) return;
  // estimate remaining time by using Date? Simpler: don't do precise remaining, just clear and set flag
  clearTimer();
  isPaused = true;
}

function resume(){
  if(!isPaused) return;
  isPaused = false;
  scheduleNext();
}

function shuffle(){
  // reshuffle remaining (including current)
  const rest = sequence.slice(currentIndex);
  for(let i=rest.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [rest[i],rest[j]]=[rest[j],rest[i]];
  }
  sequence = sequence.slice(0,currentIndex).concat(rest);
}

startBtn.addEventListener('click', start);
pauseBtn.addEventListener('click', pause);
resumeBtn.addEventListener('click', resume);
shuffleBtn.addEventListener('click', ()=>{shuffle(); showCard(currentIndex);});

// keyboard shortcuts: space to pause/resume, s to start
window.addEventListener('keydown', (e)=>{
  if(e.code === 'Space'){
    e.preventDefault();
    if(isPaused) resume(); else pause();
  }
  if(e.key.toLowerCase()==='s') start();
});

// auto-start default small set
start();
