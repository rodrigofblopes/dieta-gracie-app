# 🥋 Dashboard Nutricional - Dieta Gracie

Dashboard interativo para acompanhar sua ingestão diária de nutrientes baseado na Dieta Gracie para ganho muscular e aumento de testosterona.

## 🚀 Como Usar

### 1. Instalação das Dependências

```bash
pip install -r requirements.txt
```

### 2. Executar o Dashboard

```bash
streamlit run dashboard_nutricional.py
```

O dashboard será aberto automaticamente no seu navegador (geralmente em `http://localhost:8501`).

## 📊 Funcionalidades

### 🎯 **Metas Diárias Configuradas**
- **Calorias:** 3.200 kcal
- **Proteínas:** 220g
- **Carboidratos:** 350g
- **Gorduras:** 110g
- **Fibras:** 55g

### 📝 **Registro de Refeições**
- **6 refeições:** Café da Manhã, Lanche da Manhã, Almoço, Lanche da Tarde, Jantar, Ceia
- **Alimentos organizados por categoria:**
  - 🥩 **Proteínas:** Frango, Contra-filé, Fígado, Ovos, Atum, Sardinha
  - 🌾 **Carboidratos:** Batata Doce, Arroz, Quinoa, Aveia
  - 🥬 **Vegetais:** Brócolis, Cenoura, Couve-flor
  - 🌰 **Gorduras:** Castanha do Pará, Amendoim, Abacate
  - 🍌 **Frutas:** Banana, Açaí

### 📈 **Visualizações**
- **Gráfico de progresso** dos últimos 7 dias
- **Barras de progresso** para cada nutriente
- **Métricas em tempo real** com comparação com metas
- **Histórico detalhado** de refeições

### 💾 **Persistência de Dados**
- Dados salvos automaticamente em `dados_nutricionais.json`
- Histórico completo de todas as refeições
- Backup automático dos registros

## 🎨 Interface

### **Sidebar (Registro)**
- Seleção de data e refeição
- Campos numéricos para cada alimento
- Botão para salvar refeição
- Feedback visual de sucesso

### **Área Principal**
- **Gráfico de progresso** interativo
- **Métricas do dia atual** com comparação
- **Barras de progresso** coloridas
- **Histórico detalhado** de refeições

### **Painel Lateral**
- **Metas diárias** sempre visíveis
- **Dicas da Dieta Gracie**
- **Estatísticas** dos últimos 7 dias
- **Feedback** sobre performance

## 🥋 Princípios da Dieta Gracie Integrados

- 🍽️ **Mastigação:** 30 vezes cada garfada
- ⏰ **Horários regulares** de refeição
- 💧 **Sem líquidos** durante a refeição
- 🕐 **3 horas** entre refeições
- 🧘 **Ambiente calmo** para comer
- 🥗 **Não misturar** alimentos na boca

## 📱 Responsividade

O dashboard é totalmente responsivo e funciona bem em:
- 💻 **Desktop** (recomendado)
- 📱 **Tablet**
- 📱 **Smartphone**

## 🔧 Personalização

### **Adicionar Novos Alimentos**
Edite o dicionário `ALIMENTOS` no arquivo `dashboard_nutricional.py`:

```python
"Novo Alimento (100g)": {
    "proteina": 20,
    "carboidrato": 30,
    "gordura": 10,
    "calorias": 280
}
```

### **Ajustar Metas**
Modifique o dicionário `METAS_DIARIAS`:

```python
METAS_DIARIAS = {
    "calorias": 3500,  # Sua meta de calorias
    "proteina": 250,   # Sua meta de proteínas
    # ... outros nutrientes
}
```

## 📊 Exemplo de Uso

1. **Abra o dashboard** no navegador
2. **Na sidebar**, selecione a data e refeição
3. **Preencha as quantidades** dos alimentos consumidos
4. **Clique em "Salvar Refeição"**
5. **Visualize o progresso** no gráfico principal
6. **Acompanhe as metas** nas barras de progresso
7. **Consulte o histórico** na seção inferior

## 💡 Dicas de Uso

- **Registre imediatamente** após cada refeição
- **Use a balança** para quantidades precisas
- **Acompanhe diariamente** o progresso
- **Ajuste conforme necessário** baseado nos resultados
- **Mantenha consistência** para melhores resultados

## 🔄 Backup e Restauração

Os dados são salvos automaticamente em `dados_nutricionais.json`. Para fazer backup:

1. **Copie o arquivo** `dados_nutricionais.json`
2. **Cole em local seguro** (nuvem, pendrive, etc.)
3. **Para restaurar**, substitua o arquivo original

## 🐛 Solução de Problemas

### **Erro de Dependências**
```bash
pip install --upgrade streamlit pandas plotly
```

### **Dashboard não abre**
```bash
streamlit run dashboard_nutricional.py --server.port 8501
```

### **Dados não salvam**
- Verifique permissões de escrita na pasta
- Reinicie o dashboard

## 📈 Benefícios do Acompanhamento

- **Consciência nutricional** aumentada
- **Ajustes precisos** na dieta
- **Motivação** através do progresso visual
- **Resultados mensuráveis** para ganho muscular
- **Adesão** aos princípios da Dieta Gracie

---

**🥋 Mantenha o foco, registre suas refeições e alcance seus objetivos de ganho muscular!**
