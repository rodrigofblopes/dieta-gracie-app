# 🥋 Dieta Gracie - App Nutricional React

Aplicativo web moderno para controle da Dieta Gracie adaptada para ganho de massa muscular.

## 🚀 Como Rodar o Aplicativo

### Pré-requisitos
- Node.js (versão 16 ou superior)
- npm ou yarn

### Instalação

1. **Instalar dependências:**
```bash
npm install
```

2. **Rodar em modo desenvolvimento:**
```bash
npm run dev
```

3. **Ou usar o script de inicialização:**
```bash
# Windows
iniciar_app_react.bat

# Linux/Mac
./iniciar_app_react.sh
```

### Comandos Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria build de produção
- `npm run preview` - Visualiza o build de produção

## 📱 Funcionalidades

### 🎯 Dashboard
- Visão geral das métricas diárias
- Calorias, proteínas, carboidratos e gorduras
- Lista de refeições do dia
- Princípios da Dieta Gracie

### 🍽️ Ingredientes
- Banco de dados de alimentos
- Adicionar novos ingredientes
- Categorização automática
- Informações nutricionais detalhadas

### 🎯 Refeições
- Construtor de refeições
- Cálculo automático de nutrientes
- Controle de quantidades
- Salvar refeições

### 📖 Receitas
- Receitas pré-definidas da Dieta Gracie
- Sugestões para pré e pós-treino
- Informações nutricionais das receitas
- Instruções de preparo

### 📅 Histórico
- Histórico completo de refeições
- Agrupamento por data
- Resumo nutricional diário
- Análise de progresso

## 🎨 Tecnologias Utilizadas

- **React 18** - Framework principal
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Vite** - Build tool e dev server
- **Lucide React** - Ícones

## 📊 Princípios da Dieta Gracie

O aplicativo segue os princípios da Dieta Gracie adaptados para ganho de massa:

1. **Combinações Corretas:**
   - Proteínas + Carboidratos complexos
   - Evitar frutas ácidas com proteínas

2. **Timing Nutricional:**
   - Intervalos de 3-4 horas entre refeições
   - Pré-treino: 2h antes
   - Pós-treino: até 1h após

3. **Alimentos Prioritários:**
   - Naturais e integrais
   - Proteínas magras
   - Carboidratos complexos
   - Gorduras saudáveis

## 🎯 Metas Nutricionais

### Para Ganho de Massa Muscular:
- **Calorias:** 2800-3200 kcal/dia
- **Proteína:** 140-180g/dia
- **Carboidratos:** 280-320g/dia
- **Gorduras:** 70-90g/dia

## 📱 Interface Responsiva

O aplicativo é totalmente responsivo e funciona em:
- Desktop
- Tablet
- Smartphone

## 🔧 Estrutura do Projeto

```
gracie-diet-app/
├── src/
│   ├── App.tsx          # Componente principal
│   ├── main.tsx         # Ponto de entrada
│   └── index.css        # Estilos globais
├── package.json         # Dependências
├── vite.config.ts       # Configuração Vite
├── tailwind.config.js   # Configuração Tailwind
└── index.html           # HTML principal
```

## 🚀 Deploy

Para fazer deploy em produção:

```bash
npm run build
```

Os arquivos serão gerados na pasta `dist/` e podem ser hospedados em qualquer servidor web.

## 📞 Suporte

Para dúvidas ou problemas, consulte a documentação da Dieta Gracie ou entre em contato.
