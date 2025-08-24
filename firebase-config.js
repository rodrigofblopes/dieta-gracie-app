// Configuração do Firebase para sincronização na nuvem
const firebaseConfig = {
    apiKey: "AIzaSyBE5_S3-lBa44RVNtEYunkB0Ik999KInI8",
    authDomain: "dieta-gracie-app.firebaseapp.com",
    projectId: "dieta-gracie-app",
    storageBucket: "dieta-gracie-app.firebasestorage.app",
    messagingSenderId: "191357835216",
    appId: "1:191357835216:web:9d71f6a529e04ef6b2cbd5",
    measurementId: "G-QHGB6EYJC0"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Inicializar Analytics (opcional)
if (typeof firebase.analytics !== 'undefined') {
    firebase.analytics();
}

// Classe para gerenciar sincronização na nuvem
class CloudSync {
    constructor() {
        this.userId = this.getUserId();
        this.isOnline = navigator.onLine;
        console.log('🚀 CloudSync inicializado para usuário:', this.userId);
        console.log('🌐 Status online:', this.isOnline);
        
        this.setupOfflineSupport();
        this.setupAutoSync();
        
        // Carregar dados automaticamente ao iniciar
        this.autoLoad().then(loaded => {
            if (loaded) {
                this.showNotification('☁️ Dados sincronizados automaticamente!', 'success');
            } else {
                console.log('ℹ️ Nenhum dado carregado automaticamente');
            }
        });

        // Iniciar sincronização em tempo real após 5 segundos
        setTimeout(() => {
            this.startRealTimeSync();
        }, 5000);
    }

    // Gerar ID único do usuário (fixo para sincronização)
    getUserId() {
        // Usar ID fixo para sincronização entre dispositivos
        let userId = localStorage.getItem('userId');
        if (!userId) {
            // ID fixo para sincronização - você pode alterar se quiser
            userId = 'dieta_gracie_user_2025';
            localStorage.setItem('userId', userId);
        }
        return userId;
    }

    // Configurar suporte offline
    setupOfflineSupport() {
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.showNotification('🌐 Conectado à internet - Sincronizando...', 'success');
            this.syncData();
        });

        window.addEventListener('offline', () => {
            this.isOnline = false;
            this.showNotification('📱 Modo offline - Dados salvos localmente', 'info');
        });
    }

    // Salvar dados na nuvem
    async saveToCloud(data) {
        try {
            if (!this.isOnline) {
                this.saveForLaterSync(data);
                return false;
            }

            console.log('💾 Salvando dados na nuvem para usuário:', this.userId);
            console.log('📊 Dados a serem salvos:', data);
            
            await db.collection('users').doc(this.userId).set({
                dadosNutricionais: data,
                lastUpdate: firebase.firestore.FieldValue.serverTimestamp(),
                deviceInfo: {
                    userAgent: navigator.userAgent,
                    platform: navigator.platform,
                    timestamp: new Date().toISOString()
                }
            });

            console.log('✅ Dados salvos com sucesso na nuvem');
            this.showNotification('☁️ Dados salvos na nuvem!', 'success');
            return true;
        } catch (error) {
            console.error('❌ Erro ao salvar na nuvem:', error);
            this.saveForLaterSync(data);
            this.showNotification('❌ Erro ao salvar na nuvem - Salvando localmente', 'error');
            return false;
        }
    }

    // Carregar dados da nuvem
    async loadFromCloud() {
        try {
            if (!this.isOnline) {
                this.showNotification('📱 Modo offline - Carregando dados locais', 'info');
                return null;
            }

            console.log('🔍 Buscando dados para usuário:', this.userId);
            const doc = await db.collection('users').doc(this.userId).get();
            
            if (doc.exists) {
                const data = doc.data();
                console.log('📄 Documento encontrado:', data);
                this.showNotification('☁️ Dados carregados da nuvem!', 'success');
                return data.dadosNutricionais;
            } else {
                console.log('📝 Documento não encontrado para usuário:', this.userId);
                this.showNotification('📝 Nenhum dado encontrado na nuvem', 'info');
                return null;
            }
        } catch (error) {
            console.error('❌ Erro ao carregar da nuvem:', error);
            this.showNotification('❌ Erro ao carregar da nuvem', 'error');
            return null;
        }
    }

    // Salvar para sincronização posterior
    saveForLaterSync(data) {
        const pendingSync = JSON.parse(localStorage.getItem('pendingSync') || '[]');
        pendingSync.push({
            data: data,
            timestamp: new Date().toISOString()
        });
        localStorage.setItem('pendingSync', JSON.stringify(pendingSync));
    }

    // Sincronizar dados pendentes
    async syncData() {
        if (!this.isOnline) return;

        const pendingSync = JSON.parse(localStorage.getItem('pendingSync') || '[]');
        if (pendingSync.length === 0) return;

        for (const sync of pendingSync) {
            try {
                await this.saveToCloud(sync.data);
            } catch (error) {
                console.error('Erro na sincronização pendente:', error);
            }
        }

        localStorage.removeItem('pendingSync');
        this.showNotification('🔄 Sincronização pendente concluída!', 'success');
    }

    // Sincronização automática
    async autoSync() {
        const localData = localStorage.getItem('dadosNutricionais');
        if (localData) {
            await this.saveToCloud(JSON.parse(localData));
        }
    }

    // Sincronização em tempo real
    async realTimeSync() {
        if (!this.isOnline) return;
        
        try {
            // Salvar dados locais na nuvem
            const localData = localStorage.getItem('dadosNutricionais');
            if (localData) {
                await this.saveToCloud(JSON.parse(localData));
            }
            
            // Carregar dados da nuvem
            await this.autoLoad();
            
            console.log('✅ Sincronização em tempo real concluída');
        } catch (error) {
            console.error('❌ Erro na sincronização em tempo real:', error);
        }
    }

    // Iniciar sincronização em tempo real
    startRealTimeSync() {
        // Sincronizar a cada 10 segundos
        this.realTimeInterval = setInterval(() => {
            this.realTimeSync();
        }, 10000);
        
        console.log('🚀 Sincronização em tempo real iniciada');
    }

    // Parar sincronização em tempo real
    stopRealTimeSync() {
        if (this.realTimeInterval) {
            clearInterval(this.realTimeInterval);
            this.realTimeInterval = null;
            console.log('⏹️ Sincronização em tempo real parada');
        }
    }

    // Sincronização automática quando dados mudam
    setupAutoSync() {
        // Monitorar mudanças no localStorage
        const originalSetItem = localStorage.setItem;
        localStorage.setItem = function(key, value) {
            originalSetItem.apply(this, arguments);
            
            // Se dados nutricionais mudaram, sincronizar automaticamente
            if (key === 'dadosNutricionais' && window.cloudSync) {
                console.log('🔄 Dados nutricionais alterados, sincronizando...');
                setTimeout(() => {
                    window.cloudSync.saveToCloud(JSON.parse(value));
                }, 1000); // Aguardar 1 segundo para evitar muitas sincronizações
            }
        };

        // Sincronização automática a cada 30 segundos
        setInterval(() => {
            if (this.isOnline) {
                this.autoSync();
            }
        }, 30000);

        // Sincronização quando a página ganha foco
        window.addEventListener('focus', () => {
            if (this.isOnline) {
                console.log('🔄 Página ganhou foco, sincronizando...');
                this.autoLoad();
            }
        });

        // Sincronização quando volta online
        window.addEventListener('online', () => {
            console.log('🔄 Conexão restaurada, sincronizando...');
            this.autoSync();
        });
    }

    // Forçar sincronização manual
    async forceSync() {
        console.log('🔄 Forçando sincronização...');
        const localData = localStorage.getItem('dadosNutricionais');
        if (localData) {
            const success = await this.saveToCloud(JSON.parse(localData));
            if (success) {
                this.showNotification('✅ Sincronização forçada concluída!', 'success');
            }
        }
    }

    // Verificar status da sincronização
    async checkSyncStatus() {
        const localData = localStorage.getItem('dadosNutricionais');
        const cloudData = await this.loadFromCloud();
        
        console.log('📊 Status da sincronização:');
        console.log('Local:', localData ? JSON.parse(localData) : 'vazio');
        console.log('Cloud:', cloudData);
        
        return {
            local: localData ? JSON.parse(localData) : null,
            cloud: cloudData,
            isOnline: this.isOnline
        };
    }

    // Carregar dados automaticamente ao iniciar
    async autoLoad() {
        if (this.isOnline) {
            console.log('🔄 Tentando carregar dados da nuvem...');
            const cloudData = await this.loadFromCloud();
            if (cloudData) {
                console.log('✅ Dados encontrados na nuvem:', cloudData);
                
                // Verificar se os dados locais são mais recentes
                const localData = localStorage.getItem('dadosNutricionais');
                if (localData) {
                    const localObj = JSON.parse(localData);
                    const cloudObj = cloudData;
                    
                    // Mesclar dados de forma inteligente
                    const dadosMesclados = this.mergeData(localObj, cloudObj);
                    localStorage.setItem('dadosNutricionais', JSON.stringify(dadosMesclados));
                    console.log('✅ Dados mesclados e salvos localmente');
                } else {
                    localStorage.setItem('dadosNutricionais', JSON.stringify(cloudData));
                    console.log('✅ Dados da nuvem salvos localmente');
                }
                return true;
            } else {
                console.log('❌ Nenhum dado encontrado na nuvem');
            }
        } else {
            console.log('❌ Offline - não é possível carregar da nuvem');
        }
        return false;
    }

    // Mesclar dados de forma inteligente
    mergeData(localData, cloudData) {
        const merged = { ...localData };
        
        // Para cada data, mesclar as refeições
        Object.keys(cloudData).forEach(data => {
            if (!merged[data]) {
                merged[data] = cloudData[data];
            } else {
                // Mesclar refeições da mesma data
                const localRefeicoes = merged[data];
                const cloudRefeicoes = cloudData[data];
                
                // Criar mapa de refeições por ID para evitar duplicatas
                const refeicoesMap = new Map();
                
                // Adicionar refeições locais
                localRefeicoes.forEach(refeicao => {
                    refeicoesMap.set(refeicao.id, refeicao);
                });
                
                // Adicionar refeições da nuvem (sobrescrevem se mesmo ID)
                cloudRefeicoes.forEach(refeicao => {
                    refeicoesMap.set(refeicao.id, refeicao);
                });
                
                merged[data] = Array.from(refeicoesMap.values());
            }
        });
        
        return merged;
    }

    // Mostrar notificação
    showNotification(message, type = 'info') {
        // Remover notificação anterior se existir
        const notificacaoAnterior = document.getElementById('cloud-notification');
        if (notificacaoAnterior) {
            notificacaoAnterior.remove();
        }
        
        // Criar nova notificação
        const notificacao = document.createElement('div');
        notificacao.id = 'cloud-notification';
        notificacao.className = `fixed top-4 left-4 p-4 rounded-lg shadow-lg z-50 max-w-sm ${
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

    // Obter status da conexão
    getConnectionStatus() {
        return {
            online: this.isOnline,
            userId: this.userId,
            pendingSync: JSON.parse(localStorage.getItem('pendingSync') || '[]').length
        };
    }
}

// Instância global
window.cloudSync = new CloudSync();

