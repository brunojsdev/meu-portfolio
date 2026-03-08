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
   Cria um efeito de estrelas de 4 pontas caindo/piscando (Style: Sparkle)
   ========================================================================== */
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

// Variáveis globais de controle do Canvas
let width, height;
let particles = [];

// Paleta de cores da animação sincronizada com os DESTAQUES do CSS
const colors = ['#bbff00', '#ddff00', '#ffff00', '#ffcc00', '#ffaa00'];

/* --- FUNÇÕES DE CONTROLE DO CANVAS --- */

// Atualiza as dimensões do canvas para ocupar a tela inteira
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
    // Começa em uma posição Y aleatória para não caírem todas juntas no início
    this.y = Math.random() * height; 
    this.size = Math.random() * 7 + 3;          // Tamanho discreto (3px a 10px)
    this.speed = Math.random() * 1.5 + 0.5;     // Velocidade de queda suave
    this.color = colors[Math.floor(Math.random() * colors.length)];
    this.opacity = Math.random() * 0.7 + 0.3;   // Transparência variada
  }

  // Atualiza a posição da partícula a cada frame
  update() {
    this.y += this.speed;
    
    // Se a estrela sair da tela pela parte de baixo, reseta para o topo
    if (this.y > height + this.size) {
      this.x = Math.random() * width;
      this.y = -20;
      this.size = Math.random() * 7 + 3;
      this.speed = Math.random() * 1.5 + 0.5;
    }
  }

  // Desenha a estrela de 4 pontas simples (estilo losango esticado)
  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);

    ctx.globalAlpha = this.opacity;
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 1.2;
    
    // Proporções da estrela de 4 pontas
    const R_major = this.size;            // Pontas verticais e horizontais
    const R_minor = this.size * 0.25;     // Curvatura interna (mais fina para parecer brilho)

    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      // Alterna entre raio maior e menor a cada 45 graus
      let angle = (i * Math.PI) / 4 - Math.PI / 2; 
      let radius = (i % 2 === 0) ? R_major : R_minor;

      let px = Math.cos(angle) * radius;
      let py = Math.sin(angle) * radius;

      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();

    // Desenha o contorno da estrela
    ctx.stroke();
    
    // Efeito de "piscar": 2% de chance de preencher a estrela neste frame
    if (Math.random() > 0.98) {
       ctx.fillStyle = this.color;
       ctx.fill();
    }
    
    ctx.restore();
  }
}

/* --- INICIALIZAÇÃO E LOOP DE ANIMAÇÃO --- */

// Preenche o array com estrelas (densidade ajustada para não poluir o texto)
function initParticles() {
  particles = [];
  const particleCount = Math.floor(width / 15); 
  
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Star());
  }
}

// Loop principal de renderização
function animate() {
  // Limpa o canvas
  ctx.clearRect(0, 0, width, height);
  
  // Atualiza e desenha cada estrela
  particles.forEach(p => {
    p.update();
    p.draw();
  });
  
  requestAnimationFrame(animate);
}

/* --- EVENT LISTENERS --- */

// Recalcula o canvas ao redimensionar a janela
window.addEventListener('resize', () => {
  resize();
  initParticles();
});

/* --- START DO SCRIPT --- */
resize();         
initParticles();  
animate();
