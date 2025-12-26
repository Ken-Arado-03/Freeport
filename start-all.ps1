#!/usr/bin/env pwsh

Write-Host "=== Freeport Full Stack Start ===" -ForegroundColor Green
Write-Host ""
Write-Host "Starting Laravel Backend Server..." -ForegroundColor Cyan
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd c:\xampp\htdocs\laravel-sanctum-api; php artisan serve"

Start-Sleep -Seconds 3

Write-Host "Starting React Frontend Server..." -ForegroundColor Cyan
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd c:\xampp\htdocs\laravel-sanctum-api\FFrontend; npm run dev"

Write-Host ""
Write-Host "✅ Servers Starting!" -ForegroundColor Green
Write-Host "Backend API: http://localhost:8000" -ForegroundColor Yellow
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Yellow
Write-Host ""
