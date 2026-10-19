@echo off
chcp 65001 > nul
title INTYLACT® | Conectar Celular por Link (Android y Apple iOS)
echo ================================================================================
echo       INTYLACT® - CUIDADO ÍNTIMO #1 DE VENEZUELA
echo       Acceso por Link Directo para Celulares Android y Apple iOS
echo ================================================================================
echo.
echo Generando link de acceso directo para tu teléfono celular...
echo Sin necesidad de escanear códigos QR y compatible con cualquier dispositivo.
echo.
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0servidor_movil.ps1"
pause
