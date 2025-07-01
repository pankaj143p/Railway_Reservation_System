@echo off
echo Starting Kafka and Zookeeper...
echo.
echo This will start:
echo - Zookeeper on port 2181
echo - Kafka on port 9092
echo - Kafka UI on port 8080 (http://localhost:8080)
echo.

docker-compose up -d

echo.
echo Waiting for services to start...
timeout /t 10 /nobreak > nul

echo.
echo Checking if services are running...
docker-compose ps

echo.
echo Services started! You can access:
echo - Kafka UI: http://localhost:8080
echo - Kafka broker: localhost:9092
echo.
echo To stop the services, run: docker-compose down
echo To view logs, run: docker-compose logs -f
echo.
pause
