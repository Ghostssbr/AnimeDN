

const DashboardManager = {
    init() {
        this.loadProjectInfo();
        this.setupEventListeners();
        this.mudarAba('perfil');
    },

    loadProjectInfo() {
        const nome = localStorage.getItem('projetoNome') || 'Meu Projeto';
        const config = JSON.parse(localStorage.getItem('firebaseConfig') || '{}');
        
        document.getElementById('tituloDashboard').textContent = nome;
        document.getElementById('sidebarTitulo').textContent = nome;
        this.config = config;
    },

    setupEventListeners() {
        document.querySelectorAll('.menu-item').forEach(item => {
            item.addEventListener('click', () => {
                const tab = item.dataset.tab;
                this.mudarAba(tab);
            });
        });
    },

    mudarAba(tabId) {
        // Lógica para carregar conteúdo dinâmico
        const tabs = {
            perfil: this.renderProfileTab,
            storage: this.renderStorageTab,
            api: this.renderApiTab,
            config: this.renderConfigTab
        };

        document.getElementById('abaTitulo').textContent = this.getTabTitle(tabId);
        document.getElementById('conteudoAbas').innerHTML = tabs[tabId]();
    },

    getTabTitle(tabId) {
        const titles = {
            perfil: 'Perfil do Projeto',
            storage: 'Armazenamento',
            api: 'Chaves API',
            config: 'Configurações'
        };
        return titles[tabId];
    },

    renderProfileTab() {
        return `<div class="card">
            <h3>Informações do Projeto</h3>
            <p>ID: ${this.config.projectId || 'N/A'}</p>
        </div>`;
    },

    // Adicione outros métodos de renderização aqui
};

// Inicialização quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => DashboardManager.init());