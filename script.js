/* ==========================================================================
   1. NAVEGAÇÃO ENTRE SEÇÕES
   Função responsável por alternar as telas (Home / Projetos)
   ========================================================================== */
function showSection(sectionId) {
  // Esconde todas as seções removendo a classe 'active' de todas elas
  document.querySelectorAll(".section-container").forEach((sec) => {
    sec.classList.remove("active");
  });

  // Mostra a seção desejada adicionando a classe 'active'
  document.getElementById(sectionId).classList.add("active");

  // Rola a página suavemente para o topo ao trocar de tela (Melhora a UX)
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

/* ==========================================================================
   2. ANIMAÇÃO DE FUNDO (CANVAS STARS)
   Cria um efeito de estrelas de 4 pontas curvadas (Estilo Ouros)
   ========================================================================== */
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

// Variáveis globais de controle do Canvas
let width, height;
let particles = [];

// Paleta de cores da animação
const colors = ['#bbff00', '#ddff00', '#ffff00', '#ffcc00', '#ffaa00'];

/* --- FUNÇÕES DE CONTROLE DO CANVAS --- */

function resize() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}

/* --- CLASSE PRINCIPAL: STAR (PARTÍCULAS) --- */
class Star {
  constructor() {
    this.init();
  }

  // Inicializa ou reseta as propriedades da estrela
  init() {
    this.x = Math.random() * width;
    this.y = Math.random() * height; 
    // Tamanho reduzido para melhor estética
    this.size = Math.random() * 4 + 3; 
    this.speed = Math.random() * 1.0 + 0.3;
    this.color = colors[Math.floor(Math.random() * colors.length)];
    this.opacity = Math.random() * 0.5 + 0.3; 
  }

  // Atualiza a posição da partícula a cada frame
  update() {
    this.y += this.speed;
    
    // Se a estrela sair da tela pela parte de baixo, reseta para o topo
    if (this.y > height + 20) {
      this.x = Math.random() * width;
      this.y = -20;
    }
  }

  // Desenha a estrela de 4 pontas curvada (Gordinha e Esticada)
  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);

    ctx.globalAlpha = this.opacity;
    
    // Proporções estilo Naipe de Ouros
    const R_y = this.size * 1.8; // Vertical esticada
    const R_x = this.size * 1.2; // Horizontal gordinha
    const c = 0.25;              // Controle da curvatura (pontas finas)

    ctx.beginPath();
    ctx.moveTo(0, -R_y);

    // Curvas que formam o corpo da estrela
    ctx.quadraticCurveTo(R_x * c, -R_y * c, R_x, 0);   
    ctx.quadraticCurveTo(R_x * c, R_y * c, 0, R_y);    
    ctx.quadraticCurveTo(-R_x * c, R_y * c, -R_x, 0); 
    ctx.quadraticCurveTo(-R_x * c, -R_y * c, 0, -R_y); 
    
    ctx.closePath();

    // Estrela Oca por padrão
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 1.2;
    ctx.stroke();
    
    // Efeito de "piscar": preenche a estrela aleatoriamente
    if (Math.random() > 0.985) {
       ctx.globalAlpha = 1;
       ctx.fillStyle = this.color;
       ctx.fill();
    }
    
    ctx.restore();
  }
}

/* --- INICIALIZAÇÃO E LOOP DE ANIMAÇÃO --- */

function initParticles() {
  particles = [];
  const particleCount = Math.floor(width / 15); 
  
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Star());
  }
}

function animate() {
  ctx.clearRect(0, 0, width, height);
  
  particles.forEach(p => {
    p.update();
    p.draw();
  });
  
  requestAnimationFrame(animate);
}

/* --- EVENT LISTENERS --- */

window.addEventListener('resize', () => {
  resize();
  initParticles();
});

/* --- START DO SCRIPT --- */
resize();         
initParticles();  
animate();
