# 🚂 I Rail Gateway - Railway Reservation System

A comprehensive full-stack railway reservation system built with React, TypeScript, Spring Boot microservices, and modern web technologies. This system provides seamless train booking, real-time tracking, and integrated payment processing.

![Railway Reservation System](https://img.shields.io/badge/Project-Railway%20Reservation-blue)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-Latest-blue)
![Vite](https://img.shields.io/badge/Vite-Latest-purple)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-Microservices-green)

## 🌟 Features

### 🎫 **Booking & Reservations**
- **Smart Train Search**: Advanced search with date range, source/destination filtering
- **Real-time Seat Availability**: Live seat checking and booking
- **Multiple Passenger Booking**: Support for group bookings
- **Seat Preferences**: Window/aisle seat selection
- **Instant Confirmation**: Immediate booking confirmation with e-tickets

### 💳 **Payment Integration**
- **Razorpay Integration**: Secure payment processing
- **Multiple Payment Methods**: Cards, UPI, Net Banking, Wallets
- **Payment Tracking**: Real-time payment status updates
- **Refund Management**: Automated refund processing

### 📱 **User Experience**
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Dark/Light Theme**: User preference-based theming
- **Real-time Notifications**: Live updates via Kafka messaging
- **Progressive Web App**: Offline capability and mobile installation

### 🔐 **Security & Authentication**
- **JWT Authentication**: Secure user sessions
- **Role-based Access**: User, Admin, and Super Admin roles
- **Protected Routes**: Secure navigation based on authentication
- **Data Encryption**: Sensitive data protection

### 📊 **Admin Dashboard**
- **User Management**: CRUD operations for users
- **Train Management**: Add, update, delete train schedules
- **Booking Analytics**: Real-time booking statistics
- **Revenue Tracking**: Financial reporting and analytics

## 🛠️ Technology Stack

### **Frontend**
- **React 18.2.0** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API calls
- **React Query** - Server state management

### **Backend (Microservices)**
- **Spring Boot** - Java-based microservices framework
- **Spring Cloud Gateway** - API Gateway for routing
- **Eureka Server** - Service discovery
- **Spring Security** - Authentication and authorization
- **Spring Data JPA** - Database abstraction
- **PostgreSQL** - Primary database

### **Messaging & Communication**
- **Apache Kafka** - Event streaming and messaging
- **WebSocket** - Real-time communication
- **REST APIs** - HTTP-based service communication

### **DevOps & Tools**
- **Docker** - Containerization
- **Maven** - Java project management
- **ESLint** - Code linting
- **Prettier** - Code formatting

## 🏗️ System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React App     │    │   API Gateway   │    │  Eureka Server  │
│   (Frontend)    │◄──►│   (Port 6111)   │◄──►│   (Port 6010)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                ┌───────────────┼───────────────┐
                │               │               │
        ┌───────▼─────┐ ┌───────▼─────┐ ┌───────▼─────┐
        │ User Service│ │Train Service│ │Ticket Service│
        │ (Port 5000) │ │(Port 5200)  │ │(Port 5100)  │
        └─────────────┘ └─────────────┘ └─────────────┘
                │               │               │
        ┌───────▼─────┐ ┌───────▼─────┐ ┌───────▼─────┐
        │Payment Svc  │ │Notification │ │Admin Service│
        │(Port 5300)  │ │Svc(Port5400)│ │(Port 5500)  │
        └─────────────┘ └─────────────┘ └─────────────┘
                │               │               │
                └───────────────┼───────────────┘
                        ┌───────▼─────┐
                        │Apache Kafka │
                        │(Port 9092)  │
                        └─────────────┘
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **Java** (v11 or higher)
- **Maven** (v3.6 or higher)
- **PostgreSQL** (v12 or higher)
- **Docker** (optional, for Kafka)

### 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Railway_Reservation_System_Case_Study
   ```

2. **Frontend Setup**
   ```bash
   cd railway-reservation
   npm install
   ```

3. **Backend Setup**
   ```bash
   # Start each microservice
   cd eureka-server && mvn spring-boot:run
   cd api-gateway && mvn spring-boot:run
   cd Microservices/user-service && mvn spring-boot:run
   cd Microservices/train-service && mvn spring-boot:run
   cd Microservices/ticket-service && mvn spring-boot:run
   cd Microservices/payment-service && mvn spring-boot:run
   cd Microservices/notification-service && mvn spring-boot:run
   cd Microservices/admin-service && mvn spring-boot:run
   ```

4. **Database Setup**
   ```sql
   -- Create databases for each service
   CREATE DATABASE userdb;
   CREATE DATABASE traindb;
   CREATE DATABASE ticketdb;
   CREATE DATABASE paymentdb;
   CREATE DATABASE notificationdb;
   CREATE DATABASE admindb;
   ```

5. **Kafka Setup (Docker)**
   ```bash
   docker-compose up -d
   ```

### 📝 Environment Configuration

1. **Copy environment template**
   ```bash
   cp .env.example .env
   ```

2. **Configure environment variables**
   ```env
   # API Configuration
   VITE_API_BASE_URL=http://localhost:6111/api
   VITE_API_GATEWAY_URL=http://localhost:6111
   
   # Payment Configuration
   VITE_RAZORPAY_KEY=your_razorpay_key
   
   # Database Configuration
   DB_HOST=localhost
   DB_USERNAME=postgres
   DB_PASSWORD=your_password
   
   # Kafka Configuration
   KAFKA_BOOTSTRAP_SERVERS=localhost:9092
   ```

### 🎮 Running the Application

1. **Start Backend Services** (in order)
   ```bash
   # 1. Service Discovery
   java -jar eureka-server/target/eureka-server-0.0.1-SNAPSHOT.jar
   
   # 2. API Gateway
   java -jar api-gateway/target/api-gateway-0.0.1-SNAPSHOT.jar
   
   # 3. Microservices (can be started in parallel)
   java -jar Microservices/user-service/target/user-service-0.0.1-SNAPSHOT.jar
   java -jar Microservices/train-service/target/train-service-0.0.1-SNAPSHOT.jar
   # ... other services
   ```

2. **Start Frontend**
   ```bash
   cd railway-reservation
   npm run dev
   ```

3. **Start Kafka**
   ```bash
   docker-compose up -d
   ```

### 🌐 Access Points

- **Frontend Application**: http://localhost:3000
- **API Gateway**: http://localhost:6111
- **Eureka Dashboard**: http://localhost:6010
- **Kafka UI**: http://localhost:8080

## 📚 API Documentation

### **Authentication Endpoints**
```
POST /api/users/register - User registration
POST /api/users/login    - User login
GET  /api/users/profile  - Get user profile
```

### **Train Endpoints**
```
GET  /api/trains/all                    - Get all trains
GET  /api/trains/search/advanced        - Search trains
GET  /api/trains/{id}/schedule          - Get train schedule
GET  /api/trains/{id}/seats/{date}      - Check seat availability
```

### **Booking Endpoints**
```
POST /api/tickets/book/{trainId}        - Book ticket
GET  /api/tickets/user                  - Get user bookings
POST /api/tickets/{id}/cancel           - Cancel booking
```

## 🧪 Testing

### **Frontend Testing**
```bash
# Run tests
npm run test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

### **Backend Testing**
```bash
# Run all tests
mvn test

# Run specific service tests
cd Microservices/user-service && mvn test
```

## 📦 Build & Deployment

### **Frontend Build**
```bash
# Production build
npm run build

# Preview production build
npm run preview
```

### **Backend Build**
```bash
# Build all services
mvn clean package

# Build specific service
cd Microservices/user-service && mvn clean package
```

### **Docker Deployment**
```bash
# Build and run with Docker Compose
docker-compose up --build
```

## 🤝 Contributing

1. **Fork the repository**
2. **Create feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit changes** (`git commit -m 'Add amazing feature'`)
4. **Push to branch** (`git push origin feature/amazing-feature`)
5. **Open Pull Request**

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Developer**: [Pankaj Prajapati]
- **Project Type**: Full-Stack Railway Reservation System
- **Academic Project**: Case Study Implementation

## 🆘 Support

For support and queries:
- **Email**: support@irailgateway.com
- **Documentation**: [Project Wiki](wiki-url)
- **Issues**: [GitHub Issues](issues-url)

## 🎯 Future Enhancements

- [ ] Mobile Application (React Native)
- [ ] Advanced Analytics Dashboard
- [ ] AI-powered Seat Recommendations
- [ ] Multi-language Support
- [ ] Integration with Real Railway APIs
- [ ] Blockchain-based Ticket Verification

---

**⭐ Star this repository if you find it helpful!**
