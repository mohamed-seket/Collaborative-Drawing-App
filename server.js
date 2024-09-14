const WebSocket = require('ws');
const http = require('http');

// Create an HTTP server
const server = http.createServer();

// Create a WebSocket server on top of the HTTP server
const wss = new WebSocket.Server({ server });

// Handle WebSocket connections
wss.on('connection', (ws) => {
  console.log('A user connected');

  // Listen for messages from clients
  ws.on('message', (message) => {
    try {
      // Attempt to parse the message
      const data = JSON.parse(message);

      // Broadcast the message to all other clients
      wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(data)); // Ensure message is a JSON string
        }
      });
    } catch (error) {
      console.error('Failed to parse message:', error);
    }
  });

  // Handle client disconnections
  ws.on('close', () => {
    console.log('A user disconnected');
  });
});

// Start the HTTP server
server.listen(8080, () => {
  console.log('WebSocket server running on ws://localhost:8080');
});
