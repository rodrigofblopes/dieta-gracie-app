@echo off
echo ========================================
echo    🥋 Dieta Gracie - App React
echo ========================================
echo.
echo Iniciando aplicativo web...
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

echo 🚀 Iniciando servidor de desenvolvimento...
echo.
echo O aplicativo será aberto automaticamente no navegador.
echo Para parar o servidor, pressione Ctrl+C
echo.

npm run dev

pause
