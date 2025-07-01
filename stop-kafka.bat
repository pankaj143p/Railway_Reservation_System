@echo off
echo Stopping Kafka and Zookeeper...
docker-compose down

echo.
echo Removing volumes (optional - uncomment next line to remove data)
REM docker-compose down -v

echo.
echo Services stopped!
pause
