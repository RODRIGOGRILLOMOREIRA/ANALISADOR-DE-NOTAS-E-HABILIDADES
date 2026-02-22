; ====================================================================
; SGE CENTENARIO - NSIS Installer Script Customizado
; Correcao COMPLETA do erro ao clicar em Concluir
; Data: 21/02/2026
; ====================================================================

; ====================================================================
; SECAO 1: Definicoes MUI - DEVEM VIR ANTES DE TUDO
; ====================================================================
!define MUI_FINISHPAGE_RUN "$INSTDIR\resources\iniciar-app.bat"
!define MUI_FINISHPAGE_RUN_TEXT "Executar SGE CENTENARIO agora"
!define MUI_FINISHPAGE_RUN_NOTCHECKED
!define MUI_FINISHPAGE_SHOWREADME_NOTCHECKED

; ====================================================================
; SECAO 2: Macro de Instalacao Customizada
; ====================================================================
!macro customInstall
  SetDetailsPrint both
  DetailPrint ""
  DetailPrint "========================================="
  DetailPrint "  SGE CENTENARIO - Instalando Sistema"
  DetailPrint "========================================="
  DetailPrint ""
  
  ; ===== PASSO 1: Verificar Node.js =====
  DetailPrint "[1/4] Verificando Node.js..."
  nsExec::ExecToStack 'cmd /c node --version 2>&1'
  Pop $0  ; Codigo de retorno
  Pop $1  ; Saida do comando
  
  ${If} $0 != 0
    DetailPrint "      STATUS: Node.js NAO encontrado"
    DetailPrint "      AVISO: O sistema requer Node.js!"
    DetailPrint ""
    MessageBox MB_YESNO|MB_ICONEXCLAMATION "Node.js nao foi encontrado no sistema!$\r$\n$\r$\nO SGE CENTENARIO precisa do Node.js para funcionar.$\r$\n$\r$\nDeseja continuar mesmo assim?$\r$\n(Voce precisara instalar Node.js depois)" IDYES continue_without_node
    DetailPrint "      ACAO: Instalacao cancelada pelo usuario"
    Abort "Node.js nao instalado - instalacao cancelada"
    continue_without_node:
    DetailPrint "      ACAO: Usuario optou por continuar"
    DetailPrint "      NOTA: Instale Node.js de https://nodejs.org/"
    DetailPrint "      NOTA: Apos instalar, execute 'Verificar Instalacao'"
    DetailPrint ""
    Goto skip_npm_install
  ${Else}
    StrCpy $1 $1 20  ; Limita tamanho da string
    DetailPrint "      STATUS: Node.js encontrado ($1)"
    DetailPrint ""
  ${EndIf}
  
  ; ===== PASSO 2: Verificar npm =====
  DetailPrint "[2/4] Verificando npm..."
  nsExec::ExecToStack 'cmd /c npm --version 2>&1'
  Pop $0
  Pop $1
  
  ${If} $0 == 0
    StrCpy $1 $1 20
    DetailPrint "      STATUS: npm encontrado ($1)"
    DetailPrint ""
  ${Else}
    DetailPrint "      ERRO: npm nao encontrado!"
    DetailPrint ""
    Goto skip_npm_install
  ${EndIf}
  
  ; ===== PASSO 3: Instalar Dependencias do Servidor =====
  DetailPrint "[3/4] Instalando dependencias do servidor..."
  DetailPrint "      Diretorio: $INSTDIR\resources\server"
  DetailPrint "      Comando: npm install --production"
  DetailPrint "      AGUARDE - Isto pode levar varios minutos..."
  DetailPrint ""
  SetDetailsPrint listonly
  
  ; Limpa cache primeiro
  nsExec::ExecToLog 'cmd /c cd /d "$INSTDIR\resources\server" && npm cache clean --force 2>nul'
  
  ; Instala dependencias E AGUARDA TERMINAR
  nsExec::ExecToLog 'cmd /c cd /d "$INSTDIR\resources\server" && npm install --production --no-optional --legacy-peer-deps 2>&1'
  Pop $0
  
  SetDetailsPrint both
  DetailPrint ""
  ${If} $0 == 0
    DetailPrint "      ========================================="
    DetailPrint "      STATUS: SUCESSO!"
    DetailPrint "      Dependencias instaladas corretamente!"
    DetailPrint "      O sistema esta pronto para uso!"
    DetailPrint "      ========================================="
  ${Else}
    DetailPrint "      ========================================="
    DetailPrint "      STATUS: ERRO (Codigo: $0)"
    DetailPrint "      Houve um problema na instalacao!"
    DetailPrint "      ========================================="
    DetailPrint ""
    MessageBox MB_YESNO|MB_ICONWARNING "Houve um erro ao instalar as dependencias automaticamente!$\r$\n$\r$\nCodigo de erro: $0$\r$\n$\r$\nVoce pode:$\r$\n • Clicar SIM para continuar (podera instalar depois)$\r$\n • Clicar NAO para cancelar a instalacao$\r$\n$\r$\nPara corrigir depois, execute:$\r$\nMenu Iniciar > SGE CENTENARIO > Verificar Instalacao" IDYES continue_with_error
    DetailPrint "      ACAO: Instalacao cancelada pelo usuario"
    Abort "Erro nas dependencias - instalacao cancelada"
    continue_with_error:
    DetailPrint "      ACAO: Continuando com erro..."
    DetailPrint "      NOTA: Execute 'Verificar Instalacao' depois!"
  ${EndIf}
  DetailPrint ""
  
  skip_npm_install:
  
  ; ===== PASSO 4: Criar Atalhos =====
  DetailPrint "[4/4] Criando atalhos do sistema..."
  CreateDirectory "$SMPROGRAMS\SGE CENTENARIO"
  CreateShortcut "$SMPROGRAMS\SGE CENTENARIO\Verificar Instalacao.lnk" "$INSTDIR\resources\verificar-instalacao.bat" "" "$INSTDIR\resources\verificar-instalacao.bat" 0 SW_SHOWNORMAL "" "Verificar e corrigir instalacao"
  DetailPrint "      STATUS: Atalhos criados"
  DetailPrint ""
  
  ; ===== FINALIZACAO =====
  DetailPrint "========================================="
  DetailPrint "  INSTALACAO CONCLUIDA!"
  DetailPrint "========================================="
  DetailPrint ""
  DetailPrint "Para iniciar o SGE CENTENARIO:"
  DetailPrint "  1. Marque a caixa 'Executar SGE CENTENARIO agora'"
  DetailPrint "  2. Clique em [Concluir]"
  DetailPrint ""
  DetailPrint "OU utilize o atalho na area de trabalho"
  DetailPrint ""
  DetailPrint "Em caso de problemas:"
  DetailPrint "  Menu Iniciar > SGE CENTENARIO > Verificar Instalacao"
  DetailPrint "========================================="
  DetailPrint ""
!macroend

; ====================================================================
; SECAO 3: Macro de Desinstalacao
; ====================================================================
!macro customUnInstall
  DetailPrint "Removendo SGE CENTENARIO..."
  Delete "$SMPROGRAMS\SGE CENTENARIO\Verificar Instalacao.lnk"
  RMDir "$SMPROGRAMS\SGE CENTENARIO"
  DetailPrint "Desinstalacao concluida"
!macroend

; ====================================================================
; FIM DO SCRIPT
; ====================================================================
