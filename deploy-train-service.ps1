
Write-Host "🚂 Deploying Train Service to Azure via VS Code" -ForegroundColor Cyan

# Check Azure CLI
if (-not (Get-Command az -ErrorAction SilentlyContinue)) {
    Write-Host "Installing Azure CLI..." -ForegroundColor Yellow
    winget install Microsoft.AzureCLI
    exit
}

# Login to Azure
try {
    az account show | Out-Null
    Write-Host "✅ Already logged into Azure" -ForegroundColor Green
} catch {
    Write-Host "Logging into Azure..." -ForegroundColor Yellow
    az login
}

# Create Azure Database
Write-Host "🗄️ Setting up Azure PostgreSQL..." -ForegroundColor Green
$resourceGroup = "railway-rg"
$serverName = "railway-postgres-server"

$serverExists = az postgres flexible-server show --name $serverName --resource-group $resourceGroup 2>$null
if (-not $serverExists) {
    Write-Host "Creating PostgreSQL server..." -ForegroundColor Yellow
    az postgres flexible-server create `
        --resource-group $resourceGroup `
        --name $serverName `
        --admin-user postgres `
        --admin-password "Railway123!" `
        --sku-name Standard_B1ms `
        --version 13 `
        --public-access 0.0.0.0 `
        --location "East US"
    
    az postgres flexible-server db create `
        --resource-group $resourceGroup `
        --server-name $serverName `
        --database-name traindb
    
    Write-Host "✅ Database created!" -ForegroundColor Green
} else {
    Write-Host "✅ Database already exists" -ForegroundColor Green
}

# Build the service
Write-Host "🔨 Building train-service..." -ForegroundColor Green
Push-Location "Microservices\train-service"

mvn clean package -DskipTests

if ($LASTEXITCODE -eq 0) {
    $jarFile = Get-ChildItem "target\*.jar" -Exclude "*-sources.jar" | Select-Object -First 1
    
    Write-Host "✅ Build successful!" -ForegroundColor Green
    Write-Host "📦 JAR: $($jarFile.Name)" -ForegroundColor White
    
    # Open VS Code
    code "target"
    
    Write-Host "`n🎯 VS Code Deployment Steps:" -ForegroundColor Cyan
    Write-Host "1. Right-click on: $($jarFile.Name)" -ForegroundColor Yellow
    Write-Host "2. Select: 'Deploy to Web App...'" -ForegroundColor Yellow
    Write-Host "3. Create new: 'railway-train-service'" -ForegroundColor Yellow
    Write-Host "4. Runtime: 'Java 21'" -ForegroundColor Yellow
    
    Write-Host "`n⚙️ After deployment, add environment variable:" -ForegroundColor Cyan
    Write-Host "SPRING_PROFILES_ACTIVE = azure" -ForegroundColor White
}

Pop-Location