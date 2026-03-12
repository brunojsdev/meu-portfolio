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
   EXATAMENTE 4 TIPOS DE ESTRELAS (Baseadas nas imagens fornecidas)
   TODAS EM PÉ (Sem rotação) e CAINDO DO TOPO
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
    // Espalha as estrelas pela tela no carregamento inicial para não nascerem todas juntas
    this.y = Math.random() * height; 
  }

  // Inicializa ou reseta as propriedades da estrela no TOPO da tela
  init() {
    this.x = Math.random() * width;
    this.y = -30; // Nasce acima do topo da tela para cair
    
    // Tamanhos aleatórios
    this.size = Math.random() * 5 + 2; 
    
    // Velocidade de queda
    this.speed = (Math.random() * 0.8 + 0.3) + (this.size * 0.05);
    
    this.color = colors[Math.floor(Math.random() * colors.length)];
    this.opacity = Math.random() * 0.5 + 0.2; 
    
    // EXATAMENTE 4 TIPOS (0, 1, 2, 3) baseados nas imagens
    this.type = Math.floor(Math.random() * 4);
  }

  // Cai em linha reta
  update() {
    this.y += this.speed; 
    
    // Se a estrela sair da tela pela parte de baixo, reseta para o topo
    if (this.y > height + 30) {
      this.init();
    }
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y); 
    // NOTA: SEM ROTAÇÃO. A posição (0, -R) garante que a ponta principal aponte para CIMA (em pé).
    
    // Lógica do EFEITO DE PISCAR (Todas piscam de vez em quando)
    const isBlinking = Math.random() > 0.985;
    
    if (isBlinking) {
      ctx.globalAlpha = 1; // Brilho máximo ao piscar
      ctx.fillStyle = '#ffffff'; // Fica branca/brilhante quando pisca
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2; // Fica levemente mais grossa
    } else {
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = this.color;
      ctx.strokeStyle = this.color;
      ctx.lineWidth = 1.2;
    }

    ctx.beginPath();
    
    // DESENHA EXATAMENTE AS 4 REFERÊNCIAS
    switch(this.type) {
      
      case 0:
        // Imagem 7281bf: Estrela 4 pontas afiada (Vertical longa, horizontal média)
        ctx.moveTo(0, -this.size * 2); // Ponta Cima
        ctx.lineTo(this.size * 0.15, -this.size * 0.15); // Meio superior direito
        ctx.lineTo(this.size * 1, 0); // Ponta Direita
        ctx.lineTo(this.size * 0.15, this.size * 0.15); // Meio inferior direito
        ctx.lineTo(0, this.size * 2); // Ponta Baixo
        ctx.lineTo(-this.size * 0.15, this.size * 0.15); // Meio inferior esquerdo
        ctx.lineTo(-this.size * 1, 0); // Ponta Esquerda
        ctx.lineTo(-this.size * 0.15, -this.size * 0.15); // Meio superior esquerdo
        ctx.closePath();
        ctx.fill();
        break;

      case 1:
        // Imagem 7281bb: Estrela 8 pontas sólida
        for (let i = 0; i < 8; i++) {
          const angle = (i * Math.PI) / 4 - Math.PI / 2; // -Math.PI/2 força iniciar do TOPO EXATO
          const radius = (i % 2 === 0) ? this.size * 1.6 : this.size * 0.6;
          ctx.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
        }
        ctx.closePath();
        ctx.fill();
        break;

      case 2:
        // Imagem 7281b8: Estrela de 4 pontas curvada e OCA (Apenas linha)
        const R = this.size * 1.6;
        const r = this.size * 0.9;
        const c = 0.25;
        ctx.moveTo(0, -R);
        ctx.quadraticCurveTo(r * c, -R * c, r, 0);
        ctx.quadraticCurveTo(r * c, R * c, 0, R);
        ctx.quadraticCurveTo(-r * c, R * c, -r, 0);
        ctx.quadraticCurveTo(-r * c, -R * c, 0, -R);
        ctx.closePath();
        ctx.stroke(); // Oca
        // Se estiver piscando, preenche a estrela oca por um frame
        if (isBlinking) {
          ctx.fill();
        }
        break;

      case 3:
        // Imagem 727f14: Explosão de linhas (Cruz grande + X pequeno)
        const longRay = this.size * 1.8;
        const shortRay = this.size * 0.8;
        
        // Linha Vertical (Em pé)
        ctx.moveTo(0, -longRay); 
        ctx.lineTo(0, longRay);
        // Linha Horizontal
        ctx.moveTo(-longRay, 0); 
        ctx.lineTo(longRay, 0);
        
        // Linhas diagonais (menores)
        const diagDist = Math.cos(Math.PI/4) * shortRay;
        ctx.moveTo(-diagDist, -diagDist); 
        ctx.lineTo(diagDist, diagDist);
        ctx.moveTo(-diagDist, diagDist); 
        ctx.lineTo(diagDist, -diagDist);
        
        ctx.stroke();
        
        // Se estiver piscando, desenha um núcleo luminoso no meio das linhas
        if (isBlinking) {
          ctx.beginPath();
          ctx.arc(0, 0, this.size * 0.7, 0, Math.PI * 2);
          ctx.fill();
        }
        break;
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
