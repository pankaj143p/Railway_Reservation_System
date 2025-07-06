# Train Service Deployment Script - Fixed Version

Write-Host "🚂 Deploying Train Service to Azure" -ForegroundColor Cyan

# Check Azure CLI
if (-not (Get-Command az -ErrorAction SilentlyContinue)) {
    Write-Host "Installing Azure CLI..." -ForegroundColor Yellow
    winget install Microsoft.AzureCLI
    Write-Host "Please restart terminal after installation" -ForegroundColor Red
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

# Create Azure resources
Write-Host "🗄️ Setting up Azure PostgreSQL..." -ForegroundColor Green
$resourceGroup = "railway-rg"
$serverName = "railway-postgres-server"

# Check if resource group exists
$rgExists = az group show --name $resourceGroup 2>$null
if (-not $rgExists) {
    Write-Host "Creating resource group..." -ForegroundColor Yellow
    az group create --name $resourceGroup --location "East US"
}

# Check if PostgreSQL server exists
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
Write-Host ""
Write-Host "🔨 Building train-service..." -ForegroundColor Green
Push-Location "Microservices\train-service"

mvn clean package -DskipTests

if ($LASTEXITCODE -eq 0) {
    $jarFiles = Get-ChildItem "target\*.jar" -Exclude "*-sources.jar", "*-javadoc.jar"
    $jarFile = $jarFiles | Select-Object -First 1
    
    Write-Host "✅ Build successful!" -ForegroundColor Green
    Write-Host "📦 JAR: $($jarFile.Name)" -ForegroundColor White
    
    # Open VS Code to target folder
    Write-Host ""
    Write-Host "🚀 Opening VS Code..." -ForegroundColor Green
    code "target"
    
    Write-Host ""
    Write-Host "🎯 VS Code Deployment Steps:" -ForegroundColor Cyan
    Write-Host "1. In VS Code Explorer, right-click on: $($jarFile.Name)" -ForegroundColor Yellow
    Write-Host "2. Select: Deploy to Web App..." -ForegroundColor Yellow
    Write-Host "3. Choose your Azure subscription" -ForegroundColor Yellow
    Write-Host "4. Resource Group: Use existing railway-rg" -ForegroundColor Yellow
    Write-Host "5. Web App: Create new railway-train-service" -ForegroundColor Yellow
    Write-Host "6. Runtime: Select Java 21" -ForegroundColor Yellow
    Write-Host "7. Pricing: Select Basic B1" -ForegroundColor Yellow
    
    Write-Host ""
    Write-Host "⚙️ After deployment, add this environment variable in Azure Portal:" -ForegroundColor Cyan
    Write-Host "SPRING_PROFILES_ACTIVE = azure" -ForegroundColor White
    
    Write-Host ""
    Write-Host "🌐 Your app will be available at:" -ForegroundColor Cyan
    Write-Host "https://railway-train-service.azurewebsites.net" -ForegroundColor White
    
} else {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    Write-Host "Check the Maven output above for errors" -ForegroundColor Yellow
}

Pop-Location

Write-Host ""
Write-Host "✨ Deployment preparation complete!" -ForegroundColor Green