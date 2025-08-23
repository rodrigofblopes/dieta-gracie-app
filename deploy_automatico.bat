@echo off
echo 🚀 Dieta Gracie - Deploy Automático
echo ====================================
echo.
echo 📋 Escolha sua opção de deploy:
echo.
echo 1. 🌐 GitHub Pages (Gratuito)
echo 2. ⚡ Vercel (Super rápido)
echo 3. 📂 Preparar arquivos para upload
echo 4. 📖 Ver guias completos
echo.
set /p escolha="Escolha uma opção (1-4): "

if "%escolha%"=="1" (
    echo.
    echo 🌐 GitHub Pages - Deploy Gratuito
    echo =================================
    echo.
    echo 📋 Passos:
    echo 1. Vá para github.com
    echo 2. Crie repositório: dieta-gracie-app
    echo 3. Faça upload dos arquivos
    echo 4. Ative GitHub Pages
    echo.
    echo 📁 Arquivos para upload:
    echo ✅ index.html
    echo ✅ dashboard.html
    echo ✅ ingredientes.html
    echo ✅ refeicoes.html
    echo ✅ receitas.html
    echo ✅ historico.html
    echo ✅ Insumos.csv
    echo ✅ public/manifest.json
    echo ✅ vercel.json
    echo.
    echo 🌐 URL final: https://seu-usuario.github.io/dieta-gracie-app/
    echo.
    start https://github.com
    pause
) else if "%escolha%"=="2" (
    echo.
    echo ⚡ Vercel - Deploy Super Rápido
    echo ===============================
    echo.
    echo 📋 Pré-requisito: Repositório no GitHub
    echo.
    echo 🚀 Passos:
    echo 1. Vá para vercel.com
    echo 2. Faça login com GitHub
    echo 3. Importe o repositório
    echo 4. Deploy automático!
    echo.
    echo ⚡ URL final: https://dieta-gracie-app.vercel.app
    echo.
    start https://vercel.com
    pause
) else if "%escolha%"=="3" (
    echo.
    echo 📂 Preparando arquivos para upload...
    echo.
    echo 📋 Lista de arquivos necessários:
    echo.
    dir /b *.html
    dir /b *.csv
    dir /b *.json
    dir /b public\*
    echo.
    echo ✅ Todos os arquivos estão prontos!
    echo 📁 Pasta atual: %CD%
    echo.
    pause
) else if "%escolha%"=="4" (
    echo.
    echo 📖 Abrindo guias completos...
    echo.
    start GUIA_DEPLOY_GITHUB.md
    start GUIA_DEPLOY_VERCEL.md
    echo.
    echo 📚 Guias abertos no editor
    echo.
    pause
) else (
    echo Opção inválida!
    pause
)
