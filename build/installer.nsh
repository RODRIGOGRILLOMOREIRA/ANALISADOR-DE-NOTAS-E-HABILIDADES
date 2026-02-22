; Definir o executavel customizado para o botao Concluir
!define MUI_FINISHPAGE_RUN
!define MUI_FINISHPAGE_RUN_TEXT "Executar SGE CENTENARIO agora"
!define MUI_FINISHPAGE_RUN_FUNCTION "LaunchApp"

!macro customInstall
  DetailPrint "========================================="
  DetailPrint "SGE CENTENARIO - Instalando dependencias"
  DetailPrint "========================================="
  
  ; Verifica se o Node.js esta instalado
  DetailPrint "Verificando Node.js..."
  nsExec::ExecToStack 'cmd /c node --version'
  Pop $0
  Pop $1
  ${If} $0 != 0
    DetailPrint "AVISO: Node.js nao encontrado"
    MessageBox MB_OK|MB_ICONEXCLAMATION "Node.js nao foi encontrado.$\r$n$\r$nO SGE CENTENARIO requer Node.js instalado.$\r$n$\r$nPor favor, instale Node.js em: https://nodejs.org/$\r$n$\r$nApos instalar, execute 'Verificar Instalacao' no Menu Iniciar."
  ${Else}
    DetailPrint "Node.js encontrado: $1"
    
    ; Instala dependencias do servidor
    DetailPrint "Instalando dependencias do servidor..."
    DetailPrint "Diretorio: $INSTDIR\resources\server"
    DetailPrint "*** AGUARDE - Isto pode levar varios minutos ***"
    
    ; Limpa cache do npm
    DetailPrint "Limpando cache npm..."
    nsExec::ExecToLog 'cmd /c cd /d "$INSTDIR\resources\server" && npm cache clean --force 2>nul'
    
    ; Instala as dependencias - AGUARDANDO COMPLETAMENTE
    DetailPrint "Baixando e instalando pacotes npm..."
    DetailPrint "Por favor, NAO FECHE esta janela..."
    nsExec::ExecToLog 'cmd /c cd /d "$INSTDIR\resources\server" && npm install --production --no-optional --legacy-peer-deps 2>&1'
    Pop $0
    
    ${If} $0 == 0
      DetailPrint "========================================="
      DetailPrint "SUCESSO! Dependencias instaladas!"
      DetailPrint "O aplicativo esta pronto para uso!"
      DetailPrint "========================================="
    ${Else}
      DetailPrint "========================================="
      DetailPrint "AVISO: Erro ao instalar dependencias"
      DetailPrint "Codigo de erro: $0"
      DetailPrint "========================================="
      MessageBox MB_OKCANCEL|MB_ICONWARNING "Houve um problema ao instalar automaticamente.$\r$n$\r$nVoce pode:$\r$n1. Clicar OK e tentar executar o app mesmo assim$\r$n2. Clicar Cancelar e executar 'Verificar Instalacao' depois$\r$n$\r$nO script Verificar Instalacao esta no Menu Iniciar." IDOK continue_install
      DetailPrint "Usuario optou por cancelar"
      Abort "Instalacao cancelada pelo usuario"
      continue_install:
      DetailPrint "Continuando mesmo com erro..."
    ${EndIf}
  ${EndIf}
  
  ; Cria atalho para verificacao
  DetailPrint "Criando atalhos..."
  CreateShortcut "$SMPROGRAMS\SGE CENTENARIO\Verificar Instalacao.lnk" "$INSTDIR\resources\verificar-instalacao.bat" "" "$INSTDIR\resources\verificar-instalacao.bat" 0
  
  DetailPrint "========================================="
  DetailPrint "Instalacao concluida!"
  DetailPrint "Marque a caixa abaixo para executar agora"
  DetailPrint "========================================="
!macroend

; Funcao para executar o app ao clicar em Concluir
Function LaunchApp
  DetailPrint "Iniciando SGE CENTENARIO..."
  ; Usa o script de inicializacao que verifica tudo antes
  Exec '"$INSTDIR\resources\iniciar-app.bat"'
FunctionEnd

!macro customUnInstall
  DetailPrint "Removendo SGE CENTENARIO..."
  Delete "$SMPROGRAMS\SGE CENTENARIO\Verificar Instalacao.lnk"
!macroend
