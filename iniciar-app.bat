@echo off
:: SGE CENTENARIO - Launcher Pos-Instalacao
:: Verifica dependencias e executa o aplicativo
:: Autor: Sistema SGE CENTENARIO
:: Data: 21/02/2026

setlocal enabledelayedexpansion

title SGE CENTENARIO - Inicializando Sistema...

:: Obtem o diretorio de instalacao (pai de resources)
set "SCRIPT_DIR=%~dp0"
:: Remove resources\ do caminho para obter o diretorio raiz
for %%i in ("%SCRIPT_DIR%..") do set "INSTALL_DIR=%%~fi"

echo.
echo ========================================
echo    SGE CENTENARIO - Inicializacao
echo ========================================
echo.

:: Verifica se o executavel existe
if not exist "%INSTALL_DIR%\SGE CENTENARIO.exe" (
    echo [ERRO] Executavel nao encontrado!
    echo Procurando em: %INSTALL_DIR%\SGE CENTENARIO.exe
    echo.
    pause
    exit /b 1
)

:: Verifica se as dependencias do servidor estao instaladas
echo [1/3] Verificando dependencias do servidor...
if exist "%INSTALL_DIR%\resources\server\node_modules" (
    echo [OK] Dependencias encontradas
) else (
    echo [AVISO] Dependencias nao encontradas
    echo [2/3] Tentando instalar dependencias...
    
    if exist "%INSTALL_DIR%\resources\server\package.json" (
        pushd "%INSTALL_DIR%\resources\server"
        echo Executando: npm install --production --no-optional --legacy-peer-deps
        call npm install --production --no-optional --legacy-peer-deps
        set NPM_EXIT_CODE=!ERRORLEVEL!
        popd
        
        if !NPM_EXIT_CODE! equ 0 (
            if exist "%INSTALL_DIR%\resources\server\node_modules" (
                echo [OK] Dependencias instaladas com sucesso!
            ) else (
                echo [ERRO] Instalacao falhou - node_modules nao criado
                goto :show_manual_fix
            )
        ) else (
            echo [ERRO] npm install retornou codigo !NPM_EXIT_CODE!
            goto :show_manual_fix
        )
    ) else (
        echo [ERRO] package.json nao encontrado!
        goto :show_manual_fix
    )
)

:: Verifica Node.js
echo [3/3] Verificando Node.js...
node --version >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo [AVISO] Node.js nao encontrado no PATH
    echo O servidor backend pode nao funcionar corretamente
    echo.
    echo Por favor, instale Node.js de: https://nodejs.org/
    timeout /t 5
)

:: Tudo OK - Executa o aplicativo
echo.
echo ========================================
echo   Iniciando SGE CENTENARIO...
echo ========================================
echo.
timeout /t 1 >nul

:: Executa o aplicativo e sai
start "" "%INSTALL_DIR%\SGE CENTENARIO.exe"
exit /b 0

:show_manual_fix
echo.
echo ========================================
echo   ATENCAO: Acao Manual Necessaria
echo ========================================
echo.
echo As dependencias nao puderam ser instaladas automaticamente.
echo.
echo SOLUCAO:
echo 1. Abra o Menu Iniciar
echo 2. Procure por "SGE CENTENARIO"
echo 3. Execute "Verificar Instalacao"
echo.
echo OU execute manualmente no terminal:
echo cd "%INSTALL_DIR%\resources\server"
echo npm install --production
echo.
echo Deseja tentar executar o aplicativo mesmo assim? (S/N)
choice /C SN /N /M "Escolha S ou N: "
if errorlevel 2 goto :end_error
if errorlevel 1 goto :force_start

:force_start
echo.
echo Iniciando aplicativo (modo degradado)...
start "" "%INSTALL_DIR%\SGE CENTENARIO.exe"
exit /b 0

:end_error
echo.
echo Instalacao requer atencao manual.
timeout /t 3
exit /b 1
