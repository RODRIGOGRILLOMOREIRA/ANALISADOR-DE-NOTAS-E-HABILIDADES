# Script para gerar icone .ico valido a partir da imagem

[void][System.Reflection.Assembly]::LoadWithPartialName("System.Drawing")

$inputPath = "docs\LOGO ESCOLA.jpg"
$outputPath = "build\icon.ico"

try {
    # Criar diretorio build se nao existir
    if (!(Test-Path "build")) {
        New-Item -ItemType Directory -Path "build" | Out-Null
    }

    # Carregar imagem original
    $img = [System.Drawing.Image]::FromFile((Resolve-Path $inputPath))
    
    # Criar bitmap 256x256
    $bitmap = New-Object System.Drawing.Bitmap 256, 256
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.DrawImage($img, 0, 0, 256, 256)
    
    # Salvar como PNG primeiro
    $pngPath = "build\icon.png"
    $bitmap.Save($pngPath, [System.Drawing.Imaging.ImageFormat]::Png)
    
    # Agora usar magick ou converter manualmente
    # Como nao temos ImageMagick, vamos usar um método alternativo
    # Salvar múltiplos tamanhos e criar ICO
    
    $sizes = @(256, 128, 64, 48, 32, 16)
    $encoder = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/png' }
    
    # Para Windows, vamos criar um arquivo ICO multi-resolução
    # Usando MemoryStream para criar o formato ICO
    
    $memStream = New-Object System.IO.MemoryStream
    $writer = New-Object System.IO.BinaryWriter($memStream)
    
    # ICO Header
    $writer.Write([UInt16]0)  # Reserved (must be 0)
    $writer.Write([UInt16]1)  # Image type (1 = ICO)
    $writer.Write([UInt16]$sizes.Count)  # Number of images
    
    $imageDataList = @()
    $offset = 6 + ($sizes.Count * 16)  # Header + directory entries
    
    foreach ($size in $sizes) {
        # Criar bitmap redimensionado
        $resizedBitmap = New-Object System.Drawing.Bitmap $size, $size
        $g = [System.Drawing.Graphics]::FromImage($resizedBitmap)
        $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $g.DrawImage($bitmap, 0, 0, $size, $size)
        
        # Converter para PNG em memória
        $pngStream = New-Object System.IO.MemoryStream
        $resizedBitmap.Save($pngStream, [System.Drawing.Imaging.ImageFormat]::Png)
        $pngData = $pngStream.ToArray()
        $imageDataList += $pngData
        
        # Escrever entrada do diretório ICO
        $writer.Write([Byte]$size)  # Width
        $writer.Write([Byte]$size)  # Height
        $writer.Write([Byte]0)      # Color palette
        $writer.Write([Byte]0)      # Reserved
        $writer.Write([UInt16]1)    # Color planes
        $writer.Write([UInt16]32)   # Bits per pixel
        $writer.Write([UInt32]$pngData.Length)  # Size of image data
        $writer.Write([UInt32]$offset)          # Offset to image data
        
        $offset += $pngData.Length
        
        $g.Dispose()
        $resizedBitmap.Dispose()
        $pngStream.Dispose()
    }
    
    # Escrever dados das imagens
    foreach ($imageData in $imageDataList) {
        $writer.Write($imageData)
    }
    
    # Salvar arquivo ICO
    $icoBytes = $memStream.ToArray()
    [System.IO.File]::WriteAllBytes((Resolve-Path "build").Path + "\icon.ico", $icoBytes)
    
    # Copiar para installerIcon.ico
    Copy-Item "build\icon.ico" "build\installerIcon.ico" -Force
    
    $writer.Close()
    $memStream.Close()
    $graphics.Dispose()
    $bitmap.Dispose()
    $img.Dispose()
    
    Write-Host "Icone .ico valido criado com sucesso!" -ForegroundColor Green
    Write-Host "Tamanho do arquivo: $([Math]::Round((Get-Item 'build\icon.ico').Length / 1KB, 2)) KB"
    
} catch {
    Write-Host "Erro ao gerar icone: $_" -ForegroundColor Red
    Write-Host "Tentando método simplificado..." -ForegroundColor Yellow
    
    # Método alternativo: copiar um ICO válido do sistema ou usar PNG
    Copy-Item $inputPath "build\icon.png" -Force
    Write-Host "PNG copiado. Vamos tentar build sem ICO customizado." -ForegroundColor Yellow
}
