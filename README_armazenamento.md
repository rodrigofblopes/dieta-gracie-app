# 📊 Sistema de Armazenamento - Dieta Gracie App

## 🗂️ Onde os Dados são Salvos

### **localStorage do Navegador**
- **Localização**: Armazenamento local do navegador
- **Chave**: `'gracie-diet-meals'`
- **Formato**: JSON stringificado
- **Persistência**: Mantém os dados entre sessões do navegador

### **Arquivo de Backup JSON**
- **Nome**: `refeicoes_dieta_gracie.json`
- **Localização**: Pasta de downloads do usuário
- **Formato**: JSON estruturado
- **Uso**: Backup e transferência de dados

## 🔧 Funcionalidades de Gerenciamento

### **1. Informações do Armazenamento**
- **Botão**: `ℹ️ Info Armazenamento`
- **Função**: Mostra detalhes sobre os dados salvos
- **Informações exibidas**:
  - Local de armazenamento
  - Chave utilizada
  - Número de refeições salvas
  - Tamanho dos dados
  - Data da última atualização

### **2. Backup Automático**
- **Botão**: `💾 Backup JSON`
- **Função**: Salva todos os dados em arquivo JSON
- **Arquivo gerado**: `refeicoes_dieta_gracie.json`
- **Localização**: Pasta de downloads

### **3. Importação de Dados**
- **Botão**: `📁 Importar JSON`
- **Função**: Carrega dados de arquivo JSON
- **Formato aceito**: Arquivos `.json`
- **Validação**: Verifica se o formato é válido

### **4. Exportação de Dados**
- **Botão**: `📥 Exportar JSON`
- **Função**: Exporta dados com timestamp
- **Arquivo gerado**: `refeicoes-dieta-gracie-YYYY-MM-DD.json`

### **5. Limpeza de Dados**
- **Botão**: `🗑️ Limpar Tudo`
- **Função**: Remove todos os dados salvos
- **Confirmação**: Solicita confirmação antes de apagar

## 📋 Estrutura dos Dados

### **Formato JSON das Refeições**
```json
[
  {
    "id": "2024-01-22-12-00-001",
    "date": "2024-01-22",
    "time": "12:00",
    "items": [
      {
        "ingredient": {
          "id": 1,
          "name": "Peito Frango",
          "calories": 165,
          "protein": 31,
          "carbs": 0,
          "fat": 3.6,
          "category": "Proteína",
          "benefits": "Rica em proteína magra"
        },
        "quantity": 150
      }
    ]
  }
]
```

## 🚀 Como Usar

### **Para Fazer Backup dos Dados Atuais:**
1. Vá para a aba "Histórico"
2. Clique em `💾 Backup JSON`
3. O arquivo será baixado automaticamente

### **Para Importar Dados Salvos:**
1. Vá para a aba "Histórico"
2. Clique em `📁 Importar JSON`
3. Selecione o arquivo JSON com os dados
4. Os dados serão carregados automaticamente

### **Para Verificar Informações do Armazenamento:**
1. Vá para a aba "Histórico"
2. Clique em `ℹ️ Info Armazenamento`
3. Uma janela mostrará os detalhes

## 📁 Arquivo de Exemplo

O arquivo `exemplo_refeicoes_dia_22.json` contém dados de exemplo do dia 22 de janeiro com:
- 3 refeições (12:00, 15:30, 18:00)
- Ingredientes baseados no `Insumos.csv`
- Valores nutricionais completos
- Horários específicos

## ⚠️ Importante

- **Backup Regular**: Faça backup regular dos seus dados
- **Navegador**: Os dados ficam salvos no navegador específico
- **Limpeza**: Limpar dados do navegador pode apagar as refeições
- **Compatibilidade**: Use o mesmo navegador para manter os dados

## 🔄 Sincronização

Para sincronizar dados entre dispositivos:
1. Faça backup no dispositivo atual
2. Transfira o arquivo JSON para o novo dispositivo
3. Importe o arquivo no novo dispositivo

## 📞 Suporte

Se houver problemas com o armazenamento:
1. Verifique as informações do armazenamento
2. Faça backup dos dados atuais
3. Tente importar o backup novamente
