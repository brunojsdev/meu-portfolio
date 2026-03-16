/**
 * ==========================================================================
 * PROJETO: Portfólio Cyber-Modern - Sistema de Estrelas e Navegação
 * MODIFICAÇÕES: Retorno do ShadowBlur, Novo Formato Côncavo e Fim das Transições
 * ==========================================================================
 */

/* ==========================================================================
   1. NAVEGAÇÃO ENTRE SEÇÕES (SEM ANIMAÇÃO)
   ========================================================================== */

function showSection(sectionId) {
  // Troca instantânea para evitar "lag" visual de animações lentas
  document.querySelectorAll(".section-container").forEach((sec) => {
    sec.classList.remove("active");
  });

  const target = document.getElementById(sectionId);
  if (target) {
    target.classList.add("active");
    window.location.hash = sectionId;
    
    // Scroll instantâneo (behavior auto) mata o conflito com renderização do canvas
    window.scrollTo({
      top: 0,
      behavior: "auto" 
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
      
      // Tipos: 1 (Risco), 2 (8 Pontas Grande), 3 (Novo Brilho Côncavo)
      this.type = Math.floor(Math.random() * 3) + 1;
      
      const baseSize = Math.random() * 3 + 4; 
      
      if (this.type === 2) {
        this.size = baseSize * 2.2; // Tipo 2 agora bem maior e imponente
      } else if (this.type === 3) {
        this.size = baseSize * 1.8; // Tamanho ideal para o formato da imagem
      } else {
        this.size = baseSize * 1.5;
      }
      
      this.speed = Math.random() * 0.4 + 0.15;
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.opacity = Math.random() * 0.4 + 0.2; 
      this.isBlinking = false;
      this.blinkTimer = 0;
    }

    update() {
      this.y += this.speed;
      
      if (!this.isBlinking && Math.random() > 0.99) {
        this.isBlinking = true;
        this.blinkTimer = Math.floor(Math.random() * 5) + 3; 
      }

      if (this.isBlinking) {
        this.blinkTimer--;
        if (this.blinkTimer <= 0) this.isBlinking = false;
      }
      
      if (this.y > height + 50) {
        this.x = Math.random() * width;
        this.y = -50;
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      
      const s = this.size;
      
      // RETORNO DO SHADOWBLUR (Apenas no blink para performance)
      if (this.isBlinking) {
        ctx.globalAlpha = 1.0;
        ctx.shadowBlur = 15;
        ctx.shadowColor = this.color;
      } else {
        ctx.globalAlpha = this.opacity;
        ctx.shadowBlur = 0;
      }
      
      ctx.fillStyle = this.color;
      ctx.strokeStyle = this.color;

      switch (this.type) {
        case 1: this._drawType1(s); break;
        case 2: this._drawType2(s); break;
        case 3: this._drawType3(s); break;
      }

      ctx.restore();
    }

    _drawType1(s) {
      const drawTaper = (angle, len, thk) => {
        ctx.save(); ctx.rotate(angle); ctx.beginPath();
        ctx.moveTo(0, -thk / 2); ctx.lineTo(len, 0); ctx.lineTo(0, thk / 2);
        ctx.fill(); ctx.restore();
      };
      ctx.rotate(Math.PI / 8); 
      drawTaper(-Math.PI / 4, s * 2.2, s * 0.2);
      drawTaper(3 * Math.PI / 4, s * 1.4, s * 0.2);
      drawTaper(-3 * Math.PI / 4, s * 0.8, s * 0.15);
      drawTaper(Math.PI / 4, s * 0.7, s * 0.15);
      ctx.beginPath(); ctx.arc(0, 0, s * 0.15, 0, Math.PI * 2); ctx.fill();
    }

    _drawType2(s) {
      ctx.beginPath();
      for (let i = 0; i < 16; i++) {
        let angle = i * Math.PI / 8 - Math.PI / 2;
        let radius = (i % 4 === 0) ? s * 1.8 : (i % 2 === 0 ? s * 0.8 : s * 0.2);
        if (i === 0) ctx.moveTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
        else ctx.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
      }
      ctx.fill();
    }

    /** TIPO 3: Estrela Côncava (Baseada na Imagem Enviada) */
    _drawType3(s) {
      ctx.beginPath();
      // Ponto superior para direita
      ctx.moveTo(0, -s);
      ctx.quadraticCurveTo(0, 0, s, 0);
      // Direita para baixo
      ctx.quadraticCurveTo(0, 0, 0, s);
      // Baixo para esquerda
      ctx.quadraticCurveTo(0, 0, -s, 0);
      // Esquerda para cima
      ctx.quadraticCurveTo(0, 0, 0, -s);
      ctx.closePath();
      ctx.fill();
    }
  }

  function initParticles() {
    resize();
    particles = [];
    const particleCount = Math.floor(width / 30); 
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Star());
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  }

  window.addEventListener('resize', initParticles);
  resize(); initParticles(); animate();
}
