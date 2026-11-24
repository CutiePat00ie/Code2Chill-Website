@echo off
setlocal
start "Code2Chill Backend" cmd /k "cd /d ""%~dp0server"" && npm install && npm run dev"
start "Code2Chill Frontend" cmd /k "cd /d ""%~dp0client"" && npm install && npm run dev"
echo Started backend and frontend terminals. Open http://localhost:5173 after Vite starts.
