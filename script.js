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
      2. ANIMAÇÃO DE FUNDO (CANVAS STARS)
      Cria um efeito de estrelas de 4 pontas caindo/piscando
      ========================================================================== */
    const canvas = document.getElementById('bg-canvas');
    const ctx = canvas.getContext('2d');

    // Variáveis globais de controle do Canvas
    let width, height;
    let particles = [];

    // Paleta de cores da animação: Tons de Amarelo
    const colors = ['#bbff00', '#ddff00', '#ffff00', '#ffcc00', '#ffaa00'];

    /* --- FUNÇÕES DE CONTROLE DO CANVAS --- */

    // Atualiza as dimensões do canvas para ocupar a tela inteira
    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }

    /* --- CLASSE PRINCIPAL: STAR (PARTÍCULAS) --- */
    class Star {
      constructor() {
        this.init();
      }

      // Inicializa ou reseta as propriedades da estrela
      init() {
        this.x = Math.random() * width;
        this.y = Math.random() * height - height; // Começa acima da tela
        this.size = Math.random() * 8 + 4;         // Tamanho reduzido (4px a 12px)
        this.speed = Math.random() * 2 + 0.5;      // Velocidade de queda
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.opacity = Math.random() * 0.8 + 0.4;  // Transparência aleatória
      }

      // Atualiza a posição da partícula
      update() {
        this.y += this.speed;
        
        // Se a estrela sair da tela, volta para o topo
        if (this.y > height + this.size) {
          this.init();
          this.y = -20;
        }
      }

      // Desenha a estrela de 4 pontas (estilo losango/brilho)
      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);

        ctx.globalAlpha = this.opacity;
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 1.2;
        
        // Proporções para 4 pontas
        const R_major = this.size;            // Comprimento das pontas
        const R_minor = this.size * 0.3;      // "Espessura" do corpo da estrela

        ctx.beginPath();
        for (let i = 0; i < 8; i++) {
          let angle = (i * Math.PI) / 4 - Math.PI / 2; 
          let radius = (i % 2 === 0) ? R_major : R_minor;

          let px = Math.cos(angle) * radius;
          let py = Math.sin(angle) * radius;

          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();

        // Desenha o contorno
        ctx.stroke();
        
        // Efeito de "piscar" (preenchimento aleatório)
        if (Math.random() > 0.98) {
           ctx.fillStyle = this.color;
           ctx.fill();
        }
        
        ctx.restore();
      }
    }

    /* --- INICIALIZAÇÃO E LOOP DE ANIMAÇÃO --- */

    function initParticles() {
      particles = [];
      const particleCount = Math.floor(width / 12); // Densidade baseada na largura
      
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

    /* --- START --- */
    resize();         
    initParticles();  
    animate();

  </script>
</body>
</html>
