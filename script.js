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
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }
}

window.addEventListener('DOMContentLoaded', () => {
  const hashDaUrl = window.location.hash.replace('#', '');
  if (hashDaUrl && document.getElementById(hashDaUrl)) {
    showSection(hashDaUrl);
  }
});

/* ==========================================================================
   2. ANIMAÇÃO DE FUNDO (CANVAS STARS - MULTI-TYPE)
   ========================================================================== */
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let particles = [];
const colors = ['#bbff00', '#ddff00', '#ffff00', '#ffcc00', '#ffaa00'];

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
    // Tamanhos aleatórios variando entre pequenos brilhos e estrelas maiores
    this.size = Math.random() * 8 + 4; 
    this.speed = Math.random() * 0.8 + 0.2;
    this.color = colors[Math.floor(Math.random() * colors.length)];
    this.opacity = Math.random() * 0.6 + 0.2;
    
    // Define qual tipo de estrela será (1 a 4 baseado nas imagens)
    this.type = Math.floor(Math.random() * 4) + 1;
  }

  update() {
    this.y += this.speed;
    if (this.y > height + 50) {
      this.x = Math.random() * width;
      this.y = -50;
    }
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.globalAlpha = this.opacity;
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 1.2;
    ctx.beginPath();

    const s = this.size;

    switch (this.type) {
      case 1: // Baseada na image_72686a (Assimétrica/Sketched)
        ctx.moveTo(0, -s * 1.5);
        ctx.lineTo(s * 0.2, -s * 0.2);
        ctx.lineTo(s * 1.2, s * 0.5);
        ctx.lineTo(s * 0.1, s * 0.3);
        ctx.lineTo(0, s * 1.2);
        ctx.lineTo(-s * 0.3, s * 0.2);
        ctx.lineTo(-s * 1.1, -s * 0.1);
        ctx.lineTo(-s * 0.2, -s * 0.3);
        break;

      case 2: // Baseada na image_72684e (8 pontas clássica)
        for (let i = 0; i < 8; i++) {
          const angle = (Math.PI / 4) * i;
          const radius = i % 2 === 0 ? s * 1.5 : s * 0.6;
          ctx.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
        }
        break;

      case 3: // Baseada na image_726832 (4 pontas curvas - Brilho)
        const cp = s * 0.2; // Ponto de controle da curvatura
        ctx.moveTo(0, -s * 1.8);
        ctx.quadraticCurveTo(cp, -cp, s * 1.8, 0);
        ctx.quadraticCurveTo(cp, cp, 0, s * 1.8);
        ctx.quadraticCurveTo(-cp, cp, -s * 1.8, 0);
        ctx.quadraticCurveTo(-cp, -cp, 0, -s * 1.8);
        break;

      case 4: // Baseada na image_726812 (8 pontas fina/geométrica)
        for (let i = 0; i < 16; i++) {
          const angle = (Math.PI / 8) * i;
          let radius;
          if (i % 4 === 0) radius = s * 1.8;      // Pontas principais
          else if (i % 2 === 0) radius = s * 0.9; // Pontas secundárias
          else radius = s * 0.3;                  // Recessos
          ctx.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
        }
        break;
    }

    ctx.closePath();
    ctx.stroke();

    // Efeito de pulsação de preenchimento (Twinkle)
    if (Math.random() > 0.99) {
      ctx.globalAlpha = 0.8;
      ctx.fillStyle = this.color;
      ctx.fill();
    }

    ctx.restore();
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
