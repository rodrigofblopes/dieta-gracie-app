@echo off
echo ========================================
echo    🥋 Dieta Gracie - App React LOCAL
echo ========================================
echo.
echo Iniciando aplicativo web LOCAL...
echo.
echo ✅ Versão sem dependências do Google/Firebase
echo ✅ Funciona completamente offline
echo ✅ Cardápio completo da Dieta Gracie
echo.

REM Verificar se Node.js está instalado
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ ERRO: Node.js não encontrado!
    echo Por favor, instale o Node.js em: https://nodejs.org/
    pause
    exit /b 1
)

REM Verificar se as dependências estão instaladas
if not exist "node_modules" (
    echo 📦 Instalando dependências...
    npm install
    if errorlevel 1 (
        echo ❌ ERRO: Falha ao instalar dependências!
        pause
        exit /b 1
    )
)

echo 🚀 Iniciando servidor de desenvolvimento LOCAL...
echo.
echo 🌐 O aplicativo será aberto em: http://localhost:5173
echo 📱 Funciona em qualquer dispositivo na mesma rede
echo 🔒 Dados salvos localmente - sem internet necessária
echo.
echo Para parar o servidor, pressione Ctrl+C
echo.

npm run dev

pause
