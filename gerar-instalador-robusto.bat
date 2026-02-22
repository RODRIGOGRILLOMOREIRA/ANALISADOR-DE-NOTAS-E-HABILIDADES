@echo off
chcp 65001 > nul
title SGE CENTENÁRIO - Geração de Instalador Robusto

echo.
echo ╔═══════════════════════════════════════════════════════════════╗
echo ║       SGE CENTENÁRIO - GERAÇÃO DE INSTALADOR ROBUSTO          ║
echo ╚═══════════════════════════════════════════════════════════════╝
echo.

REM Verifica Node.js
echo [1/8] Verificando Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ ERRO: Node.js não encontrado!
    echo 📥 Baixe em: https://nodejs.org/
    pause
    exit /b 1
)
echo ✅ Node.js encontrado

REM Verifica npm
echo [2/8] Verificando npm...
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ ERRO: npm não encontrado!
    pause
    exit /b 1
)
echo ✅ npm encontrado

REM Limpa builds anteriores
echo.
echo [3/8] Limpando builds anteriores...
if exist "dist" (
    echo 🗑️  Removendo pasta dist...
    rmdir /s /q dist
)
if exist "client\build" (
    echo 🗑️  Removendo client\build...
    rmdir /s /q client\build
)
echo ✅ Limpeza concluída

REM Instala dependências raiz
echo.
echo [4/8] Instalando dependências raiz...
call npm install
if %errorlevel% neq 0 (
    echo ❌ Erro ao instalar dependências raiz
    pause
    exit /b 1
)
echo ✅ Dependências raiz instaladas

REM Instala dependências do client
echo.
echo [5/8] Instalando dependências do client...
cd client
call npm install
if %errorlevel% neq 0 (
    echo ❌ Erro ao instalar dependências do client
    cd ..
    pause
    exit /b 1
)
cd ..
echo ✅ Dependências do client instaladas

REM Instala dependências do server
echo.
echo [6/8] Instalando dependências do server...
cd server
call npm install --production
if %errorlevel% neq 0 (
    echo ❌ Erro ao instalar dependências do server
    cd ..
    pause
    exit /b 1
)
cd ..
echo ✅ Dependências do server instaladas

REM Build do client (React)
echo.
echo [7/8] Gerando build do React...
cd client
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Erro ao gerar build do React
    cd ..
    pause
    exit /b 1
)
cd ..
echo ✅ Build do React gerado

REM Verifica se os arquivos necessários existem
echo.
echo 🔍 Verificando arquivos necessários...

if not exist "build\icon.ico" (
    echo ❌ ERRO: build\icon.ico não encontrado!
    pause
    exit /b 1
)
echo ✅ icon.ico encontrado

if not exist "build\installerIcon.ico" (
    echo ❌ ERRO: build\installerIcon.ico não encontrado!
    pause
    exit /b 1
)
echo ✅ installerIcon.ico encontrado

if not exist "client\build\index.html" (
    echo ❌ ERRO: Build do React não gerado corretamente!
    pause
    exit /b 1
)
echo ✅ Build do React OK

if not exist "electron\main.js" (
    echo ❌ ERRO: electron\main.js não encontrado!
    pause
    exit /b 1
)
echo ✅ main.js encontrado

REM Gera o instalador
echo.
echo [8/8] Gerando instalador Windows...
echo 📦 Este processo pode demorar vários minutos...
echo.

call npm run dist:win

if %errorlevel% neq 0 (
    echo.
    echo ❌ ERRO ao gerar instalador!
    echo.
    echo 💡 Dicas:
    echo    1. Verifique se todas as dependências foram instaladas
    echo    2. Tente executar como Administrador
    echo    3. Verifique o espaço em disco disponível
    echo.
    pause
    exit /b 1
)

echo.
echo ╔═══════════════════════════════════════════════════════════════╗
echo ║              INSTALADOR GERADO COM SUCESSO!                   ║
echo ╚═══════════════════════════════════════════════════════════════╝
echo.
echo 📍 Localização: dist\SGE CENTENARIO-Setup-1.0.0.exe
echo.
echo 📋 Próximos passos:
echo    1. Teste o instalador em um computador limpo
echo    2. Verifique se o Node.js está instalado no PC de destino
echo    3. Execute o instalador e aguarde a instalação das dependências
echo    4. O aplicativo será iniciado automaticamente
echo.
echo 💡 Documentação: GUIA_INSTALACAO.md
echo.

pause
