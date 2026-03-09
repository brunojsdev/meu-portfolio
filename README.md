# 🖥️ Portfólio Profissional | Bruno J. Silveira

Interface web desenvolvida para a apresentação centralizada de projetos, habilidades técnicas e informações profissionais. O sistema foi arquitetado utilizando conceitos de Single Page Application (SPA) através de Vanilla JavaScript, garantindo navegação contínua e renderização de alta performance sem recarregamento da página.

## 🛠️ Stack Tecnológica

* **Estrutura:** HTML5 Semântico
* **Estilização:** CSS3 (Flexbox, CSS Grid, Variáveis Nativas e Media Queries)
* **Comportamento:** JavaScript Vanilla (ES6+)
* **Renderização Gráfica:** HTML5 Canvas API

## 📊 Arquitetura e Funcionalidades Principais

* **Navegação Dinâmica:** Manipulação de classes via DOM (Document Object Model) para controle de estado e transição suave entre a seção "Home" e o "Catálogo de Projetos".
* **Motor de Animação Background:** Implementação de um sistema de partículas ("Canvas Stars") processado localmente via Canvas API. Utiliza `requestAnimationFrame` para atualização contínua de coordenadas geométricas, opacidade e curvaturas de bezier (`quadraticCurveTo`).
* **Design System e Tema Estético:** Estruturação de variáveis de escopo global (`:root`) no CSS para controle padronizado da paleta de cores "Deep Space" (fundos em tons de azul escuro/roxo estruturados em degradê) com contornos e textos em alto contraste neon (amarelo e ciano).
* **Integrações de Módulos:** Redirecionamento configurado para repositórios individuais, perfis em plataformas profissionais (LinkedIn, GitHub) e visualização direta do **currículo online** hospedado em nuvem.
* **Componentização UI:** Criação de *cards* interativos com efeitos de flutuação, sombras modulares e *badges* categorizados para exibição de ferramentas (Tech Minis).
* **UX/UI Customizada:** Barra de rolagem nativa estilizada (`::-webkit-scrollbar`) integrando-se nativamente à interface de usuário.

## 📁 Projetos Indexados

O portfólio atua como hub para os seguintes repositórios:
1. Calculadora Web
2. Lista de Tarefas
3. Integração de API (Hora e Clima)
4. Guia Informativo de Primeiros Socorros
5. Dashboard Analítico do Sistema Solar (Python/Streamlit)
6. Hub de Automações Python

## ⚙️ Configuração e Execução

Como o projeto é estruturado de forma estática (Client-side), não há dependências de servidor para a sua visualização local.

1. **Clone o repositório:**
   ```bash
   git clone [https://github.com/brunojsdev/meu-portfolio.git](https://github.com/brunojsdev/meu-portfolio.git)
   ```
2. **Acesso:**
Basta abrir o arquivo index.html em qualquer navegador web moderno.

## 📁 Estrutura de Arquivos
* `index.html:` Marcação semântica e conteúdo principal.

* `style.css:` Lógica de estilização global, variáveis de cor, animações (@keyframes) e responsividade.

* `script.js:` Funções de navegação do DOM e classe geradora do Canvas API.

* `img/:` Diretório de armazenamento das miniaturas (thumbnails) e favicon.
