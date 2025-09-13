import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { createConnection } from "net";
import { vncConnectionSchema, vncMessageSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  
  // Create WebSocket server for VNC proxy
  const wss = new WebSocketServer({ 
    server: httpServer, 
    path: '/ws'
  });

  wss.on('connection', (ws: WebSocket) => {
    console.log('WebSocket client connected');
    let vncSocket: any = null;
    let isConnected = false;

    ws.on('message', (data: Buffer) => {
      try {
        const message = JSON.parse(data.toString());
        const validatedMessage = vncMessageSchema.parse(message);

        switch (validatedMessage.type) {
          case 'connect':
            const connectionData = vncConnectionSchema.parse(validatedMessage.data);
            
            // Create TCP connection to VNC server
            vncSocket = createConnection({
              host: connectionData.host,
              port: connectionData.port,
              timeout: 10000
            });

            vncSocket.on('connect', () => {
              console.log(`Connected to VNC server at ${connectionData.host}:${connectionData.port}`);
              isConnected = true;
              
              if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({
                  type: 'connected',
                  data: { host: connectionData.host, port: connectionData.port }
                }));
              }
            });

            vncSocket.on('data', (data: Buffer) => {
              // Forward VNC data to WebSocket client
              if (ws.readyState === WebSocket.OPEN) {
                ws.send(data);
              }
            });

            vncSocket.on('error', (error: Error) => {
              console.error('VNC connection error:', error);
              if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({
                  type: 'error',
                  data: { message: `Failed to connect to ${connectionData.host}:${connectionData.port}` }
                }));
              }
            });

            vncSocket.on('close', () => {
              console.log('VNC connection closed');
              isConnected = false;
              if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({
                  type: 'disconnected',
                  data: {}
                }));
              }
            });
            break;

          case 'disconnect':
            if (vncSocket && isConnected) {
              vncSocket.end();
              vncSocket = null;
              isConnected = false;
            }
            break;

          default:
            // Forward other messages (mouse, keyboard, etc.) to VNC server
            if (vncSocket && isConnected && validatedMessage.data) {
              vncSocket.write(Buffer.from(validatedMessage.data));
            }
            break;
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({
            type: 'error',
            data: { message: 'Invalid message format' }
          }));
        }
      }
    });

    // Forward binary data from WebSocket to VNC server
    ws.on('message', (data: Buffer) => {
      if (vncSocket && isConnected && data instanceof Buffer) {
        vncSocket.write(data);
      }
    });

    ws.on('close', () => {
      console.log('WebSocket client disconnected');
      if (vncSocket && isConnected) {
        vncSocket.end();
      }
    });

    ws.on('error', (error: Error) => {
      console.error('WebSocket error:', error);
      if (vncSocket && isConnected) {
        vncSocket.end();
      }
    });
  });

  return httpServer;
}
