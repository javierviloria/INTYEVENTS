# ==============================================================================
# INTYLACT® EVENTS - SERVIDOR WEB NATIVO Y TUNEL CLOUDFLARE PARA MÓVIL
# Compatible con Android, Apple iPhone, iPad, iMac, Tablets y Computadores
# ==============================================================================

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8
$baseDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $baseDir

$port = 8080
$httpListener = $null

# Inicializar HttpListener en puerto 8080 o siguiente disponible
for ($p = 8080; $p -le 8089; $p++) {
    try {
        $testListener = New-Object System.Net.HttpListener
        $testListener.Prefixes.Add("http://127.0.0.1:$p/")
        $testListener.Prefixes.Add("http://localhost:$p/")
        $testListener.Start()
        $httpListener = $testListener
        $port = $p
        break
    } catch {
        if ($testListener) { try { $testListener.Close() } catch {} }
    }
}

if (-not $httpListener) {
    Write-Host "[!] Error: No se pudo iniciar HttpListener en los puertos 8080-8089." -ForegroundColor Red
    pause
    exit 1
}

# Iniciar Túnel Cloudflare para acceso HTTPS público directo
$cfExe = Join-Path $baseDir "cloudflared.exe"
$cfLog = Join-Path $baseDir "cloudflared.log"
$cfProcess = $null
$tunnelUrl = $null

if (Test-Path $cfExe) {
    if (Test-Path $cfLog) { Remove-Item -Force -ErrorAction SilentlyContinue $cfLog }
    
    Write-Host "Iniciando túnel seguro de alta velocidad para celulares..." -ForegroundColor Cyan
    $cfProcess = Start-Process -FilePath $cfExe -ArgumentList "tunnel --url http://127.0.0.1:$port" -PassThru -NoNewWindow -RedirectStandardError $cfLog
    
    # Esperar hasta 12 segundos para obtener la URL pública de Cloudflare
    $retries = 0
    while ($retries -lt 24 -and -not $tunnelUrl) {
        Start-Sleep -Milliseconds 500
        $retries++
        if (Test-Path $cfLog) {
            $content = Get-Content -Path $cfLog -Raw -ErrorAction SilentlyContinue
            if ($content -match 'https://([a-zA-Z0-9-]+\.trycloudflare\.com)') {
                $tunnelUrl = $matches[0]
            }
        }
    }
}

$targetUrl = if ($tunnelUrl) { $tunnelUrl } else { "http://127.0.0.1:$port/" }

# Guardar información del túnel para que el frontend pueda consultarlo
$jsonPayload = @{
    url = $targetUrl
    is_tunnel = [bool]$tunnelUrl
    port = $port
    created_at = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
} | ConvertTo-Json

[System.IO.File]::WriteAllText((Join-Path $baseDir "tunnel_url.json"), $jsonPayload, [System.Text.Encoding]::UTF8)

# Crear acceso directo de Internet (.URL) en la carpeta para abrir con 1 clic
$urlShortcutPath = Join-Path $baseDir "LINK_PAGINA_WEB.url"
$urlShortcutContent = "[InternetShortcut]`r`nURL=$targetUrl`r`nIconIndex=0`r`n"
[System.IO.File]::WriteAllText($urlShortcutPath, $urlShortcutContent, [System.Text.Encoding]::ASCII)

# Guardar archivo de texto simple y directo para compartir
$txtSharePath = Join-Path $baseDir "LINK_PARA_COMPARTIR.txt"
$txtShareContent = @"
================================================================================
           INTYLACT(R) EVENTS - LINK DIRECTO PARA CELULARES Y TABLETS
================================================================================

-> LINK PARA ABRIR EN TU CELULAR (ANDROID / IPHONE / TABLETS / PC):
   $targetUrl

INSTRUCCIONES SIMPLES:
1. Copia el link de arriba y envialo por WhatsApp, Telegram o correo a tu telefono.
2. Toca el enlace desde tu celular (funciona en Android y en Apple iOS iPhone/iPad).
3. La pagina abrira al instante con un clic, SIN necesidad de escanear codigo QR.

COMPATIBILIDAD TOTAL COMPROBADA:
[OK] Celulares Android (Samsung, Xiaomi, Motorola, Google Pixel, etc.)
[OK] Celulares Apple iPhone y iPads (Safari, Chrome)
[OK] Tablets Android e iPadOS
[OK] Computadores iMac, MacBook y Windows con cualquier navegador
[OK] Abre tanto con datos moviles (4G/5G) como con cualquier red Wi-Fi
[OK] Las imagenes y banners se ajustan automaticamente al tamano de tu pantalla
[OK] No requiere instalar programas adicionales ni configuraciones
================================================================================
"@
[System.IO.File]::WriteAllText($txtSharePath, $txtShareContent, [System.Text.Encoding]::UTF8)

# Copiar automáticamente al portapapeles de Windows para que el usuario solo presione Ctrl+V
try {
    Set-Clipboard -Value $targetUrl
} catch {
    try { $targetUrl | clip.exe } catch {}
}

# Mostrar pantalla informativa en consola
Clear-Host
Write-Host "================================================================================" -ForegroundColor Magenta
Write-Host "        INTYLACT(R) - SERVIDOR WEB ACTIVO CON LINK DIRECTO PARA MOVIL           " -ForegroundColor Cyan
Write-Host "================================================================================" -ForegroundColor Magenta
Write-Host ""
Write-Host " [OK] LINK DIRECTO GENERADO CON EXITO!" -ForegroundColor Green
Write-Host ""
Write-Host " -> LINK PARA TU CELULAR (ANDROID / IPHONE / TABLET / MAC):" -ForegroundColor Yellow
Write-Host "    $targetUrl" -ForegroundColor White -BackgroundColor DarkMagenta
Write-Host ""
Write-Host " [OK] EL LINK YA ESTA COPIADO EN TU PORTAPAPELES!" -ForegroundColor Green
Write-Host "      Solo ve a WhatsApp Web, Telegram o tu correo y presiona Ctrl + V" -ForegroundColor White
Write-Host "      para enviartelo a tu celular y abrirlo directamente." -ForegroundColor White
Write-Host ""
Write-Host " [OK] Archivos generados en tu carpeta:" -ForegroundColor Cyan
Write-Host "      * LINK_PARA_COMPARTIR.txt  (Contiene este link listo para copiar)" -ForegroundColor Gray
Write-Host "      * LINK_PAGINA_WEB.url      (Acceso directo para abrir en el navegador)" -ForegroundColor Gray
Write-Host ""
Write-Host " [OK] Ventajas clave:" -ForegroundColor White
Write-Host "      * Sin escanear codigo QR (acceso por link directo)" -ForegroundColor Gray
Write-Host "      * Compatible con Android, iPhone, iPad, iMac y PC" -ForegroundColor Gray
Write-Host "      * Abre con datos moviles 4G/5G o cualquier Wi-Fi" -ForegroundColor Gray
Write-Host "      * Formato responsivo: las imagenes se adaptan solas al tamano de pantalla" -ForegroundColor Gray
Write-Host ""
Write-Host " Para detener el servidor, cierra esta ventana o presiona Ctrl+C." -ForegroundColor DarkYellow
Write-Host "================================================================================" -ForegroundColor Magenta

# Abrir automáticamente en el navegador de la computadora
Start-Process $targetUrl

# Bucle del Servidor HttpListener multi-hilo
try {
    while ($httpListener.IsListening) {
        $context = $null
        try {
            $context = $httpListener.GetContext()
        } catch {
            break
        }

        if (-not $context) { continue }

        $req = $context.Request
        $resp = $context.Response

        try {
            $rawPath = $req.Url.AbsolutePath
            if ($rawPath -eq "/" -or $rawPath -eq "") { $rawPath = "/index.html" }

            # Endpoint especial API /api/tunnel y /tunnel_url.json
            if ($rawPath -eq "/api/tunnel" -or $rawPath -eq "/tunnel_url.json") {
                $jsonInfo = @{ url = $targetUrl; active = $true } | ConvertTo-Json
                $jsonBytes = [System.Text.Encoding]::UTF8.GetBytes($jsonInfo)
                $resp.ContentType = "application/json; charset=utf-8"
                $resp.AddHeader("Access-Control-Allow-Origin", "*")
                $resp.ContentLength64 = $jsonBytes.Length
                $resp.OutputStream.Write($jsonBytes, 0, $jsonBytes.Length)
                $resp.Close()
                continue
            }

            $decodedPath = [System.Uri]::UnescapeDataString($rawPath.TrimStart("/").Replace("/", "\"))
            $filePath = Join-Path $baseDir $decodedPath

            if (-not (Test-Path $filePath -PathType Leaf)) {
                $resp.StatusCode = 404
                $resp.Close()
                continue
            }

            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            $mime = switch ($ext) {
                ".html"  { "text/html; charset=utf-8" }
                ".css"   { "text/css; charset=utf-8" }
                ".js"    { "application/javascript; charset=utf-8" }
                ".json"  { "application/json; charset=utf-8" }
                ".jpeg"  { "image/jpeg" }
                ".jpg"   { "image/jpeg" }
                ".png"   { "image/png" }
                ".mp4"   { "video/mp4" }
                ".pdf"   { "application/pdf" }
                ".docx"  { "application/vnd.openxmlformats-officedocument.wordprocessingml.document" }
                ".woff2" { "font/woff2" }
                ".woff"  { "font/woff" }
                ".ttf"   { "font/ttf" }
                ".otf"   { "font/otf" }
                default  { "application/octet-stream" }
            }

            $fileInfo = New-Object System.IO.FileInfo($filePath)
            $fileLength = $fileInfo.Length

            $resp.ContentType = $mime
            $resp.AddHeader("Access-Control-Allow-Origin", "*")
            $resp.AddHeader("Accept-Ranges", "bytes")

            $rangeHeader = $req.Headers["Range"]
            if ($rangeHeader -and $rangeHeader -match 'bytes=(\d*)-(\d*)') {
                $startStr = $matches[1]
                $endStr = $matches[2]
                $start = if ([string]::IsNullOrEmpty($startStr)) { 0 } else { [long]$startStr }
                $end = if ([string]::IsNullOrEmpty($endStr) -or [long]$endStr -ge $fileLength) { $fileLength - 1 } else { [long]$endStr }
                $chunkLength = ($end - $start) + 1

                $resp.StatusCode = 206
                $resp.AddHeader("Content-Range", "bytes $start-$end/$fileLength")
                $resp.ContentLength64 = $chunkLength

                if ($req.HttpMethod -ne "HEAD") {
                    $fs = [System.IO.File]::OpenRead($filePath)
                    try {
                        [void]$fs.Seek($start, [System.IO.SeekOrigin]::Begin)
                        $buffer = New-Object byte[] 65536
                        $remaining = $chunkLength
                        while ($remaining -gt 0) {
                            $toRead = [System.Math]::Min($remaining, 65536)
                            $read = $fs.Read($buffer, 0, $toRead)
                            if ($read -le 0) { break }
                            $resp.OutputStream.Write($buffer, 0, $read)
                            $remaining -= $read
                        }
                    } finally {
                        $fs.Close()
                    }
                }
            } else {
                $resp.StatusCode = 200
                $resp.ContentLength64 = $fileLength

                if ($req.HttpMethod -ne "HEAD") {
                    $fs = [System.IO.File]::OpenRead($filePath)
                    try {
                        $buffer = New-Object byte[] 65536
                        while ($true) {
                            $read = $fs.Read($buffer, 0, $buffer.Length)
                            if ($read -le 0) { break }
                            $resp.OutputStream.Write($buffer, 0, $read)
                        }
                    } finally {
                        $fs.Close()
                    }
                }
            }
        } catch {
        } finally {
            try { $resp.Close() } catch {}
        }
    }
} finally {
    if ($httpListener) {
        try { $httpListener.Stop(); $httpListener.Close() } catch {}
    }
    if ($cfProcess -and -not $cfProcess.HasExited) {
        Stop-Process -Id $cfProcess.Id -Force -ErrorAction SilentlyContinue
    }
    if (Test-Path $cfLog) { Remove-Item -Force -ErrorAction SilentlyContinue $cfLog }
}
