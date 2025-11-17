@echo off
setlocal enabledelayedexpansion

echo.
echo ================================================
echo   Creating Tracky Desktop Shortcut
echo ================================================
echo.

:: Get current directory
set "PROJECT_DIR=%~dp0"
set "PROJECT_DIR=%PROJECT_DIR:~0,-1%"

:: Get desktop path - fixed version
set "DESKTOP=%USERPROFILE%\Desktop"

echo Project Directory: %PROJECT_DIR%
echo Desktop Directory: %DESKTOP%
echo.

:: Create batch launcher
(
echo @echo off
echo title Tracky Server
echo color 0A
echo.
echo ============================================
echo   TRACKY - Finance Tracker
echo ============================================
echo.
echo Starting server...
echo.
echo cd /d "%PROJECT_DIR%"
echo node server/index.js
echo.
echo pause
) > "%PROJECT_DIR%\launch-tracky.bat"

echo Created: launch-tracky.bat
echo.

:: Create VBScript to make shortcut
(
echo Set oWS = WScript.CreateObject^("WScript.Shell"^)
echo sLinkFile = "%DESKTOP%\Tracky.lnk"
echo Set oLink = oWS.CreateShortcut^(sLinkFile^)
echo oLink.TargetPath = "%PROJECT_DIR%\launch-tracky.bat"
echo oLink.WorkingDirectory = "%PROJECT_DIR%"
echo oLink.IconLocation = "%PROJECT_DIR%\public\icon.ico"
echo oLink.Description = "Tracky - Finance Tracker"
echo oLink.Save
) > "%TEMP%\CreateTrackyShortcut.vbs"

echo Creating shortcut...
cscript //nologo "%TEMP%\CreateTrackyShortcut.vbs"

if %errorlevel% equ 0 (
    echo.
    echo ================================================
    echo   SUCCESS!
    echo ================================================
    echo.
    echo Desktop shortcut created: %DESKTOP%\Tracky.lnk
    echo Launch file created: %PROJECT_DIR%\launch-tracky.bat
    echo.
    echo Double-click "Tracky" on your Desktop to launch!
    echo.
) else (
    echo.
    echo ================================================
    echo   ERROR
    echo ================================================
    echo.
    echo Could not create shortcut automatically.
    echo Please create manually or check permissions.
    echo.
)

:: Cleanup
del "%TEMP%\CreateTrackyShortcut.vbs" 2>nul

pause