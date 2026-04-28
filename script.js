/*
  ==========================================================================
  ÍNDICE DO ARQUIVO (JavaScript)
  1. NAVEGAÇÃO E LÓGICA SPA (Single Page Application)
  2. SISTEMA DE TEMAS (Persistência e Toggle)
  3. COMPORTAMENTO MOBILE (Sticky Navigation)
  4. MOTOR DE ANIMAÇÃO (Canvas API - Efeito Espacial)
     - Configurações e Variáveis
     - Classe Star (Estrelas Geométricas)
     - Classe ShootingStar (Cometas)
     - Inicialização e Ciclo de Animação
  ==========================================================================
*/

/* 1. NAVEGAÇÃO E LÓGICA SPA: Alternância de seções sem recarregar a página */

function showSection(sectionId) {
  // Oculta todas as seções antes de mostrar a desejada
  document.querySelectorAll(".section-container").forEach((sec) => {
    sec.classList.remove("active");
  });

  const target = document.getElementById(sectionId);
  if (target) {
    target.classList.add("active");

    // Atualiza a URL (hash) para permitir o uso do botão Voltar do navegador
    if (window.location.hash !== `#${sectionId}`) {
      window.location.hash = sectionId;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Garante que os ícones do Lucide sejam renderizados na nova seção
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
  /* 1.1 Inicialização da Seção */
  const initialSection = window.location.hash.replace("#", "") || "home";
  showSection(initialSection);

  /* 2. SISTEMA DE TEMAS: Carregamento e Listeners */
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light") {
    document.body.classList.add("light-mode");
    setTimeout(() => {
      if (window.refreshSpace) window.refreshSpace();
    }, 100);
  }

  // Listener para os botões de troca de tema (Home e Projetos)
  const themeBtns = document.querySelectorAll(".theme-toggle-btn");
  themeBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      document.body.classList.toggle("light-mode");

      const isLight = document.body.classList.contains("light-mode");
      localStorage.setItem("theme", isLight ? "light" : "dark");

      if (window.refreshSpace) window.refreshSpace();
    });
  });
});

/* 3. COMPORTAMENTO MOBILE: Torna a navegação fixa (sticky) ao rolar no celular */

window.addEventListener("scroll", () => {
  const backBtn = document.getElementById("back-btn");
  const themeBtn = document.getElementById("theme-toggle-btn");
  const projectsSection = document.getElementById("projects");

  if (!backBtn || !projectsSection || !themeBtn) return;

  const isProjectsActive = projectsSection.classList.contains("active");

  if (window.innerWidth <= 768 && isProjectsActive) {
    // Se rolar mais de 20px, ele vira a barra fixa
    if (window.scrollY > 20) {
      backBtn.classList.add("scrolled");
      themeBtn.classList.add("scrolled");
    } else {
      backBtn.classList.remove("scrolled");
      themeBtn.classList.remove("scrolled");
    }
  }
});

/* 4. MOTOR DE ANIMAÇÃO: Renderização do fundo espacial interativo via Canvas */

const canvas = document.getElementById("bg-canvas");

if (canvas) {
  const ctx = canvas.getContext("2d");
  let width, height;
  let stars = [];
  let shootingStars = [];

  /* 4.1 Configurações de Cores (Reativas ao Tema) */
  const darkStarColors = [
    "#ffffff",
    "#fff4e6",
    "#ffdd00",
    "#ffaa00",
    "#ffcc80",
    "#e6f2ff",
  ];

  const lightStarColors = [
    "#150136",
    "#090024",
    "#5752ff",
    "#3b35cc",
    "#8b87ff",
    "#17005c",
  ];

  // Ajusta o tamanho do canvas para ocupar toda a janela
  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  /* 4.2 Classe Star: Gerencia o comportamento das estrelas fixas/descendentes */
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
      // DIREÇÃO ALTERADA: Agora as estrelas descem (y positivo)
      this.baseSpeedX = (Math.random() - 0.5) * 0.1;
      this.baseSpeedY = baseSize * 0.4 + 0.2; // Aumentado levemente para dar mais dinamismo

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
      // Movimentação para baixo
      this.x += this.baseSpeedX;
      this.y += this.baseSpeedY;
      this.twinklePhase += this.twinkleSpeed;
      this.opacity =
        (Math.sin(this.twinklePhase) * 0.5 + 0.5) * this.maxOpacity;

      // Loop infinito: se sair por baixo, volta para o topo
      if (this.y > height + 20) {
        this.y = -20;
        this.x = Math.random() * width;
      }
      if (this.x < -20) this.x = width + 20;
      if (this.x > width + 20) this.x = -20;
    }

    draw() {
      const alpha = this.opacity;

      // Efeito de brilho (Halo) ao redor da estrela
      ctx.globalAlpha = alpha * 0.2;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * 1.5, 0, Math.PI * 2);
      ctx.fill();

      // NÚCLEO DA ESTRELA: Agora desenha uma forma de 4 pontas (diamante)
      ctx.globalAlpha = alpha;
      this._drawFourPointStar(this.x, this.y, this.size);
      ctx.globalAlpha = 1.0;
    }

    /* 
       Desenha uma estrela de 4 pontas geométrica
       x, y: centro da estrela
       s: tamanho base
    */
    _drawFourPointStar(x, y, s) {
      ctx.beginPath();
      ctx.moveTo(x, y - s * 2.5); // Ponta Superior
      ctx.lineTo(x + s * 0.4, y - s * 0.4); // Curva interna
      ctx.lineTo(x + s * 2.5, y); // Ponta Direita
      ctx.lineTo(x + s * 0.4, y + s * 0.4);
      ctx.lineTo(x, y + s * 2.5); // Ponta Inferior
      ctx.lineTo(x - s * 0.4, y + s * 0.4);
      ctx.lineTo(x - s * 2.5, y); // Ponta Esquerda
      ctx.lineTo(x - s * 0.4, y - s * 0.4);
      ctx.closePath();
      ctx.fill();
    }
  }

  /* 4.3 Classe ShootingStar: Gerencia os cometas aleatórios */
  class ShootingStar {
    constructor() {
      this.reset();
    }
    reset() {
      this.active = false;
      if (Math.random() > 0.993) {
        this.active = true;
        this.x = Math.random() * width;
        this.y = -50;
        this.size = Math.random() * 2 + 1;
        this.speedX = (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 5 + 3);
        this.speedY = Math.random() * 5 + 7; // Cometas também caem rápido
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
        this.x - this.speedX * (this.len / 5),
        this.y - this.speedY * (this.len / 5),
      );
      ctx.lineWidth = this.size;
      ctx.lineCap = "round";

      let grad = ctx.createLinearGradient(
        this.x,
        this.y,
        this.x - this.speedX * (this.len / 10),
        this.y - this.speedY * (this.len / 10),
      );

      if (document.body.classList.contains("light-mode")) {
        grad.addColorStop(0, `rgba(21, 1, 54, ${this.opacity})`);
        grad.addColorStop(1, `rgba(87, 82, 255, 0)`);
      } else {
        grad.addColorStop(0, `rgba(255, 255, 255, ${this.opacity})`);
        grad.addColorStop(1, `rgba(255, 170, 0, 0)`);
      }

      ctx.strokeStyle = grad;
      ctx.stroke();
    }
  }

  /* 4.4 Gerenciamento e Inicialização */
  function initSpace() {
    resize();
    stars = [];
    shootingStars = [];

    // Densidade de estrelas equilibrada para não sobrecarregar dispositivos lentos
    const calculatedStars = Math.floor((width * height) / 12000);
    const numStars = Math.min(calculatedStars, 150);

    for (let i = 0; i < numStars; i++) {
      stars.push(new Star());
    }

    for (let i = 0; i < 2; i++) {
      shootingStars.push(new ShootingStar());
    }
  }

  window.refreshSpace = initSpace;

  // Loop principal de animação
  function animate() {
    ctx.clearRect(0, 0, width, height); // Limpa o quadro anterior

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
