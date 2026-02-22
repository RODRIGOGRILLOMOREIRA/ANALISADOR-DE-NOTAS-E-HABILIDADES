@echo off
chcp 65001 > nul
title SGE CENTENÁRIO - Verificação de Instalação

echo.
echo ╔═══════════════════════════════════════════════════════════════╗
echo ║          SGE CENTENÁRIO - VERIFICAÇÃO DE INSTALAÇÃO           ║
echo ╚═══════════════════════════════════════════════════════════════╝
echo.

echo 📋 Verificando pré-requisitos...
echo.

REM Verifica Node.js
echo [1/3] Verificando Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js NÃO ENCONTRADO
    echo.
    echo ⚠️  O SGE CENTENÁRIO requer Node.js instalado.
    echo 📥 Baixe em: https://nodejs.org/
    echo.
    pause
    exit /b 1
) else (
    for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
    echo ✅ Node.js instalado: %NODE_VERSION%
)

echo.
echo [2/3] Verificando npm...
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm NÃO ENCONTRADO
    pause
    exit /b 1
) else (
    for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
    echo ✅ npm instalado: %NPM_VERSION%
)

echo.
echo [3/3] Verificando dependências do servidor...
if exist "server\package.json" (
    echo 📦 Instalando/verificando dependências do servidor...
    cd server
    call npm install --production --no-optional --legacy-peer-deps
    if %errorlevel% equ 0 (
        echo ✅ Dependências instaladas com sucesso!
    ) else (
        echo ⚠️  Houve problemas ao instalar algumas dependências
        echo    O sistema pode não funcionar corretamente
    )
    cd ..
) else (
    echo ⚠️  Arquivo package.json do servidor não encontrado
)

echo.
echo ╔═══════════════════════════════════════════════════════════════╗
echo ║                    VERIFICAÇÃO CONCLUÍDA                      ║
echo ╚═══════════════════════════════════════════════════════════════╝
echo.
echo 💡 Dica: Se o aplicativo não iniciar corretamente:
echo    1. Execute este script novamente
echo    2. Reinicie o computador
echo    3. Execute o SGE CENTENÁRIO como Administrador
echo.

pause
