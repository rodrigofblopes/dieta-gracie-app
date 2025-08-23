@echo off
echo 🥋 Dieta Gracie - Servidor Local
echo =================================
echo.
echo 📂 Iniciando servidor local...
echo 🌐 URL: http://localhost:8000
echo 📱 Para celular: http://SEU_IP:8000
echo.
echo 💡 Para parar o servidor: Ctrl+C
echo.

REM Verificar se Python está instalado
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python não encontrado!
    echo 💡 Instale Python ou use a opção "Abrir localmente"
    pause
    exit /b
)

REM Iniciar servidor Python
echo 🚀 Iniciando servidor...
python -m http.server 8000

pause
