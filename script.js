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
  const target = document.getElementById(sectionId);
  if (target) {
    target.classList.add("active");
    // Atualiza a URL com a seção atual
    window.location.hash = sectionId;
    // Rola a página suavemente para o topo ao trocar de tela (Melhora a UX)
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }
}

/* ==========================================================================
   2. INTERCEPTADOR DE URL (HASH)
   Verifica se a URL contém um # para abrir a aba correta no carregamento
   ========================================================================== */
window.addEventListener('DOMContentLoaded', () => {
  // Pega o texto depois do '#' na URL (ex: se for #projects, pega 'projects')
  const hashDaUrl = window.location.hash.replace('#', '');
  
  // Se existir um texto e houver um elemento com esse ID no HTML, abre a seção
  if (hashDaUrl && document.getElementById(hashDaUrl)) {
    showSection(hashDaUrl);
  }
});

/* ==========================================================================
   3. ANIMAÇÃO DE FUNDO (CANVAS MULTI-STARS)
   Cria um efeito de estrelas variadas baseadas em referências de imagem
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
    // Espalha as estrelas pela tela no carregamento inicial
    this.y = Math.random() * height; 
  }

  // Inicializa ou reseta as propriedades da estrela no TOPO da tela
  init() {
    this.x = Math.random() * width;
    this.y = -20; // Nasce acima do topo da tela
    
    // Tamanhos aleatórios (Maior variedade)
    this.size = Math.random() * 6 + 2; 
    
    // Velocidade de queda (proporcional ao tamanho dá um efeito de profundidade)
    this.speed = (Math.random() * 0.8 + 0.3) + (this.size * 0.05);
    
    this.color = colors[Math.floor(Math.random() * colors.length)];
    this.opacity = Math.random() * 0.6 + 0.3; 
    
    // Escolhe aleatoriamente entre os 5 tipos de estrelas baseados nas imagens
    this.type = Math.floor(Math.random() * 5);
  }

  // Atualiza a posição da partícula a cada frame (Caindo reto)
  update() {
    this.y += this.speed; // Cai reta, sem alterar o X
    
    // Se a estrela sair da tela pela parte de baixo, reseta para o topo
    if (this.y > height + 30) {
      this.init();
    }
  }

  // Desenha a estrela com base no tipo sorteado
  draw() {
    ctx.save();
    ctx.translate(this.x, this.y); // Move o cursor para a posição da estrela
    // NOTA: Sem ctx.rotate(). As estrelas ficam fixas "em pé" e não deitam.
    
    ctx.globalAlpha = this.opacity;
    ctx.strokeStyle = this.color;
    ctx.fillStyle = this.color;
    ctx.lineWidth = 1.2;

    ctx.beginPath();
    
    // Direciona para a função de desenho correta
    switch(this.type) {
      case 0:
        // Imagem 7d6afe: Estrela Diamante Clássica Curvada (Sólida)
        this.drawCurvedStar(this.size * 1.5, this.size * 1.0, 0.3);
        ctx.fill();
        break;
      case 1:
        // Imagem 7d6b5b: Brilho de Linhas Finas Cruzadas
        this.drawSharpCross(this.size * 2.2, this.size * 1.2);
        ctx.fill();
        break;
      case 2:
        // Imagem 7d67c1: Estrela 8 pontas preenchida
        this.draw8PointStar(this.size * 1.8, this.size * 0.7);
        ctx.fill();
        break;
      case 3:
        // Imagem 7d677e: Estrela Diamante Oca/Vazada (Apenas borda)
        this.drawCurvedStar(this.size * 1.8, this.size * 1.2, 0.25);
        ctx.stroke();
        break;
      case 4:
        // Imagem 7d6725: Brilho/Explosão de 8 linhas separadas (Burst)
        this.drawLineBurst(this.size * 1.8, this.size * 1.0, this.size * 0.2);
        ctx.stroke();
        break;
    }

    // Efeito de piscar esporádico (Pisca mais forte)
    if (Math.random() > 0.985 && this.type === 3) {
       ctx.globalAlpha = 1;
       ctx.fill();
    }
    
    ctx.restore();
  }

  /* --- FUNÇÕES DE GEOMETRIA DOS DESENHOS --- */
  
  // Desenha estrela curvada (Usada nos Tipos 0 e 3)
  drawCurvedStar(ry, rx, c) {
    ctx.moveTo(0, -ry);
    ctx.quadraticCurveTo(rx * c, -ry * c, rx, 0);   
    ctx.quadraticCurveTo(rx * c, ry * c, 0, ry);    
    ctx.quadraticCurveTo(-rx * c, ry * c, -rx, 0);  
    ctx.quadraticCurveTo(-rx * c, -ry * c, 0, -ry); 
    ctx.closePath();
  }

  // Desenha cruz fina afiada (Tipo 1) - Mantém a verticalidade
  drawSharpCross(ry, rx) {
    const thin = this.size * 0.15; // Espessura do centro
    ctx.moveTo(0, -ry);
    ctx.lineTo(thin, -thin);
    ctx.lineTo(rx, 0);
    ctx.lineTo(thin, thin);
    ctx.lineTo(0, ry);
    ctx.lineTo(-thin, thin);
    ctx.lineTo(-rx, 0);
    ctx.lineTo(-thin, -thin);
    ctx.closePath();
  }

  // Desenha estrela de 8 pontas contínua (Tipo 2)
  draw8PointStar(outer, inner) {
    for (let i = 0; i < 8; i++) {
      // Começa do topo (-Math.PI/2) para garantir que fique "em pé"
      const angle = (i * Math.PI) / 4 - Math.PI / 2;
      const radius = (i % 2 === 0) ? outer : inner;
      ctx.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
    }
    ctx.closePath();
  }

  // Desenha linhas de brilho separadas (Tipo 4)
  drawLineBurst(longRay, shortRay, gap) {
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI) / 4 - Math.PI / 2;
      const radius = (i % 2 === 0) ? longRay : shortRay;
      
      // Move para o gap interno e faz a linha até o raio externo
      ctx.moveTo(Math.cos(angle) * gap, Math.sin(angle) * gap);
      ctx.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
    }
  }
}

/* --- INICIALIZAÇÃO E LOOP DE ANIMAÇÃO --- */

function initParticles() {
  particles = [];
  // Quantidade de partículas baseada na largura da tela
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
