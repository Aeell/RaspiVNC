import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useVnc } from "@/hooks/use-vnc";
import { ConnectionPanel } from "@/components/connection-panel";
import { VncViewer } from "@/components/vnc-viewer";
import { TouchControls } from "@/components/touch-controls";
import { useIsMobile } from "@/hooks/use-mobile";
import type { VncConnection, ConnectionStatus, VncStats } from "@shared/schema";

export default function VncClient() {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');
  const [stats, setStats] = useState<VncStats>({
    frameRate: 0,
    bandwidth: 0,
    latency: 0,
    resolution: '',
  });

  const {
    connect,
    disconnect,
    sendMessage,
    sendKeySequence,
    isConnecting,
    error,
    canvasRef
  } = useVnc({
    onStatusChange: setConnectionStatus,
    onStatsUpdate: setStats,
    onError: (message) => {
      toast({
        variant: "destructive",
        title: "Connection Error",
        description: message,
      });
    }
  });

  const handleConnect = async (connectionData: VncConnection) => {
    try {
      await connect(connectionData);
    } catch (err) {
      console.error('Connection failed:', err);
    }
  };

  const handleDisconnect = () => {
    disconnect();
  };

  const toggleFullscreen = () => {
    if (canvasRef.current) {
      if (!document.fullscreenElement) {
        canvasRef.current.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    }
  };

  const sendCtrlAltDel = () => {
    // Send Ctrl+Alt+Del key sequence with proper keydown/keyup pairs
    const keys = ['Control_L', 'Alt_L', 'Delete'];
    
    // Press keys down
    sendKeySequence(keys, 'press');
    
    // Release keys in reverse order (standard practice)
    sendKeySequence(keys.reverse(), 'release');
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="bg-card shadow-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <i className="fas fa-desktop text-primary text-xl"></i>
              <h1 className="text-xl font-semibold text-foreground">VNC Remote Desktop</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span 
                  className={`status-indicator ${
                    connectionStatus === 'connected' ? 'status-connected' :
                    connectionStatus === 'connecting' ? 'status-connecting' :
                    'status-disconnected'
                  }`}
                  data-testid="status-indicator"
                ></span>
                <span className="text-sm text-muted-foreground" data-testid="status-text">
                  {connectionStatus === 'connected' ? 'Connected' :
                   connectionStatus === 'connecting' ? 'Connecting...' :
                   connectionStatus === 'failed' ? 'Connection Failed' :
                   'Disconnected'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Connection Panel */}
          <div className="md:col-span-1">
            <ConnectionPanel
              onConnect={handleConnect}
              onDisconnect={handleDisconnect}
              onToggleFullscreen={toggleFullscreen}
              connectionStatus={connectionStatus}
              isConnecting={isConnecting}
            />
            
            {/* Touch Controls for Mobile */}
            {isMobile && (
              <TouchControls
                onLeftClick={() => sendMessage({ type: 'mouse', data: { button: 1, action: 'click' } })}
                onRightClick={() => sendMessage({ type: 'mouse', data: { button: 3, action: 'click' } })}
                onKeyboard={() => {}}
                onDrag={() => {}}
              />
            )}
          </div>

          {/* VNC Viewer */}
          <div className="md:col-span-3">
            <VncViewer
              canvasRef={canvasRef}
              connectionStatus={connectionStatus}
              stats={stats}
              onCtrlAltDel={sendCtrlAltDel}
              onToggleViewOnly={() => {}}
              onFitToWindow={() => {}}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
