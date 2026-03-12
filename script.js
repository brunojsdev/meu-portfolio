/* ==========================================================================
   1. NAVEGAÇÃO ENTRE SEÇÕES
   ========================================================================== */
function showSection(sectionId) {
  document.querySelectorAll(".section-container").forEach((sec) => {
    sec.classList.remove("active");
  });

  const target = document.getElementById(sectionId);
  if (target) {
    target.classList.add("active");
    window.location.hash = sectionId;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

window.addEventListener('DOMContentLoaded', () => {
  const hashDaUrl = window.location.hash.replace('#', '');
  if (hashDaUrl && document.getElementById(hashDaUrl)) {
    showSection(hashDaUrl);
  }
});

/* ==========================================================================
   2. ANIMAÇÃO DE FUNDO (CANVAS MULTI-STARS)
   Cria uma variedade de estrelas baseadas na imagem de referência
   ========================================================================== */
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let particles = [];
const colors = ['#bbff00', '#ddff00', '#ffff00', '#ffcc00', '#ffffff'];

function resize() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}

class Star {
  constructor() {
    this.init();
  }

  init() {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    
    // Variedade de Tamanhos
    this.size = Math.random() * 5 + 2; 
    this.speed = Math.random() * 0.5 + 0.2;
    this.color = colors[Math.floor(Math.random() * colors.length)];
    this.opacity = Math.random() * 0.6 + 0.2;
    
    // Define qual tipo de estrela será (0 a 3)
    this.type = Math.floor(Math.random() * 4); 
    
    // Rotação removida para manter as estrelas "em pé"
    this.rotation = 0;
  }

  update() {
    this.y += this.speed;
    
    if (this.y > height + 20) {
      this.init();
      this.y = -20;
    }
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    // ctx.rotate(this.rotation); // Removido para evitar que fiquem de lado
    ctx.globalAlpha = this.opacity;
    ctx.strokeStyle = this.color;
    ctx.fillStyle = this.color;
    ctx.lineWidth = 1;

    ctx.beginPath();
    
    switch(this.type) {
      case 0: // Estrela 4 pontas Curvada (Estilo Ouros / Diamante)
        this.drawStar4Curved(this.size * 1.8, this.size * 1.2, 0.25);
        break;
      case 1: // Brilho Fino (4 pontas esticadas)
        this.drawStar4Thin(this.size * 2.5, this.size * 0.3);
        break;
      case 2: // Estrela de 8 pontas (Sparkle)
        this.drawStar8(this.size * 1.5, this.size * 0.6);
        break;
      case 3: // Ponto de luz / Pequena estrela sólida
        ctx.arc(0, 0, this.size * 0.4, 0, Math.PI * 2);
        ctx.fill();
        break;
    }

    ctx.stroke();

    // Efeito de "Blink" (Piscar)
    if (Math.random() > 0.99) {
      ctx.globalAlpha = 1;
      ctx.fill();
    }

    ctx.restore();
  }

  // Desenho: Diamante curvado
  drawStar4Curved(ry, rx, c) {
    ctx.moveTo(0, -ry);
    ctx.quadraticCurveTo(rx * c, -ry * c, rx, 0);
    ctx.quadraticCurveTo(rx * c, ry * c, 0, ry);
    ctx.quadraticCurveTo(-rx * c, ry * c, -rx, 0);
    ctx.quadraticCurveTo(-rx * c, -ry * c, 0, -ry);
  }

  // Desenho: Estrela 4 pontas finas
  drawStar4Thin(outer, inner) {
    // Desenha as linhas manualmente para garantir a orientação vertical
    ctx.moveTo(0, -outer);
    ctx.lineTo(inner, 0);
    ctx.lineTo(0, outer);
    ctx.lineTo(-inner, 0);
    ctx.closePath();
  }

  // Desenho: Estrela 8 pontas
  drawStar8(outer, inner) {
    // Desenha sem usar ctx.rotate repetitivo para garantir alinhamento vertical
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI) / 4 - Math.PI / 2;
      const radius = (i % 2 === 0) ? outer : inner;
      ctx.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
    }
    ctx.closePath();
  }
}

function initParticles() {
  particles = [];
  const particleCount = Math.floor(width / 12);
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

window.addEventListener('resize', () => {
  resize();
  initParticles();
});

// Inicialização
resize();
initParticles();
animate();
