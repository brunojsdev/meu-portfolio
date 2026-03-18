/**
 * Meu Portfólio - Arquivo Principal de Scripts
 * Organização: 1. Navegação, 2. UI Interativa, 3. Animação de Fundo (Canvas).
 */

document.addEventListener('DOMContentLoaded', () => {
    
    /* ==========================================================================
       1. MÓDULO DE NAVEGAÇÃO (SPA - Single Page Application)
       ========================================================================== */
    const Navigation = {
        /**
         * Oculta todas as seções e exibe a seção alvo
         * @param {string} sectionId - O ID da seção a ser exibida
         */
        showSection: (sectionId) => {
            // Remove a classe 'active' de todas as seções
            document.querySelectorAll(".section-container").forEach((sec) => {
                sec.classList.remove("active");
            });

            // Adiciona a classe 'active' na seção escolhida
            const target = document.getElementById(sectionId);
            if (target) {
                target.classList.add("active");
                window.location.hash = sectionId; // Atualiza a URL para facilitar o compartilhamento
                window.scrollTo({ top: 0, behavior: "smooth" }); // Rola suavemente para o topo
            }
        },

        /**
         * Inicializa a navegação verificando se há uma hash na URL ao carregar a página
         */
        init: () => {
            const hashDaUrl = window.location.hash.replace('#', '');
            if (hashDaUrl && document.getElementById(hashDaUrl)) {
                Navigation.showSection(hashDaUrl);
            }
        }
    };

    // Expõe a função para o escopo global para que os onclicks do HTML funcionem
    window.showSection = Navigation.showSection;
    Navigation.init();


    /* ==========================================================================
       2. MÓDULO DE INTERFACE (Mobile Scroll)
       ========================================================================== */
    const UI = {
        /**
         * Gerencia o encolhimento do botão "Voltar" no mobile ao rolar a página
         */
        handleStickyBackButton: () => {
            const backBtn = document.getElementById('back-btn');
            const projectsSection = document.getElementById('projects');

            if (!backBtn || !projectsSection) return;

            const isProjectsActive = projectsSection.classList.contains('active');
            const isMobile = window.innerWidth <= 768;
            const hasScrolled = window.scrollY > 20;

            if (isMobile && isProjectsActive && hasScrolled) {
                backBtn.classList.add('scrolled');
            } else {
                backBtn.classList.remove('scrolled');
            }
        },

        init: () => {
            window.addEventListener('scroll', UI.handleStickyBackButton);
        }
    };

    UI.init();


    /* ==========================================================================
       3. MÓDULO DE ANIMAÇÃO (Canvas Background) - POR ÚLTIMO
       ========================================================================== */
    const BackgroundAnimation = (() => {
        const canvas = document.getElementById('bg-canvas');
        if (!canvas) return; 

        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];
        const STAR_COLORS = ['#bbff00', '#ddff00', '#ffff00', '#ffcc00', '#ffaa00'];

        const resize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };

        const isPosOccupied = (x, y, minDistance) => {
            return particles.some(p => {
                const dx = p.x - x;
                const dy = p.y - y;
                return Math.sqrt(dx * dx + dy * dy) < minDistance;
            });
        };

        class Star {
            constructor() {
                this.init(true);
            }

            init(fullScreen = false) {
                this.type = Math.floor(Math.random() * 3) + 1;
                this.size = this.calculateSize();
                this.positionRandomly(fullScreen);
                
                this.speed = Math.random() * 0.3 + 0.15;
                this.color = STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)];
                this.opacity = Math.random() * 0.4 + 0.2;
                this.isBlinking = false;
                this.blinkTimer = 0;
            }

            calculateSize() {
                const isMobile = window.innerWidth <= 768;
                if (isMobile) {
                    return this.type === 1 ? Math.random() * 3 + 4 : (this.type === 2 ? Math.random() * 3 + 3 : Math.random() * 3 + 2);
                }
                return this.type === 1 ? Math.random() * 3 + 6 : (this.type === 2 ? Math.random() * 4 + 5 : Math.random() * 2 + 3);
            }

            positionRandomly(fullScreen) {
                let foundPos = false;
                let attempts = 0;
                let safeMargin = 45; 

                while (!foundPos && attempts < 30) {
                    this.x = Math.random() * width;
                    this.y = fullScreen ? Math.random() * height : -50;
                    
                    let currentMargin = attempts > 15 ? safeMargin / 2 : safeMargin;
                    if (!isPosOccupied(this.x, this.y, currentMargin)) {
                        foundPos = true;
                    }
                    attempts++;
                }
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
                    case 1: this._drawType1(this.size); break;
                    case 2: this._drawType2(this.size); break;
                    case 3: this._drawType3(this.size); break;
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

            _drawType3(s) {
                ctx.beginPath();
                ctx.moveTo(0, -(s * 2.2));
                ctx.quadraticCurveTo(0, 0, (s * 0.7), 0);
                ctx.quadraticCurveTo(0, 0, 0, (s * 2.2));
                ctx.quadraticCurveTo(0, 0, -(s * 0.7), 0);
                ctx.quadraticCurveTo(0, 0, 0, -(s * 2.2));
                ctx.closePath();
                ctx.fill();
            }
        }

        const initParticles = () => {
            resize();
            particles = [];
            const particleCount = Math.floor(width / 22); 
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Star());
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, width, height);
            particles.forEach(p => { p.update(); p.draw(); });
            requestAnimationFrame(animate);
        };

        window.addEventListener('resize', initParticles);
        initParticles();
        animate();
    })();
});
