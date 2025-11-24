/* public/app.js - Production Ready SPA Logic */

console.log('Quantum Leap v1.0 loaded');

// --- 1. Smart Navigation & Routing ---

// Handle browser Back/Forward buttons
window.addEventListener('popstate', () => {
  const hash = window.location.hash.substring(1);
  if (hash) nav(hash, null, false); // false = don't push state again
  else nav('home', null, false);
});

// Initialize on Load (Fixes the Refresh Bug)
document.addEventListener('DOMContentLoaded', () => {
  // 1. Seed Data if empty
  seedInitialData();
  
  // 2. Render Views
  renderNotes('9');
  renderNotes('10');

  // 3. Check URL for active page
  const hash = window.location.hash.substring(1);
  if (hash) {
    nav(hash, null, false);
  } else {
    nav('home', null, false);
  }
});

function nav(pageId, btnElement, updateHistory = true) {
  // 1. Validate target exists
  const target = document.getElementById(pageId);
  if (!target) return;

  // 2. Hide all pages / Show Target
  document.querySelectorAll('.page').forEach(page => {
    page.classList.remove('active');
  });
  target.classList.add('active');

  // 3. Update Nav Button Styles (Desktop)
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.remove('active');
  });

  // Highlight the correct button
  if (btnElement) {
    btnElement.classList.add('active');
  } else {
    // If navigated via URL or code, find the matching button
    const matchingBtn = document.querySelector(`.nav-btn[onclick*="'${pageId}'"]`);
    if (matchingBtn) matchingBtn.classList.add('active');
  }

  // 4. Update Browser URL (so refresh works)
  if (updateHistory) {
    history.pushState(null, null, `#${pageId}`);
  }

  // 5. Mobile Menu & Scroll
  document.querySelector('.site-nav').classList.remove('open');
  window.scrollTo(0, 0);
}

function toggleMobileMenu() {
  document.querySelector('.site-nav').classList.toggle('open');
}


// --- 2. Data Management (Content) ---

function seedInitialData() {
  // Pre-fill Class 9 Data if empty
  if (!localStorage.getItem('notes-9')) {
    const initial9 = [
      { id: 1, subject: 'Science', title: 'Chapter 1 — Motion', content: 'Short notes on velocity, acceleration, and Newton’s laws of motion. Includes solved examples for equations of motion.' },
      { id: 2, subject: 'Mathematics', title: 'Chapter 1 — Number Systems', content: 'Revision notes covering rational numbers, irrational numbers, and real number properties.' }
    ];
    localStorage.setItem('notes-9', JSON.stringify(initial9));
  }
  
  // Pre-fill Class 10 Data if empty
  if (!localStorage.getItem('notes-10')) {
    const initial10 = [
      { id: 1, subject: 'Physical Science', title: 'Chemical Reactions', content: 'Key definitions: Combination, Decomposition, Displacement, and Double Displacement reactions.' }
    ];
    localStorage.setItem('notes-10', JSON.stringify(initial10));
  }
}

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

  alert('Note saved successfully!');
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

  container.innerHTML = notes.map(n => `
    <div class="card neon-card">
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <span style="color:var(--primary); font-size:0.75rem; text-transform:uppercase; letter-spacing:1px; font-weight:700;">${n.subject}</span>
        <button onclick="deleteNote('${classLevel}', ${n.id})" style="background:none; border:none; color:var(--muted); cursor:pointer; font-size:12px;">✕</button>
      </div>
      <h3 style="margin:8px 0; font-size:1.1rem;">${n.title}</h3>
      <p class="small" style="color:#b0b8c4; line-height:1.5;">${n.content}</p>
    </div>
  `).join('');
}

function deleteNote(classLevel, id) {
  if(!confirm("Delete this note?")) return;
  const notes = JSON.parse(localStorage.getItem(`notes-${classLevel}`) || '[]');
  const updated = notes.filter(n => n.id !== id);
  localStorage.setItem(`notes-${classLevel}`, JSON.stringify(updated));
  renderNotes(classLevel);
}

function toggleAdmin(sectionId, btn) {
  const panel = document.getElementById(`admin-${sectionId}`);
  if (panel) {
    const isActive = panel.classList.contains('active');
    isActive ? panel.classList.remove('active') : panel.classList.add('active');
    btn.innerText = isActive ? '+ Add Content' : 'Close Admin';
  }
}


// --- 3. Mock Test System ---

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
    // Highlight correct one
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
      <p style="color:var(--muted); margin-bottom:20px;">Final Score</p>
      <button class="btn" onclick="location.reload()">Return Home</button>
    </div>
  `;
}

function cancelTest() {
  location.reload(); // Simple reload to reset state
}