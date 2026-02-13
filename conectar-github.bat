@echo off
echo ========================================
echo  Conectando ao GitHub
echo ========================================
echo.

REM Solicitar o username do GitHub
set /p GITHUB_USER="Digite seu username do GitHub: "

echo.
echo Configurando repositorio remoto...
git remote remove origin 2>nul
git remote add origin https://github.com/%GITHUB_USER%/sistema-escolar-notas-habilidades.git

echo.
echo Renomeando branch para main...
git branch -M main

echo.
echo ========================================
echo  Fazendo push para o GitHub...
echo ========================================
echo.
echo O GitHub pedira suas credenciais:
echo - Username: %GITHUB_USER%
echo - Password: Use seu Personal Access Token (NAO a senha)
echo.
echo Para criar token: https://github.com/settings/tokens
echo.
pause

git push -u origin main

echo.
echo ========================================
echo  Concluido!
echo ========================================
echo.
echo Seu repositorio esta em:
echo https://github.com/%GITHUB_USER%/sistema-escolar-notas-habilidades
echo.
pause
