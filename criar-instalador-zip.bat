@echo off
echo ========================================
echo  SGE CENTENARIO - Criar Instalador ZIP
echo ========================================
echo.

cd /d "%~dp0"

REM Parar processos
taskkill /F /IM node.exe 2>nul
taskkill /F /IM electron.exe 2>nul
timeout /t 2 >nul

REM Verificar se win-unpacked existe  
if not exist "dist\win-unpacked" (
    echo ERRO: Pasta dist\win-unpacked nao encontrada!
    echo Execute primeiro: npm run build
    pause
    exit /b 1
)

REM Criar ZIP
echo Criando instalador ZIP...
powershell -Command "Compress-Archive -Path 'dist\win-unpacked\*' -DestinationPath '$env:USERPROFILE\Desktop\SGE-CENTENARIO-v1.0.0.zip' -Force"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo  SUCESSO!
    echo ========================================
    echo.
    echo Instalador criado em:
    echo %USERPROFILE%\Desktop\SGE-CENTENARIO-v1.0.0.zip
    echo.
    echo Como instalar:
    echo 1. Descompacte o arquivo ZIP
    echo 2. Execute SGE CENTENARIO.exe
    echo 3. Crie atalho na area de trabalho
    echo.
) else (
    echo ERRO ao criar ZIP!
)

pause
