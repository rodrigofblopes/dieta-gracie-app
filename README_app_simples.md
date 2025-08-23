# 🥋 App Nutricional Simples

Aplicativo local super simples para registrar peso e alimento, com cálculo automático de nutrientes e benefícios.

## 🚀 Como Usar

### 1. Instalação
```bash
pip install -r requirements.txt
```

### 2. Executar
```bash
streamlit run app_nutricional_simples.py
```

**Ou no Windows:** Duplo clique em `iniciar_app_simples.bat`

## 📝 Como Funciona

### **1. Registrar Alimento**
- **Digite o alimento:** frango, batata doce, ovos, etc.
- **Digite o peso:** em gramas (ex: 200g)
- **Clique em "Registrar Alimento"**

### **2. Cálculo Automático**
O app automaticamente:
- ✅ **Identifica a categoria** do alimento
- ✅ **Calcula nutrientes** baseado no peso
- ✅ **Mostra benefícios** específicos
- ✅ **Salva no histórico** com data e hora

### **3. Visualização**
- 📊 **Resumo do dia** com totais
- 📈 **Gráfico de macronutrientes**
- 📅 **Histórico por data**
- 💪 **Benefícios detalhados**

## 🍽️ Alimentos Disponíveis

### **🥩 Proteínas**
- Frango, Contra-filé, Fígado, Ovos, Atum, Sardinha

### **🌾 Carboidratos**
- Batata Doce, Arroz, Quinoa, Aveia

### **🥬 Vegetais**
- Brócolis, Cenoura, Couve-flor

### **🌰 Gorduras**
- Castanha do Pará, Amendoim, Abacate

### **🍌 Frutas**
- Banana, Açaí

## 📊 Exemplo de Uso

1. **Digite:** "frango"
2. **Peso:** 200g
3. **Clique:** "Registrar Alimento"
4. **Resultado:**
   - Categoria: Proteína
   - Proteína: 46.2g
   - Carboidrato: 0g
   - Gordura: 2.4g
   - Calorias: 220 kcal
   - Benefícios: 5 benefícios específicos

## 🎯 Benefícios Mostrados

Cada alimento mostra **5 benefícios específicos** como:
- 🥩 **Proteína magra** para construção muscular
- 💪 **Vitaminas** para imunidade
- 🧠 **Nutrientes** para cognição
- ⚡ **Energia** para treinos
- 🦴 **Minerais** para saúde óssea

## 📈 Funcionalidades

### **📊 Resumo Diário**
- Totais de calorias, proteínas, carboidratos, gorduras
- Gráfico de pizza com distribuição
- Lista expandível de alimentos

### **📅 Histórico**
- Seleção de data específica
- Totais por dia
- Alimentos agrupados por categoria
- Detalhes completos de cada registro

### **💾 Persistência**
- Dados salvos em `registros_nutricionais.json`
- Histórico completo mantido
- Backup automático

## 🎨 Interface

### **🔄 Layout Responsivo**
- **Coluna esquerda:** Registro de alimentos
- **Coluna direita:** Resumo do dia
- **Seção inferior:** Histórico completo

### **🎯 Design Intuitivo**
- Campos simples e diretos
- Feedback visual imediato
- Cores organizadas por categoria
- Ícones para fácil identificação

## 💡 Dicas de Uso

### **📝 Registro Eficiente**
- Use nomes simples: "frango" em vez de "peito de frango"
- Pese sempre em gramas para precisão
- Registre imediatamente após consumir

### **📊 Acompanhamento**
- Verifique o resumo diário regularmente
- Use o histórico para identificar padrões
- Compare dias diferentes

### **🔍 Busca Inteligente**
O app reconhece variações:
- "frango" = "frango"
- "batata" = "batata doce"
- "ovo" = "ovos"

## 🆕 Adicionar Novos Alimentos

Para adicionar novos alimentos, edite o dicionário `ALIMENTOS_DB` no arquivo:

```python
"novo_alimento": {
    "categoria": "Proteína",
    "proteina": 25.0,
    "carboidrato": 0,
    "gordura": 5.0,
    "calorias": 150,
    "fibra": 0,
    "beneficios": [
        "Benefício 1",
        "Benefício 2",
        "Benefício 3",
        "Benefício 4",
        "Benefício 5"
    ]
}
```

## 🔄 Backup e Restauração

Os dados são salvos em `registros_nutricionais.json`:
1. **Copie o arquivo** para backup
2. **Cole em local seguro**
3. **Substitua** para restaurar

## 🐛 Solução de Problemas

### **Alimento não encontrado**
- Verifique a lista de alimentos disponíveis
- Use nomes simples (ex: "frango" não "peito de frango")
- Tente variações do nome

### **App não abre**
```bash
pip install --upgrade streamlit
streamlit run app_nutricional_simples.py --server.port 8502
```

### **Dados não salvam**
- Verifique permissões de escrita
- Reinicie o app

## 📱 Compatibilidade

- 💻 **Desktop:** Chrome, Firefox, Safari, Edge
- 📱 **Mobile:** Responsivo para smartphones
- 🖥️ **Sistemas:** Windows, macOS, Linux

## 🎯 Vantagens

✅ **Simplicidade:** Interface direta e intuitiva
✅ **Precisão:** Cálculos baseados em dados nutricionais reais
✅ **Educação:** Benefícios específicos de cada alimento
✅ **Histórico:** Acompanhamento completo por data
✅ **Flexibilidade:** Registro individual de alimentos
✅ **Visualização:** Gráficos e métricas claras

---

**🥋 Registre, calcule e acompanhe sua nutrição de forma simples e eficiente!**
