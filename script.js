    /* ==========================================================================
       1. NAVEGAÇÃO ENTRE SEÇÕES (Seu código original mantido)
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
       2. ANIMAÇÃO DE FUNDO (NOVO EFEITO CORRIGIDO E REALISTA)
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
        
        // Tamanho reduzido para manter a delicadeza (entre 4 e 7px)
        this.size = Math.random() * 3 + 4; 
        
        this.speed = Math.random() * 0.5 + 0.2;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        
        // Lógica de Piscar Real (Twinkle) - Flash rápido e agressivo
        this.opacity = Math.random() * 0.3 + 0.2; // Opacidade base baixa
        this.isBlinking = false;
        this.blinkTimer = 0;
        
        this.type = Math.floor(Math.random() * 4) + 1;
      }

      update() {
        this.y += this.speed;
        
        // Sorteia o flash (piscar)
        if (!this.isBlinking && Math.random() > 0.985) {
          this.isBlinking = true;
          this.blinkTimer = Math.floor(Math.random() * 4) + 2; // Flash curtíssimo: 2 a 5 frames
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
        
        // Efeito de Piscar: Aumenta brilho e opacidade drasticamente quando ativo
        if (this.isBlinking) {
          ctx.globalAlpha = 1.0;
          ctx.shadowBlur = 12;
          ctx.shadowColor = this.color;
        } else {
          ctx.globalAlpha = this.opacity;
          ctx.shadowBlur = 0;
        }
        
        const s = this.size;

        // TIPO 1: Risco manual assimétrico (image_72686a)
        if (this.type === 1) { 
          ctx.fillStyle = this.color;
          const drawTaper = (angle, len, thk) => {
            ctx.save();
            ctx.rotate(angle);
            ctx.beginPath();
            ctx.moveTo(0, -thk/2);
            ctx.lineTo(len, 0);
            ctx.lineTo(0, thk/2);
            ctx.fill();
            ctx.restore();
          };
          ctx.rotate(Math.PI / 8); 
          drawTaper(-Math.PI/4, s * 2.2, s * 0.2);
          drawTaper(3*Math.PI/4, s * 1.4, s * 0.2);
          drawTaper(-3*Math.PI/4, s * 0.8, s * 0.15);
          drawTaper(Math.PI/4, s * 0.7, s * 0.15);
          ctx.beginPath();
          ctx.arc(0, 0, s * 0.15, 0, Math.PI * 2);
          ctx.fill();
        } 
        
        // TIPO 2: 8 pontas sólida (image_72684e)
        else if (this.type === 2) { 
          ctx.fillStyle = this.color;
          ctx.beginPath();
          for (let i = 0; i < 16; i++) {
            let angle = i * Math.PI / 8 - Math.PI/2;
            let radius = (i % 4 === 0) ? s * 1.8 : (i % 2 === 0 ? s * 0.8 : s * 0.2);
            ctx.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
          }
          ctx.fill();
        } 
        
        // TIPO 3: 8 pontas VAZADA (image_71fef0 / image_726832)
        else if (this.type === 3) { 
          ctx.strokeStyle = this.color;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          
          const rMax = s * 2.0;  // Pontas longas
          const rMin = s * 1.0;  // Pontas curtas
          const rIn = s * 0.4;   // Centro vazio (buraco)
          
          for (let i = 0; i < 8; i++) {
            const angle = (i * Math.PI) / 4 - Math.PI / 2;
            const nextAngle = ((i + 1) * Math.PI) / 4 - Math.PI / 2;
            const midAngle = (angle + nextAngle) / 2;
            
            const rCurr = i % 2 === 0 ? rMax : rMin;
            const rNext = (i + 1) % 2 === 0 ? rMax : rMin;
            
            const x1 = Math.cos(angle) * rCurr;
            const y1 = Math.sin(angle) * rCurr;
            const x2 = Math.cos(nextAngle) * rNext;
            const y2 = Math.sin(nextAngle) * rNext;
            
            const cx = Math.cos(midAngle) * rIn;
            const cy = Math.sin(midAngle) * rIn;
            
            if (i === 0) ctx.moveTo(x1, y1);
            ctx.quadraticCurveTo(cx, cy, x2, y2);
          }
          ctx.closePath();
          ctx.stroke();
        } 
        
        // TIPO 4: SÓ LINHAS (image_726812)
        else if (this.type === 4) { 
          ctx.fillStyle = this.color;
          for (let i = 0; i < 8; i++) {
            let angle = i * Math.PI / 4 - Math.PI/2;
            let radius = (i % 2 === 0) ? s * 1.8 : s * 0.9;
            let gap = s * 0.3; // Garante o buraco central separando as linhas
            let thk = s * 0.15;
            ctx.save();
            ctx.rotate(angle);
            ctx.beginPath();
            ctx.moveTo(gap, -thk/2);
            ctx.lineTo(radius, 0);
            ctx.lineTo(gap, thk/2);
            ctx.fill();
            ctx.restore();
          }
        }
        ctx.restore();
      }
    }

    function initParticles() {
      resize();
      particles = [];
      const particleCount = Math.floor(width / 15); // Quantidade responsiva
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

    // Inicialização
    initParticles();
    animate();
