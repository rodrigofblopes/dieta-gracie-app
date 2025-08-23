// Configuração do Firebase para sincronização
const firebaseConfig = {
    apiKey: "AIzaSyBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    authDomain: "dieta-gracie-app.firebaseapp.com",
    projectId: "dieta-gracie-app",
    storageBucket: "dieta-gracie-app.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abcdef1234567890"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Funções de sincronização
class DataSync {
    constructor() {
        this.userId = this.getUserId();
        this.isOnline = navigator.onLine;
        this.setupOfflineSupport();
    }

    // Gerar ID único do usuário
    getUserId() {
        let userId = localStorage.getItem('userId');
        if (!userId) {
            userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('userId', userId);
        }
        return userId;
    }

    // Configurar suporte offline
    setupOfflineSupport() {
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.syncData();
            this.showNotification('🌐 Conectado - Dados sincronizados!', 'success');
        });

        window.addEventListener('offline', () => {
            this.isOnline = false;
            this.showNotification('📱 Modo offline - Dados salvos localmente', 'info');
        });
    }

    // Salvar dados no Firebase
    async saveToCloud(data, collection) {
        if (!this.isOnline) {
            // Salvar para sincronização posterior
            this.saveForLaterSync(data, collection);
            return;
        }

        try {
            await db.collection('users').doc(this.userId)
                .collection(collection).doc('data')
                .set({
                    data: data,
                    lastUpdated: firebase.firestore.FieldValue.serverTimestamp(),
                    device: navigator.userAgent
                });
        } catch (error) {
            console.error('Erro ao salvar na nuvem:', error);
            this.saveForLaterSync(data, collection);
        }
    }

    // Carregar dados do Firebase
    async loadFromCloud(collection) {
        if (!this.isOnline) {
            return null;
        }

        try {
            const doc = await db.collection('users').doc(this.userId)
                .collection(collection).doc('data').get();
            
            if (doc.exists) {
                return doc.data().data;
            }
        } catch (error) {
            console.error('Erro ao carregar da nuvem:', error);
        }
        return null;
    }

    // Salvar para sincronização posterior
    saveForLaterSync(data, collection) {
        const pendingSync = JSON.parse(localStorage.getItem('pendingSync') || '{}');
        pendingSync[collection] = {
            data: data,
            timestamp: Date.now()
        };
        localStorage.setItem('pendingSync', JSON.stringify(pendingSync));
    }

    // Sincronizar dados pendentes
    async syncData() {
        if (!this.isOnline) return;

        const pendingSync = JSON.parse(localStorage.getItem('pendingSync') || '{}');
        
        for (const [collection, syncData] of Object.entries(pendingSync)) {
            try {
                await this.saveToCloud(syncData.data, collection);
                delete pendingSync[collection];
            } catch (error) {
                console.error(`Erro ao sincronizar ${collection}:`, error);
            }
        }
        
        localStorage.setItem('pendingSync', JSON.stringify(pendingSync));
    }

    // Mostrar notificação
    showNotification(message, type = 'info') {
        // Implementar notificação visual
        console.log(`${type.toUpperCase()}: ${message}`);
    }

    // Verificar status da conexão
    getConnectionStatus() {
        return {
            online: this.isOnline,
            userId: this.userId,
            lastSync: localStorage.getItem('lastSync')
        };
    }
}

// Exportar para uso global
window.DataSync = DataSync;
