/* ==========================================================================

NAVEGAÇÃO ENTRE SEÇÕES
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

    // Reinicia os ícones sempre que trocar de seção (Consolidado)
    if (typeof lucide !== "undefined") {
      lucide.createIcons();
    }
  }
}

// Gerencia a navegação quando o usuário usa as setas voltar/avançar do navegador
window.addEventListener("hashchange", () => {
  const sectionId = window.location.hash.replace("#", "") || "home";
  showSection(sectionId);
});

document.addEventListener("DOMContentLoaded", () => {
  // Verifica se a URL já possui um hash ao carregar a página
  const initialSection = window.location.hash.replace("#", "") || "home";
  showSection(initialSection);

  // Recupera o tema salvo no navegador
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light") {
    document.body.classList.add("light-mode");
    // Pequeno atraso para garantir que o canvas carregue com as cores certas
    setTimeout(() => {
      if (window.refreshSpace) window.refreshSpace();
    }, 100);
  }

  // Inicializa funcionalidade do Botão de Tema
  const themeBtn = document.getElementById("theme-toggle-btn");
  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      // Alterna a classe no body
      document.body.classList.toggle("light-mode");

      // Salva a preferência
      const isLight = document.body.classList.contains("light-mode");
      localStorage.setItem("theme", isLight ? "light" : "dark");

      // Re-inicia o canvas imediatamente para trocar as cores das estrelas
      if (window.refreshSpace) {
        window.refreshSpace();
      }
    });
  }
});

/* ==========================================================================
2. LÓGICA DO BOTÃO VOLTAR
========================================================================== */

window.addEventListener("scroll", () => {
  const backBtn = document.getElementById("back-btn");
  const projectsSection = document.getElementById("projects");

  if (!backBtn || !projectsSection) return;

  const isProjectsActive = projectsSection.classList.contains("active");

  if (window.innerWidth <= 768 && isProjectsActive) {
    // Se rolar mais de 20px, ele vira a barra fixa
    if (window.scrollY > 20) {
      backBtn.classList.add("scrolled");
    } else {
      backBtn.classList.remove("scrolled");
    }
  } else {
    backBtn.classList.remove("scrolled");
  }
});

/* ==========================================================================
3. ANIMAÇÃO DE FUNDO ESPACIAL (OTIMIZADA PARA PERFORMANCE EM MOBILE)
========================================================================== */
const canvas = document.getElementById("bg-canvas");

if (canvas) {
  const ctx = canvas.getContext("2d");
  let width, height;
  let stars = [];
  let shootingStars = [];

  // Cores padrão (Tema Escuro)
  const darkStarColors = [
    "#ffffff",
    "#fff4e6",
    "#ffdd00",
    "#ffaa00",
    "#ffcc80",
    "#e6f2ff",
  ];

  // Cores Invertidas (Tema Claro) - Estrelas arroxeadas para dar contraste com fundo amarelo/laranja
  const lightStarColors = [
    "#150136",
    "#090024",
    "#5752ff",
    "#3b35cc",
    "#8b87ff",
    "#17005c",
  ];

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  class Star {
    constructor() {
      this.init();
    }

    init() {
      this.type = Math.floor(Math.random() * 3) + 1;
      let baseSize = Math.random() * 2 + 0.5;

      if (this.type === 1) this.size = baseSize * 2.5;
      else if (this.type === 2) this.size = baseSize * 1.8;
      else this.size = baseSize * 1.2;

      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.baseSpeedX = (Math.random() - 0.5) * 0.1;
      this.baseSpeedY = baseSize * 0.3 + 0.1;

      // Seleciona a paleta de cores correta dependendo do modo ativado
      const isLightMode = document.body.classList.contains("light-mode");
      const activeColors = isLightMode ? lightStarColors : darkStarColors;

      this.color =
        activeColors[Math.floor(Math.random() * activeColors.length)];

      this.maxOpacity = Math.random() * 0.7 + 0.3;
      this.opacity = this.maxOpacity;
      this.twinkleSpeed = Math.random() * 0.02 + 0.005;
      this.twinklePhase = Math.random() * Math.PI * 2;
    }

    update() {
      this.x += this.baseSpeedX;
      this.y -= this.baseSpeedY;
      this.twinklePhase += this.twinkleSpeed;
      this.opacity =
        (Math.sin(this.twinklePhase) * 0.5 + 0.5) * this.maxOpacity;

      if (this.y < -20) {
        this.y = height + 20;
        this.x = Math.random() * width;
      }
      if (this.x < -20) this.x = width + 20;
      if (this.x > width + 20) this.x = -20;
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);

      // OTIMIZAÇÃO: Círculo translúcido no lugar do pesado shadowBlur
      ctx.globalAlpha = this.opacity * 0.2;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(0, 0, this.size * 1.5, 0, Math.PI * 2);
      ctx.fill();

      // Desenho da estrela principal
      ctx.globalAlpha = this.opacity;
      switch (this.type) {
        case 1:
          this._drawType1(this.size);
          break;
        case 2:
          this._drawType2(this.size);
          break;
        case 3:
          this._drawType3(this.size);
          break;
      }
      ctx.restore();
    }

    _drawType1(s) {
      ctx.rotate(Math.PI / 8);
      this._drawTaper(-Math.PI / 4, s * 2.2, s * 0.2);
      this._drawTaper((3 * Math.PI) / 4, s * 1.4, s * 0.2);
      this._drawTaper((-3 * Math.PI) / 4, s * 0.8, s * 0.15);
      this._drawTaper(Math.PI / 4, s * 0.7, s * 0.15);
    }

    _drawTaper(angle, len, thk) {
      ctx.save();
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.moveTo(0, -thk / 2);
      ctx.lineTo(len, 0);
      ctx.lineTo(0, thk / 2);
      ctx.fill();
      ctx.restore();
    }

    _drawType2(s) {
      ctx.beginPath();
      ctx.arc(0, 0, s * 0.8, 0, Math.PI * 2);
      ctx.fill();
      this._drawTaper(0, s * 1.8, s * 0.3);
      this._drawTaper(Math.PI / 2, s * 1.8, s * 0.3);
      this._drawTaper(Math.PI, s * 1.8, s * 0.3);
      this._drawTaper(-Math.PI / 2, s * 1.8, s * 0.3);
    }

    _drawType3(s) {
      ctx.beginPath();
      const vLen = s * 2.2;
      const hLen = s * 0.7;
      ctx.moveTo(0, -vLen);
      ctx.quadraticCurveTo(0, 0, hLen, 0);
      ctx.quadraticCurveTo(0, 0, 0, vLen);
      ctx.quadraticCurveTo(0, 0, -hLen, 0);
      ctx.quadraticCurveTo(0, 0, 0, -vLen);
      ctx.closePath();
      ctx.fill();
    }
  }

  class ShootingStar {
    constructor() {
      this.reset();
    }
    reset() {
      this.active = false;
      if (Math.random() > 0.993) {
        this.active = true;
        this.x = Math.random() * width;
        this.y = 0;
        this.size = Math.random() * 2 + 1;
        this.speedX = (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 5 + 3);
        this.speedY = Math.random() * 5 + 5;
        this.len = Math.random() * 80 + 30;
        this.opacity = 1;
      }
    }
    update() {
      if (!this.active) {
        this.reset();
        return;
      }
      this.x += this.speedX;
      this.y += this.speedY;
      this.opacity -= 0.015;
      if (
        this.opacity <= 0 ||
        this.y > height ||
        this.x < 0 ||
        this.x > width
      ) {
        this.active = false;
      }
    }
    draw() {
      if (!this.active) return;
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(
        this.x - this.speedX * (this.len / 10),
        this.y - this.speedY * (this.len / 10),
      );
      ctx.lineWidth = this.size;
      ctx.lineCap = "round";

      let grad = ctx.createLinearGradient(
        this.x,
        this.y,
        this.x - this.speedX * (this.len / 10),
        this.y - this.speedY * (this.len / 10),
      );

      // Verifica o tema para aplicar a cor do rastro do cometa
      if (document.body.classList.contains("light-mode")) {
        grad.addColorStop(0, `rgba(21, 1, 54, ${this.opacity})`); // Roxo Escuro
        grad.addColorStop(1, `rgba(87, 82, 255, 0)`); // Dissolve para Roxo claro
      } else {
        grad.addColorStop(0, `rgba(255, 255, 255, ${this.opacity})`);
        grad.addColorStop(1, `rgba(255, 170, 0, 0)`);
      }

      ctx.strokeStyle = grad;
      ctx.stroke();
    }
  }

  function initSpace() {
    resize();
    stars = [];
    shootingStars = [];

    // OTIMIZAÇÃO: Limite máximo fixado em 150 estrelas para evitar travamentos
    const calculatedStars = Math.floor((width * height) / 12000);
    const numStars = Math.min(calculatedStars, 150);

    for (let i = 0; i < numStars; i++) {
      stars.push(new Star());
    }

    for (let i = 0; i < 2; i++) {
      shootingStars.push(new ShootingStar());
    }
  }

  // Expondo a função para que o botão de tema a chame sem problemas de escopo
  window.refreshSpace = initSpace;

  function animate() {
    ctx.clearRect(0, 0, width, height);

    stars.forEach((star) => {
      star.update();
      star.draw();
    });

    shootingStars.forEach((sStar) => {
      sStar.update();
      sStar.draw();
    });

    requestAnimationFrame(animate);
  }

  window.addEventListener("resize", initSpace);
  resize();
  initSpace();
  animate();
}
