/**
 * Script de Portfólio
 * Mantido simples e direto para melhor performance.
 */

// Inicializar ícones do Lucide
if (typeof lucide !== 'undefined') {
    lucide.createIcons();
}

// Efeito de mudança de cor no Header ao fazer scroll
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.style.padding = '15px 50px';
        navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
    } else {
        navbar.style.padding = '20px 50px';
        navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)';
    }
});

// Lógica de "Scroll Ativo" (Opcional)
// Poderia destacar o link da navegação conforme a secção visível.
console.log("Portfólio carregado com sucesso!");