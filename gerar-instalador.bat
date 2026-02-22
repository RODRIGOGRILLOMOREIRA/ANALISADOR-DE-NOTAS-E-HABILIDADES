@echo off
chcp 65001 >nul
echo.
echo ═══════════════════════════════════════════════════════════════
echo   🎓 SGE CENTENÁRIO - Gerar Instalador
echo ═══════════════════════════════════════════════════════════════
echo.

echo [1/3] Verificando ícones...
if not exist "build\icon.ico" (
    echo ❌ ERRO: Ícone não encontrado em build\icon.ico
    echo.
    echo   Por favor:
    echo   1. Converta docs/LOGO ESCOLA.jpg para .ico
    echo   2. Salve como build\icon.ico
    echo   3. Execute este script novamente
    echo.
    pause
    exit /b 1
)

if not exist "build\installerIcon.ico" (
    echo ⚠️  Copiando icon.ico para installerIcon.ico...
    copy "build\icon.ico" "build\installerIcon.ico"
)

echo ✅ Ícones encontrados!
echo.

echo [2/3] Compilando aplicação...
call npm run build

if errorlevel 1 (
    echo.
    echo ❌ ERRO ao compilar. Verifique os erros acima.
    pause
    exit /b 1
)

echo.
echo [3/3] Gerando instalador...
call npm run dist

if errorlevel 1 (
    echo.
    echo ❌ ERRO ao gerar instalador. Verifique os erros acima.
    pause
    exit /b 1
)

echo.
echo ═══════════════════════════════════════════════════════════════
echo   ✅ INSTALADOR GERADO COM SUCESSO!
echo ═══════════════════════════════════════════════════════════════
echo.
echo   Arquivo gerado em: dist\SGE CENTENARIO-Setup-1.0.0.exe
echo.
echo   Você pode:
echo   1. Testar o instalador
echo   2. Distribuir para os computadores da escola
echo   3. Publicar no GitHub Releases para auto-update
echo.
pause
