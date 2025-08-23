# 🥋 Dieta Gracie App - Versão Local

## ✅ Funcionamento Completo Offline

Este aplicativo funciona **100% localmente** sem necessidade de:
- ❌ Login com Google
- ❌ Conexão com internet
- ❌ Firebase ou serviços externos
- ❌ Configurações complexas

## 🚀 Como Executar

### Opção 1: Arquivo Batch (Mais Fácil)
```bash
# Duplo clique no arquivo:
iniciar_app_react.bat
```

### Opção 2: Comando Manual
```bash
# Instalar dependências (primeira vez)
npm install

# Iniciar aplicativo
npm run dev
```

## 🌐 Acesso ao Aplicativo

Após executar, o aplicativo estará disponível em:
- **Local**: http://localhost:5173
- **Rede**: http://[seu-ip]:5173 (para outros dispositivos)

## 📱 Funcionalidades

### ✅ Cardápio Completo 7 Dias
- **Segunda a Domingo** com refeições detalhadas
- **6 refeições por dia** com horários específicos
- **Quantidades precisas** em gramas/porções

### ✅ Lanche da Tarde Especial
- **Quinoa + Abacate + Açaí**
- **Modo de preparo** detalhado
- **Informações nutricionais** completas

### ✅ Interface Moderna
- **Design responsivo** para mobile/desktop
- **Navegação intuitiva** entre dias
- **Cores e ícones** organizados

### ✅ Resumo Nutricional
- **Calorias diárias**: ~3.200 kcal
- **Proteínas**: ~220g
- **Carboidratos**: ~350g
- **Gorduras**: ~110g

## 🍽️ Estrutura das Refeições

### Horários Padrão:
- **6:00h** - Café da Manhã
- **9:00h** - Lanche da Manhã
- **12:00h** - Almoço
- **15:00h** - Lanche da Tarde ⭐
- **18:00h** - Jantar
- **21:00h** - Ceia

### Lanche da Tarde Especial:
```
🌾 Quinoa (100g) - Proteína completa
🥑 Abacate (80-100g) - Gordura saudável
🫐 Açaí (100-120g) - Antioxidantes
```

## 📋 Modo de Preparo - Lanche da Tarde

1. **Cozinhe a quinoa** até ficar macia
2. **Descasque e corte o abacate**
3. **Adicione o açaí** (polpa congelada)
4. **Bata tudo no liquidificador** com água
5. **Sirva imediatamente**

## 🔧 Requisitos Técnicos

### Mínimos:
- **Node.js** 16+ (https://nodejs.org/)
- **Navegador moderno** (Chrome, Firefox, Safari, Edge)

### Recomendados:
- **4GB RAM** disponível
- **Conexão estável** (apenas para instalação inicial)

## 📁 Estrutura do Projeto

```
DietaArtistaMarcial/
├── src/
│   ├── App.tsx          # Aplicativo principal
│   ├── main.tsx         # Ponto de entrada
│   └── index.css        # Estilos
├── public/              # Arquivos estáticos
├── package.json         # Dependências
├── iniciar_app_react.bat # Inicializador Windows
└── README_versao_local.md # Este arquivo
```

## 🎯 Benefícios da Versão Local

### ✅ Privacidade Total
- **Dados não saem do seu computador**
- **Sem rastreamento** de uso
- **Sem coleta de dados** pessoais

### ✅ Performance
- **Carregamento instantâneo**
- **Funciona offline**
- **Sem latência de rede**

### ✅ Confiabilidade
- **Sem dependências externas**
- **Funciona sempre**
- **Sem problemas de conectividade**

## 🚨 Solução de Problemas

### Erro: "Node.js não encontrado"
```bash
# Baixe e instale Node.js em:
https://nodejs.org/
```

### Erro: "Falha ao instalar dependências"
```bash
# Limpe cache e reinstale:
npm cache clean --force
npm install
```

### Porta 5173 ocupada
```bash
# O Vite automaticamente tentará a próxima porta
# Ou pare outros processos na porta 5173
```

### Aplicativo não abre no navegador
```bash
# Acesse manualmente:
http://localhost:5173
```

## 📞 Suporte

Se encontrar problemas:
1. Verifique se Node.js está instalado
2. Execute `npm install` manualmente
3. Verifique se a porta 5173 está livre
4. Acesse http://localhost:5173 no navegador

## 🎉 Pronto para Usar!

Agora você tem um aplicativo completo da Dieta Gracie que funciona **100% offline** e **sem dependências externas**!

🥋 **Bons treinos e boa nutrição!**
