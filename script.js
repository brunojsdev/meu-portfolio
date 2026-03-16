/* ==========================================================================
   1. NAVEGAÇÃO ENTRE SEÇÕES
   ========================================================================== */

function showSection(sectionId) {
  // Remove a classe 'active' de todos os containers de seção
  document.querySelectorAll(".section-container").forEach((sec) => {
    sec.classList.remove("active");
  });

  // Adiciona a classe 'active' na seção alvo
  const target = document.getElementById(sectionId);
  if (target) {
    target.classList.add("active");
    window.location.hash = sectionId;
    
    // Scroll instantâneo para não conflitar com a animação de fade-in do CSS
    window.scrollTo({
      top: 0,
      behavior: "auto" 
    });
  }
}

// Verifica o hash da URL assim que o DOM for carregado
window.addEventListener('DOMContentLoaded', () => {
  const hashDaUrl = window.location.hash.replace('#', '');
  if (hashDaUrl && document.getElementById(hashDaUrl)) {
    showSection(hashDaUrl);
  }
});


/* ==========================================================================
   2. ANIMAÇÃO DE FUNDO (CANVAS)
   ========================================================================== */

const canvas = document.getElementById('bg-canvas');

if (canvas) {
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
      
      // Sorteia o tipo da estrela: 1 (Risco), 2 (8 Pontas), 3 (Bolinha Distante)
      this.type = Math.floor(Math.random() * 3) + 1;
      
      const baseSize = Math.random() * 3 + 4; 
      
      // Lógica de profundidade para o novo Tipo 3
      if (this.type === 3) {
        this.size = baseSize * 0.4; // Bolinhas bem menores
        this.speed = Math.random() * 0.2 + 0.1; // Mais lentas (dá sensação de distância)
      } else {
        this.size = baseSize; // Tamanho normal para os tipos 1 e 2
        this.speed = Math.random() * 0.5 + 0.2; // Mais rápidas
      }
      
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.opacity = Math.random() * 0.3 + 0.2; 
      this.isBlinking = false;
      this.blinkTimer = 0;
    }

    update() {
      this.y += this.speed;
      
      // Flash rápido
      if (!this.isBlinking && Math.random() > 0.985) {
        this.isBlinking = true;
        this.blinkTimer = Math.floor(Math.random() * 4) + 2; 
      }

      if (this.isBlinking) {
        this.blinkTimer--;
        if (this.blinkTimer <= 0) this.isBlinking = false;
      }
      
      // Reposiciona no topo
      if (this.y > height + 50) {
        this.x = Math.random() * width;
        this.y = -50;
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      
      const s = this.size;
      
      // EFEITO DE BRILHO OTIMIZADO (Sem shadowBlur)
      if (this.isBlinking) {
        // 1. Desenha a "aura" de brilho por trás
        ctx.beginPath();
        ctx.arc(0, 0, s * 3, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = 0.2; // Aura suave
        ctx.fill();
        
        // 2. Prepara a opacidade no máximo para a estrela principal
        ctx.globalAlpha = 1.0; 
      } else {
        ctx.globalAlpha = this.opacity;
      }
      
      ctx.fillStyle = this.color;
      ctx.strokeStyle = this.color;

      // Chama a função de desenho com base no tipo
      switch (this.type) {
        case 1:
          this._drawType1(s);
          break;
        case 2:
          this._drawType2(s);
          break;
        case 3:
          this._drawType3(s);
          break;
      }

      ctx.restore();
    }

    /* --- MÉTODOS DE DESENHO ESPECÍFICOS --- */

    /** TIPO 1: Risco manual assimétrico */
    _drawType1(s) {
      const drawTaper = (angle, len, thk) => {
        ctx.save();
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.moveTo(0, -thk / 2);
        ctx.lineTo(len, 0);
        ctx.lineTo(0, thk / 2);
        ctx.fill();
        ctx.restore();
      };
      
      ctx.rotate(Math.PI / 8); 
      drawTaper(-Math.PI / 4, s * 2.2, s * 0.2);
      drawTaper(3 * Math.PI / 4, s * 1.4, s * 0.2);
      drawTaper(-3 * Math.PI / 4, s * 0.8, s * 0.15);
      drawTaper(Math.PI / 4, s * 0.7, s * 0.15);
      
      ctx.beginPath();
      ctx.arc(0, 0, s * 0.15, 0, Math.PI * 2);
      ctx.fill();
    }

    /** TIPO 2: 8 pontas sólida */
    _drawType2(s) {
      ctx.beginPath();
      for (let i = 0; i < 16; i++) {
        let angle = i * Math.PI / 8 - Math.PI / 2;
        let radius = (i % 4 === 0) ? s * 1.8 : (i % 2 === 0 ? s * 0.8 : s * 0.2);
        
        if (i === 0) {
          ctx.moveTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
        } else {
          ctx.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
        }
      }
      ctx.fill();
    }

    /** NOVO TIPO 3: Bolinhas preenchidas e distantes */
    _drawType3(s) {
      ctx.beginPath();
      ctx.arc(0, 0, s, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function initParticles() {
    resize();
    particles = [];
    // Reduzido para melhorar a performance (de 15 para 35)
    const particleCount = Math.floor(width / 35); 
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

  window.addEventListener('resize', initParticles);

  resize();         
  initParticles();
  animate();
}
