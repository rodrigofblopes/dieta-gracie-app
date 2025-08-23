// Gerenciador de Sincronização de Dados
class SyncManager {
    constructor() {
        this.setupOfflineSupport();
    }

    // Configurar suporte offline
    setupOfflineSupport() {
        window.addEventListener('online', () => {
            this.showNotification('🌐 Conectado à internet', 'success');
        });

        window.addEventListener('offline', () => {
            this.showNotification('📱 Modo offline - Dados salvos localmente', 'info');
        });
    }

    // Exportar todos os dados
    exportAllData() {
        const data = {
            ingredientes: JSON.parse(localStorage.getItem('ingredientes') || '[]'),
            dadosNutricionais: JSON.parse(localStorage.getItem('dadosNutricionais') || '{}'),
            refeicaoAtual: JSON.parse(localStorage.getItem('refeicaoAtual') || '[]'),
            timestamp: new Date().toISOString(),
            version: '1.0'
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `dieta-gracie-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.showNotification('📤 Backup exportado com sucesso!', 'success');
    }

    // Importar dados
    importData(file) {
        const reader = new FileReader();
        
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                
                // Validar dados
                if (!data.version || !data.timestamp) {
                    throw new Error('Arquivo inválido');
                }

                // Restaurar dados
                if (data.ingredientes) {
                    localStorage.setItem('ingredientes', JSON.stringify(data.ingredientes));
                }
                if (data.dadosNutricionais) {
                    localStorage.setItem('dadosNutricionais', JSON.stringify(data.dadosNutricionais));
                }
                if (data.refeicaoAtual) {
                    localStorage.setItem('refeicaoAtual', JSON.stringify(data.refeicaoAtual));
                }

                this.showNotification('📥 Dados importados com sucesso!', 'success');
                
                // Recarregar página se necessário
                if (window.location.pathname.includes('ingredientes.html')) {
                    window.location.reload();
                }
                
            } catch (error) {
                this.showNotification('❌ Erro ao importar dados: ' + error.message, 'error');
            }
        };

        reader.readAsText(file);
    }

    // Sincronizar com Google Drive (simulado)
    async syncWithGoogleDrive() {
        this.showNotification('🔄 Sincronizando com Google Drive...', 'info');
        
        // Simular sincronização
        setTimeout(() => {
            this.showNotification('✅ Sincronização concluída!', 'success');
        }, 2000);
    }

    // Mostrar notificação
    showNotification(message, type = 'info') {
        // Remover notificação anterior se existir
        const notificacaoAnterior = document.getElementById('sync-notification');
        if (notificacaoAnterior) {
            notificacaoAnterior.remove();
        }
        
        // Criar nova notificação
        const notificacao = document.createElement('div');
        notificacao.id = 'sync-notification';
        notificacao.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 max-w-sm ${
            type === 'success' ? 'bg-green-500 text-white' : 
            type === 'error' ? 'bg-red-500 text-white' : 
            'bg-blue-500 text-white'
        }`;
        notificacao.innerHTML = `
            <div class="flex items-center gap-2">
                <span class="text-lg">${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}</span>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notificacao);
        
        // Remover após 3 segundos
        setTimeout(() => {
            if (notificacao.parentNode) {
                notificacao.remove();
            }
        }, 3000);
    }

    // Verificar status da conexão
    getConnectionStatus() {
        return {
            online: navigator.onLine,
            lastBackup: localStorage.getItem('lastBackup'),
            dataSize: this.getDataSize()
        };
    }

    // Calcular tamanho dos dados
    getDataSize() {
        const data = {
            ingredientes: localStorage.getItem('ingredientes'),
            dadosNutricionais: localStorage.getItem('dadosNutricionais'),
            refeicaoAtual: localStorage.getItem('refeicaoAtual')
        };
        
        const totalSize = JSON.stringify(data).length;
        return (totalSize / 1024).toFixed(2) + ' KB';
    }
}

// Exportar para uso global
window.SyncManager = SyncManager;
