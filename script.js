/**
 * Script Principal do Portfólio do Bruno
 * Contém a lógica de navegação e as funções dos Mini-Apps
 */

// Elementos de Navegação
const homeView = document.getElementById('home-view');
const appWrapper = document.getElementById('app-wrapper');
const appTitle = document.getElementById('app-title');
const apps = ['calculator', 'clock', 'todo', 'weather'];

// Gerenciamento de Seções (Sobre/Projetos)
function toggleSection(sectionId) {
    closeOverlay();
    const section = document.getElementById(sectionId + '-section');
    if(section) section.classList.remove('hidden');
}

function closeOverlay() {
    document.getElementById('about-section').classList.add('hidden');
    document.getElementById('projects-section').classList.add('hidden');
}

// Abrir Aplicativos
function openApp(appName) {
    homeView.classList.add('hidden');
    appWrapper.classList.remove('hidden');
    
    // Esconder todos os apps antes de mostrar o escolhido
    apps.forEach(app => {
        const el = document.getElementById('app-' + app);
        if(el) el.classList.add('hidden');
    });

    const targetApp = document.getElementById('app-' + appName);
    if(targetApp) targetApp.classList.remove('hidden');

    const titles = {
        'calculator': 'Calculadora',
        'clock': 'Relógio Mundial',
        'todo': 'Lista de Tarefas',
        'weather': 'Previsão do Tempo'
    };
    appTitle.innerText = titles[appName] || 'App';

    // Iniciar lógicas específicas se necessário
    if(appName === 'clock') startClock();
    if(appName === 'todo') renderTodos();
    if(appName === 'weather') updateWeather();
}

// Fechar Aplicativos
function closeApp() {
    appWrapper.classList.add('hidden');
    homeView.classList.remove('hidden');
}

// --- LÓGICA DA CALCULADORA ---
let calcDisplay = document.getElementById('calc-display');
function calcInput(val) {
    const lastChar = calcDisplay.value.slice(-1);
    // Evita repetição de operadores
    if (['+', '-', '*', '/', '.'].includes(val) && ['+', '-', '*', '/', '.'].includes(lastChar)) return;
    calcDisplay.value += val;
}
function calcClear() { calcDisplay.value = ''; }
function calcDelete() { calcDisplay.value = calcDisplay.value.slice(0, -1); }
function calcResult() {
    try {
        if(calcDisplay.value) calcDisplay.value = eval(calcDisplay.value);
    } catch {
        calcDisplay.value = 'Erro';
        setTimeout(calcClear, 1000);
    }
}

// --- LÓGICA DO RELÓGIO ---
let clockInterval;
function startClock() {
    if(clockInterval) clearInterval(clockInterval);
    function update() {
        const now = new Date();
        const timeEl = document.getElementById('clock-time');
        const dateEl = document.getElementById('clock-date');
        if(timeEl) timeEl.innerText = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        if(dateEl) dateEl.innerText = now.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
    }
    update();
    clockInterval = setInterval(update, 1000);
}

// --- LÓGICA DE TAREFAS (TODO) ---
let todos = JSON.parse(localStorage.getItem('bruno_todos')) || [];
function saveTodos() {
    localStorage.setItem('bruno_todos', JSON.stringify(todos));
    renderTodos();
}
function addTodo() {
    const input = document.getElementById('todo-input');
    if (input.value.trim()) {
        todos.push({ text: input.value.trim(), done: false });
        input.value = '';
        saveTodos();
    }
}
function toggleTodo(index) {
    todos[index].done = !todos[index].done;
    saveTodos();
}
function deleteTodo(index) {
    todos.splice(index, 1);
    saveTodos();
}
function renderTodos() {
    const list = document.getElementById('todo-list');
    if(!list) return;
    list.innerHTML = '';
    todos.forEach((todo, index) => {
        const li = document.createElement('li');
        li.className = "flex items-center gap-3 p-3 bg-slate-900 rounded-lg border border-slate-700 text-slate-200";
        li.innerHTML = `
            <button onclick="toggleTodo(${index})" class="${todo.done ? 'text-green-500' : 'text-slate-600'}">
                <i class="fas ${todo.done ? 'fa-check-circle' : 'fa-circle'}"></i>
            </button>
            <span class="flex-grow ${todo.done ? 'line-through text-slate-500' : 'text-white'}">${todo.text}</span>
            <button onclick="deleteTodo(${index})" class="text-red-400"><i class="fas fa-trash"></i></button>
        `;
        list.appendChild(li);
    });
}

// --- LÓGICA DO CLIMA ---
async function updateWeather() {
    const tempEl = document.getElementById('weather-temp');
    if(!tempEl) return;
    try {
        const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=-23.5505&longitude=-46.6333&current_weather=true');
        const data = await res.json();
        tempEl.innerText = Math.round(data.current_weather.temperature) + '°';
    } catch {
        tempEl.innerText = 'Erro';
    }
}