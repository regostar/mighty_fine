# 📖 API Documentation
### Overview

This document provides details on the REST API endpoints and WebSocket connection protocol provided by the Audio Captioning Service.

##🔑 REST API Endpoints
##✅ Create a New Client
### Endpoint:   POST /clients

Description:

Creates a new client token to access captioning services.

Request:
```HTTP
POST /clients
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com"
}
```

Successful Response:
Status: 201 Created

```json
{
  "token": "b6f51a3e-0da2-4e52-8fb2-c8a6e5d4438f",
  "name": "John Doe",
  "email": "john@example.com",
  "createdAt": "2025-03-06T15:30:00.000Z"
}
```

Error Responses:

1. Missing fields:

```json

Status: 400 Bad Request
{
  "error": "Name and email are required."
}
```

2. Internal Server Error:

```json
Status: 500 Internal Server Error
{
  "error": "Internal server error."
}
```

## 🚩 REST API: Usage Retrieval

### **Endpoint**

### GET /usage


### **Description**
Retrieves the total captioning usage in milliseconds for a specific client token.

### **Request Example**
```http
GET /usage?token=b6f51a3e-0da2-4a2f-abcd-123456789abc
```

Successful Response
```json
{
  "token": "b6f51a3e-0da2-4a2f-abcd-123456789abc",
  "usage": 3500
}
```

### Error Responses:

1. Missing Token
```json
{
  "error": "Missing token parameter"
}
```

2. Invalid Token
```json
{
  "error": "Client not found"
}
```


## 📡 WebSocket Captioning API

### **Connection URL**

ws://<host>:<port>?token=<CLIENT_TOKEN>


### **Example**
ws://localhost:3000?token=b6f51a3e-0da2-4a2f-abcd-123456789abc


### **Functionality**
This WebSocket connection allows clients to send audio packets and receive real-time simulated caption data.

### **Incoming Messages (from Client → Server)**
- **Simulate Audio Packet**:  
  - Send any message (content does not matter).
  - Each message sent counts as **100 milliseconds** of captioning usage.

### **Outgoing Messages (from Server)**

#### a. **Regular Caption Message**

Sent periodically (every second) if the usage limit is not exceeded.

```json
{
  "caption": "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
}
```
#### b. Usage Limit Exceeded

When the usage limit (e.g., 60 seconds) is reached, the server sends an error and closes the connection.


```json
{
  "error": "Captioning time limit exceeded."
}
```

#### c. Invalid Token Error

If the client token is invalid, the server immediately sends an error and closes the connection.

```json
{
  "error": "Client not found"
}
```


## 🚩 Usage Limits and Constraints

  - Max captioning duration per token: 60 seconds (60000 milliseconds)
  - Each WebSocket message sent by client increments usage by 100 ms.
  - Once the limit is reached:
  - The server sends an error message.
  - The WebSocket connection is terminated.

## 🚨 Error Codes and Meanings

| **Error Message**                     | **Meaning**                                                   |
|---------------------------------------|--------------------------------------------------------------|
| `"Missing token parameter"`           | REST endpoint accessed without required token parameter.      |
| `"Name and email are required."`      | Missing required fields when creating a client.              |
| `"Client not found"`                  | Provided token does not correspond to any registered client. |
| `"Captioning time limit exceeded."`   | User exceeded the maximum allowed captioning time.           |

---

## 📌 Sample Flow

### **Step 1: Create a Client**

#### **Request**
```bash
POST /clients
Content-Type: application/json

{
  "name": "Alice",
  "email": "alice@example.com"
}
```

#### **Response**
```json
{
  "token": "b6f51a3e-0da2-4a2f-abcd-123456789abc",
  "name": "Alice",
  "email": "alice@example.com",
  "createdAt": "2025-03-07T08:21:34.567Z"
}
```

### **Step 2: Connect via WebSocket**

#### **Connection**

ws://localhost:3000?token=b6f51a3e-0da2-4a2f-abcd-123456789abc


- Send any WebSocket message to simulate a **100ms** audio packet.
- Server responds every second with captions.
- After reaching **60 seconds of usage**, the server sends an error message and disconnects.

