@echo off
echo 🥋 Dieta Gracie - Deploy Rapido
echo ================================
echo.
echo 📱 Opcoes para usar no celular:
echo.
echo 1. GitHub Pages (Recomendado)
echo 2. Netlify 
echo 3. Vercel
echo 4. Abrir localmente
echo.
set /p escolha="Escolha uma opcao (1-4): "

if "%escolha%"=="1" (
    echo.
    echo 🚀 GitHub Pages:
    echo 1. Vá para github.com
    echo 2. Crie um novo repositório chamado "dieta-gracie-app"
    echo 3. Faça upload dos arquivos HTML e CSV
    echo 4. Ative GitHub Pages em Settings > Pages
    echo 5. Acesse: https://seu-usuario.github.io/dieta-gracie-app/
    echo.
    pause
) else if "%escolha%"=="2" (
    echo.
    echo 🌐 Netlify:
    echo 1. Vá para netlify.com
    echo 2. Faça login com GitHub
    echo 3. Clique "New site from Git"
    echo 4. Conecte seu repositório
    echo 5. Deploy automático!
    echo.
    pause
) else if "%escolha%"=="3" (
    echo.
    echo ⚡ Vercel:
    echo 1. Vá para vercel.com
    echo 2. Faça login com GitHub
    echo 3. Clique "New Project"
    echo 4. Importe seu repositório
    echo 5. Deploy em segundos!
    echo.
    pause
) else if "%escolha%"=="4" (
    echo.
    echo 📂 Abrindo localmente...
    start index.html
    echo.
    echo 💡 Para usar no celular:
    echo 1. Abra o arquivo no navegador
    echo 2. Copie o endereço da barra de endereços
    echo 3. Envie para você mesmo por WhatsApp
    echo 4. Abra no celular
    echo.
    pause
) else (
    echo Opcao invalida!
    pause
)
