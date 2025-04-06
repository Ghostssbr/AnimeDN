// script.js
function proximaEtapa(etapa) {
    document.querySelectorAll('[id^="etapa"]').forEach(el => el.classList.add('hidden'));
    document.getElementById(`etapa${etapa}`).classList.remove('hidden');
    updateProgressIndicators(etapa);
}

function updateProgressIndicators(currentStep) {
    // ... (código existente mantido igual)
}

function salvarConfig() {
    // Validar nome do projeto
    const projectName = document.getElementById('nomeProjeto').value.trim();
    if (!projectName) {
        alert('Por favor, insira um nome para o projeto');
        return;
    }

    // Validar configuração do Firebase
    const configElement = document.getElementById('editorFirebase');
    let config;
    
    try {
        config = JSON.parse(configElement.textContent);
    } catch (error) {
        alert('Erro no formato JSON! Verifique a configuração');
        return;
    }

    // Validar campos obrigatórios
    const requiredFields = [
        'apiKey', 'authDomain', 'projectId', 
        'storageBucket', 'messagingSenderId', 'appId'
    ];
    
    const missingFields = requiredFields.filter(field => !config[field]);
    if (missingFields.length > 0) {
        alert(`Campos obrigatórios faltando: ${missingFields.join(', ')}`);
        return;
    }

    // Salvar no localStorage
    localStorage.setItem('firebaseConfig', JSON.stringify(config));
    localStorage.setItem('projectName', projectName);

    proximaEtapa(3);
}

function mostrarDashboard() {
    // Redirecionar para o dashboard
    window.location.href = 'dashboard.html';
}

// Inicialização do editor de código
document.getElementById('editorFirebase').addEventListener('paste', (e) => {
    e.preventDefault();
    const text = (e.clipboardData || window.clipboardData).getData('text');
    document.execCommand('insertText', false, text);
});