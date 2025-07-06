# deploy-all-services.ps1
Write-Host "🚀 Railway Reservation System - Azure Deployment" -ForegroundColor Green

# Build all services
$services = @(
    "eureka-server",
    "api-gateway", 
    "Microservices/user-service",
    "Microservices/train-service",
    "Microservices/ticket-service",
    "Microservices/payment-service"
)

foreach ($service in $services) {
    Write-Host "`n🔨 Building $service..." -ForegroundColor Yellow
    Push-Location $service
    mvn clean package -DskipTests
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ $service built successfully" -ForegroundColor Green
    } else {
        Write-Host "❌ $service build failed" -ForegroundColor Red
    }
    Pop-Location
}

Write-Host "`n🎯 Ready for deployment! Follow the manual steps below:" -ForegroundColor Cyan