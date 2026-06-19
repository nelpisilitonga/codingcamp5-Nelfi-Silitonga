// ============================================
// 1. GREETING + JAM (Wajib)
// ============================================
function updateGreetingAndTime() {
    const now = new Date();
    const hours = now.getHours();
    let greeting = 'Selamat Malam';
    if (hours < 12) greeting = 'Selamat Pagi';
    else if (hours < 18) greeting = 'Selamat Siang';
    else if (hours < 21) greeting = 'Selamat Sore';
    
    // Custom name (Challenge 2)
    let name = localStorage.getItem('userName') || 'User';
    document.getElementById('greeting').textContent = `${greeting}, ${name}!`;
    
    // Tanggal
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    document.getElementById('date').textContent = now.toLocaleDateString('id-ID', options);
    
    // Jam
    document.getElementById('time').textContent = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

// Update setiap detik
setInterval(updateGreetingAndTime, 1000);
updateGreetingAndTime();

// ============================================
// 2. FOCUS TIMER (Wajib)
// ============================================
let timerInterval = null;
let timeLeft = 25 * 60; // 25 menit dalam detik
let isRunning = false;

const timerDisplay = document.getElementById('timerDisplay');

function updateTimerDisplay() {
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    timerDisplay.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function startTimer() {
    if (isRunning) return;
    isRunning = true;
    timerInterval = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            isRunning = false;
            alert('⏰ Waktu fokus selesai! Ambil jeda sebentar.');
            return;
        }
        timeLeft--;
        updateTimerDisplay();
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
    isRunning = false;
}

function resetTimer() {
    stopTimer();
    timeLeft = parseInt(localStorage.getItem('timerDuration')) || 25 * 60;
    updateTimerDisplay();
}

// Custom durasi (Challenge 3)
document.getElementById('setTimerBtn').addEventListener('click', () => {
    const val = parseInt(document.getElementById('customTimerInput').value);
    if (val > 0 && val <= 60) {
        stopTimer();
        timeLeft = val * 60;
        localStorage.setItem('timerDuration', timeLeft);
        updateTimerDisplay();
    } else {
        alert('Masukkan angka 1-60 menit');
    }
});

// Event listener timer
document.getElementById('timerStart').addEventListener('click', startTimer);
document.getElementById('timerStop').addEventListener('click', stopTimer);
document.getElementById('timerReset').addEventListener('click', resetTimer);

// Load custom timer dari local storage
const savedDuration = localStorage.getItem('timerDuration');
if (savedDuration) {
    timeLeft = parseInt(savedDuration);
    updateTimerDisplay();
    document.getElementById('customTimerInput').value = Math.floor(timeLeft / 60);
}

// ============================================
// 3. TO-DO LIST (Wajib)
// ============================================
let todos = JSON.parse(localStorage.getItem('todos')) || [];

function renderTodos() {
    const list = document.getElementById('todoList');
    list.innerHTML = '';
    todos.forEach((todo, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span class="todo-text ${todo.done ? 'done' : ''}" data-index="${index}">${todo.text}</span>
            <div class="todo-actions">
                <button class="edit-btn" data-index="${index}">✏️</button>
                <button class="delete-btn" data-index="${index}">🗑️</button>
            </div>
        `;
        // Toggle done (klik teks)
        li.querySelector('.todo-text').addEventListener('click', () => {
            todos[index].done = !todos[index].done;
            saveTodos();
            renderTodos();
        });
        // Edit
        li.querySelector('.edit-btn').addEventListener('click', () => {
            const newText = prompt('Edit tugas:', todos[index].text);
            if (newText !== null && newText.trim() !== '') {
                todos[index].text = newText.trim();
                saveTodos();
                renderTodos();
            }
        });
        // Delete
        li.querySelector('.delete-btn').addEventListener('click', () => {
            todos.splice(index, 1);
            saveTodos();
            renderTodos();
        });
        list.appendChild(li);
    });
}

function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

// Tambah To-Do (dengan cegah duplikat - Challenge 4)
document.getElementById('addTodoBtn').addEventListener('click', () => {
    const input = document.getElementById('todoInput');
    const text = input.value.trim();
    if (text === '') return;
    
    // Cek duplikat
    if (todos.some(t => t.text.toLowerCase() === text.toLowerCase())) {
        alert('Tugas sudah ada di daftar!');
        return;
    }
    
    todos.push({ text, done: false });
    saveTodos();
    renderTodos();
    input.value = '';
});

// Enter untuk tambah
document.getElementById('todoInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') document.getElementById('addTodoBtn').click();
});

renderTodos();

// ============================================
// 4. QUICK LINKS (Wajib)
// ============================================
let links = JSON.parse(localStorage.getItem('links')) || [];

function renderLinks() {
    const container = document.getElementById('linkContainer');
    container.innerHTML = '';
    links.forEach((link, index) => {
        const div = document.createElement('div');
        div.className = 'link-item';
        div.innerHTML = `
            <a href="${link.url}" target="_blank">${link.name}</a>
            <button data-index="${index}">✕</button>
        `;
        div.querySelector('button').addEventListener('click', () => {
            links.splice(index, 1);
            localStorage.setItem('links', JSON.stringify(links));
            renderLinks();
        });
        container.appendChild(div);
    });
}

document.getElementById('addLinkBtn').addEventListener('click', () => {
    const nameInput = document.getElementById('linkName');
    const urlInput = document.getElementById('linkUrl');
    const name = nameInput.value.trim();
    let url = urlInput.value.trim();
    if (name === '' || url === '') return;
    
    // Tambahkan https:// jika tidak ada
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
    }
    
    links.push({ name, url });
    localStorage.setItem('links', JSON.stringify(links));
    renderLinks();
    nameInput.value = '';
    urlInput.value = '';
});

// Enter untuk tambah link
document.getElementById('linkUrl').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') document.getElementById('addLinkBtn').click();
});

renderLinks();

// ============================================
// 5. DARK/LIGHT MODE (Challenge 1)
// ============================================
const themeToggle = document.getElementById('themeToggle');
let darkMode = localStorage.getItem('darkMode') === 'true';

function applyTheme() {
    if (darkMode) {
        document.body.classList.add('dark');
        themeToggle.textContent = '☀️ Light Mode';
    } else {
        document.body.classList.remove('dark');
        themeToggle.textContent = '🌙 Dark Mode';
    }
    localStorage.setItem('darkMode', darkMode);
}

themeToggle.addEventListener('click', () => {
    darkMode = !darkMode;
    applyTheme();
});

applyTheme();

// ============================================
// 6. SORT TASKS (Challenge 5) - Tambahan
// ============================================
// Tambahkan tombol sort di HTML? Kita tambahkan secara dinamis
const todoSection = document.querySelector('.todo-section');
const sortBtn = document.createElement('button');
sortBtn.textContent = '🔀 Urutkan A-Z';
sortBtn.style.marginBottom = '10px';
sortBtn.style.padding = '5px 15px';
sortBtn.style.borderRadius = '20px';
sortBtn.style.border = '1px solid #cbd5e0';
sortBtn.style.background = 'transparent';
sortBtn.style.cursor = 'pointer';
todoSection.insertBefore(sortBtn, document.getElementById('todoList'));

sortBtn.addEventListener('click', () => {
    todos.sort((a, b) => a.text.localeCompare(b.text));
    saveTodos();
    renderTodos();
});