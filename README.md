# Realtime Captioning Service

This project implements a backend service that simulates real-time captioning using a WebSocket and tracks usage via a RESTful endpoint. The service is built with Node.js and Express.

## Features

- **Captioning Endpoint:**  
  Accepts simulated audio packets (each representing 100ms of audio) and returns sequential chunks of lorem ipsum text as captions every second.
  
- **Usage Endpoint:**  
  Provides the total captioning time (in milliseconds) per client based on a provided session token.

- **Usage Limit (Bonus):**  
  Each client is limited to 60 seconds (60,000ms) of captioning time. Once the limit is exceeded, the connection is terminated.

## Getting Started

1. Install dependencies:
   
```bash
   npm install
```

2. Start the server:

```bash
npm start
```

For development with auto-reload:

```bash
npm run dev
```

3. 
WebSocket:

Connect to the WebSocket at:

ws://localhost:3000/?token=your_unique_token

Usage Endpoint:
Access usage via:

GET http://localhost:3000/usage?token=your_unique_token

.
