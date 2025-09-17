# Railway Reservation System - Architecture Diagrams

This folder contains comprehensive architecture diagrams for the Railway Reservation System project.

## 📁 Available Diagrams

### 1. **ARCHITECTURE_DIAGRAM.md**
- **Type**: Detailed text-based diagram
- **Purpose**: Complete system architecture with all components
- **Use Case**: Technical documentation, detailed analysis
- **Features**:
  - All 7 microservices with ports
  - Data flow visualization
  - Security features
  - External integrations
  - Infrastructure components

### 2. **ARCHITECTURE_DIAGRAM.puml**
- **Type**: PlantUML diagram source
- **Purpose**: Professional visual diagram generation
- **Use Case**: Presentations, reports, documentation
- **Features**:
  - Auto-generated visual diagram
  - Component relationships
  - Color-coded layers
  - Detailed annotations

### 3. **SIMPLE_ARCHITECTURE.md**
- **Type**: Simplified text-based diagram
- **Purpose**: Quick overview and presentations
- **Use Case**: High-level explanations, stakeholder meetings
- **Features**:
  - Clean, easy-to-read layout
  - Key components only
  - Essential relationships
  - Technology summary

## 🎯 **How to Use These Diagrams**

### **For Presentations:**
- Use `SIMPLE_ARCHITECTURE.md` for high-level overviews
- Use `ARCHITECTURE_DIAGRAM.puml` for detailed technical presentations

### **For Documentation:**
- Include `ARCHITECTURE_DIAGRAM.md` in technical docs
- Use PlantUML version for professional reports

### **For Development:**
- Reference detailed diagram for new feature planning
- Use simple diagram for team discussions

## 🛠️ **Generating Visual Diagrams**

### **From PlantUML File:**
1. Install PlantUML plugin for your IDE
2. Open `ARCHITECTURE_DIAGRAM.puml`
3. Export as PNG/PDF/SVG

### **Online Tools:**
1. Copy PlantUML code to [PlantUML Online](https://www.plantuml.com/plantuml/)
2. Generate and download visual diagram

### **VS Code Extension:**
1. Install "PlantUML" extension
2. Open `.puml` file
3. Right-click → "Export Current Diagram"

## 📊 **Diagram Contents**

### **System Layers:**
1. **User Interface Layer** - React frontend, mobile app, admin portal
2. **API Gateway Layer** - Spring Cloud Gateway with security
3. **Service Discovery Layer** - Netflix Eureka server
4. **Microservices Layer** - 7 Spring Boot services
5. **Data & Messaging Layer** - PostgreSQL + Apache Kafka
6. **External Integrations** - OpenAI, Razorpay, email/SMS
7. **Infrastructure Layer** - Docker, Kubernetes, monitoring

### **Key Components:**
- **7 Microservices** with specific responsibilities
- **Database per Service** pattern
- **Event-driven architecture** with Kafka
- **Security-first design** with JWT
- **Scalable infrastructure** with Docker/K8s

## 🔧 **Updating Diagrams**

When adding new features or services:
1. Update all three diagram files
2. Test PlantUML rendering
3. Update this README with new components
4. Commit changes with descriptive message

## 📞 **Contact**

For questions about the architecture or diagrams:
- **Technical Lead**: [Your Name]
- **Email**: [Your Email]
- **Documentation**: Check main project README.md

---

*Last Updated: September 6, 2025*
*Architecture Version: 1.0*
