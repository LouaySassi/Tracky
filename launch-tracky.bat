@echo off
title Tracky Server
color 0A

cd /d "%~dp0"

echo.
echo ============================================
echo    TRACKY - Finance Tracker
echo ============================================
echo.
echo Starting server...
echo.

node server/index.js

echo.
echo Server stopped.
pause