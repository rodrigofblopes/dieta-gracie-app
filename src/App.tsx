import React from 'react';

const GracieDietApp = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">
          🥋 Dieta Gracie App
        </h1>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Status do App</h2>
          <p className="text-green-600 mb-4">✅ App carregado com sucesso!</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Funcionalidades</h3>
              <ul className="space-y-1 text-sm">
                <li>✅ Dashboard nutricional</li>
                <li>✅ Registro de refeições</li>
                <li>✅ Histórico detalhado</li>
                <li>✅ Relatórios mensais</li>
                <li>✅ Login com Google</li>
                <li>✅ Sincronização na nuvem</li>
              </ul>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Próximos Passos</h3>
              <ul className="space-y-1 text-sm">
                <li>🔧 Configurar Firebase</li>
                <li>🔧 Implementar login</li>
                <li>🔧 Adicionar funcionalidades</li>
                <li>🔧 Testar no celular</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
              🚀 Começar a Usar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GracieDietApp;