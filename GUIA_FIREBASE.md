# 🔥 Guia de Configuração do Firebase para Sincronização na Nuvem

## 📋 Pré-requisitos

1. Conta Google
2. Acesso ao Firebase Console
3. Projeto no Firebase

## 🚀 Passo a Passo

### 1️⃣ Criar Projeto no Firebase

1. **Acesse:** [Firebase Console](https://console.firebase.google.com/)
2. **Clique em:** "Criar projeto"
3. **Nome do projeto:** `dieta-gracie-app`
4. **Habilitar Google Analytics:** Opcional
5. **Clique em:** "Criar projeto"

### 2️⃣ Configurar Firestore Database

1. **No menu lateral:** Clique em "Firestore Database"
2. **Clique em:** "Criar banco de dados"
3. **Modo de segurança:** "Iniciar no modo de teste"
4. **Localização:** Escolha a mais próxima (ex: `us-central1`)
5. **Clique em:** "Próximo"

### 3️⃣ Configurar Regras de Segurança

1. **Na aba "Regras":**
2. **Substitua as regras por:**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir acesso aos dados do usuário
    match /users/{userId} {
      allow read, write: if true; // Para teste - em produção use autenticação
    }
  }
}
```

3. **Clique em:** "Publicar"

### 4️⃣ Obter Configuração do Projeto

1. **No menu lateral:** Clique em "Configurações do projeto" (ícone de engrenagem)
2. **Aba "Geral":** Role até "Seus aplicativos"
3. **Clique em:** "Adicionar app" → "Web"
4. **Apelido do app:** `dieta-gracie-web`
5. **Clique em:** "Registrar app"
6. **Copie a configuração:**

```javascript
const firebaseConfig = {
  apiKey: "sua-api-key-aqui",
  authDomain: "dieta-gracie-app.firebaseapp.com",
  projectId: "dieta-gracie-app",
  storageBucket: "dieta-gracie-app.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdefghijklmnop"
};
```

### 5️⃣ Atualizar Configuração no App

1. **Abra o arquivo:** `firebase-config.js`
2. **Substitua a configuração** pela sua configuração real
3. **Salve o arquivo**

### 6️⃣ Testar Sincronização

1. **Abra o app:** `https://dietagracieapp.vercel.app/sincronizacao.html`
2. **Clique em:** "☁️ Salvar na Nuvem"
3. **Verifique no Firebase Console** se os dados aparecem

## 🔧 Configurações Avançadas

### Autenticação (Opcional)

Para maior segurança, você pode adicionar autenticação:

1. **No Firebase Console:** Authentication → "Começar"
2. **Provedores:** Habilitar "Email/Senha"
3. **Atualizar regras do Firestore:**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### Backup Automático

Configure backup automático no Firebase:

1. **Firestore Database:** Configurações → Backup
2. **Habilitar:** Backup automático
3. **Frequência:** Diária
4. **Retenção:** 30 dias

## 🚨 Segurança

### Regras de Produção

Para produção, use regras mais restritivas:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### Limites de Uso

- **Leituras gratuitas:** 50.000/dia
- **Escritas gratuitas:** 20.000/dia
- **Para uso intensivo:** Considere upgrade

## 🔍 Monitoramento

### Verificar Uso

1. **Firebase Console:** Uso e cobrança
2. **Monitorar:** Leituras, escritas, armazenamento
3. **Alertas:** Configurar alertas de uso

### Logs

1. **Firebase Console:** Functions → Logs
2. **Monitorar:** Erros e performance

## 🆘 Solução de Problemas

### Erro de Configuração

```
Firebase: Error (auth/invalid-api-key)
```

**Solução:** Verificar se a API key está correta

### Erro de Permissão

```
Firebase: Error (permission-denied)
```

**Solução:** Verificar regras do Firestore

### Erro de Rede

```
Firebase: Error (unavailable)
```

**Solução:** Verificar conexão com internet

## 📞 Suporte

- **Documentação:** [Firebase Docs](https://firebase.google.com/docs)
- **Comunidade:** [Firebase Community](https://firebase.google.com/community)
- **Stack Overflow:** Tag `firebase`

## ✅ Checklist

- [ ] Projeto criado no Firebase
- [ ] Firestore Database configurado
- [ ] Regras de segurança definidas
- [ ] Configuração atualizada no app
- [ ] Teste de sincronização realizado
- [ ] Backup configurado (opcional)
- [ ] Monitoramento ativo

---

**🎉 Parabéns!** Seu app agora tem sincronização na nuvem funcionando!
