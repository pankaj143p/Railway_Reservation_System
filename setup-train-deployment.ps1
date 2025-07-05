# Fixed setup script for train-service deployment

Write-Host "🚂 Setting up Train Service for Azure Deployment" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor White

# 1. Create Azure properties file
Write-Host "📁 Creating Azure configuration file..." -ForegroundColor Yellow

$azurePropsPath = "Microservices\train-service\src\main\resources\application-azure.properties"
$azurePropsContent = @"
spring.application.name=train-service

# Azure PostgreSQL Database Configuration
spring.datasource.url=jdbc:postgresql://railway-postgres-server.postgres.database.azure.com:5432/traindb?sslmode=require
spring.datasource.username=postgres
spring.datasource.password=Railway123!
spring.datasource.driver-class-name=org.postgresql.Driver

# Azure Server Configuration
server.port=8080

# JPA Configuration for Azure
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect

# Eureka Server Configuration for Azure
eureka.client.service-url.defaultZone=https://railway-eureka-server.azurewebsites.net/eureka
eureka.instance.hostname=railway-train-service.azurewebsites.net
eureka.instance.prefer-ip-address=false
eureka.instance.non-secure-port=80
eureka.instance.secure-port=443
eureka.instance.secure-port-enabled=true

# Azure logging
logging.level.com.microservice=INFO
"@

# Create the Azure properties file
if (Test-Path (Split-Path $azurePropsPath)) {
    New-Item -Path $azurePropsPath -ItemType File -Value $azurePropsContent -Force
    Write-Host "✅ Created: $azurePropsPath" -ForegroundColor Green
} else {
    Write-Host "❌ Path not found: Microservices\train-service\src\main\resources\" -ForegroundColor Red
    Write-Host "Make sure you're in the project root directory" -ForegroundColor Yellow
    exit
}

# 2. Install VS Code Extensions
Write-Host "`n🔧 Installing VS Code Extensions..." -ForegroundColor Yellow

$extensions = @(
    "ms-azuretools.vscode-azureappservice",
    "ms-vscode.azure-account",
    "ms-azuretools.vscode-azureresourcegroups"
)

foreach ($ext in $extensions) {
    Write-Host "Installing $ext..." -ForegroundColor Gray
    code --install-extension $ext
}
Write-Host "✅ VS Code Extensions installed!" -ForegroundColor Green

# 3. Check Azure CLI
Write-Host "`n⚙️ Checking Azure CLI..." -ForegroundColor Yellow
if (-not (Get-Command az -ErrorAction SilentlyContinue)) {
    Write-Host "Installing Azure CLI..." -ForegroundColor Yellow
    winget install Microsoft.AzureCLI
    Write-Host "⚠️ Please restart terminal after Azure CLI installation" -ForegroundColor Red
    Write-Host "Then run: .\deploy-train-service.ps1" -ForegroundColor Yellow
    exit
} else {
    Write-Host "✅ Azure CLI is installed" -ForegroundColor Green
}

# 4. Create deployment script
Write-Host "`n📝 Creating deployment script..." -ForegroundColor Yellow

$deployScriptContent = @'
# Train Service Deployment Script
Write-Host "🚂 Deploying Train Service to Azure" -ForegroundColor Cyan

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
Write-Host "`n🔨 Building train-service..." -ForegroundColor Green
Push-Location "Microservices\train-service"

mvn clean package -DskipTests

if ($LASTEXITCODE -eq 0) {
    $jarFile = Get-ChildItem "target\*.jar" -Exclude "*-sources.jar", "*-javadoc.jar" | Select-Object -First 1
    
    Write-Host "✅ Build successful!" -ForegroundColor Green
    Write-Host "📦 JAR: $($jarFile.Name)" -ForegroundColor White
    
    # Open VS Code to target folder
    Write-Host "`n🚀 Opening VS Code..." -ForegroundColor Green
    code "target"
    
    Write-Host "`n🎯 VS Code Deployment Steps:" -ForegroundColor Cyan
    Write-Host "1. In VS Code Explorer, right-click on: $($jarFile.Name)" -ForegroundColor Yellow
    Write-Host "2. Select: 'Deploy to Web App...'" -ForegroundColor Yellow
    Write-Host "3. Choose your Azure subscription" -ForegroundColor Yellow
    Write-Host "4. Resource Group: Use existing 'railway-rg'" -ForegroundColor Yellow
    Write-Host "5. Web App: Create new 'railway-train-service'" -ForegroundColor Yellow
    Write-Host "6. Runtime: Select 'Java 21'" -ForegroundColor Yellow
    Write-Host "7. Pricing: Select 'Basic B1'" -ForegroundColor Yellow
    
    Write-Host "`n⚙️ After deployment, add this environment variable in Azure Portal:" -ForegroundColor Cyan
    Write-Host "SPRING_PROFILES_ACTIVE = azure" -ForegroundColor White
    
    Write-Host "`n🌐 Your app will be available at:" -ForegroundColor Cyan
    Write-Host "https://railway-train-service.azurewebsites.net" -ForegroundColor White
    
} else {
    Write-Host "❌ Build failed!" -ForegroundColor Red
}

Pop-Location
'@

New-Item -Path "deploy-train-service.ps1" -ItemType File -Value $deployScriptContent -Force
Write-Host "✅ Created: deploy-train-service.ps1" -ForegroundColor Green

# 5. Summary
Write-Host "`n🎉 Setup Complete!" -ForegroundColor Green
Write-Host "==================" -ForegroundColor White

Write-Host "`n📁 Files created:" -ForegroundColor Cyan
Write-Host "• application-azure.properties (Azure configuration)" -ForegroundColor White
Write-Host "• deploy-train-service.ps1 (Deployment script)" -ForegroundColor White

Write-Host "`n🚀 Next steps:" -ForegroundColor Cyan
Write-Host "1. Run: .\deploy-train-service.ps1" -ForegroundColor Yellow
Write-Host "2. Follow VS Code deployment prompts" -ForegroundColor Yellow
Write-Host "3. Add environment variable: SPRING_PROFILES_ACTIVE = azure" -ForegroundColor Yellow

Write-Host "`n✨ Ready to deploy!" -ForegroundColor Green