@echo off
echo ========================================
echo   SISTEMA ESCOLAR - PUSH PARA GITHUB
echo ========================================
echo.
echo Este script vai ajudar a publicar no GitHub
echo.
echo ANTES DE EXECUTAR:
echo 1. Crie o repositorio no GitHub: https://github.com/new
echo 2. Nome sugerido: sistema-escolar-notas-habilidades
echo 3. Deixe DESMARCADO: README, .gitignore, license
echo.
pause
echo.
echo ========================================
echo Por favor, digite seu USUARIO do GitHub:
echo (exemplo: joaosilva)
echo ========================================
set /p GITHUB_USER="Seu usuario: "
echo.
echo ========================================
echo Configurando repositorio remoto...
echo ========================================
git remote remove origin 2>nul
git remote add origin https://github.com/%GITHUB_USER%/sistema-escolar-notas-habilidades.git
echo.
echo ========================================
echo Renomeando branch para main...
echo ========================================
git branch -M main
echo.
echo ========================================
echo Fazendo push para GitHub...
echo ========================================
echo.
echo ATENCAO: O GitHub vai pedir suas credenciais
echo - Usuario: seu username do GitHub
echo - Senha: use um Personal Access Token (nao a senha normal)
echo.
echo Como criar token: https://github.com/settings/tokens
echo Marque o scope: repo (full control)
echo.
pause
echo.
git push -u origin main
echo.
echo ========================================
echo CONCLUIDO!
echo ========================================
echo.
echo Seu projeto esta em:
echo https://github.com/%GITHUB_USER%/sistema-escolar-notas-habilidades
echo.
pause
