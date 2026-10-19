@echo off
chcp 65001 > nul
title INTYLACT® | Link Directo para Celular y Computadora
echo ================================================================================
echo       INTYLACT® - CUIDADO ÍNTIMO #1 DE VENEZUELA
echo       Generador de Link Directo para Teléfonos (Android / Apple iPhone)
echo ================================================================================
echo.
echo [1/2] Iniciando servidor y generando link seguro para tu celular...
echo [2/2] Compatible con Android, iPhone, iPad, iMac, tablets y computadores.
echo.
echo No requiere instalar programas adicionales.
echo.
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0servidor_movil.ps1"
pause
