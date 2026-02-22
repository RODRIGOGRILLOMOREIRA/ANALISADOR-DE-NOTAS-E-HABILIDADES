@echo off
:: Script de inicialização pos-instalacao
:: Aguarda e verifica dependencias antes de executar o app

title SGE CENTENARIO - Inicializando...

:: Define o diretorio de instalacao
set "INSTALL_DIR=%~dp0"
cd /d "%INSTALL_DIR%"

:: Verifica se as dependencias estao instaladas
echo Verificando dependencias do servidor...

if exist "resources\server\node_modules" (
    echo [OK] Dependencias encontradas
    goto :start_app
) else (
    echo [AVISO] Dependencias nao encontradas. Instalando...
    
    :: Tenta instalar dependencias
    if exist "resources\server\package.json" (
        echo Instalando dependencias do servidor...
        cd resources\server
        call npm install --production --no-optional --legacy-peer-deps >nul 2>&1
        cd ..\..
        
        if exist "resources\server\node_modules" (
            echo [OK] Dependencias instaladas com sucesso!
            goto :start_app
        ) else (
            echo [ERRO] Nao foi possivel instalar dependencias
            echo.
            echo Por favor, execute: Verificar Instalacao no Menu Iniciar
            timeout /t 5
            exit /b 1
        )
    )
)

:start_app
echo Iniciando SGE CENTENARIO...
timeout /t 2 >nul

:: Executa o aplicativo
start "" "%INSTALL_DIR%SGE CENTENARIO.exe"

exit /b 0
