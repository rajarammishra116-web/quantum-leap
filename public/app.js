console.log('Quantum Leap loaded');

// --- Navigation Logic ---
function nav(pageId, btnElement) {
  // 1. Hide all pages
  document.querySelectorAll('.page').forEach(page => {
    page.classList.remove('active');
  });

  // 2. Show target page
  const target = document.getElementById(pageId);
  if (target) target.classList.add('active');

  // 3. Update Nav Button Styles
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  
  // Highlight the clicked button
  if (btnElement && btnElement.classList.contains('nav-btn')) {
    btnElement.classList.add('active');
  } else {
    const matchingBtn = document.querySelector(`.nav-btn[onclick*="'${pageId}'"]`);
    if (matchingBtn) matchingBtn.classList.add('active');
  }

  // Close mobile menu if open
  document.querySelector('.site-nav').classList.remove('open');
  
  // Scroll to top
  window.scrollTo(0, 0);
}

function toggleMobileMenu() {
  document.querySelector('.site-nav').classList.toggle('open');
}

// --- Admin / Content Logic ---
function toggleAdmin(sectionId, btn) {
  const panel = document.getElementById(`admin-${sectionId}`);
  if (panel) {
    const isActive = panel.classList.contains('active');
    isActive ? panel.classList.remove('active') : panel.classList.add('active');
    btn.innerText = isActive ? '+ Add Content' : 'Close Admin';
  }
}

// --- Mock Database (LocalStorage) ---
function addContent(classLevel) {
  const subject = document.getElementById(`subject-class${classLevel}`).value;
  const title = document.getElementById(`chapter-title-class${classLevel}`).value;
  const content = document.getElementById(`content-class${classLevel}`).value;

  if (!subject || !title) return alert("Please fill in Subject and Title");

  const note = { id: Date.now(), subject, title, content };
  
  // Save to LocalStorage
  const existing = JSON.parse(localStorage.getItem(`notes-${classLevel}`) || '[]');
  existing.push(note);
  localStorage.setItem(`notes-${classLevel}`, JSON.stringify(existing));

  alert('Note saved locally!');
  renderNotes(classLevel);
  
  // Clear inputs
  document.getElementById(`subject-class${classLevel}`).value = '';
  document.getElementById(`chapter-title-class${classLevel}`).value = '';
  document.getElementById(`content-class${classLevel}`).value = '';
}

function renderNotes(classLevel) {
  const container = document.getElementById(`view-class${classLevel}`);
  if (!container) return;

  const notes = JSON.parse(localStorage.getItem(`notes-${classLevel}`) || '[]');
  
  if (notes.length === 0) {
    container.innerHTML = '<p style="color:var(--muted)">No notes added yet.</p>';
    return;
  }

  // Adds "neon-card" class to dynamic notes for the glow effect
  container.innerHTML = notes.map(n => `
    <div class="card neon-card">
      <div style="color:var(--primary); font-size:0.8rem; text-transform:uppercase; letter-spacing:1px; margin-bottom:4px;">
        ${n.subject}
      </div>
      <h3 style="margin:5px 0">${n.title}</h3>
      <p class="small" style="color:var(--muted); margin-top:8px;">${n.content}</p>
    </div>
  `).join('');
}

// Initialize Views on Load
document.addEventListener('DOMContentLoaded', () => {
  renderNotes('9');
  renderNotes('10');
});

// --- Mock Test System ---
const mockQuestions = [
  { q: "What is the SI unit of Force?", options: ["Joule", "Newton", "Watt", "Pascal"], correct: "B" },
  { q: "Which gas is most abundant in Earth's atmosphere?", options: ["Oxygen", "Nitrogen", "Argon", "CO2"], correct: "B" },
  { q: "The value of 'g' on Earth's surface is approximately:", options: ["9.8 m/s²", "8.9 m/s²", "10.2 m/s²", "6.67 m/s²"], correct: "A" }
];

let currentTest = [];
let currentIndex = 0;
let score = 0;

function startTest(classLevel) {
  document.getElementById('test-select').style.display = 'none';
  const ui = document.getElementById('test-ui');
  ui.style.display = 'block';
  ui.setAttribute('aria-hidden', 'false');

  currentTest = mockQuestions; 
  currentIndex = 0;
  score = 0;
  showQuestion();
}

function showQuestion() {
  if (currentIndex >= currentTest.length) {
    finishTest();
    return;
  }

  const q = currentTest[currentIndex];
  document.getElementById('q-display-num').innerText = `Question ${currentIndex + 1}`;
  document.getElementById('q-display-text').innerText = q.q;

  const optsContainer = document.getElementById('options-container');
  optsContainer.innerHTML = '';

  q.options.forEach((opt, idx) => {
    const letter = String.fromCharCode(65 + idx); // A, B, C, D
    optsContainer.innerHTML += `
      <div class="option-item" onclick="checkAnswer(this, '${letter}', '${q.correct}')">
        <strong>${letter}.</strong> ${opt}
      </div>
    `;
  });
}

function checkAnswer(el, selected, correct) {
  if (el.parentElement.querySelector('.correct') || el.parentElement.querySelector('.incorrect')) return;

  if (selected === correct) {
    el.classList.add('correct');
    score++;
  } else {
    el.classList.add('incorrect');
    const siblings = el.parentElement.children;
    const correctIndex = correct.charCodeAt(0) - 65;
    siblings[correctIndex].classList.add('correct');
  }
}

function nextQuestion() {
  currentIndex++;
  showQuestion();
}

function finishTest() {
  const ui = document.getElementById('test-ui');
  ui.innerHTML = `
    <div class="card neon-card" style="text-align:center; padding: 40px;">
      <h3 style="margin-bottom:10px;">Test Complete!</h3>
      <h1 style="font-size:3rem; color:var(--primary); margin:0;">${score} / ${currentTest.length}</h1>
      <p style="color:var(--muted); margin-bottom:20px;">Score</p>
      <button class="btn" onclick="location.reload()">Return Home</button>
    </div>
  `;
}

function cancelTest() {
  location.reload();
}