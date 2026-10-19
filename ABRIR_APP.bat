@echo off
chcp 65001 > nul
title INTYLACT® | Plataforma de Eventos y Acceso Móvil
echo ================================================================================
echo       INTYLACT® - CUIDADO ÍNTIMO #1 DE VENEZUELA
echo       Plataforma de Gestión de Eventos (PC, Android, Apple iPhone/iPad)
echo ================================================================================
echo.
echo Iniciando la aplicación y generando tu link de acceso directo...
echo Compatible con cualquier teléfono, tablet o computador sin instalar nada.
echo.
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0servidor_movil.ps1"
pause
