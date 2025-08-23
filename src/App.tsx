import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit3, Save, X, BookOpen, Target, Calendar, BarChart3, ChefHat, ChevronLeft, ChevronRight, Cloud, Wifi, WifiOff } from 'lucide-react';
import { useFirebaseSync } from './hooks/useFirebaseSync';

const GracieDietApp = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [ingredients, setIngredients] = useState([]);
  
  // Hook de sincronização Firebase
  const {
    user,
    loading: authLoading,
    syncing,
    lastSync,
    signInWithGoogle,
    signOutUser,
    syncMeals,
    loadMealsFromCloud,
    subscribeToMeals
  } = useFirebaseSync();

  const [meals, setMeals] = useState([]);
  const [dailyLog, setDailyLog] = useState([]);
  const [recipes, setRecipes] = useState([
    {
      id: 1,
      name: 'Pós-Treino Massa Muscular',
      description: 'Combinação ideal para recuperação e ganho de massa',
      ingredients: [
        { ingredientId: 1, quantity: 150 },
        { ingredientId: 2, quantity: 100 },
        { ingredientId: 3, quantity: 200 }
      ],
      instructions: '1. Grelhe o frango com temperos naturais\n2. Cozinhe o arroz integral\n3. Asse a batata doce\n4. Sirva com vegetais frescos'
    }
  ]);

  // Removido estado para adicionar ingredientes manualmente

  const [currentMeal, setCurrentMeal] = useState([]);
  const [editingIngredient, setEditingIngredient] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState(new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [dashboardSelectedDate, setDashboardSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Categorias da Dieta Gracie adaptada
  const categories = ['Proteína', 'Carboidrato', 'Gordura', 'Fruta', 'Vegetal', 'Líquido'];

  // Dados nutricionais baseados nos insumos disponíveis (atualizado com Insumos.csv)
  const nutritionalData = {
    'Peito Frango': { calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0, category: 'Proteína', benefits: 'Rica em proteína magra, ideal para ganho muscular' },
    'Figado Bovino': { calories: 135, protein: 26, carbs: 3.9, fat: 3.6, fiber: 0, category: 'Proteína', benefits: 'Excelente fonte de ferro e vitamina B12' },
    'Contra-Filé': { calories: 250, protein: 26, carbs: 0, fat: 15, fiber: 0, category: 'Proteína', benefits: 'Proteína de alta qualidade, rica em creatina' },
    'Quinoa Grao Mix': { calories: 368, protein: 14, carbs: 64, fat: 6, fiber: 7, category: 'Carboidrato', benefits: 'Proteína completa, rica em fibras e minerais' },
    'Aveia em flocos grossos': { calories: 389, protein: 13, carbs: 68, fat: 6.5, fiber: 10, category: 'Carboidrato', benefits: 'Fibras beta-glucana, energia sustentada' },
    'Farelo Aveia': { calories: 246, protein: 17, carbs: 66, fat: 7, fiber: 15, category: 'Carboidrato', benefits: 'Alto teor de fibras, baixo índice glicêmico' },
    'Nozes': { calories: 654, protein: 15, carbs: 14, fat: 65, fiber: 6.7, category: 'Gordura', benefits: 'Ômega-3, antioxidantes, saúde cardiovascular' },
    'Amendoim Torrado Granulado': { calories: 567, protein: 25, carbs: 16, fat: 49, fiber: 8.5, category: 'Gordura', benefits: 'Proteína vegetal, energia concentrada' },
    'Farinha de Aveia': { calories: 389, protein: 13, carbs: 68, fat: 6.5, fiber: 10, category: 'Carboidrato', benefits: 'Fibras solúveis, controle glicêmico' },
    'Quinoa Urbano': { calories: 368, protein: 14, carbs: 64, fat: 6, fiber: 7, category: 'Carboidrato', benefits: 'Proteína completa, sem glúten' },
    'Ovos': { calories: 155, protein: 13, carbs: 1.1, fat: 11, fiber: 0, category: 'Proteína', benefits: 'Proteína de referência, colina para cognição' },
    'Castanha do Pará': { calories: 656, protein: 14, carbs: 12, fat: 66, fiber: 7.5, category: 'Gordura', benefits: 'Selênio, antioxidantes, saúde hormonal' },
    'Amendoim Cru': { calories: 567, protein: 25, carbs: 16, fat: 49, fiber: 8.5, category: 'Gordura', benefits: 'Proteína vegetal, energia sustentada' },
    'Amendoim com casca': { calories: 567, protein: 25, carbs: 16, fat: 49, fiber: 8.5, category: 'Gordura', benefits: 'Proteína vegetal, fibras da casca' },
    'Sardinha': { calories: 208, protein: 24, carbs: 0, fat: 12, fiber: 0, category: 'Proteína', benefits: 'Ômega-3, cálcio, vitamina D' },
    'Atum': { calories: 144, protein: 30, carbs: 0, fat: 1, fiber: 0, category: 'Proteína', benefits: 'Proteína magra, ômega-3, selênio' },
    'Batata Doce': { calories: 86, protein: 2, carbs: 20, fat: 0.1, fiber: 3, category: 'Carboidrato', benefits: 'Carboidrato complexo, vitamina A, fibras' },
    'Batata Doce Roxa': { calories: 86, protein: 2, carbs: 20, fat: 0.1, fiber: 3, category: 'Carboidrato', benefits: 'Antocianinas, antioxidantes, carboidrato complexo' },
    'Cenoura': { calories: 41, protein: 0.9, carbs: 10, fat: 0.2, fiber: 2.8, category: 'Vegetal', benefits: 'Betacaroteno, vitamina A, antioxidantes' },
    'Abacate': { calories: 160, protein: 2, carbs: 9, fat: 15, fiber: 6.7, category: 'Gordura', benefits: 'Gorduras saudáveis, potássio, fibras' },
    'Brocolis': { calories: 34, protein: 2.8, carbs: 7, fat: 0.4, fiber: 2.6, category: 'Vegetal', benefits: 'Sulforafano, vitamina C, fibras' },
    'Couve Flor': { calories: 25, protein: 1.9, carbs: 5, fat: 0.3, fiber: 2, category: 'Vegetal', benefits: 'Vitamina C, antioxidantes, baixas calorias' },
    'Açai': { calories: 247, protein: 4, carbs: 52, fat: 32, fiber: 2.6, category: 'Fruta', benefits: 'Antioxidantes, energia, saúde cardiovascular' },
    'Arroz Branco': { calories: 130, protein: 2.7, carbs: 28, fat: 0.3, fiber: 0.4, category: 'Carboidrato', benefits: 'Energia rápida, fácil digestão' },
    'Banana': { calories: 89, protein: 1.1, carbs: 23, fat: 0.3, fiber: 2.6, category: 'Fruta', benefits: 'Potássio, energia rápida, triptofano' }
  };

  // Carregar dados do CSV e salvar/carregar refeições
  useEffect(() => {
    loadIngredientsFromCSV();
    loadMealsFromStorage();
  }, []);

  const loadIngredientsFromCSV = () => {
    const csvData = [
      { id: 1, name: 'Peito Frango', weight: 0.692, price: 12.24, pricePerKg: 17.69, unit: 'g', location: 'Araujo' },
      { id: 2, name: 'Figado Bovino', weight: 0.416, price: 4.49, pricePerKg: 10.79, unit: 'g', location: 'Araujo' },
      { id: 3, name: 'Contra-Filé', weight: 0.606, price: 31.02, pricePerKg: 51.19, unit: 'g', location: 'Araujo' },
      { id: 4, name: 'Quinoa Grao Mix', weight: 500, price: 37, pricePerKg: 74, unit: 'g', location: 'QualiErvas' },
      { id: 5, name: 'Aveia em flocos grossos', weight: 500, price: 9.9, pricePerKg: 19.8, unit: 'g', location: 'QualiErvas' },
      { id: 6, name: 'Farelo Aveia', weight: 500, price: 9.9, pricePerKg: 19.8, unit: 'g', location: 'QualiErvas' },
      { id: 7, name: 'Nozes', weight: 120, price: 9, pricePerKg: 75, unit: 'g', location: 'QualiErvas' },
      { id: 8, name: 'Amendoim Torrado Granulado', weight: 150, price: 5, pricePerKg: 33.3, unit: 'g', location: 'QualiErvas' },
      { id: 9, name: 'Farinha de Aveia', weight: 100, price: 2.5, pricePerKg: 25, unit: 'g', location: 'QualiErvas' },
      { id: 10, name: 'Quinoa Urbano', weight: 500, price: 25, pricePerKg: 50, unit: 'g', location: 'Araujo' },
      { id: 11, name: 'Ovos', weight: 0, price: 0, pricePerKg: 0, unit: 'unid', location: 'Araujo' },
      { id: 12, name: 'Castanha do Pará', weight: 88, price: 8.8, pricePerKg: 100, unit: 'g', location: 'Mercado Central' },
      { id: 13, name: 'Amendoim Cru', weight: 200, price: 4, pricePerKg: 20, unit: 'g', location: 'QualiErvas' },
      { id: 14, name: 'Amendoim com casca', weight: 312, price: 6.86, pricePerKg: 22.0, unit: 'g', location: 'Mercado Central' },
      { id: 15, name: 'Sardinha', weight: 150, price: 15, pricePerKg: 0, unit: 'unid', location: 'Araujo' },
      { id: 16, name: 'Atum', weight: 170, price: 12, pricePerKg: 0, unit: 'unid', location: 'Araujo' },
      { id: 17, name: 'Batata Doce', weight: 2000, price: 8.01, pricePerKg: 3.99, unit: 'g', location: 'Frutaria' },
      { id: 18, name: 'Batata Doce Roxa', weight: 0.802, price: 12.02, pricePerKg: 14.99, unit: 'g', location: 'Frutaria' },
      { id: 19, name: 'Cenoura', weight: 0.62, price: 2.47, pricePerKg: 3.99, unit: 'g', location: 'Frutaria' },
      { id: 20, name: 'Abacate', weight: 1.764, price: 17.62, pricePerKg: 9.99, unit: 'g', location: 'Frutaria' },
      { id: 21, name: 'Brocolis', weight: 0.45, price: 13.5, pricePerKg: 29.99, unit: 'g', location: 'Frutaria' },
      { id: 22, name: 'Couve Flor', weight: 0.67, price: 10.04, pricePerKg: 14.99, unit: 'g', location: 'Frutaria' },
      { id: 23, name: 'Açai', weight: 2000, price: 30, pricePerKg: 15, unit: 'g', location: 'Frutaria' },
      { id: 24, name: 'Arroz Branco', weight: 0, price: 0, pricePerKg: 0, unit: 'g', location: '' },
      { id: 25, name: 'Banana', weight: 0, price: 0, pricePerKg: 0, unit: 'g', location: '' }
    ];

    const ingredientsWithNutrition = csvData.map(item => {
      const nutrition = nutritionalData[item.name] || {
        calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, category: 'Outros'
      };
      
      return {
        ...item,
        ...nutrition,
        pricePerKg: item.pricePerKg || 0
      };
    });

    setIngredients(ingredientsWithNutrition);
  };

  const saveMealsToStorage = (mealsData) => {
    try {
      localStorage.setItem('gracie-diet-meals', JSON.stringify(mealsData));
    } catch (error) {
      console.error('Erro ao salvar refeições:', error);
    }
  };

  const loadMealsFromStorage = () => {
    try {
      const savedMeals = localStorage.getItem('gracie-diet-meals');
      if (savedMeals) {
        const parsedMeals = JSON.parse(savedMeals);
        setMeals(parsedMeals);
        setDailyLog(parsedMeals);
      }
    } catch (error) {
      console.error('Erro ao carregar refeições:', error);
    }
  };

  const exportMealsToJSON = () => {
    try {
      const dataStr = JSON.stringify(meals, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `refeicoes-dieta-gracie-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erro ao exportar refeições:', error);
    }
  };

  // Função para salvar refeições em arquivo JSON local
  const saveMealsToFile = () => {
    try {
      const dataStr = JSON.stringify(meals, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'refeicoes_dieta_gracie.json';
      link.click();
      URL.revokeObjectURL(url);
      alert('Arquivo de backup salvo como "refeicoes_dieta_gracie.json"');
    } catch (error) {
      console.error('Erro ao salvar arquivo:', error);
      alert('Erro ao salvar arquivo');
    }
  };

  // Função para importar refeições de arquivo JSON
  const importMealsFromFile = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedMeals = JSON.parse(e.target.result);
          if (Array.isArray(importedMeals)) {
            setMeals(importedMeals);
            setDailyLog(importedMeals);
            saveMealsToStorage(importedMeals);
            alert(`Importadas ${importedMeals.length} refeições com sucesso!`);
          } else {
            alert('Formato de arquivo inválido');
          }
        } catch (error) {
          console.error('Erro ao importar:', error);
          alert('Erro ao importar arquivo');
        }
      };
      reader.readAsText(file);
    }
  };

  // Função para mostrar informações sobre o armazenamento
  const showStorageInfo = () => {
    const savedMeals = localStorage.getItem('gracie-diet-meals');
    const mealsCount = savedMeals ? JSON.parse(savedMeals).length : 0;
    const storageSize = savedMeals ? new Blob([savedMeals]).size : 0;
    
    alert(`📊 Informações do Armazenamento:
    
🗂️ Local: localStorage do navegador
🔑 Chave: 'gracie-diet-meals'
📝 Refeições salvas: ${mealsCount}
💾 Tamanho: ${storageSize} bytes
📅 Última atualização: ${new Date().toLocaleString('pt-BR')}

💡 Dica: Use "Exportar Backup" para salvar em arquivo JSON`);
  };

  const clearAllMeals = () => {
    if (window.confirm('Tem certeza que deseja apagar todas as refeições? Esta ação não pode ser desfeita.')) {
      setMeals([]);
      setDailyLog([]);
      localStorage.removeItem('gracie-diet-meals');
    }
  };

  // Sistema de sugestões de horários baseado na Dieta Gracie
  const getMealSuggestions = (selectedTime) => {
    const hour = parseInt(selectedTime.split(':')[0]);
    
    // Princípios da Dieta Gracie: intervalo de 5 horas entre refeições
    const suggestions = {
      breakfast: {
        time: '07:00',
        name: 'Café da Manhã',
        description: 'Primeira refeição do dia - Energia para começar',
        recommendations: [
          'Aveia em flocos grossos + Banana + Castanha do Pará',
          'Quinoa Urbano + Ovos + Abacate',
          'Farelo Aveia + Nozes + Açai'
        ]
      },
      morningSnack: {
        time: '10:00',
        name: 'Lanche da Manhã',
        description: 'Manter energia até o almoço',
        recommendations: [
          'Castanha do Pará + Amendoim Cru',
          'Nozes + Açai',
          'Amendoim Torrado Granulado'
        ]
      },
      lunch: {
        time: '12:00',
        name: 'Almoço',
        description: 'Refeição principal - Combinação proteína + carboidrato',
        recommendations: [
          'Peito Frango + Batata Doce + Brocolis',
          'Contra-Filé + Quinoa Grao Mix + Couve Flor',
          'Sardinha + Arroz Integral + Cenoura'
        ]
      },
      afternoonSnack: {
        time: '15:00',
        name: 'Lanche da Tarde',
        description: 'Energia para o final do dia',
        recommendations: [
          'Amendoim Cru + Banana',
          'Castanha do Pará + Açai',
          'Nozes + Farinha de Aveia'
        ]
      },
      dinner: {
        time: '18:00',
        name: 'Jantar',
        description: 'Refeição leve - Proteína + vegetais',
        recommendations: [
          'Ovos + Batata Doce Roxa + Cenoura',
          'Atum + Quinoa Urbano + Brocolis',
          'Figado Bovino + Aveia em flocos grossos + Couve Flor'
        ]
      },
      preWorkout: {
        time: '16:00',
        name: 'Pré-Treino (2h antes)',
        description: 'Energia para o treino',
        recommendations: [
          'Batata Doce + Ovos',
          'Quinoa Grao Mix + Peito Frango',
          'Aveia em flocos grossos + Castanha do Pará'
        ]
      },
      postWorkout: {
        time: '20:00',
        name: 'Pós-Treino (até 1h após)',
        description: 'Recuperação muscular',
        recommendations: [
          'Peito Frango + Batata Doce + Abacate',
          'Ovos + Quinoa Urbano + Nozes',
          'Sardinha + Aveia em flocos grossos + Amendoim Cru'
        ]
      }
    };

    // Determinar qual sugestão baseada no horário
    if (hour >= 6 && hour < 9) return suggestions.breakfast;
    if (hour >= 9 && hour < 11) return suggestions.morningSnack;
    if (hour >= 11 && hour < 14) return suggestions.lunch;
    if (hour >= 14 && hour < 16) return suggestions.afternoonSnack;
    if (hour >= 16 && hour < 18) return suggestions.preWorkout;
    if (hour >= 18 && hour < 20) return suggestions.dinner;
    if (hour >= 20 && hour < 22) return suggestions.postWorkout;
    
    return suggestions.breakfast; // padrão
  };

  // Relatórios mensais
  const getMonthlyReport = () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    const monthlyMeals = meals.filter(meal => {
      const mealDate = new Date(meal.date);
      return mealDate.getMonth() === currentMonth && mealDate.getFullYear() === currentYear;
    });

    const totalNutrition = monthlyMeals.reduce((total, meal) => {
      const mealNutrition = calculateMealNutrition(meal.items);
      return {
        calories: total.calories + mealNutrition.calories,
        protein: total.protein + mealNutrition.protein,
        carbs: total.carbs + mealNutrition.carbs,
        fat: total.fat + mealNutrition.fat,
        fiber: total.fiber + mealNutrition.fiber
      };
    }, { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 });

    const mealsByDay = monthlyMeals.reduce((acc, meal) => {
      if (!acc[meal.date]) {
        acc[meal.date] = [];
      }
      acc[meal.date].push(meal);
      return acc;
    }, {});

    const daysWithMeals = Object.keys(mealsByDay).length;
    const totalMeals = monthlyMeals.length;
    const avgMealsPerDay = daysWithMeals > 0 ? (totalMeals / daysWithMeals).toFixed(1) : 0;

    return {
      month: currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }),
      totalMeals,
      daysWithMeals,
      avgMealsPerDay,
      nutrition: totalNutrition,
      mealsByDay
    };
  };

  const exportMonthlyReport = () => {
    const report = getMonthlyReport();
    const reportData = {
      ...report,
      generatedAt: new Date().toISOString(),
      dietType: 'Dieta Gracie - Ganho de Massa Muscular',
      principles: [
        'Intervalo de 5 horas entre refeições',
        'Combinações corretas de alimentos',
        'Proteínas + Carboidratos complexos',
        'Alimentos naturais e integrais'
      ]
    };

    try {
      const dataStr = JSON.stringify(reportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `relatorio-mensal-dieta-gracie-${report.month.replace(' ', '-')}.json`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erro ao exportar relatório:', error);
    }
  };

  // Função removida - ingredientes só podem ser adicionados via CSV

  const addToMeal = (ingredient, quantity = 100) => {
    const existing = currentMeal.find(item => item.ingredient.id === ingredient.id);
    if (existing) {
      setCurrentMeal(currentMeal.map(item => 
        item.ingredient.id === ingredient.id 
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
    } else {
      setCurrentMeal([...currentMeal, { ingredient, quantity }]);
    }
  };

  const saveMeal = () => {
    if (currentMeal.length > 0) {
      const meal = {
        id: Date.now(),
        date: selectedDate,
        time: selectedTime,
        items: [...currentMeal]
      };
      const updatedMeals = [...meals, meal];
      setMeals(updatedMeals);
      setDailyLog(updatedMeals);
      setCurrentMeal([]);
      saveMealsToStorage(updatedMeals);
    }
  };

  const calculateMealNutrition = (mealItems) => {
    return mealItems.reduce((total, item) => {
      const multiplier = item.quantity / 100;
      return {
        calories: total.calories + (item.ingredient.calories * multiplier),
        protein: total.protein + (item.ingredient.protein * multiplier),
        carbs: total.carbs + (item.ingredient.carbs * multiplier),
        fat: total.fat + (item.ingredient.fat * multiplier),
        fiber: total.fiber + (item.ingredient.fiber * multiplier)
      };
    }, { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 });
  };

  const getTodaysNutrition = () => {
    const today = new Date().toISOString().split('T')[0];
    const todaysMeals = meals.filter(meal => meal.date === today);
    
    return todaysMeals.reduce((total, meal) => {
      const mealNutrition = calculateMealNutrition(meal.items);
      return {
        calories: total.calories + mealNutrition.calories,
        protein: total.protein + mealNutrition.protein,
        carbs: total.carbs + mealNutrition.carbs,
        fat: total.fat + mealNutrition.fat,
        fiber: total.fiber + mealNutrition.fiber
      };
    }, { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 });
  };

  // Funções do calendário
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    return { daysInMonth, startingDay };
  };

  const getMealsForDate = (date) => {
    return meals.filter(meal => meal.date === date);
  };

  const hasMealsOnDate = (date) => {
    return getMealsForDate(date).length > 0;
  };

  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const renderCalendar = () => {
    const { daysInMonth, startingDay } = getDaysInMonth(currentMonth);
    const monthName = currentMonth.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
    
    const days = [];
    const today = new Date();
    
    // Dias vazios no início
    for (let i = 0; i < startingDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2 text-gray-400"></div>);
    }
    
    // Dias do mês
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const dateStr = formatDate(date);
      const isToday = dateStr === today.toISOString().split('T')[0];
      const isSelected = dateStr === selectedDate;
      const hasMeals = hasMealsOnDate(dateStr);
      
      days.push(
        <button
          key={day}
          onClick={() => setSelectedDate(dateStr)}
          className={`p-2 rounded-lg text-sm font-medium transition-colors ${
            isSelected 
              ? 'bg-blue-600 text-white' 
              : isToday 
                ? 'bg-blue-100 text-blue-800' 
                : hasMeals 
                  ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                  : 'hover:bg-gray-100'
          }`}
        >
          <div className="flex items-center justify-center">
            <span>{day}</span>
            {hasMeals && (
              <div className="w-2 h-2 bg-green-500 rounded-full ml-1"></div>
            )}
          </div>
        </button>
      );
    }
    
    return (
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ChevronLeft size={20} />
          </button>
          <h3 className="text-lg font-semibold capitalize">{monthName}</h3>
          <button
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ChevronRight size={20} />
          </button>
        </div>
        
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
            <div key={day} className="p-2 text-center text-sm font-medium text-gray-600">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {days}
        </div>
        
        <div className="mt-4 flex items-center gap-4 text-xs text-gray-600">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-600 rounded"></div>
            <span>Selecionado</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-100 rounded"></div>
            <span>Hoje</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-100 rounded"></div>
            <span>Com refeições</span>
          </div>
        </div>
      </div>
    );
  };

  // Renderizar calendário para o dashboard
  const renderDashboardCalendar = () => {
    const { daysInMonth, startingDay } = getDaysInMonth(currentMonth);
    const monthName = currentMonth.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
    
    const days = [];
    const today = new Date();
    
    // Dias vazios no início
    for (let i = 0; i < startingDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2 text-gray-400"></div>);
    }
    
    // Dias do mês
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const dateStr = formatDate(date);
      const isToday = dateStr === today.toISOString().split('T')[0];
      const isSelected = dateStr === dashboardSelectedDate;
      const hasMeals = hasMealsOnDate(dateStr);
      
      days.push(
        <button
          key={day}
          onClick={() => setDashboardSelectedDate(dateStr)}
          className={`p-2 rounded-lg text-sm font-medium transition-colors ${
            isSelected 
              ? 'bg-blue-600 text-white' 
              : isToday 
                ? 'bg-blue-100 text-blue-800' 
                : hasMeals 
                  ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                  : 'hover:bg-gray-100'
          }`}
        >
          <div className="flex items-center justify-center">
            <span>{day}</span>
            {hasMeals && (
              <div className="w-2 h-2 bg-green-500 rounded-full ml-1"></div>
            )}
          </div>
        </button>
      );
    }
    
    return (
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ChevronLeft size={20} />
          </button>
          <h3 className="text-lg font-semibold capitalize">{monthName}</h3>
          <button
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ChevronRight size={20} />
          </button>
        </div>
        
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
            <div key={day} className="p-2 text-center text-sm font-medium text-gray-600">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {days}
        </div>
        
        <div className="mt-4 flex items-center gap-4 text-xs text-gray-600">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-600 rounded"></div>
            <span>Selecionado</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-100 rounded"></div>
            <span>Hoje</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-100 rounded"></div>
            <span>Com refeições</span>
          </div>
        </div>
      </div>
    );
  };

  const renderDashboard = () => {
    const todaysNutrition = getTodaysNutrition();
    const today = new Date().toISOString().split('T')[0];
    const todaysMeals = meals.filter(meal => meal.date === today);

    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-2">Dieta Gracie - Ganho de Massa</h2>
          <p className="text-blue-100">Controle completo da sua alimentação para hipertrofia</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow border-l-4 border-red-500">
            <h3 className="font-semibold text-gray-700">Calorias Hoje</h3>
            <p className="text-2xl font-bold text-red-600">{Math.round(todaysNutrition.calories)}</p>
            <p className="text-sm text-gray-500">Meta: 2800-3200 kcal</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
            <h3 className="font-semibold text-gray-700">Proteína</h3>
            <p className="text-2xl font-bold text-blue-600">{Math.round(todaysNutrition.protein)}g</p>
            <p className="text-sm text-gray-500">Meta: 140-180g</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
            <h3 className="font-semibold text-gray-700">Carboidratos</h3>
            <p className="text-2xl font-bold text-green-600">{Math.round(todaysNutrition.carbs)}g</p>
            <p className="text-sm text-gray-500">Meta: 280-320g</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-500">
            <h3 className="font-semibold text-gray-700">Gorduras</h3>
            <p className="text-2xl font-bold text-yellow-600">{Math.round(todaysNutrition.fat)}g</p>
            <p className="text-sm text-gray-500">Meta: 70-90g</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Refeições de Hoje ({todaysMeals.length})</h3>
          {todaysMeals.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Nenhuma refeição registrada hoje</p>
          ) : (
            <div className="space-y-3">
              {todaysMeals.map(meal => (
                <div key={meal.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{meal.time}</span>
                    <span className="text-sm text-gray-500">
                      {Math.round(calculateMealNutrition(meal.items).calories)} kcal
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {meal.items.map(item => `${item.ingredient.name} (${item.quantity}g)`).join(', ')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
            <h4 className="font-semibold text-amber-800 mb-2">💡 Princípios da Dieta Gracie para Massa:</h4>
            <ul className="text-sm text-amber-700 space-y-1">
              <li>• Combine proteínas com carboidratos complexos</li>
              <li>• Evite misturar frutas ácidas com proteínas</li>
              <li>• Mantenha intervalos de 3-4 horas entre refeições</li>
              <li>• Priorize alimentos naturais e integrais</li>
              <li>• Hidrate-se adequadamente (35ml/kg corporal)</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-800 mb-4">📅 Calendário Interativo</h4>
            {renderDashboardCalendar()}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">
            Refeições do Dia Selecionado ({new Date(dashboardSelectedDate).toLocaleDateString('pt-BR')})
          </h3>
          {(() => {
            const selectedDateMeals = meals.filter(meal => meal.date === dashboardSelectedDate);
            return selectedDateMeals.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Nenhuma refeição registrada nesta data</p>
            ) : (
              <div className="space-y-3">
                {selectedDateMeals.map(meal => (
                  <div key={meal.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-blue-600">🕐 {meal.time}</span>
                      <span className="text-sm text-gray-500">
                        {Math.round(calculateMealNutrition(meal.items).calories)} kcal
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {meal.items.map(item => `${item.ingredient.name} (${item.quantity}g)`).join(', ')}
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      </div>
    );
  };

  const renderIngredients = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">ℹ️</div>
          <h3 className="text-lg font-semibold text-blue-800">Informações sobre Ingredientes</h3>
        </div>
        <p className="text-blue-700 mb-3">
          Os ingredientes são carregados automaticamente do arquivo <strong>Insumos.csv</strong>. 
          Para adicionar novos ingredientes, edite o arquivo CSV diretamente.
        </p>
        <div className="text-sm text-blue-600">
          <strong>Como adicionar ingredientes:</strong>
          <ol className="list-decimal list-inside mt-2 space-y-1">
            <li>Abra o arquivo <code className="bg-blue-100 px-1 rounded">Insumos.csv</code></li>
            <li>Adicione uma nova linha com os dados do ingrediente</li>
            <li>Salve o arquivo</li>
            <li>Recarregue o aplicativo para ver as mudanças</li>
          </ol>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-lg font-semibold">Banco de Ingredientes (Insumos.csv)</h3>
          <div className="text-sm text-gray-500">
            {ingredients.length} ingredientes disponíveis
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">Nome</th>
                <th className="px-4 py-3 text-left">Categoria</th>
                <th className="px-4 py-3 text-right">Calorias</th>
                <th className="px-4 py-3 text-right">Proteína</th>
                <th className="px-4 py-3 text-right">Carbs</th>
                <th className="px-4 py-3 text-right">Gordura</th>
                <th className="px-4 py-3 text-right">Preço/Kg</th>
                <th className="px-4 py-3 text-left">Local</th>
                <th className="px-4 py-3 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {ingredients.map(ingredient => (
                <tr key={ingredient.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{ingredient.name}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      ingredient.category === 'Proteína' ? 'bg-red-100 text-red-700' :
                      ingredient.category === 'Carboidrato' ? 'bg-green-100 text-green-700' :
                      ingredient.category === 'Gordura' ? 'bg-yellow-100 text-yellow-700' :
                      ingredient.category === 'Fruta' ? 'bg-orange-100 text-orange-700' :
                      ingredient.category === 'Vegetal' ? 'bg-green-100 text-green-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {ingredient.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">{ingredient.calories}</td>
                  <td className="px-4 py-3 text-right">{ingredient.protein}g</td>
                  <td className="px-4 py-3 text-right">{ingredient.carbs}g</td>
                  <td className="px-4 py-3 text-right">{ingredient.fat}g</td>
                  <td className="px-4 py-3 text-right">R$ {ingredient.pricePerKg?.toFixed(2) || '0.00'}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{ingredient.location}</td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => addToMeal(ingredient)}
                      className="text-blue-600 hover:text-blue-800 mr-2"
                      title="Adicionar à refeição"
                    >
                      <Plus size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Estatísticas dos Ingredientes */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-red-500">
          <h4 className="font-semibold text-gray-700">Proteínas</h4>
          <p className="text-2xl font-bold text-red-600">
            {ingredients.filter(i => i.category === 'Proteína').length}
          </p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
          <h4 className="font-semibold text-gray-700">Carboidratos</h4>
          <p className="text-2xl font-bold text-green-600">
            {ingredients.filter(i => i.category === 'Carboidrato').length}
          </p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-500">
          <h4 className="font-semibold text-gray-700">Gorduras</h4>
          <p className="text-2xl font-bold text-yellow-600">
            {ingredients.filter(i => i.category === 'Gordura').length}
          </p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
          <h4 className="font-semibold text-gray-700">Outros</h4>
          <p className="text-2xl font-bold text-blue-600">
            {ingredients.filter(i => !['Proteína', 'Carboidrato', 'Gordura'].includes(i.category)).length}
          </p>
        </div>
      </div>
    </div>
  );

  const renderMealBuilder = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Calendário */}
      <div className="lg:col-span-1">
        {renderCalendar()}
        
        {/* Refeições do dia selecionado */}
        <div className="mt-6 bg-white p-4 rounded-lg shadow">
          <h4 className="font-semibold mb-3">
            Refeições de {new Date(selectedDate).toLocaleDateString('pt-BR', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </h4>
          
          {(() => {
            const dayMeals = getMealsForDate(selectedDate);
            if (dayMeals.length === 0) {
              return <p className="text-gray-500 text-center py-4">Nenhuma refeição registrada</p>;
            }
            
            return (
              <div className="space-y-3">
                {dayMeals.map(meal => (
                  <div key={meal.id} className="border rounded-lg p-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-sm">{meal.time}</span>
                      <span className="text-xs text-gray-500">
                        {Math.round(calculateMealNutrition(meal.items).calories)} kcal
                      </span>
                    </div>
                    <div className="text-xs text-gray-600">
                      {meal.items.map(item => `${item.ingredient.name} (${item.quantity}g)`).join(', ')}
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      </div>

      {/* Construtor de Refeições */}
      <div className="lg:col-span-2">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Construir Refeição</h3>
          
          {/* Seleção de Data e Hora */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold mb-3">Data e Horário da Refeição:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data:</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Horário:</label>
                <input
                  type="time"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            {/* Sugestões baseadas no horário */}
            {(() => {
              const suggestion = getMealSuggestions(selectedTime);
              return (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h5 className="font-semibold text-blue-800 mb-2">
                    💡 Sugestão para {suggestion.name} ({suggestion.time})
                  </h5>
                  <p className="text-sm text-blue-700 mb-3">{suggestion.description}</p>
                  <div className="text-sm text-blue-600">
                    <strong>Combinações recomendadas:</strong>
                    <ul className="mt-2 space-y-1">
                      {suggestion.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-center">
                          <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-3 p-2 bg-blue-100 rounded text-xs text-blue-800">
                    <strong>Princípio da Dieta Gracie:</strong> Intervalo de 5 horas entre refeições para melhor digestão
                  </div>
                </div>
              );
            })()}
          </div>
          
          {currentMeal.length > 0 && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold mb-3">Refeição Atual:</h4>
              {currentMeal.map((item, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
                  <span>{item.ingredient.name}</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => {
                        const newQuantity = parseFloat(e.target.value) || 0;
                        setCurrentMeal(currentMeal.map((mealItem, i) =>
                          i === index ? { ...mealItem, quantity: newQuantity } : mealItem
                        ));
                      }}
                      className="w-20 px-2 py-1 border rounded text-center"
                    />
                    <span className="text-sm text-gray-500">g</span>
                    <button
                      onClick={() => setCurrentMeal(currentMeal.filter((_, i) => i !== index))}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ))}
              
              <div className="mt-4 p-3 bg-white rounded border">
                <h5 className="font-semibold mb-2">Resumo Nutricional:</h5>
                {(() => {
                  const nutrition = calculateMealNutrition(currentMeal);
                  return (
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm">
                      <div>Calorias: <strong>{Math.round(nutrition.calories)}</strong></div>
                      <div>Proteína: <strong>{Math.round(nutrition.protein)}g</strong></div>
                      <div>Carbs: <strong>{Math.round(nutrition.carbs)}g</strong></div>
                      <div>Gordura: <strong>{Math.round(nutrition.fat)}g</strong></div>
                      <div>Fibra: <strong>{Math.round(nutrition.fiber)}g</strong></div>
                    </div>
                  );
                })()}
              </div>
              
              <button
                onClick={saveMeal}
                className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
              >
                <Save size={16} /> Salvar Refeição
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ingredients.map(ingredient => (
              <div key={ingredient.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{ingredient.name}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    ingredient.category === 'Proteína' ? 'bg-red-100 text-red-700' :
                    ingredient.category === 'Carboidrato' ? 'bg-green-100 text-green-700' :
                    ingredient.category === 'Gordura' ? 'bg-yellow-100 text-yellow-700' :
                    ingredient.category === 'Fruta' ? 'bg-orange-100 text-orange-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {ingredient.category}
                  </span>
                </div>
                <div className="text-sm text-gray-600 mb-3">
                  {ingredient.calories} kcal • {ingredient.protein}g prot
                  <br />
                  <span className="text-xs text-blue-600">
                    R$ {ingredient.pricePerKg?.toFixed(2) || '0.00'}/kg • {ingredient.location}
                  </span>
                </div>
                <button
                  onClick={() => addToMeal(ingredient)}
                  className="w-full bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 text-sm"
                >
                  Adicionar (100g)
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderHistory = () => {
    const groupedMeals = meals.reduce((acc, meal) => {
      if (!acc[meal.date]) {
        acc[meal.date] = [];
      }
      acc[meal.date].push(meal);
      return acc;
    }, {});

    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Histórico de Refeições</h3>
            <div className="flex gap-2 flex-wrap">
              {user && (
                <>
                  <button
                    onClick={() => syncMeals(meals)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm flex items-center gap-1"
                  >
                    <Cloud className="w-4 h-4" />
                    {syncing ? 'Sincronizando...' : 'Sincronizar'}
                  </button>
                  <button
                    onClick={async () => {
                      const cloudMeals = await loadMealsFromCloud();
                      setMeals(cloudMeals);
                      setDailyLog(cloudMeals);
                      saveMealsToStorage(cloudMeals);
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm flex items-center gap-1"
                  >
                    <Wifi className="w-4 h-4" />
                    Carregar da Nuvem
                  </button>
                </>
              )}
              <button
                onClick={showStorageInfo}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 text-sm"
              >
                ℹ️ Info Armazenamento
              </button>
              <button
                onClick={saveMealsToFile}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm"
              >
                💾 Backup JSON
              </button>
              <label className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 text-sm cursor-pointer">
                📁 Importar JSON
                <input
                  type="file"
                  accept=".json"
                  onChange={importMealsFromFile}
                  className="hidden"
                />
              </label>
              <button
                onClick={exportMealsToJSON}
                className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 text-sm"
              >
                📥 Exportar JSON
              </button>
              <button
                onClick={clearAllMeals}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-sm"
              >
                🗑️ Limpar Tudo
              </button>
            </div>
          </div>
          
          {Object.keys(groupedMeals).length === 0 ? (
            <p className="text-gray-500 text-center py-8">Nenhuma refeição registrada ainda</p>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedMeals)
                .sort(([a], [b]) => new Date(b) - new Date(a))
                .map(([date, dayMeals]) => {
                  const dayNutrition = dayMeals.reduce((total, meal) => {
                    const mealNutrition = calculateMealNutrition(meal.items);
                    return {
                      calories: total.calories + mealNutrition.calories,
                      protein: total.protein + mealNutrition.protein,
                      carbs: total.carbs + mealNutrition.carbs,
                      fat: total.fat + mealNutrition.fat
                    };
                  }, { calories: 0, protein: 0, carbs: 0, fat: 0 });

                  return (
                    <div key={date} className="border rounded-lg overflow-hidden">
                      <div className="bg-gray-50 px-6 py-4 border-b">
                        <div className="flex justify-between items-center">
                          <h4 className="font-semibold">
                            {new Date(date + 'T00:00:00').toLocaleDateString('pt-BR', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </h4>
                          <div className="text-sm text-gray-600">
                            {dayMeals.length} refeições • {Math.round(dayNutrition.calories)} kcal
                          </div>
                        </div>
                        <div className="grid grid-cols-4 gap-4 mt-2 text-sm">
                          <div>Calorias: <strong>{Math.round(dayNutrition.calories)}</strong></div>
                          <div>Proteína: <strong>{Math.round(dayNutrition.protein)}g</strong></div>
                          <div>Carbs: <strong>{Math.round(dayNutrition.carbs)}g</strong></div>
                          <div>Gordura: <strong>{Math.round(dayNutrition.fat)}g</strong></div>
                        </div>
                      </div>
                      <div className="p-6 space-y-4">
                        {dayMeals
                          .sort((a, b) => a.time.localeCompare(b.time))
                          .map(meal => (
                          <div key={meal.id} className="border rounded-lg p-4 bg-gray-50">
                            <div className="flex justify-between items-start mb-3">
                              <div className="flex items-center gap-3">
                                <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                                  🕐 {meal.time}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {Math.round(calculateMealNutrition(meal.items).calories)} kcal
                                </div>
                              </div>
                              <div className="text-xs text-gray-400">
                                ID: {meal.id}
                              </div>
                            </div>
                            <div className="text-sm text-gray-700">
                              <strong>Ingredientes:</strong>
                              <div className="mt-1 space-y-1">
                                {meal.items.map((item, index) => (
                                  <div key={index} className="flex items-center gap-2">
                                    <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                                    <span>{item.ingredient.name}</span>
                                    <span className="text-gray-500">({item.quantity}g)</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div className="mt-3 pt-3 border-t border-gray-200">
                              <div className="grid grid-cols-4 gap-2 text-xs">
                                <div>Proteína: <strong>{Math.round(calculateMealNutrition(meal.items).protein)}g</strong></div>
                                <div>Carbs: <strong>{Math.round(calculateMealNutrition(meal.items).carbs)}g</strong></div>
                                <div>Gordura: <strong>{Math.round(calculateMealNutrition(meal.items).fat)}g</strong></div>
                                <div>Fibra: <strong>{Math.round(calculateMealNutrition(meal.items).fiber)}g</strong></div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderReports = () => {
    const report = getMonthlyReport();
    
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-2">📊 Relatório Mensal - Dieta Gracie</h2>
          <p className="text-purple-100">Análise completa do seu progresso nutricional</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow border-l-4 border-purple-500">
            <h3 className="font-semibold text-gray-700">Mês</h3>
            <p className="text-2xl font-bold text-purple-600">{report.month}</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
            <h3 className="font-semibold text-gray-700">Total de Refeições</h3>
            <p className="text-2xl font-bold text-blue-600">{report.totalMeals}</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
            <h3 className="font-semibold text-gray-700">Dias com Refeições</h3>
            <p className="text-2xl font-bold text-green-600">{report.daysWithMeals}</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow border-l-4 border-orange-500">
            <h3 className="font-semibold text-gray-700">Média/Dia</h3>
            <p className="text-2xl font-bold text-orange-600">{report.avgMealsPerDay}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Resumo Nutricional do Mês</h3>
            <button
              onClick={exportMonthlyReport}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 text-sm"
            >
              📥 Exportar Relatório
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{Math.round(report.nutrition.calories)}</div>
              <div className="text-sm text-gray-600">Calorias Totais</div>
            </div>
            
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{Math.round(report.nutrition.protein)}g</div>
              <div className="text-sm text-gray-600">Proteína Total</div>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{Math.round(report.nutrition.carbs)}g</div>
              <div className="text-sm text-gray-600">Carboidratos Totais</div>
            </div>
            
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{Math.round(report.nutrition.fat)}g</div>
              <div className="text-sm text-gray-600">Gorduras Totais</div>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{Math.round(report.nutrition.fiber)}g</div>
              <div className="text-sm text-gray-600">Fibras Totais</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Princípios da Dieta Gracie Aplicados</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">✓</div>
                <div>
                  <h4 className="font-semibold">Intervalo de 5 Horas</h4>
                  <p className="text-sm text-gray-600">Respeito aos intervalos digestivos entre refeições</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">✓</div>
                <div>
                  <h4 className="font-semibold">Combinações Corretas</h4>
                  <p className="text-sm text-gray-600">Proteínas + Carboidratos complexos</p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">✓</div>
                <div>
                  <h4 className="font-semibold">Alimentos Naturais</h4>
                  <p className="text-sm text-gray-600">Priorização de ingredientes integrais</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">✓</div>
                <div>
                  <h4 className="font-semibold">Ganho de Massa</h4>
                  <p className="text-sm text-gray-600">Adaptação para hipertrofia muscular</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {Object.keys(report.mealsByDay).length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Detalhamento por Dia</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left">Data</th>
                    <th className="px-4 py-3 text-center">Refeições</th>
                    <th className="px-4 py-3 text-center">Horários</th>
                    <th className="px-4 py-3 text-right">Calorias</th>
                    <th className="px-4 py-3 text-right">Proteína</th>
                    <th className="px-4 py-3 text-right">Carbs</th>
                    <th className="px-4 py-3 text-right">Gordura</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {Object.entries(report.mealsByDay)
                    .sort(([a], [b]) => new Date(a) - new Date(b))
                    .map(([date, dayMeals]) => {
                      const dayNutrition = dayMeals.reduce((total, meal) => {
                        const mealNutrition = calculateMealNutrition(meal.items);
                        return {
                          calories: total.calories + mealNutrition.calories,
                          protein: total.protein + mealNutrition.protein,
                          carbs: total.carbs + mealNutrition.carbs,
                          fat: total.fat + mealNutrition.fat
                        };
                      }, { calories: 0, protein: 0, carbs: 0, fat: 0 });

                      return (
                        <tr key={date} className="hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium">
                            {new Date(date + 'T00:00:00').toLocaleDateString('pt-BR')}
                          </td>
                          <td className="px-4 py-3 text-center">{dayMeals.length}</td>
                          <td className="px-4 py-3 text-center">
                            <div className="text-sm text-gray-600">
                              {dayMeals.map(meal => (
                                <div key={meal.id} className="mb-1">
                                  🕐 {meal.time}
                                </div>
                              ))}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right">{Math.round(dayNutrition.calories)}</td>
                          <td className="px-4 py-3 text-right">{Math.round(dayNutrition.protein)}g</td>
                          <td className="px-4 py-3 text-right">{Math.round(dayNutrition.carbs)}g</td>
                          <td className="px-4 py-3 text-right">{Math.round(dayNutrition.fat)}g</td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  };

  const [selectedMealTime, setSelectedMealTime] = useState('breakfast');
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  const renderRecipes = () => {

    // Receitas baseadas nos insumos do CSV
    const mealTimeRecipes = {
      breakfast: {
        name: 'Café da Manhã',
        time: '06:00',
        recipes: [
          {
            id: 1,
            name: 'Aveia Energética',
            description: 'Café da manhã completo com aveia e castanhas',
            ingredients: [
              { name: 'Aveia em flocos grossos', quantity: 80, id: 5 },
              { name: 'Castanha do Pará', quantity: 30, id: 12 },
              { name: 'Amendoim Cru', quantity: 20, id: 13 }
            ],
            instructions: '1. Misture a aveia com água quente\n2. Adicione as castanhas picadas\n3. Deixe repousar por 5 minutos\n4. Sirva com frutas se desejar',
            nutrition: { calories: 420, protein: 15, carbs: 45, fat: 22, fiber: 8 }
          },
          {
            id: 2,
            name: 'Quinoa Matinal',
            description: 'Quinoa com ovos para um café proteico',
            ingredients: [
              { name: 'Quinoa Urbano', quantity: 60, id: 10 },
              { name: 'Ovos', quantity: 2, id: 11 },
              { name: 'Abacate', quantity: 50, id: 20 }
            ],
            instructions: '1. Cozinhe a quinoa em água\n2. Prepare os ovos mexidos\n3. Corte o abacate em fatias\n4. Monte o prato com quinoa, ovos e abacate',
            nutrition: { calories: 380, protein: 18, carbs: 35, fat: 20, fiber: 6 }
          },
          {
            id: 3,
            name: 'Farelo de Aveia com Nozes',
            description: 'Farelo de aveia rico em fibras com nozes',
            ingredients: [
              { name: 'Farelo Aveia', quantity: 100, id: 6 },
              { name: 'Nozes', quantity: 25, id: 7 },
              { name: 'Farinha de Aveia', quantity: 30, id: 9 }
            ],
            instructions: '1. Misture o farelo com farinha de aveia\n2. Adicione água quente\n3. Polvilhe as nozes picadas\n4. Deixe engrossar e sirva',
            nutrition: { calories: 320, protein: 12, carbs: 40, fat: 18, fiber: 10 }
          }
        ]
      },
      morningSnack: {
        name: 'Lanche da Manhã',
        time: '09:00',
        recipes: [
          {
            id: 4,
            name: 'Mix de Castanhas',
            description: 'Combinação energética de castanhas e amendoim',
            ingredients: [
              { name: 'Castanha do Pará', quantity: 20, id: 12 },
              { name: 'Amendoim Cru', quantity: 30, id: 13 },
              { name: 'Nozes', quantity: 15, id: 7 }
            ],
            instructions: '1. Misture as castanhas em um recipiente\n2. Consuma uma porção de 65g\n3. Ideal para manter energia até o almoço',
            nutrition: { calories: 450, protein: 18, carbs: 15, fat: 40, fiber: 8 }
          },
          {
            id: 5,
            name: 'Amendoim Torrado',
            description: 'Amendoim torrado para lanche rápido',
            ingredients: [
              { name: 'Amendoim Torrado Granulado', quantity: 50, id: 8 }
            ],
            instructions: '1. Consuma 50g de amendoim torrado\n2. Ideal para lanche rápido e energético',
            nutrition: { calories: 280, protein: 13, carbs: 8, fat: 25, fiber: 4 }
          },
          {
            id: 6,
            name: 'Castanha com Açai',
            description: 'Castanha do Pará com açai para energia',
            ingredients: [
              { name: 'Castanha do Pará', quantity: 25, id: 12 },
              { name: 'Açai', quantity: 100, id: 23 }
            ],
            instructions: '1. Consuma 25g de castanha do Pará\n2. Acompanhe com 100g de açai\n3. Combinação rica em antioxidantes',
            nutrition: { calories: 320, protein: 7, carbs: 18, fat: 28, fiber: 6 }
          }
        ]
      },
      lunch: {
        name: 'Almoço',
        time: '12:00',
        recipes: [
          {
            id: 7,
            name: 'Frango com Batata Doce',
            description: 'Combinação clássica para ganho de massa',
            ingredients: [
              { name: 'Peito Frango', quantity: 150, id: 1 },
              { name: 'Batata Doce', quantity: 200, id: 17 },
              { name: 'Brocolis', quantity: 100, id: 21 }
            ],
            instructions: '1. Grelhe o peito de frango\n2. Asse a batata doce\n3. Cozinhe o brócolis no vapor\n4. Sirva com temperos naturais',
            nutrition: { calories: 580, protein: 48, carbs: 65, fat: 8, fiber: 12 }
          },
          {
            id: 8,
            name: 'Contra-Filé com Quinoa',
            description: 'Proteína nobre com quinoa integral',
            ingredients: [
              { name: 'Contra-Filé', quantity: 120, id: 3 },
              { name: 'Quinoa Grao Mix', quantity: 100, id: 4 },
              { name: 'Couve Flor', quantity: 150, id: 22 }
            ],
            instructions: '1. Grelhe o contra-filé ao ponto desejado\n2. Cozinhe a quinoa em água\n3. Prepare a couve-flor no vapor\n4. Monte o prato harmoniosamente',
            nutrition: { calories: 620, protein: 42, carbs: 45, fat: 28, fiber: 10 }
          },
          {
            id: 9,
            name: 'Sardinha com Aveia',
            description: 'Ômega-3 com carboidrato complexo',
            ingredients: [
              { name: 'Sardinha', quantity: 150, id: 15 },
              { name: 'Aveia em flocos grossos', quantity: 80, id: 5 },
              { name: 'Cenoura', quantity: 100, id: 19 }
            ],
            instructions: '1. Prepare a sardinha grelhada\n2. Cozinhe a aveia\n3. Rale a cenoura crua\n4. Combine os ingredientes',
            nutrition: { calories: 520, protein: 38, carbs: 42, fat: 22, fiber: 8 }
          }
        ]
      },
      afternoonSnack: {
        name: 'Lanche da Tarde',
        time: '15:00',
        recipes: [
          {
            id: 10,
            name: 'Amendoim com Banana',
            description: 'Energia rápida para o final do dia',
            ingredients: [
              { name: 'Amendoim Cru', quantity: 40, id: 13 },
              { name: 'Amendoim com casca', quantity: 30, id: 14 }
            ],
            instructions: '1. Consuma 40g de amendoim cru\n2. Acompanhe com 30g de amendoim com casca\n3. Ideal para pré-treino',
            nutrition: { calories: 380, protein: 18, carbs: 12, fat: 32, fiber: 6 }
          },
          {
            id: 11,
            name: 'Castanha com Açai',
            description: 'Antioxidantes para recuperação',
            ingredients: [
              { name: 'Castanha do Pará', quantity: 20, id: 12 },
              { name: 'Açai', quantity: 150, id: 23 }
            ],
            instructions: '1. Consuma 20g de castanha do Pará\n2. Acompanhe com 150g de açai\n3. Rico em antioxidantes',
            nutrition: { calories: 340, protein: 6, carbs: 24, fat: 26, fiber: 8 }
          },
          {
            id: 12,
            name: 'Nozes com Farinha de Aveia',
            description: 'Combinação rica em fibras',
            ingredients: [
              { name: 'Nozes', quantity: 25, id: 7 },
              { name: 'Farinha de Aveia', quantity: 50, id: 9 }
            ],
            instructions: '1. Misture 25g de nozes com 50g de farinha de aveia\n2. Consuma com água ou leite\n3. Rico em fibras e gorduras boas',
            nutrition: { calories: 420, protein: 12, carbs: 35, fat: 28, fiber: 8 }
          }
        ]
      },
      dinner: {
        name: 'Jantar',
        time: '18:00',
        recipes: [
          {
            id: 13,
            name: 'Ovos com Batata Doce Roxa',
            description: 'Jantar leve e nutritivo',
            ingredients: [
              { name: 'Ovos', quantity: 3, id: 11 },
              { name: 'Batata Doce Roxa', quantity: 150, id: 18 },
              { name: 'Cenoura', quantity: 100, id: 19 }
            ],
            instructions: '1. Prepare os ovos mexidos\n2. Asse a batata doce roxa\n3. Rale a cenoura crua\n4. Monte o prato com os ingredientes',
            nutrition: { calories: 480, protein: 22, carbs: 45, fat: 18, fiber: 8 }
          },
          {
            id: 14,
            name: 'Atum com Quinoa',
            description: 'Proteína magra com quinoa',
            ingredients: [
              { name: 'Atum', quantity: 120, id: 16 },
              { name: 'Quinoa Urbano', quantity: 80, id: 10 },
              { name: 'Brocolis', quantity: 120, id: 21 }
            ],
            instructions: '1. Prepare o atum grelhado\n2. Cozinhe a quinoa\n3. Prepare o brócolis no vapor\n4. Combine os ingredientes',
            nutrition: { calories: 520, protein: 40, carbs: 38, fat: 22, fiber: 8 }
          },
          {
            id: 15,
            name: 'Figado com Aveia',
            description: 'Ferro e carboidrato complexo',
            ingredients: [
              { name: 'Figado Bovino', quantity: 100, id: 2 },
              { name: 'Aveia em flocos grossos', quantity: 60, id: 5 },
              { name: 'Couve Flor', quantity: 100, id: 22 }
            ],
            instructions: '1. Grelhe o fígado bovino\n2. Cozinhe a aveia\n3. Prepare a couve-flor\n4. Sirva com temperos naturais',
            nutrition: { calories: 450, protein: 32, carbs: 35, fat: 18, fiber: 6 }
          }
        ]
      },
      supper: {
        name: 'Ceia',
        time: '21:00',
        recipes: [
          {
            id: 16,
            name: 'Castanha Leve',
            description: 'Ceia leve com castanhas',
            ingredients: [
              { name: 'Castanha do Pará', quantity: 15, id: 12 }
            ],
            instructions: '1. Consuma 15g de castanha do Pará\n2. Ideal para ceia leve\n3. Rico em selênio e gorduras boas',
            nutrition: { calories: 98, protein: 2, carbs: 2, fat: 10, fiber: 1 }
          },
          {
            id: 17,
            name: 'Amendoim Suave',
            description: 'Amendoim para ceia',
            ingredients: [
              { name: 'Amendoim Cru', quantity: 20, id: 13 }
            ],
            instructions: '1. Consuma 20g de amendoim cru\n2. Ceia leve e nutritiva\n3. Rico em proteínas e gorduras boas',
            nutrition: { calories: 113, protein: 5, carbs: 3, fat: 10, fiber: 2 }
          },
          {
            id: 18,
            name: 'Nozes Noturnas',
            description: 'Nozes para ceia',
            ingredients: [
              { name: 'Nozes', quantity: 15, id: 7 }
            ],
            instructions: '1. Consuma 15g de nozes\n2. Ceia rica em ômega-3\n3. Ideal para recuperação noturna',
            nutrition: { calories: 98, protein: 2, carbs: 2, fat: 10, fiber: 1 }
          }
        ]
      }
    };

    const currentMealTime = mealTimeRecipes[selectedMealTime] || mealTimeRecipes.breakfast;
    const currentRecipe = currentMealTime.recipes[currentCardIndex] || currentMealTime.recipes[0];

    const nextCard = () => {
      if (currentMealTime && currentMealTime.recipes) {
        setCurrentCardIndex((prev) => 
          prev === currentMealTime.recipes.length - 1 ? 0 : prev + 1
        );
      }
    };

    const prevCard = () => {
      if (currentMealTime && currentMealTime.recipes) {
        setCurrentCardIndex((prev) => 
          prev === 0 ? currentMealTime.recipes.length - 1 : prev - 1
        );
      }
    };

    // Verificação de segurança
    if (!currentMealTime || !currentRecipe) {
      return (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Receitas Dieta Gracie - Insumos Disponíveis</h3>
            <div className="text-center py-8">
              <p className="text-gray-500">Carregando receitas...</p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Receitas Dieta Gracie - Insumos Disponíveis</h3>
          
          {/* Seletor de Horário */}
          <div className="mb-6">
            <h4 className="font-medium mb-3">Escolha o Horário da Refeição:</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
              {Object.entries(mealTimeRecipes).map(([key, meal]) => (
                <button
                  key={key}
                  onClick={() => {
                    setSelectedMealTime(key);
                    setCurrentCardIndex(0);
                  }}
                  className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                    selectedMealTime === key
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <div className="text-xs opacity-75">{meal.time}</div>
                  <div>{meal.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Card da Receita */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xl font-bold text-gray-800">{currentMealTime.name} - {currentMealTime.time}</h4>
              <div className="text-sm text-gray-600">
                {currentCardIndex + 1} de {currentMealTime.recipes.length}
              </div>
            </div>

            {/* Navegação dos Cards */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={prevCard}
                className="p-2 rounded-full bg-white shadow-md hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft size={20} className="text-gray-600" />
              </button>
              
              <div className="flex space-x-2">
                {currentMealTime.recipes.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      index === currentCardIndex ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={nextCard}
                className="p-2 rounded-full bg-white shadow-md hover:bg-gray-50 transition-colors"
              >
                <ChevronRight size={20} className="text-gray-600" />
              </button>
            </div>

            {/* Conteúdo do Card */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h5 className="text-lg font-semibold text-gray-800 mb-2">{currentRecipe.name}</h5>
              <p className="text-gray-600 mb-4">{currentRecipe.description}</p>
              
              {/* Ingredientes */}
              <div className="mb-4">
                <h6 className="font-medium text-gray-700 mb-2">📋 Ingredientes:</h6>
                <div className="space-y-2">
                  {currentRecipe.ingredients.map((ingredient, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                      <span className="font-medium text-gray-800">{ingredient.name}</span>
                      <span className="text-sm text-gray-600 bg-blue-100 px-2 py-1 rounded">
                        {ingredient.quantity}g
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Instruções */}
              <div className="mb-4">
                <h6 className="font-medium text-gray-700 mb-2">👨‍🍳 Preparo:</h6>
                <div className="bg-gray-50 rounded-lg p-3">
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">{currentRecipe.instructions}</pre>
                </div>
              </div>

              {/* Informações Nutricionais */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4">
                <h6 className="font-medium text-gray-700 mb-3">📊 Informações Nutricionais:</h6>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  <div className="text-center">
                    <div className="text-lg font-bold text-red-600">{currentRecipe.nutrition.calories}</div>
                    <div className="text-xs text-gray-600">Calorias</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-600">{currentRecipe.nutrition.protein}g</div>
                    <div className="text-xs text-gray-600">Proteína</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">{currentRecipe.nutrition.carbs}g</div>
                    <div className="text-xs text-gray-600">Carbs</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-yellow-600">{currentRecipe.nutrition.fat}g</div>
                    <div className="text-xs text-gray-600">Gordura</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-600">{currentRecipe.nutrition.fiber}g</div>
                    <div className="text-xs text-gray-600">Fibra</div>
                  </div>
                </div>
              </div>

              {/* Botão para Adicionar à Refeição */}
              <div className="mt-6">
                <button
                  onClick={() => {
                    currentRecipe.ingredients.forEach(ing => {
                      const ingredient = ingredients.find(i => i.id === ing.id);
                      if (ingredient) {
                        addToMeal(ingredient, ing.quantity);
                      }
                    });
                    setActiveTab('meals');
                  }}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  ➕ Adicionar à Minha Refeição
                </button>
              </div>
            </div>
          </div>

          {/* Princípios da Dieta Gracie */}
          <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
            <h4 className="font-semibold text-amber-800 mb-2">🥋 Princípios da Dieta Gracie:</h4>
            <ul className="text-sm text-amber-700 space-y-1">
              <li>• Intervalo de 5 horas entre refeições para melhor digestão</li>
              <li>• Combinações corretas: Proteínas + Carboidratos complexos</li>
              <li>• Alimentos naturais e integrais dos insumos disponíveis</li>
              <li>• Adaptação para ganho de massa muscular</li>
            </ul>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow mb-6">
          {/* Status de Sincronização */}
          <div className="p-4 border-b bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h1 className="text-xl font-bold text-gray-800">🥋 Dieta Gracie App</h1>
                {user ? (
                  <div className="flex items-center gap-2">
                    <Wifi className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-600">Online</span>
                    {lastSync && (
                      <span className="text-xs text-gray-500">
                        Última sincronização: {lastSync.toLocaleTimeString('pt-BR')}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <WifiOff className="w-4 h-4 text-red-600" />
                    <span className="text-sm text-red-600">Offline</span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                {user ? (
                  <>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>👤 {user.email}</span>
                      {syncing && (
                        <div className="flex items-center gap-1">
                          <Cloud className="w-4 h-4 animate-pulse text-blue-600" />
                          <span className="text-blue-600">Sincronizando...</span>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={signOutUser}
                      className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                    >
                      Sair
                    </button>
                  </>
                ) : (
                  <button
                    onClick={signInWithGoogle}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                  >
                    <Cloud className="w-4 h-4" />
                    Entrar com Google
                  </button>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap border-b">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-6 py-4 flex items-center gap-2 ${
                activeTab === 'dashboard' 
                  ? 'border-b-2 border-blue-600 text-blue-600 bg-blue-50' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <BarChart3 size={20} /> Dashboard
            </button>
            <button
              onClick={() => setActiveTab('ingredients')}
              className={`px-6 py-4 flex items-center gap-2 ${
                activeTab === 'ingredients' 
                  ? 'border-b-2 border-blue-600 text-blue-600 bg-blue-50' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Plus size={20} /> Ingredientes
            </button>
            <button
              onClick={() => setActiveTab('meals')}
              className={`px-6 py-4 flex items-center gap-2 ${
                activeTab === 'meals' 
                  ? 'border-b-2 border-blue-600 text-blue-600 bg-blue-50' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Target size={20} /> Refeições
            </button>
            <button
              onClick={() => setActiveTab('recipes')}
              className={`px-6 py-4 flex items-center gap-2 ${
                activeTab === 'recipes' 
                  ? 'border-b-2 border-blue-600 text-blue-600 bg-blue-50' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <ChefHat size={20} /> Receitas
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-6 py-4 flex items-center gap-2 ${
                activeTab === 'history' 
                  ? 'border-b-2 border-blue-600 text-blue-600 bg-blue-50' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Calendar size={20} /> Histórico
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`px-6 py-4 flex items-center gap-2 ${
                activeTab === 'reports' 
                  ? 'border-b-2 border-blue-600 text-blue-600 bg-blue-50' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <BarChart3 size={20} /> Relatórios
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'ingredients' && renderIngredients()}
        {activeTab === 'meals' && renderMealBuilder()}
        {activeTab === 'recipes' && renderRecipes()}
        {activeTab === 'history' && renderHistory()}
        {activeTab === 'reports' && renderReports()}
      </div>
    </div>
  );
};

export default GracieDietApp;