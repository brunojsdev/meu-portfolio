
// script.js - separado a partir do HTML original

// --- NAVEGAÇÃO ENTRE SEÇÕES ---
function showSection(sectionId) {
  document.querySelectorAll(".section-container").forEach((sec) => {
    sec.classList.remove("active");
  });
  const target = document.getElementById(sectionId);
  if (target) {
    target.classList.add("active");
    window.scrollTo(0, 0);
  }
}

// --- EXPANSÃO DOS WIDGETS ---
function toggleWidget(element) {
  if (element.classList.contains("collapsed")) {
    element.classList.remove("collapsed");
    element.classList.add("expanded");
  } else {
    element.classList.add("collapsed");
    element.classList.remove("expanded");
  }
}

// --- WIDGET: RELÓGIO DIGITAL ---
function startClock() {
  const clockEl = document.getElementById("digital-clock");
  if (!clockEl) return;
  setInterval(() => {
    const now = new Date();
    clockEl.innerText = now.toLocaleTimeString("pt-BR");
  }, 1000);
}
startClock();

// --- WIDGET: CALCULADORA ---
let calcExpression = "";
const calcDisplay = document.getElementById("calc-display");

function calcAppend(val) {
  calcExpression += val;
  if (calcDisplay) calcDisplay.innerText = calcExpression;
}

function calcClear() {
  calcExpression = "";
  if (calcDisplay) calcDisplay.innerText = "0";
}

function calcEqual() {
  try {
    if (/^[0-9+\-*/.]+$/.test(calcExpression)) {
      const result = eval(calcExpression);
      if (calcDisplay) calcDisplay.innerText = result;
      calcExpression = result.toString();
    } else {
      if (calcDisplay) calcDisplay.innerText = "Erro";
      calcExpression = "";
    }
  } catch (e) {
    if (calcDisplay) calcDisplay.innerText = "Erro";
    calcExpression = "";
  }
}

// --- WIDGET: TODO LIST ---
const todoInput = document.getElementById("todo-input");
const todoList = document.getElementById("todo-list");

function addTodo() {
  if (!todoInput || !todoList) return;
  const text = todoInput.value;
  if (text.trim() === "") return;

  const li = document.createElement("li");
  li.innerHTML = `
          <span class="todo-item-text">${text}</span>
          <div class="todo-actions">
              <span class="todo-check" onclick="this.closest('li').style.textDecoration = 'line-through'">✔</span>
              <span class="todo-delete" onclick="this.closest('li').remove()">✖</span>
          </div>
      `;
  todoList.appendChild(li);
  todoInput.value = "";
}

if (todoInput) {
  todoInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") addTodo();
  });
}

// --- WIDGET: CLIMA (SIMULADO) ---
function updateWeather() {
  const display = document.getElementById("weather-display");
  if (!display) return;
  display.innerHTML =
    '<div style="padding: 20px; color: var(--cor-destaque);">Buscando...</div>';

  setTimeout(() => {
    display.innerHTML = `
              <div style="font-size: 3rem;">🌦</div>
              <div class="weather-temp">22°C</div>
              <div class="weather-city">São Bernardo do Campo</div>
              <div style="font-size: 0.8rem; color: var(--cor-destaque); margin-top:5px;">Atualizado agora</div>
              <button class="weather-btn" onclick="event.stopPropagation(); updateWeather()">Atualizar</button>
          `;
  }, 1000);
}
