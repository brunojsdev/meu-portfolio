/* ==========================================================================
   1. NAVEGAÇÃO ENTRE SEÇÕES (INSTANTÂNEA)
   ========================================================================== */

function showSection(sectionId) {
  document.querySelectorAll(".section-container").forEach((sec) => {
    sec.classList.remove("active");
  });

  const target = document.getElementById(sectionId);
  if (target) {
    target.classList.add("active");
    window.location.hash = sectionId;
    window.scrollTo({ top: 0, behavior: "auto" });
  }
}

window.addEventListener('DOMContentLoaded', () => {
  const hashDaUrl = window.location.hash.replace('#', '');
  if (hashDaUrl && document.getElementById(hashDaUrl)) {
    showSection(hashDaUrl);
  }
});


/* ==========================================================================
   2. ANIMAÇÃO DE FUNDO (CANVAS COM ANTICOLISÃO)
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

  /**
   * Verifica se uma nova posição (x, y) está muito perto de estrelas existentes
   */
  function isPosOccupied(x, y, minDistance) {
    for (let p of particles) {
      const dx = p.x - x;
      const dy = p.y - y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < minDistance) return true;
    }
    return false;
  }

  class Star {
    constructor() {
      this.init(true); // 'true' para espalhar na tela toda no início
    }

    init(fullScreen = false) {
      this.type = Math.floor(Math.random() * 3) + 1;
      
      // Variação de tamanho unificada para todos os tipos
      this.size = Math.random() * 4 + 3; // Tamanho base entre 3 e 7
      
      let foundPos = false;
      let attempts = 0;
      while (!foundPos && attempts < 15) {
        this.x = Math.random() * width;
        this.y = fullScreen ? Math.random() * height : -50;
        
        if (!isPosOccupied(this.x, this.y, 45)) {
          foundPos = true;
        }
        attempts++;
      }

      this.speed = Math.random() * 0.3 + 0.15;
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.opacity = Math.random() * 0.4 + 0.2;
      this.isBlinking = false;
      this.blinkTimer = 0;
    }

    update() {
      this.y += this.speed;
      
      if (!this.isBlinking && Math.random() > 0.992) {
        this.isBlinking = true;
        this.blinkTimer = Math.floor(Math.random() * 6) + 3;
      }

      if (this.isBlinking) {
        this.blinkTimer--;
        if (this.blinkTimer <= 0) this.isBlinking = false;
      }
      
      if (this.y > height + 50) {
        this.init(false);
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      
      const s = this.size;
      
      if (this.isBlinking) {
        ctx.globalAlpha = 1.0;
        ctx.shadowBlur = 15;
        ctx.shadowColor = this.color;
      } else {
        ctx.globalAlpha = this.opacity;
        ctx.shadowBlur = 0;
      }
      
      ctx.fillStyle = this.color;

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

    /** TIPO 3: Estrela Côncava esticada (Proporção corrigida) */
    _drawType3(s) {
      ctx.beginPath();
      const vLen = s * 3.5; // Comprimento vertical
      const hLen = s * 0.8; // Comprimento lateral
      
      ctx.moveTo(0, -vLen);
      ctx.quadraticCurveTo(0, 0, hLen, 0);
      ctx.quadraticCurveTo(0, 0, 0, vLen);
      ctx.quadraticCurveTo(0, 0, -hLen, 0);
      ctx.quadraticCurveTo(0, 0, 0, -vLen);
      
      ctx.closePath();
      ctx.fill();
    }
  }

  function initParticles() {
    resize();
    particles = [];
    const particleCount = Math.floor(width / 35); 
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
