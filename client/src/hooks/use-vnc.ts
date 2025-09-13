import { useState, useRef, useCallback, useEffect } from "react";
import type { VncConnection, VncMessage, ConnectionStatus, VncStats } from "@shared/schema";

interface UseVncOptions {
  onStatusChange: (status: ConnectionStatus) => void;
  onStatsUpdate: (stats: VncStats) => void;
  onError: (message: string) => void;
}

export function useVnc({ onStatusChange, onStatsUpdate, onError }: UseVncOptions) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);

  // Initialize canvas context
  useEffect(() => {
    if (canvasRef.current) {
      contextRef.current = canvasRef.current.getContext('2d');
    }
  }, []);

  const connect = useCallback(async (connectionData: VncConnection) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    setIsConnecting(true);
    setError(null);
    onStatusChange('connecting');

    try {
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${protocol}//${window.location.host}/ws`;
      
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('WebSocket connected');
        // Send connection request
        ws.send(JSON.stringify({
          type: 'connect',
          data: connectionData
        }));
      };

      ws.onmessage = (event) => {
        try {
          // Handle JSON messages (control messages)
          if (typeof event.data === 'string') {
            const message = JSON.parse(event.data);
            
            switch (message.type) {
              case 'connected':
                setIsConnecting(false);
                onStatusChange('connected');
                console.log('VNC connected successfully');
                break;
                
              case 'disconnected':
                onStatusChange('disconnected');
                setIsConnecting(false);
                break;
                
              case 'error':
                setError(message.data.message);
                onError(message.data.message);
                onStatusChange('failed');
                setIsConnecting(false);
                break;
            }
          } else {
            // Handle binary data (VNC framebuffer updates)
            handleVncData(event.data);
          }
        } catch (err) {
          console.error('Message handling error:', err);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setError('WebSocket connection failed');
        onError('WebSocket connection failed');
        onStatusChange('failed');
        setIsConnecting(false);
      };

      ws.onclose = () => {
        console.log('WebSocket disconnected');
        onStatusChange('disconnected');
        setIsConnecting(false);
        wsRef.current = null;
      };

    } catch (err) {
      console.error('Connection error:', err);
      setError('Failed to establish connection');
      onError('Failed to establish connection');
      onStatusChange('failed');
      setIsConnecting(false);
    }
  }, [onStatusChange, onError]);

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.send(JSON.stringify({
        type: 'disconnect',
        data: {}
      }));
      wsRef.current.close();
      wsRef.current = null;
    }
    onStatusChange('disconnected');
    setIsConnecting(false);
  }, [onStatusChange]);

  const sendMessage = useCallback((message: VncMessage) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    }
  }, []);

  const handleVncData = useCallback((data: ArrayBuffer) => {
    // Basic VNC protocol handling
    // In a real implementation, this would parse RFB protocol messages
    // and update the canvas with framebuffer data
    
    if (canvasRef.current && contextRef.current) {
      // Mock framebuffer update for demonstration
      // Real implementation would decode VNC RFB messages
      const imageData = contextRef.current.createImageData(800, 600);
      const buffer = new Uint8Array(data);
      
      // Simple pattern to show data is being received
      for (let i = 0; i < imageData.data.length; i += 4) {
        const index = Math.floor(i / 4);
        imageData.data[i] = buffer[index % buffer.length] || 0;     // R
        imageData.data[i + 1] = buffer[(index + 1) % buffer.length] || 0; // G
        imageData.data[i + 2] = buffer[(index + 2) % buffer.length] || 0; // B
        imageData.data[i + 3] = 255; // A
      }
      
      contextRef.current.putImageData(imageData, 0, 0);
      
      // Update stats
      onStatsUpdate({
        frameRate: 30,
        bandwidth: buffer.length,
        latency: 50,
        resolution: `${canvasRef.current.width}x${canvasRef.current.height}`
      });
    }
  }, [onStatsUpdate]);

  // Mouse event handlers
  const handleMouseEvent = useCallback((event: MouseEvent, action: string) => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    // Calculate coordinates relative to canvas CSS size
    const cssX = event.clientX - rect.left;
    const cssY = event.clientY - rect.top;
    
    // Scale coordinates to canvas internal resolution (800x600)
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const scaledX = cssX * scaleX;
    const scaledY = cssY * scaleY;
    
    // Clamp coordinates to canvas bounds
    const x = Math.max(0, Math.min(canvas.width - 1, Math.floor(scaledX)));
    const y = Math.max(0, Math.min(canvas.height - 1, Math.floor(scaledY)));
    
    sendMessage({
      type: 'mouse',
      data: {
        x,
        y,
        button: event.button + 1,
        action
      }
    });
  }, [sendMessage]);

  // Keyboard event handlers
  const handleKeyEvent = useCallback((event: KeyboardEvent, action: string) => {
    event.preventDefault();
    
    sendMessage({
      type: 'keyboard',
      data: {
        key: event.key,
        keyCode: event.keyCode,
        action
      }
    });
  }, [sendMessage]);

  // Wheel/scroll event handler
  const handleWheelEvent = useCallback((event: WheelEvent) => {
    event.preventDefault();
    
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    // Calculate coordinates relative to canvas CSS size
    const cssX = event.clientX - rect.left;
    const cssY = event.clientY - rect.top;
    
    // Scale coordinates to canvas internal resolution
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const scaledX = cssX * scaleX;
    const scaledY = cssY * scaleY;
    
    // Clamp coordinates to canvas bounds
    const x = Math.max(0, Math.min(canvas.width - 1, Math.floor(scaledX)));
    const y = Math.max(0, Math.min(canvas.height - 1, Math.floor(scaledY)));
    
    // Determine wheel direction and button
    const button = event.deltaY < 0 ? 4 : 5; // Button 4 for scroll up, 5 for scroll down
    
    // Send wheel events as button press/release pairs
    sendMessage({
      type: 'mouse',
      data: { x, y, button, action: 'mousedown' }
    });
    
    sendMessage({
      type: 'mouse',
      data: { x, y, button, action: 'mouseup' }
    });
  }, [sendMessage]);

  // Auto-focus canvas on connection
  useEffect(() => {
    if (canvasRef.current && !isConnecting) {
      // Focus canvas when connected
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.focus();
      }
    }
  }, [isConnecting]);

  // Attach event listeners to canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const mouseDown = (e: MouseEvent) => {
      // Focus canvas on first click to ensure keyboard events work
      if (document.activeElement !== canvas) {
        canvas.focus();
      }
      handleMouseEvent(e, 'mousedown');
    };
    const mouseUp = (e: MouseEvent) => handleMouseEvent(e, 'mouseup');
    const mouseMove = (e: MouseEvent) => handleMouseEvent(e, 'mousemove');
    const keyDown = (e: KeyboardEvent) => handleKeyEvent(e, 'keydown');
    const keyUp = (e: KeyboardEvent) => handleKeyEvent(e, 'keyup');
    const wheel = (e: WheelEvent) => handleWheelEvent(e);

    canvas.addEventListener('mousedown', mouseDown);
    canvas.addEventListener('mouseup', mouseUp);
    canvas.addEventListener('mousemove', mouseMove);
    canvas.addEventListener('wheel', wheel);
    canvas.addEventListener('contextmenu', (e) => e.preventDefault());
    
    // Canvas needs to be focusable for keyboard events
    canvas.tabIndex = 0;
    canvas.addEventListener('keydown', keyDown);
    canvas.addEventListener('keyup', keyUp);

    return () => {
      canvas.removeEventListener('mousedown', mouseDown);
      canvas.removeEventListener('mouseup', mouseUp);
      canvas.removeEventListener('mousemove', mouseMove);
      canvas.removeEventListener('wheel', wheel);
      canvas.removeEventListener('keydown', keyDown);
      canvas.removeEventListener('keyup', keyUp);
    };
  }, [handleMouseEvent, handleKeyEvent, handleWheelEvent]);

  // Helper function to send special key sequences
  const sendKeySequence = useCallback((keys: string[], action: 'press' | 'release') => {
    keys.forEach(key => {
      sendMessage({
        type: 'keyboard',
        data: {
          key,
          keyCode: 0, // Special keys don't need keyCode
          action: action === 'press' ? 'keydown' : 'keyup'
        }
      });
    });
  }, [sendMessage]);

  return {
    connect,
    disconnect,
    sendMessage,
    sendKeySequence,
    isConnecting,
    error,
    canvasRef
  };
}
