# gRPC + REST Microservices (Node.js)

This project demonstrates how to build two simple microservices in **Node.js** that communicate via **gRPC** and also expose normal **REST APIs** for testing.

- **UserService** → provides user information
- **OrderService** → creates orders and fetches user details by calling UserService via gRPC

---

## 📂 Project Structure

```
grpc-microservices/
├── user-service/
│   ├── server.js              # gRPC server for UserService
│   ├── client.js              # Test client for UserService
│   └── protos/user.proto      # Proto definition for UserService
└── order-service/
    ├── server.js              # gRPC + REST server for OrderService
    ├── protos/order.proto     # Proto definition for OrderService
    └── protos/user.proto      # Copy of user.proto for gRPC calls
```

---

## ⚙️ Installation

Clone this repo and install dependencies in both services:

```bash
cd grpc-microservices/user-service
npm init -y
npm install @grpc/grpc-js @grpc/proto-loader express body-parser

cd ../order-service
npm init -y
npm install @grpc/grpc-js @grpc/proto-loader express body-parser
```

---

## ▶️ Running the Services

### 1. Start UserService

```bash
cd user-service
node server.js
```

**Runs on:**
- gRPC: `localhost:50051`

### 2. Start OrderService

```bash
cd order-service
node server.js
```

**Runs on:**
- gRPC: `localhost:50052`
- REST: `http://localhost:4000`

---

## 🔌 Testing

### ✅ UserService (gRPC)

**Using client.js:**
```bash
cd user-service
node client.js
```

**Expected Output:**
```json
Response: { id: 1, name: 'Alice', email: 'alice@example.com' }
```

### ✅ OrderService (gRPC)

Use **Postman** (free version) or **grpcurl**:

- **Address:** `localhost:50052`
- **Import:** `order.proto`
- **Service:** `order.OrderService`
- **Method:** `CreateOrder`

**Request Body:**
```json
{
  "userId": 1,
  "product": "Laptop"
}
```

**Response:**
```json
{
  "status": "SUCCESS",
  "message": "Order for Laptop created for Alice"
}
```

### ✅ OrderService (REST)

**POST** `http://localhost:4000/orders`

**Body (JSON):**
```json
{
  "userId": 2,
  "product": "Phone"
}
```

**Response:**
```json
{
  "status": "SUCCESS",
  "message": "Order for Phone created for Bob"
}
```

---

## 📜 Proto Definitions

### user.proto

```proto
syntax = "proto3";

package user;

service UserService {
  rpc GetUser (UserRequest) returns (UserResponse);
}

message UserRequest {
  int32 id = 1;
}

message UserResponse {
  int32 id = 1;
  string name = 2;
  string email = 3;
}
```

### order.proto

```proto
syntax = "proto3";

package order;

service OrderService {
  rpc CreateOrder (OrderRequest) returns (OrderResponse);
}

message OrderRequest {
  int32 userId = 1;
  string product = 2;
}

message OrderResponse {
  string status = 1;
  string message = 2;
}
```

---

## 🚀 Features

- ✨ gRPC microservices in Node.js
- 🔧 REST endpoints for easier debugging
- 🔄 Demonstrates service-to-service communication
- 🛠️ Compatible with Postman (free) and grpcurl

---

## 📌 Notes

- Keep proto field numbers (`= 1`, `= 2`, etc.) fixed → they're field tags, not order
- gRPC is binary and efficient; REST API is added here just for easier testing
