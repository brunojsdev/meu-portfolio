# 🖥️ Portfólio Profissional | Bruno J. Silveira

Interface web moderna e responsiva desenvolvida para centralizar projetos, habilidades técnicas e informações profissionais. O projeto utiliza conceitos de **Single Page Application (SPA)** com Vanilla JavaScript, oferecendo uma experiência de navegação fluida, interativa e visualmente impactante.

## 🛠️ Stack Tecnológica

- **Estrutura:** HTML5 Semântico
- **Estilização:** CSS3 (Flexbox, CSS Grid, Variáveis Nativas e Glassmorphism)
- **Comportamento:** JavaScript Vanilla (ES6+)
- **Renderização Gráfica:** HTML5 Canvas API
- **Ícones:** Lucide Icons

## 🌟 Funcionalidades e Diferenciais

### 🌓 Sistema de Temas (Light & Dark Mode)

O portfólio conta com uma inversão completa de paleta de cores. O modo escuro apresenta tons "Deep Space" (roxos e azuis), enquanto o modo claro utiliza tons solares e vibrantes (âmbar e laranja). A preferência do usuário é salva automaticamente no `localStorage`.

### 🚀 Background Interativo com Canvas API

Um motor de partículas dinâmico renderiza estrelas e estrelas cadentes em tempo real.

- **Otimização:** Limite de 150 partículas para garantir performance em dispositivos móveis.
- **Reatividade:** As cores das partículas mudam instantaneamente ao alternar o tema da interface.

### 📱 Responsividade e UX Mobile

Interface totalmente adaptável para dispositivos móveis:

- **Menu Adaptativo:** Layout em grid para botões de navegação no mobile.
- **Sticky Navigation:** O botão "Voltar" transforma-se em uma barra de topo fixa ao rolar a página na seção de projetos, melhorando a navegabilidade em telas pequenas.

### 📂 Hub de Projetos Dinâmico

Navegação entre seções controlada por manipulação de estado do DOM, permitindo alternar entre a Home e a Galeria de Projetos sem recarregar o navegador.

## 📁 Projetos Indexados

O portfólio atua como hub para os seguintes repositórios:

- **Lista de Tarefas:** Gerenciador com manipulação de DOM.
- **Guia de Primeiros Socorros:** Interface informativa com Tailwind e Lucide.
- **Hora e Clima:** Integração de API com chamadas assíncronas (Async/Await).
- **Jogo da Cobrinha:** Implementação de Python no navegador via Brython Engine.
- **Automação Python:** Scripts para rotinas de arquivos.
- **Calculadora Web:** Foco em UX e design limpo.
- **Dashboard Sistema Solar:** Visualização de dados com Streamlit, Pandas e Plotly.
- **Portfólio Pessoal:** Esta interface modular e responsiva.

## ⚙️ Configuração e Execução

Como o projeto é estruturado de forma estática (Client-side), não há dependências de servidor para a sua visualização local.

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/brunojsdev/meu-portfolio.git
   ```
2. **Acesso:**
   Basta abrir o arquivo index.html em qualquer navegador web moderno.

## Estrutura de Arquivos

- `index.html`: Estrutura SPA e marcação semântica.
- `style.css`: Variáveis de tema, lógica de Glassmorphism, animações de entrada e media queries.
- `script.js`: Gerenciamento de temas, lógica do Canvas (classes Star e ShootingStar) e controle de navegação.
- `img/`: Assets visuais e miniaturas dos projetos.

---

Desenhado e desenvolvido por **Bruno J. Silveira**.
