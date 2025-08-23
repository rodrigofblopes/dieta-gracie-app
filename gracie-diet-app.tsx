import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit3, Save, X, BookOpen, Target, Calendar, BarChart3, ChefHat } from 'lucide-react';

const GracieDietApp = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [ingredients, setIngredients] = useState([
    // Alimentos base da Dieta Gracie adaptados para massa muscular
    { id: 1, name: 'Peito de Frango', category: 'Proteína', calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0 },
    { id: 2, name: 'Arroz Integral', category: 'Carboidrato', calories: 123, protein: 2.6, carbs: 23, fat: 0.9, fiber: 1.8 },
    { id: 3, name: 'Batata Doce', category: 'Carboidrato', calories: 86, protein: 1.6, carbs: 20, fat: 0.1, fiber: 3 },
    { id: 4, name: 'Ovos', category: 'Proteína', calories: 155, protein: 13, carbs: 1.1, fat: 11, fiber: 0 },
    { id: 5, name: 'Abacate', category: 'Gordura', calories: 160, protein: 2, carbs: 8.5, fat: 15, fiber: 6.7 },
    { id: 6, name: 'Banana', category: 'Fruta', calories: 89, protein: 1.1, carbs: 23, fat: 0.3, fiber: 2.6 },
    { id: 7, name: 'Castanha do Brasil', category: 'Gordura', calories: 656, protein: 14, carbs: 12, fat: 66, fiber: 7.5 },
    { id: 8, name: 'Feijão Preto', category: 'Proteína', calories: 132, protein: 8.9, carbs: 23, fat: 0.5, fiber: 8.7 }
  ]);

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

  const [newIngredient, setNewIngredient] = useState({
    name: '', category: 'Proteína', calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0
  });

  const [currentMeal, setCurrentMeal] = useState([]);
  const [editingIngredient, setEditingIngredient] = useState(null);

  // Categorias da Dieta Gracie adaptada
  const categories = ['Proteína', 'Carboidrato', 'Gordura', 'Fruta', 'Vegetal', 'Líquido'];

  const addIngredient = () => {
    if (newIngredient.name) {
      setIngredients([...ingredients, { ...newIngredient, id: Date.now() }]);
      setNewIngredient({ name: '', category: 'Proteína', calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 });
    }
  };

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
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString(),
        items: [...currentMeal]
      };
      setMeals([...meals, meal]);
      setDailyLog([...dailyLog, meal]);
      setCurrentMeal([]);
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
      </div>
    );
  };

  const renderIngredients = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Adicionar Novo Ingrediente</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Nome do alimento"
            className="border rounded-lg px-3 py-2"
            value={newIngredient.name}
            onChange={(e) => setNewIngredient({...newIngredient, name: e.target.value})}
          />
          <select
            className="border rounded-lg px-3 py-2"
            value={newIngredient.category}
            onChange={(e) => setNewIngredient({...newIngredient, category: e.target.value})}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Calorias/100g"
            className="border rounded-lg px-3 py-2"
            value={newIngredient.calories}
            onChange={(e) => setNewIngredient({...newIngredient, calories: parseFloat(e.target.value) || 0})}
          />
          <input
            type="number"
            placeholder="Proteína/100g"
            className="border rounded-lg px-3 py-2"
            value={newIngredient.protein}
            onChange={(e) => setNewIngredient({...newIngredient, protein: parseFloat(e.target.value) || 0})}
          />
          <input
            type="number"
            placeholder="Carboidratos/100g"
            className="border rounded-lg px-3 py-2"
            value={newIngredient.carbs}
            onChange={(e) => setNewIngredient({...newIngredient, carbs: parseFloat(e.target.value) || 0})}
          />
          <input
            type="number"
            placeholder="Gordura/100g"
            className="border rounded-lg px-3 py-2"
            value={newIngredient.fat}
            onChange={(e) => setNewIngredient({...newIngredient, fat: parseFloat(e.target.value) || 0})}
          />
          <input
            type="number"
            placeholder="Fibra/100g"
            className="border rounded-lg px-3 py-2"
            value={newIngredient.fiber}
            onChange={(e) => setNewIngredient({...newIngredient, fiber: parseFloat(e.target.value) || 0})}
          />
          <button
            onClick={addIngredient}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus size={16} /> Adicionar
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <h3 className="text-lg font-semibold p-6 border-b">Banco de Ingredientes</h3>
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
    </div>
  );

  const renderMealBuilder = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Construir Refeição</h3>
        
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
          <h3 className="text-lg font-semibold mb-4">Histórico de Refeições</h3>
          
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
                        {dayMeals.map(meal => (
                          <div key={meal.id} className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="font-medium mb-1">{meal.time}</div>
                              <div className="text-sm text-gray-600">
                                {meal.items.map(item => 
                                  `${item.ingredient.name} (${item.quantity}g)`
                                ).join(', ')}
                              </div>
                            </div>
                            <div className="text-sm text-gray-500 ml-4">
                              {Math.round(calculateMealNutrition(meal.items).calories)} kcal
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

  const renderRecipes = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Receitas Dieta Gracie - Massa Muscular</h3>
        
        <div className="grid gap-6">
          {recipes.map(recipe => (
            <div key={recipe.id} className="border rounded-lg p-6">
              <h4 className="font-semibold text-lg mb-2">{recipe.name}</h4>
              <p className="text-gray-600 mb-4">{recipe.description}</p>
              
              <div className="mb-4">
                <h5 className="font-medium mb-2">Ingredientes:</h5>
                <ul className="space-y-1">
                  {recipe.ingredients.map(item => {
                    const ingredient = ingredients.find(ing => ing.id === item.ingredientId);
                    return ingredient ? (
                      <li key={item.ingredientId} className="text-sm">
                        • {ingredient.name} - {item.quantity}g
                      </li>
                    ) : null;
                  })}
                </ul>
              </div>
              
              <div className="mb-4">
                <h5 className="font-medium mb-2">Preparo:</h5>
                <pre className="text-sm text-gray-600 whitespace-pre-wrap">{recipe.instructions}</pre>
              </div>
              
              {(() => {
                const recipeItems = recipe.ingredients.map(item => {
                  const ingredient = ingredients.find(ing => ing.id === item.ingredientId);
                  return ingredient ? { ingredient, quantity: item.quantity } : null;
                }).filter(Boolean);
                
                const nutrition = calculateMealNutrition(recipeItems);
                
                return (
                  <div className="bg-gray-50 p-3 rounded">
                    <h6 className="font-medium mb-2">Informações Nutricionais:</h6>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm">
                      <div>Calorias: <strong>{Math.round(nutrition.calories)}</strong></div>
                      <div>Proteína: <strong>{Math.round(nutrition.protein)}g</strong></div>
                      <div>Carbs: <strong>{Math.round(nutrition.carbs)}g</strong></div>
                      <div>Gordura: <strong>{Math.round(nutrition.fat)}g</strong></div>
                      <div>Fibra: <strong>{Math.round(nutrition.fiber)}g</strong></div>
                    </div>
                  </div>
                );
              })()}
            </div>
          ))}
        </div>
        
        <div className="mt-8 p-6 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-4">📖 Sugestões de Receitas Dieta Gracie:</h4>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-700">
            <div>
              <h5 className="font-medium mb-2">Pré-Treino (2h antes):</h5>
              <ul className="space-y-1">
                <li>• Banana + Castanha do Brasil</li>
                <li>• Batata Doce + Ovos</li>
                <li>• Arroz Integral + Frango</li>
              </ul>
            </div>
            <div>
              <h5 className="font-medium mb-2">Pós-Treino (até 1h):</h5>
              <ul className="space-y-1">
                <li>• Frango + Batata Doce + Abacate</li>
                <li>• Ovos + Arroz + Feijão</li>
                <li>• Peixe + Mandioca + Óleo de Coco</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow mb-6">
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
          </div>
        </div>

        {/* Content */}
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'ingredients' && renderIngredients()}
        {activeTab === 'meals' && renderMealBuilder()}
        {activeTab === 'recipes' && renderRecipes()}
        {activeTab === 'history' && renderHistory()}
      </div>
    </div>
  );