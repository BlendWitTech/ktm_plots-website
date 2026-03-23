param (
    [string]$Mode = "PROMPT"
)

Write-Host "`n--- KTM Plots CMS Setup ---" -ForegroundColor Blue

if ($Mode -eq "PROMPT") {
    $choice = Read-Host "Select Setup Mode: [1] Manual (Local DB), [2] Docker (Containerized DB)"
} else {
    $choice = $Mode
}

# 1. Root dependencies
Write-Host "`n[1/5] Installing root dependencies..." -ForegroundColor Gray
npm install

# 2. Environment Setup
Write-Host "[2/5] Setting up environment files..." -ForegroundColor Gray
if (-not (Test-Path "backend/.env")) {
    if ($choice -eq "2") {
        # Docker mode: use credentials that match docker-compose defaults
        @"
NODE_ENV=development
PORT=3001

DATABASE_URL=postgresql://admin:password123@localhost:5432/ktm-plots

JWT_SECRET=dev-jwt-secret-change-in-production

CORS_ORIGINS=http://localhost:3000,http://localhost:3002

THEMES_DIR=../themes
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760

ENABLED_MODULES=
SETUP_COMPLETE=false
"@ | Out-File -FilePath "backend/.env" -Encoding utf8
        Write-Host "Created backend/.env for Docker mode." -ForegroundColor Green
    } elseif (Test-Path "backend/.env.development.example") {
        Copy-Item "backend/.env.development.example" "backend/.env"
        Write-Host "Created backend/.env from development example." -ForegroundColor Green
    } else {
        @"
NODE_ENV=development
DATABASE_URL=postgresql://admin:password123@localhost:5432/ktm-plots
JWT_SECRET=dev-jwt-secret-change-in-production
PORT=3001
CORS_ORIGINS=http://localhost:3000,http://localhost:3002
ENABLED_MODULES=
SETUP_COMPLETE=false
"@ | Out-File -FilePath "backend/.env" -Encoding utf8
        Write-Host "Generated default backend/.env." -ForegroundColor Yellow
    }
}
if (-not (Test-Path "frontend/.env.local")) {
    if (Test-Path "frontend/.env.development.example") {
        Copy-Item "frontend/.env.development.example" "frontend/.env.local"
        Write-Host "Created frontend/.env.local from development example." -ForegroundColor Green
    } else {
        "NEXT_PUBLIC_API_URL=http://localhost:3001" | Out-File -FilePath "frontend/.env.local" -Encoding utf8
        Write-Host "Created frontend/.env.local with default API URL." -ForegroundColor Green
    }
}

# 3. Database Infrastructure
if ($choice -eq "2") {
    Write-Host "[3/5] Starting Docker containers..." -ForegroundColor Gray
    docker compose up -d db pgadmin
    Write-Host "Waiting for database to be ready..." -ForegroundColor Gray

    $max_retries = 60
    $retry_count = 0
    $db_ready = $false

    while (-not $db_ready -and $retry_count -lt $max_retries) {
        try {
            $tcp = New-Object System.Net.Sockets.TcpClient
            $connect = $tcp.BeginConnect("127.0.0.1", 5432, $null, $null)
            $wait = $connect.AsyncWaitHandle.WaitOne(1000, $false)
            if ($wait) {
                $tcp.EndConnect($connect)
                $db_ready = $true
                Write-Host "`nDatabase is ready!" -ForegroundColor Green
            } else {
                Write-Host "." -NoNewline -ForegroundColor Gray
                $retry_count++
                Start-Sleep -s 1
            }
            $tcp.Close()
        } catch {
            Write-Host "." -NoNewline -ForegroundColor Gray
            $retry_count++
            Start-Sleep -s 1
        }
    }

    if (-not $db_ready) {
        Write-Host "`nWarning: Database did not respond within 60 seconds. Setup may fail during seeding." -ForegroundColor Yellow
    }
} else {
    Write-Host "[3/5] Skipping Docker. (Manual setup selected)" -ForegroundColor Gray
}

# 4. Database Initialization
Write-Host "[4/5] Initializing database..." -ForegroundColor Gray
node scripts/build-schema.js all
Set-Location backend
npx prisma generate
npx prisma migrate dev --name initial --skip-seed
npm run seed
Set-Location ..

# 5. Build
Write-Host "[5/5] Finalizing setup..." -ForegroundColor Gray
npm run build

Write-Host "`nSetup Complete! Run 'npm run dev' to start the application." -ForegroundColor Green
Write-Host "`nOpen http://localhost:3000 to complete the setup wizard." -ForegroundColor Green
Write-Host "The setup wizard will let you create your superadmin account and configure modules." -ForegroundColor Cyan
