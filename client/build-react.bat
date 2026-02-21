@echo off
echo Compilando aplicacao React...
call npm run build
if %ERRORLEVEL% EQU 0 (
    echo Build concluido com sucesso!
) else (
    echo Erro no build: %ERRORLEVEL%
)
pause
