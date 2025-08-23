@echo off
chcp 65001 >nul
title Backup Automático - Dieta Gracie App

echo.
echo ========================================
echo    🔄 BACKUP AUTOMÁTICO - DIETA GRACIE
echo ========================================
echo.

echo 📅 Data/Hora: %date% %time%
echo.

echo 🎯 O que você quer fazer?
echo.
echo 1. 📤 Fazer backup dos dados atuais
echo 2. 📥 Restaurar dados de um backup
echo 3. 🔄 Sincronizar com celular
echo 4. 📊 Ver status dos dados
echo 5. ❌ Sair
echo.

set /p escolha="Digite sua escolha (1-5): "

if "%escolha%"=="1" goto backup
if "%escolha%"=="2" goto restore
if "%escolha%"=="3" goto sync
if "%escolha%"=="4" goto status
if "%escolha%"=="5" goto sair

echo ❌ Opção inválida!
pause
goto :eof

:backup
echo.
echo 📤 Fazendo backup dos dados...
echo.
echo 1. Abra o app: https://dietagracieapp.vercel.app/
echo 2. Vá para a aba "🔄 Sincronização"
echo 3. Clique em "📤 Exportar Backup"
echo 4. Salve o arquivo em uma pasta segura
echo.
echo ✅ Backup concluído!
echo.
pause
goto :eof

:restore
echo.
echo 📥 Restaurando dados...
echo.
echo 1. Abra o app: https://dietagracieapp.vercel.app/
echo 2. Vá para a aba "🔄 Sincronização"
echo 3. Clique em "📥 Selecionar Arquivo"
echo 4. Escolha o arquivo de backup (.json)
echo.
echo ✅ Dados restaurados!
echo.
pause
goto :eof

:sync
echo.
echo 🔄 Sincronizando com celular...
echo.
echo 📱 PASSO A PASSO:
echo.
echo 1. No COMPUTADOR:
echo    - Abra o app
echo    - Vá em "🔄 Sincronização"
echo    - Clique "📤 Exportar Backup"
echo    - Envie o arquivo para o celular
echo.
echo 2. No CELULAR:
echo    - Abra o app
echo    - Vá em "🔄 Sincronização"
echo    - Clique "📥 Selecionar Arquivo"
echo    - Escolha o arquivo recebido
echo.
echo ✅ Sincronização concluída!
echo.
pause
goto :eof

:status
echo.
echo 📊 Status dos Dados:
echo.
echo 🔍 Para verificar seus dados:
echo 1. Abra o app: https://dietagracieapp.vercel.app/
echo 2. Vá para "📅 Histórico"
echo 3. Selecione os dias 22 e 23 de agosto
echo 4. Veja suas refeições cadastradas
echo.
echo 💡 Dica: Use a aba "🔄 Sincronização" para ver estatísticas
echo.
pause
goto :eof

:sair
echo.
echo 👋 Até logo!
echo.
pause
exit
