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
   2. ANIMAÇÃO DE FUNDO (CANVAS SQUARES)
   Cria um efeito de quadrados caindo/piscando estilo "Digital Rain"
   ========================================================================== */
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

// Variáveis globais de controle do Canvas
let width, height;
let particles = [];

// Paleta de cores da animação sincronizada com a NOVA PALETA DO CSS:
// Cores: Tons de Amarelo
const colors = [ '#bbff00', '#ddff00', '#ffff00', '#ffcc00', '#ffaa00'];


/* --- FUNÇÕES DE CONTROLE DO CANVAS --- */

// Atualiza as dimensões do canvas para ocupar a tela inteira do dispositivo
function resize() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}


/* --- CLASSE PRINCIPAL: SQUARE (PARTÍCULAS) --- */
class Square {
  constructor() {
    this.init();
  }

  // Inicializa ou reseta as propriedades do quadrado
  init() {
    this.x = Math.random() * width;
    this.y = Math.random() * height - height; // Começa acima da tela para queda natural
    this.size = Math.random() * 15 + 5;       // Tamanho varia aleatoriamente entre 5 e 20
    this.speed = Math.random() * 2 + 0.5;     // Velocidade de queda
    this.color = colors[Math.floor(Math.random() * colors.length)]; // Sorteia uma cor da nova paleta
    this.opacity = Math.random() * 0.8 + 0.4; // Transparência aleatória
  }

  // Atualiza a posição da partícula a cada frame (loop de animação)
  update() {
    this.y += this.speed;
    
    // Se o quadrado sair da tela pela parte de baixo, ele volta para o topo
    if (this.y > height) {
      this.init(); // Sorteia tudo de novo
      this.y = -20; // Reposiciona um pouco acima do limite superior
    }
  }

  // Desenha o quadrado no elemento Canvas
  draw() {
    ctx.globalAlpha = this.opacity;
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 1.5;
    
    // Desenha o contorno do quadrado (Stroke)
    ctx.strokeRect(this.x, this.y, this.size, this.size);
    
    // Ocasionalmente (2% de chance) preenche o quadrado para dar um efeito de "piscar" ou glitch
    if (Math.random() > 0.98) {
       ctx.fillStyle = this.color;
       ctx.fillRect(this.x, this.y, this.size, this.size);
    }
    
    // Restaura a opacidade para 1, evitando afetar outros desenhos do canvas
    ctx.globalAlpha = 1;
  }
}


/* --- INICIALIZAÇÃO E LOOP DE ANIMAÇÃO --- */

// Preenche o array com a quantidade ideal de partículas (dinâmico baseado no tamanho da tela)
function initParticles() {
  particles = [];
  const particleCount = Math.floor(width / 10); // Densidade de quadrados na tela
  
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Square());
  }
}

// Loop principal que atualiza a tela a cada frame (normalmente roda a 60fps)
function animate() {
  // Limpa a tela inteira antes de desenhar a nova posição dos quadrados
  ctx.clearRect(0, 0, width, height);
  
  // Atualiza a matemática e redesenha cada partícula existente
  particles.forEach(p => {
    p.update();
    p.draw();
  });
  
  // Chama o próprio método repetidas vezes para criar a animação fluida
  requestAnimationFrame(animate);
}


/* --- EVENT LISTENERS (RESPONSIVIDADE E INTERATIVIDADE) --- */

// Recalcula o tamanho e recria as partículas se o usuário redimensionar a janela do navegador
window.addEventListener('resize', () => {
  resize();
  initParticles();
});


/* --- START DO SCRIPT --- */
// Executa as funções essenciais para a animação começar a rodar assim que a página carregar
resize();         
initParticles();  
animate();
