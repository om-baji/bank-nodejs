# SecureBank - Modern Banking System

A comprehensive, microservices-based banking platform built with modern technologies, featuring real-time notifications, secure transactions, and an intuitive user interface.

## 🌟 Features

### Core Banking Features
- 💳 **Account Management** - Multiple account types with comprehensive controls
- 🔄 **Fund Transfers** - Secure domestic and international wire transfers
- 💰 **Transaction Processing** - Real-time transaction handling with Kafka messaging
- 🎯 **Card Services** - Debit/Credit card management with instant lock/unlock
- 📊 **Manager Dashboard** - Administrative oversight and reporting tools
- 📧 **Smart Notifications** - Event-driven email system with beautiful HTML templates

### Technical Features
- 🔐 **Advanced Security** - JWT authentication, encrypted data storage
- 📡 **Real-time Updates** - Kafka-based event streaming
- 🚀 **High Performance** - Go-powered core engine with efficient processing
- 📱 **Responsive UI** - Modern React interface with Tailwind CSS
- 🐳 **Containerized** - Docker-ready microservices architecture
- 🔄 **API Gateway** - Centralized routing with rate limiting

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │    API Gateway   │    │   Core Engine   │
│   (React/Next)  │◄──►│   (Go/Fiber)     │◄──►│   (Go/gRPC)     │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │
                    ┌───────────┴───────────┐
                    │                       │
        ┌───────────▼──────────┐ ┌─────────▼──────────┐
        │   Backend Services   │ │   Notification     │
        │   (Node.js/Bun)      │ │   Service          │
        └──────────────────────┘ └────────────────────┘
        │                      │
        ├── Auth Service        ├── Account Service
        ├── User Service        ├── Card Service
        └── Manager Service     └── Event-driven Emails
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ / Bun 1.0+
- Go 1.21+
- Docker & Docker Compose
- PostgreSQL 14+
- Redis 6+

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/bank-mini.git
   cd bank-mini
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start with Docker Compose**
   ```bash
   docker-compose up -d
   ```

4. **Manual Setup** (Alternative)
   ```bash
   # Backend Services
   cd backend/auth-service && bun install && bun run index.ts &
   cd backend/user-service && bun install && bun run index.ts &
   cd backend/account-service && bun install && bun run index.ts &
   cd backend/card-service && bun install && bun run index.ts &
   cd backend/manager-server && bun install && bun run index.ts &
   cd backend/notification-service && bun install && bun run index.ts &
   
   # Core Engine
   cd core && go run main.go &
   
   # API Gateway
   cd gateway && go run main.go &
   
   # Frontend
   cd interface && npm install && npm run dev
   ```

## 📁 Project Structure

```
bank-mini/
├── 🎨 interface/              # React/Next.js Frontend
│   ├── app/                   # Next.js App Router
│   ├── components/            # Reusable UI Components
│   └── lib/                   # Utilities & Hooks
├── ⚡ core/                   # Go Core Engine
│   ├── engine.go              # Transaction Engine
│   ├── crypto.go              # Security Layer
│   └── generated/             # Protocol Buffers
├── 🌐 gateway/                # API Gateway (Go/Fiber)
│   ├── proxy.go               # Request Routing
│   ├── ratelimit.go           # Rate Limiting
│   └── health.go              # Health Checks
├── 🔧 backend/                # Microservices (Node.js/Bun)
│   ├── auth-service/          # Authentication & Authorization
│   ├── user-service/          # User Management
│   ├── account-service/       # Account Operations
│   ├── card-service/          # Card Management
│   ├── manager-server/        # Admin Dashboard Backend
│   └── notification-service/  # Email Notification System
├── 📡 proto/                  # Protocol Buffer Definitions
└── 🐳 docker-compose.yml      # Container Orchestration
```

## 🎯 Services Overview

### Frontend Services
- **🖥️ Interface** - Next.js 14 with App Router, Tailwind CSS, shadcn/ui

### Backend Services
- **🔐 Auth Service** - JWT-based authentication, session management
- **👤 User Service** - User profile and preference management  
- **💰 Account Service** - Account creation, balance management
- **💳 Card Service** - Card issuance, blocking, transaction history
- **👨‍💼 Manager Service** - Administrative functions, reporting
- **📧 Notification Service** - Event-driven email system

### Core Services
- **⚡ Core Engine** - High-performance transaction processing (Go)
- **🌐 API Gateway** - Request routing, rate limiting, load balancing (Go/Fiber)

## 📧 Notification System

Our advanced notification system supports multiple email templates:

### Available Templates
- 🎉 **Account Created** - Welcome new customers
- 📊 **Account Statement** - Monthly statements with transaction history
- 🔒 **Card Blocked** - Security alerts for blocked cards
- 💳 **Transaction Alert** - Real-time transaction notifications

### Usage Example
```typescript
import { sendAccountCreatedEmail, EmailTemplateData } from './backend/notification-service/action/notification.action'

const accountData: EmailTemplateData = {
  recipientName: "John Doe",
  accountNumber: "1234567890",
  initialDeposit: "$1,000.00"
}

await sendAccountCreatedEmail("user@example.com", accountData)
```

## 🔧 Development

### Frontend Development
```bash
cd interface
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run ESLint
```

### Backend Development
```bash
cd backend/[service-name]
bun run index.ts     # Start service
bun test            # Run tests
```

### Core Engine Development
```bash
cd core
go run main.go      # Start core engine
go test ./...       # Run tests
go build           # Build binary
```

## 🐳 Docker Support

### Full Stack Deployment
```bash
docker-compose up -d                    # Start all services
docker-compose logs -f [service-name]   # View logs
docker-compose down                     # Stop all services
```

### Individual Service
```bash
docker build -t bank-core ./core
docker run -p 8080:8080 bank-core
```

## 📊 API Documentation

### Core Endpoints
- `POST /api/auth/login` - User authentication
- `GET /api/accounts` - List user accounts
- `POST /api/transfers` - Create fund transfer
- `GET /api/transactions` - Transaction history
- `POST /api/cards` - Create new card
- `PUT /api/cards/:id/block` - Block/unblock card

### Manager Endpoints
- `GET /api/manager/customers` - Customer overview
- `GET /api/manager/transactions` - System transactions
- `POST /api/manager/reports` - Generate reports

## 🔒 Security Features

- **🛡️ JWT Authentication** - Secure token-based auth
- **🔐 Data Encryption** - At-rest and in-transit encryption  
- **🚦 Rate Limiting** - API abuse prevention
- **🔍 Audit Logging** - Complete transaction trails
- **🎯 Role-based Access** - Granular permission system

## 🚀 Performance

- **⚡ Go Core Engine** - High-throughput transaction processing
- **🔄 Redis Caching** - Sub-millisecond data access
- **📡 Kafka Messaging** - Asynchronous event processing
- **🌐 CDN Ready** - Static asset optimization
- **📊 Connection Pooling** - Efficient database connections
---