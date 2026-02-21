@echo off
chcp 65001 >nul
echo.
echo ═══════════════════════════════════════════════════════════════
echo   🎓 SGE CENTENÁRIO - Instalador de Dependências
echo ═══════════════════════════════════════════════════════════════
echo.

echo [1/5] Limpando cache do NPM...
call npm cache clean --force

echo.
echo [2/5] Instalando concurrently...
call npm install concurrently --save-dev

echo.
echo [3/5] Instalando ferramentas...
call npm install cross-env dotenv --save-dev

echo.
echo [4/5] Instalando Electron (pode demorar)...
call npm install electron --save-dev

echo.
echo [5/5] Instalando electron-builder e updater...
call npm install electron-builder electron-updater --save-dev

echo.
echo ═══════════════════════════════════════════════════════════════
echo   ✅ Instalação Concluída!
echo ═══════════════════════════════════════════════════════════════
echo.
echo Próximos passos:
echo  1. Configure o arquivo .env com MongoDB Atlas
echo  2. Gere os ícones (build/icon.ico)
echo  3. Teste com: npm run electron-dev
echo.
pause
