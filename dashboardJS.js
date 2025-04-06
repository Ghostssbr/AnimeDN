// dashboardJS.js
let db;
let storage;
let animes = [];

// Inicialização do Firebase
document.addEventListener('DOMContentLoaded', async () => {
    // Recuperar configurações
    const firebaseConfig = JSON.parse(localStorage.getItem('firebaseConfig'));
    const projectName = localStorage.getItem('projectName');
    
    if (!firebaseConfig || !projectName) {
        window.location.href = 'index.html';
        return;
    }

    // Atualizar UI com nome do projeto
    document.getElementById('tituloDashboard').textContent = projectName;
    document.getElementById('sidebarTitulo').textContent = projectName;
    
    try {
        // Inicializar Firebase
        const app = firebase.initializeApp(firebaseConfig);
        db = firebase.firestore();
        storage = firebase.storage();
        
        // Carregar animes do Firestore
        await loadAnimes();
        setupRealTimeUpdates();
    } catch (error) {
        console.error('Erro ao inicializar Firebase:', error);
        alert('Erro na configuração do Firebase! Verifique suas credenciais.');
        window.location.href = 'index.html';
    }

    // Restante do código de inicialização...
    setupTabs();
    setupDarkMode();
});

async function loadAnimes() {
    try {
        const snapshot = await db.collection('animes').get();
        animes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        renderAnimes();
    } catch (error) {
        console.error('Erro ao carregar animes:', error);
    }
}

function setupRealTimeUpdates() {
    db.collection('animes').onSnapshot(snapshot => {
        animes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        renderAnimes();
    });
}

// Modifique as funções CRUD para usar Firestore
async function addAnime(anime) {
    try {
        await db.collection('animes').add(anime);
    } catch (error) {
        console.error('Erro ao adicionar anime:', error);
        alert('Erro ao salvar no Firebase!');
    }
}

async function deleteAnime(id) {
    try {
        await db.collection('animes').doc(id).delete();
    } catch (error) {
        console.error('Erro ao remover anime:', error);
        alert('Erro ao remover do Firebase!');
    }
}

async function clearAnimes() {
    const batch = db.batch();
    const snapshot = await db.collection('animes').get();
    
    snapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
    });
    
    try {
        await batch.commit();
    } catch (error) {
        console.error('Erro ao limpar animes:', error);
        alert('Erro ao limpar a coleção!');
    }
}

// Atualize o event listener do formulário
document.getElementById('formAnime').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const newAnime = {
        title: document.getElementById('animeTitle').value,
        episodes: document.getElementById('animeEpisodes').value,
        genre: document.getElementById('animeGenre').value,
        year: document.getElementById('animeYear').value,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };
    
    try {
        await addAnime(newAnime);
        this.reset();
        
        // Feedback visual
        const btn = this.querySelector('button');
        btn.innerHTML = '<i class="fas fa-check"></i> Anime Adicionado!';
        setTimeout(() => {
            btn.innerHTML = '<i class="fas fa-plus"></i> Adicionar Anime';
        }, 2000);
    } catch (error) {
        alert('Erro ao salvar anime!');
    }
});

// Atualize a função de renderização
function renderAnimes() {
    const tbody = document.getElementById('animeList');
    const emptyState = document.getElementById('emptyState');
    
    if(animes.length === 0) {
        tbody.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    }
    
    emptyState.style.display = 'none';
    tbody.innerHTML = animes.map(anime => `
        <tr class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                ${anime.title}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                ${anime.episodes || '--'}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                ${anime.genre || 'Não informado'}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                ${anime.year || '--'}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button onclick="deleteAnime('${anime.id}')" 
                        class="text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors px-2 py-1 rounded-lg flex items-center gap-2">
                    <i class="fas fa-trash text-sm"></i>
                    <span class="hidden sm:inline">Remover</span>
                </button>
            </td>
        </tr>
    `).join('');
}

// Restante do código mantido...
function setupTabs() {
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            menuItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            
            const tabName = this.dataset.tab;
            document.querySelectorAll('#conteudoAbas > div').forEach(tab => {
                tab.classList.add('hidden');
            });
            document.getElementById(`tab-${tabName}`).classList.remove('hidden');
        });
    });
}

function setupDarkMode() {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
    }
    
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        e.matches ? document.documentElement.classList.add('dark') 
                 : document.documentElement.classList.remove('dark');
    });
}