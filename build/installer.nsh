!macro customInstall
  DetailPrint "========================================="
  DetailPrint "SGE CENTENARIO - Instalando dependencias"
  DetailPrint "========================================="
  
  ; Verifica se o Node.js está instalado
  DetailPrint "Verificando Node.js..."
  nsExec::ExecToStack 'cmd /c node --version'
  Pop $0
  Pop $1
  ${If} $0 != 0
    DetailPrint "AVISO: Node.js nao encontrado. Por favor, instale o Node.js"
    MessageBox MB_OK|MB_ICONEXCLAMATION "Node.js nao foi encontrado.$\r$n$\r$nO SGE CENTENARIO requer Node.js instalado.$\r$n$\r$nPor favor, instale o Node.js em https://nodejs.org/"
  ${Else}
    DetailPrint "Node.js encontrado: $1"
    
    ; Instala dependências do servidor
    DetailPrint "Instalando dependencias do servidor..."
    DetailPrint "Diretorio: $INSTDIR\resources\server"
    
    ; Limpa cache do npm antes de instalar
    nsExec::ExecToLog 'cmd /c cd /d "$INSTDIR\resources\server" && npm cache clean --force 2>nul'
    
    ; Instala as dependências de produção
    DetailPrint "Instalando pacotes npm..."
    nsExec::ExecToLog 'cmd /c cd /d "$INSTDIR\resources\server" && npm install --production --no-optional --legacy-peer-deps'
    Pop $0
    
    ${If} $0 == 0
      DetailPrint "========================================="
      DetailPrint "Dependencias instaladas com SUCESSO!"
      DetailPrint "========================================="
    ${Else}
      DetailPrint "========================================="
      DetailPrint "AVISO: Erro ao instalar dependencias"
      DetailPrint "Codigo de erro: $0"
      DetailPrint "========================================="
      MessageBox MB_OK|MB_ICONINFORMATION "A instalacao foi concluida, mas algumas dependencias podem precisar ser instaladas manualmente.$\r$n$\r$nExecute no terminal:$\r$ncd $\"$INSTDIR\resources\server$\"$\r$nnpm install --production"
    ${EndIf}
  ${EndIf}
  
  ; Cria atalho para o script de verificação no Menu Iniciar
  CreateShortcut "$SMPROGRAMS\SGE CENTENARIO\Verificar Instalacao.lnk" "$INSTDIR\resources\verificar-instalacao.bat" "" "$INSTDIR\resources\verificar-instalacao.bat" 0
  
  DetailPrint "Instalacao do SGE CENTENARIO concluida!"
!macroend

!macro customUnInstall
  DetailPrint "Removendo SGE CENTENARIO..."
  Delete "$SMPROGRAMS\SGE CENTENARIO\Verificar Instalacao.lnk"
!macroend
