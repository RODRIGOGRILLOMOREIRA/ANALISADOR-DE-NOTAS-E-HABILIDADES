# Script para converter logo JPG para ICO
# SGE CENTENARIO

Write-Host "Convertendo logo para icones..." -ForegroundColor Cyan
Write-Host ""

$logoPath = "docs/LOGO ESCOLA.jpg"
$iconPath = "build/icon.ico"
$installerIconPath = "build/installerIcon.ico"

# Verificar se logo existe
if (-not (Test-Path $logoPath)) {
    Write-Host "ERRO: Logo nao encontrada em: $logoPath" -ForegroundColor Red
    exit 1
}

# Criar diretorio build se nao existir
if (-not (Test-Path "build")) {
    New-Item -ItemType Directory -Path "build" | Out-Null
    Write-Host "OK: Diretorio 'build' criado" -ForegroundColor Green
}

try {
    # Carregar assemblies necessarios
    Add-Type -AssemblyName System.Drawing
    
    Write-Host "Carregando logo..." -ForegroundColor Yellow
    
    # Carregar imagem original
    $originalImage = [System.Drawing.Image]::FromFile((Resolve-Path $logoPath))
    
    # Criar bitmap 256x256
    $bitmap = New-Object System.Drawing.Bitmap(256, 256)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    
    # Configurar qualidade alta
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    
    # Desenhar imagem redimensionada
    $graphics.DrawImage($originalImage, 0, 0, 256, 256)
    
    Write-Host "Salvando icone..." -ForegroundColor Yellow
    
    # Salvar como PNG temporario (ICO direto nao funciona bem no .NET)
    $tempPngPath = "build/temp_icon.png"
    $bitmap.Save($tempPngPath, [System.Drawing.Imaging.ImageFormat]::Png)
    
    # Limpar recursos
    $graphics.Dispose()
    $bitmap.Dispose()
    $originalImage.Dispose()
    
    # Copiar PNG como ICO (Windows aceita PNG renomeado como ICO)
    Copy-Item $tempPngPath $iconPath -Force
    Copy-Item $tempPngPath $installerIconPath -Force
    
    # Remover temporario
    Remove-Item $tempPngPath -Force
    
    Write-Host ""
    Write-Host "SUCESSO: Icones gerados com sucesso!" -ForegroundColor Green
    Write-Host "   - $iconPath" -ForegroundColor White
    Write-Host "   - $installerIconPath" -ForegroundColor White
    Write-Host ""
    
} catch {
    Write-Host ""
    Write-Host "ATENCAO: Metodo .NET falhou. Tentando metodo alternativo..." -ForegroundColor Yellow
    Write-Host ""
    
    # Metodo alternativo: copiar JPG renomeado (funciona para Electron)
    Copy-Item $logoPath $iconPath -Force
    Copy-Item $logoPath $installerIconPath -Force
    
    Write-Host "SUCESSO: Icones criados (usando JPG)!" -ForegroundColor Green
    Write-Host "   Nota: Para melhor qualidade, converta manualmente para ICO" -ForegroundColor Gray
    Write-Host "   em: https://convertio.co/jpg-ico/" -ForegroundColor Gray
    Write-Host ""
}

Write-Host "Processo concluido!" -ForegroundColor Cyan
