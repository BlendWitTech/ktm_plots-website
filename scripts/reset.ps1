Write-Host "`n!!! WARNING: This will delete node_modules, .env files, build artifacts, and reset the database !!!" -ForegroundColor Red
$confirm = Read-Host "Are you sure you want to proceed? (y/N)"

if ($confirm -ne "y") {
    Write-Host "Reset aborted."
    exit
}

Write-Host "`n[1/5] Cleaning root..." -ForegroundColor Gray
Remove-Item -Path "node_modules", "package-lock.json" -Recurse -Force -ErrorAction SilentlyContinue

Write-Host "[2/5] Cleaning backend..." -ForegroundColor Gray
Remove-Item -Path "backend/node_modules", "backend/dist", "backend/.env", "backend/prisma/migrations" -Recurse -Force -ErrorAction SilentlyContinue

Write-Host "[3/5] Cleaning frontend..." -ForegroundColor Gray
Remove-Item -Path "frontend/node_modules", "frontend/.next", "frontend/.env", "frontend/.env.local" -Recurse -Force -ErrorAction SilentlyContinue

Write-Host "[4/5] Cleaning theme build caches..." -ForegroundColor Gray
Get-ChildItem -Path "themes" -Filter ".next" -Recurse -Directory -Force -ErrorAction SilentlyContinue | ForEach-Object {
    Remove-Item -Path $_.FullName -Recurse -Force -ErrorAction SilentlyContinue
}
Get-ChildItem -Path "themes" -Filter "node_modules" -Recurse -Directory -Force -ErrorAction SilentlyContinue | ForEach-Object {
    Remove-Item -Path $_.FullName -Recurse -Force -ErrorAction SilentlyContinue
}

Write-Host "[5/5] Resetting database infrastructure..." -ForegroundColor Gray
docker compose down -v --remove-orphans 2>$null

Write-Host "`nProject reset complete." -ForegroundColor Green
Write-Host "To start fresh, run: npm run setup" -ForegroundColor Yellow
