/* public/app.js - v2.0 Structured Hierarchy */

console.log('Quantum Leap v2.0 loaded');

// --- 1. Navigation & UI ---
document.addEventListener('DOMContentLoaded', () => {
  seedInitialData();
  
  // Check URL hash to load correct page
  const hash = window.location.hash.substring(1);
  nav(hash || 'home', null, false);
});

// Handle Browser Back Button
window.addEventListener('popstate', () => {
  nav(window.location.hash.substring(1) || 'home', null, false);
});

function nav(pageId, btnElement, updateHistory = true) {
  const target = document.getElementById(pageId);
  if (!target) return;

  // Animation: Fade out old, Fade in new
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  target.classList.add('active');

  // Update Buttons
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  
  if (btnElement) {
    btnElement.classList.add('active');
  } else {
    // Find button by onclick attribute matching the pageId
    const match = document.querySelector(`.nav-btn[onclick*="'${pageId}'"]`);
    if (match) match.classList.add('active');
  }

  // Update URL
  if (updateHistory) history.pushState(null, null, `#${pageId}`);

  // Mobile Menu & Scroll
  document.querySelector('.site-nav').classList.remove('open');
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Re-render content if entering class pages
  if(pageId === 'class9') renderHierarchy('9');
  if(pageId === 'class10') renderHierarchy('10');
}

function toggleMobileMenu() {
  document.querySelector('.site-nav').classList.toggle('open');
}

// --- 2. Data & Hierarchy System ---

function seedInitialData() {
  if (!localStorage.getItem('notes-9')) {
    const data9 = [
      { id: 1, subject: 'Physical Science', title: 'Chapter 1: Motion', content: 'In physics, motion is the change in position of an object over time. Key formulas: v = u + at, s = ut + 1/2at².' },
      { id: 2, subject: 'Physical Science', title: 'Chapter 2: Force', content: 'Force is an interaction that causes an affected object to be pushed or pulled. F = ma.' },
      { id: 3, subject: 'Mathematics', title: 'Chapter 1: Number Systems', content: 'Real numbers include rational and irrational numbers. Euclid’s division lemma states a = bq + r.' },
      { id: 4, subject: 'Life Science', title: 'Chapter 1: Cell Structure', content: 'The cell is the fundamental structural and functional unit of living matter.' }
    ];
    localStorage.setItem('notes-9', JSON.stringify(data9));
  }
  
  if (!localStorage.getItem('notes-10')) {
    const data10 = [
      { id: 1, subject: 'Physical Science', title: 'Chemical Reactions', content: 'Chemical reactions involve breaking and making bonds between atoms to produce new substances.' },
      { id: 2, subject: 'Mathematics', title: 'Quadratic Equations', content: 'Standard form: ax² + bx + c = 0. The quadratic formula is x = (-b ± √(b²-4ac)) / 2a.' }
    ];
    localStorage.setItem('notes-10', JSON.stringify(data10));
  }
}

// THE NEW HIERARCHY RENDERER
function renderHierarchy(classLevel) {
  const container = document.getElementById(`view-class${classLevel}`);
  if (!container) return;

  const notes = JSON.parse(localStorage.getItem(`notes-${classLevel}`) || '[]');

  if (notes.length === 0) {
    container.innerHTML = '<p style="color:var(--muted); text-align:center;">No content available yet.</p>';
    return;
  }

  // Group by Subject
  const subjects = [...new Set(notes.map(n => n.subject))];
  
  container.innerHTML = subjects.map(subject => {
    // Get chapters for this subject
    const subjectNotes = notes.filter(n => n.subject === subject);
    
    // Generate HTML
    return `
      <div class="subject-group">
        <button class="subject-btn" onclick="toggleSubject(this)">
          ${subject}
          <span>▼</span>
        </button>
        <div class="chapter-list">
          ${subjectNotes.map(note => `
            <div class="chapter-item" onclick="toggleNote(this)">
              <div style="font-weight:600; color:#fff;">${note.title}</div>
              <div class="note-content">${note.content}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }).join('');
}

function toggleSubject(btn) {
  const list = btn.nextElementSibling;
  const isOpen = list.classList.contains('open');
  
  // Close all others (Accordion style) - Optional, remove to keep multiple open
  document.querySelectorAll('.chapter-list').forEach(l => l.classList.remove('open'));
  document.querySelectorAll('.subject-btn span').forEach(s => s.innerText = '▼');

  if (!isOpen) {
    list.classList.add('open');
    btn.querySelector('span').innerText = '▲';
  }
}

function toggleNote(item) {
  const content = item.querySelector('.note-content');
  const isVisible = content.style.display === 'block';
  
  // Reset all notes in this list
  item.parentElement.querySelectorAll('.note-content').forEach(c => c.style.display = 'none');
  
  if (!isVisible) {
    content.style.display = 'block';
  }
}

// --- 3. Mock Test System ---
const mockData = {
  '9': [
    { q: "Unit of Acceleration?", options: ["m/s", "m/s²", "N/kg", "Joule"], correct: "B" },
    { q: "Powerhouse of the cell?", options: ["Nucleus", "Mitochondria", "Ribosome", "Golgi"], correct: "B" }
  ],
  '10': [
    { q: "pH of pure water?", options: ["0", "7", "14", "1"], correct: "B" },
    { q: "Ohm's Law formula?", options: ["V=IR", "P=VI", "F=ma", "E=mc²"], correct: "A" }
  ]
};

let currentTest = [];
let currentIndex = 0;
let score = 0;

function startTest(classLevel) {
  document.getElementById('test-select').style.display = 'none';
  const ui = document.getElementById('test-ui');
  ui.style.display = 'block';
  
  currentTest = mockData[classLevel] || [];
  currentIndex = 0;
  score = 0;
  
  if(currentTest.length === 0) {
    alert("Test coming soon!");
    cancelTest();
    return;
  }
  
  showQuestion();
}

function showQuestion() {
  if (currentIndex >= currentTest.length) {
    finishTest();
    return;
  }

  const q = currentTest[currentIndex];
  document.getElementById('q-display-num').innerText = `Question ${currentIndex + 1} of ${currentTest.length}`;
  document.getElementById('q-display-text').innerText = q.q;

  const optsContainer = document.getElementById('options-container');
  optsContainer.innerHTML = '';

  q.options.forEach((opt, idx) => {
    const letter = String.fromCharCode(65 + idx);
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
    const correctIndex = correct.charCodeAt(0) - 65;
    el.parentElement.children[correctIndex].classList.add('correct');
  }
  
  // Auto next after 1.5s
  setTimeout(nextQuestion, 1500);
}

function nextQuestion() {
  currentIndex++;
  showQuestion();
}

function finishTest() {
  document.getElementById('test-ui').innerHTML = `
    <div class="card neon-card" style="text-align:center; padding:40px;">
      <h1>Score: ${score} / ${currentTest.length}</h1>
      <button class="btn" onclick="cancelTest()">Finish</button>
    </div>
  `;
}

function cancelTest() {
  location.reload();
}

// Admin Logic
function toggleAdmin(id, btn) {
  const panel = document.getElementById(`admin-${id}`);
  panel.classList.toggle('active');
  btn.innerText = panel.classList.contains('active') ? 'Close Admin' : '+ Add Note';
}

function addContent(classLevel) {
  const subject = document.getElementById(`subject-class${classLevel}`).value;
  const title = document.getElementById(`chapter-title-class${classLevel}`).value;
  const content = document.getElementById(`content-class${classLevel}`).value;
  
  if(!subject || !title) return alert("Fill all fields");
  
  const notes = JSON.parse(localStorage.getItem(`notes-${classLevel}`) || '[]');
  notes.push({ id: Date.now(), subject, title, content });
  localStorage.setItem(`notes-${classLevel}`, JSON.stringify(notes));
  
  alert("Saved!");
  renderHierarchy(classLevel);
  // Clear inputs...
}