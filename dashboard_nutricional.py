import streamlit as st
import json
import pandas as pd
import plotly.express as px
from datetime import datetime, timedelta
import os

# Configuração da página
st.set_page_config(
    page_title="🥋 Dashboard Nutricional - Dieta Gracie",
    page_icon="🥋",
    layout="wide",
    initial_sidebar_state="expanded"
)

# CSS personalizado
st.markdown("""
<style>
    .main-header {
        background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
        padding: 2rem;
        border-radius: 10px;
        color: white;
        text-align: center;
        margin-bottom: 2rem;
    }
    .metric-card {
        background: rgba(255, 255, 255, 0.1);
        padding: 1rem;
        border-radius: 10px;
        border-left: 4px solid #667eea;
    }
    .progress-bar {
        background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
        height: 20px;
        border-radius: 10px;
        margin: 0.5rem 0;
    }
    .refeicao-card {
        background: rgba(255, 255, 255, 0.05);
        padding: 1rem;
        border-radius: 10px;
        margin: 0.5rem 0;
        border-left: 4px solid #28a745;
    }
</style>
""", unsafe_allow_html=True)

# Dados dos alimentos
ALIMENTOS = {
    # Proteínas
    "Peito de Frango (100g)": {"proteina": 23, "carboidrato": 0, "gordura": 1, "calorias": 165, "fibra": 0},
    "Contra-Filé (100g)": {"proteina": 26, "carboidrato": 0, "gordura": 15, "calorias": 250, "fibra": 0},
    "Fígado Bovino (100g)": {"proteina": 20, "carboidrato": 3, "gordura": 4, "calorias": 135, "fibra": 0},
    "Ovos Inteiros (1 unidade)": {"proteina": 6, "carboidrato": 0.6, "gordura": 5, "calorias": 74, "fibra": 0},
    "Atum (100g)": {"proteina": 26, "carboidrato": 0, "gordura": 1, "calorias": 116, "fibra": 0},
    "Sardinha (100g)": {"proteina": 24, "carboidrato": 0, "gordura": 12, "calorias": 208, "fibra": 0},
    
    # Carboidratos
    "Batata Doce (100g)": {"proteina": 2, "carboidrato": 20, "gordura": 0.1, "calorias": 86, "fibra": 3},
    "Arroz Branco (100g)": {"proteina": 2.7, "carboidrato": 28, "gordura": 0.3, "calorias": 130, "fibra": 0.4},
    "Quinoa (100g)": {"proteina": 4.4, "carboidrato": 21.3, "gordura": 1.9, "calorias": 120, "fibra": 2.8},
    "Aveia em Flocos (100g)": {"proteina": 13.5, "carboidrato": 68, "gordura": 6.5, "calorias": 389, "fibra": 10.6},
    "Farelo de Aveia (100g)": {"proteina": 17.3, "carboidrato": 66.2, "gordura": 7, "calorias": 246, "fibra": 15.4},
    
    # Vegetais
    "Brócolis (100g)": {"proteina": 2.8, "carboidrato": 6.6, "gordura": 0.4, "calorias": 34, "fibra": 2.6},
    "Cenoura (100g)": {"proteina": 0.9, "carboidrato": 9.6, "gordura": 0.2, "calorias": 41, "fibra": 2.8},
    "Couve-flor (100g)": {"proteina": 1.9, "carboidrato": 5, "gordura": 0.3, "calorias": 25, "fibra": 2},
    
    # Gorduras
    "Castanha do Pará (100g)": {"proteina": 14, "carboidrato": 12, "gordura": 66, "calorias": 656, "fibra": 7.5},
    "Amendoim (100g)": {"proteina": 25, "carboidrato": 16, "gordura": 49, "calorias": 567, "fibra": 8.5},
    "Abacate (100g)": {"proteina": 2, "carboidrato": 9, "gordura": 15, "calorias": 160, "fibra": 6.7},
    "Nozes (100g)": {"proteina": 15, "carboidrato": 14, "gordura": 65, "calorias": 654, "fibra": 6.7},
    
    # Frutas
    "Banana (100g)": {"proteina": 1.1, "carboidrato": 23, "gordura": 0.3, "calorias": 89, "fibra": 2.6},
    "Açaí (100g)": {"proteina": 4, "carboidrato": 4, "gordura": 5, "calorias": 70, "fibra": 2.5}
}

# Metas diárias
METAS_DIARIAS = {
    "calorias": 3200,
    "proteina": 220,
    "carboidrato": 350,
    "gordura": 110,
    "fibra": 55
}

# Refeições
REFEICOES = [
    "Café da Manhã (6:00h)",
    "Lanche da Manhã (9:00h)", 
    "Almoço (12:00h)",
    "Lanche da Tarde (15:00h)",
    "Jantar (18:00h)",
    "Ceia (21:00h)"
]

def carregar_dados():
    """Carrega dados salvos do arquivo JSON"""
    if os.path.exists('dados_nutricionais.json'):
        with open('dados_nutricionais.json', 'r', encoding='utf-8') as f:
            return json.load(f)
    return {"registros": {}}

def salvar_dados(dados):
    """Salva dados no arquivo JSON"""
    with open('dados_nutricionais.json', 'w', encoding='utf-8') as f:
        json.dump(dados, f, ensure_ascii=False, indent=2)

def calcular_nutrientes(alimentos_consumidos):
    """Calcula totais de nutrientes baseado nos alimentos consumidos"""
    totais = {"proteina": 0, "carboidrato": 0, "gordura": 0, "calorias": 0, "fibra": 0}
    
    for alimento, quantidade in alimentos_consumidos.items():
        if alimento in ALIMENTOS and quantidade > 0:
            for nutriente in totais:
                totais[nutriente] += (ALIMENTOS[alimento][nutriente] * quantidade / 100)
    
    return totais

def calcular_progresso(totais):
    """Calcula progresso em relação às metas"""
    progresso = {}
    for nutriente, meta in METAS_DIARIAS.items():
        progresso[nutriente] = min((totais[nutriente] / meta) * 100, 100)
    return progresso

def main():
    # Header principal
    st.markdown("""
    <div class="main-header">
        <h1>🥋 Dashboard Nutricional - Dieta Gracie</h1>
        <p>Ganho de Massa Muscular e Aumento de Testosterona</p>
    </div>
    """, unsafe_allow_html=True)
    
    # Carregar dados
    dados = carregar_dados()
    
    # Sidebar para registro
    with st.sidebar:
        st.header("📝 Registrar Refeição")
        
        # Seleção de data
        data = st.date_input("Data", value=datetime.now())
        data_str = data.strftime("%Y-%m-%d")
        
        # Seleção de refeição
        refeicao = st.selectbox("Refeição", REFEICOES)
        
        st.markdown("---")
        st.subheader("🍽️ Alimentos Consumidos")
        
        # Campos para cada alimento
        alimentos_consumidos = {}
        
        # Proteínas
        st.markdown("**🥩 Proteínas**")
        for alimento in [k for k in ALIMENTOS.keys() if "Frango" in k or "Contra" in k or "Fígado" in k or "Ovos" in k or "Atum" in k or "Sardinha" in k]:
            quantidade = st.number_input(f"{alimento}", min_value=0.0, value=0.0, step=10.0, key=f"prot_{alimento}")
            if quantidade > 0:
                alimentos_consumidos[alimento] = quantidade
        
        # Carboidratos
        st.markdown("**🌾 Carboidratos**")
        for alimento in [k for k in ALIMENTOS.keys() if "Batata" in k or "Arroz" in k or "Quinoa" in k or "Aveia" in k]:
            quantidade = st.number_input(f"{alimento}", min_value=0.0, value=0.0, step=10.0, key=f"carb_{alimento}")
            if quantidade > 0:
                alimentos_consumidos[alimento] = quantidade
        
        # Vegetais
        st.markdown("**🥬 Vegetais**")
        for alimento in [k for k in ALIMENTOS.keys() if "Brócolis" in k or "Cenoura" in k or "Couve" in k]:
            quantidade = st.number_input(f"{alimento}", min_value=0.0, value=0.0, step=10.0, key=f"veg_{alimento}")
            if quantidade > 0:
                alimentos_consumidos[alimento] = quantidade
        
        # Gorduras
        st.markdown("**🌰 Gorduras**")
        for alimento in [k for k in ALIMENTOS.keys() if "Castanha" in k or "Amendoim" in k or "Abacate" in k or "Nozes" in k]:
            quantidade = st.number_input(f"{alimento}", min_value=0.0, value=0.0, step=10.0, key=f"gord_{alimento}")
            if quantidade > 0:
                alimentos_consumidos[alimento] = quantidade
        
        # Frutas
        st.markdown("**🍌 Frutas**")
        for alimento in [k for k in ALIMENTOS.keys() if "Banana" in k or "Açaí" in k]:
            quantidade = st.number_input(f"{alimento}", min_value=0.0, value=0.0, step=10.0, key=f"frut_{alimento}")
            if quantidade > 0:
                alimentos_consumidos[alimento] = quantidade
        
        # Botão para salvar
        if st.button("💾 Salvar Refeição", type="primary"):
            if alimentos_consumidos:
                # Calcular nutrientes
                nutrientes = calcular_nutrientes(alimentos_consumidos)
                
                # Salvar no dicionário de dados
                if data_str not in dados["registros"]:
                    dados["registros"][data_str] = {}
                
                dados["registros"][data_str][refeicao] = {
                    "alimentos": alimentos_consumidos,
                    "nutrientes": nutrientes,
                    "timestamp": datetime.now().isoformat()
                }
                
                # Salvar no arquivo
                salvar_dados(dados)
                st.success(f"✅ Refeição salva com sucesso!")
                st.balloons()
            else:
                st.warning("⚠️ Adicione pelo menos um alimento!")
    
    # Área principal
    col1, col2 = st.columns([2, 1])
    
    with col1:
        st.header("📊 Progresso do Dia")
        
        # Calcular totais do dia
        if data_str in dados["registros"]:
            totais_dia = {"proteina": 0, "carboidrato": 0, "gordura": 0, "calorias": 0, "fibra": 0}
            for refeicao_dados in dados["registros"][data_str].values():
                for nutriente, valor in refeicao_dados["nutrientes"].items():
                    totais_dia[nutriente] += valor
            
            progresso = calcular_progresso(totais_dia)
            
            # Métricas principais
            metric_cols = st.columns(4)
            with metric_cols[0]:
                st.metric("🔥 Calorias", f"{totais_dia['calorias']:.0f}", f"{totais_dia['calorias'] - METAS_DIARIAS['calorias']:.0f}")
            with metric_cols[1]:
                st.metric("🥩 Proteínas", f"{totais_dia['proteina']:.1f}g", f"{totais_dia['proteina'] - METAS_DIARIAS['proteina']:.1f}g")
            with metric_cols[2]:
                st.metric("🌾 Carboidratos", f"{totais_dia['carboidrato']:.1f}g", f"{totais_dia['carboidrato'] - METAS_DIARIAS['carboidrato']:.1f}g")
            with metric_cols[3]:
                st.metric("🥑 Gorduras", f"{totais_dia['gordura']:.1f}g", f"{totais_dia['gordura'] - METAS_DIARIAS['gordura']:.1f}g")
            
            # Barras de progresso
            st.markdown("### 📈 Progresso das Metas")
            for nutriente, meta in METAS_DIARIAS.items():
                percentual = progresso[nutriente]
                st.markdown(f"**{nutriente.title()}** ({totais_dia[nutriente]:.1f}/{meta})")
                st.progress(percentual / 100)
                st.markdown(f"<small>{percentual:.1f}% da meta</small>", unsafe_allow_html=True)
                st.markdown("---")
        else:
            st.info("📝 Nenhuma refeição registrada para hoje. Use a sidebar para registrar suas refeições!")
    
    with col2:
        st.header("🎯 Metas Diárias")
        for nutriente, meta in METAS_DIARIAS.items():
            st.metric(nutriente.title(), f"{meta}")
        
        st.markdown("---")
        st.header("🥋 Dicas da Dieta Gracie")
        st.markdown("""
        - 🍽️ **Mastigue 30 vezes** cada garfada
        - ⏰ **Horários regulares** de refeição
        - 💧 **Sem líquidos** durante a refeição
        - 🕐 **3 horas** entre refeições
        - 🧘 **Ambiente calmo** para comer
        - 🥗 **Não misturar** alimentos na boca
        """)
    
    # Histórico de refeições do dia
    if data_str in dados["registros"] and dados["registros"][data_str]:
        st.header(f"📋 Refeições de {data.strftime('%d/%m/%Y')}")
        
        for refeicao_nome, dados_refeicao in dados["registros"][data_str].items():
            with st.expander(f"🍽️ {refeicao_nome}"):
                col1, col2 = st.columns([2, 1])
                
                with col1:
                    st.markdown("**Alimentos consumidos:**")
                    for alimento, quantidade in dados_refeicao["alimentos"].items():
                        st.markdown(f"- {alimento}: {quantidade}g")
                
                with col2:
                    st.markdown("**Nutrientes:**")
                    for nutriente, valor in dados_refeicao["nutrientes"].items():
                        st.markdown(f"- {nutriente.title()}: {valor:.1f}")
    
    # Gráfico de progresso dos últimos 7 dias
    st.header("📈 Progresso dos Últimos 7 Dias")
    
    # Preparar dados para o gráfico
    datas_7_dias = [(datetime.now() - timedelta(days=i)).strftime("%Y-%m-%d") for i in range(6, -1, -1)]
    dados_grafico = []
    
    for data_grafico in datas_7_dias:
        if data_grafico in dados["registros"]:
            totais = {"proteina": 0, "carboidrato": 0, "gordura": 0, "calorias": 0, "fibra": 0}
            for refeicao_dados in dados["registros"][data_grafico].values():
                for nutriente, valor in refeicao_dados["nutrientes"].items():
                    totais[nutriente] += valor
            
            for nutriente, valor in totais.items():
                dados_grafico.append({
                    "Data": datetime.strptime(data_grafico, "%Y-%m-%d").strftime("%d/%m"),
                    "Nutriente": nutriente.title(),
                    "Valor": valor,
                    "Meta": METAS_DIARIAS[nutriente]
                })
    
    if dados_grafico:
        df = pd.DataFrame(dados_grafico)
        fig = px.line(df, x="Data", y="Valor", color="Nutriente", 
                     title="Progresso Nutricional - Últimos 7 Dias",
                     markers=True)
        fig.update_layout(height=400)
        st.plotly_chart(fig, use_container_width=True)
    else:
        st.info("📊 Registre refeições para ver o gráfico de progresso!")

if __name__ == "__main__":
    main()
