import { RefObject } from "react";
import type { ConnectionStatus, VncStats } from "@shared/schema";

interface VncViewerProps {
  canvasRef: RefObject<HTMLCanvasElement>;
  connectionStatus: ConnectionStatus;
  stats: VncStats;
  onCtrlAltDel: () => void;
  onToggleViewOnly: () => void;
  onFitToWindow: () => void;
}

export function VncViewer({ 
  canvasRef, 
  connectionStatus, 
  stats, 
  onCtrlAltDel, 
  onToggleViewOnly, 
  onFitToWindow 
}: VncViewerProps) {
  return (
    <div className="bg-card rounded-lg shadow-sm border border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground flex items-center">
          <i className="fas fa-tv text-primary mr-2"></i>
          Remote Desktop
        </h2>
        
        {/* VNC Controls */}
        <div className="flex items-center space-x-2">
          <button 
            className="bg-muted text-muted-foreground px-3 py-1 rounded text-sm hover:bg-muted/80 focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
            onClick={onCtrlAltDel}
            disabled={connectionStatus !== 'connected'}
            title="Send Ctrl+Alt+Del"
            data-testid="button-ctrl-alt-del"
          >
            <i className="fas fa-keyboard mr-1"></i>
            Ctrl+Alt+Del
          </button>
          
          <button 
            className="bg-muted text-muted-foreground px-3 py-1 rounded text-sm hover:bg-muted/80 focus:outline-none focus:ring-2 focus:ring-ring"
            onClick={onToggleViewOnly}
            title="Toggle View Only Mode"
            data-testid="button-view-only"
          >
            <i className="fas fa-eye mr-1"></i>
            View Only
          </button>
          
          <button 
            className="bg-muted text-muted-foreground px-3 py-1 rounded text-sm hover:bg-muted/80 focus:outline-none focus:ring-2 focus:ring-ring"
            onClick={onFitToWindow}
            title="Fit to Window"
            data-testid="button-fit-window"
          >
            <i className="fas fa-compress-arrows-alt mr-1"></i>
            Fit
          </button>
        </div>
      </div>
      
      {/* VNC Canvas Container */}
      <div className="vnc-canvas rounded-lg relative">
        {/* Disconnected State */}
        {connectionStatus === 'disconnected' && (
          <div className="absolute inset-0 flex items-center justify-center" data-testid="state-disconnected">
            <div className="text-center">
              <i className="fas fa-desktop text-muted-foreground text-4xl mb-4"></i>
              <h3 className="text-lg font-medium text-foreground mb-2">No Active Connection</h3>
              <p className="text-muted-foreground mb-4">Connect to your Raspberry Pi 5 to start the remote session</p>
              <div className="text-sm text-muted-foreground">
                <p>Target: 192.168.0.102:5901</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Loading State */}
        {connectionStatus === 'connecting' && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center" data-testid="state-connecting">
            <div className="text-center">
              <i className="fas fa-spinner loading-spinner text-primary text-3xl mb-4"></i>
              <h3 className="text-lg font-medium text-foreground mb-2">Connecting...</h3>
              <p className="text-muted-foreground">Establishing VNC connection to Raspberry Pi 5</p>
              <div className="mt-4">
                <div className="bg-muted rounded-full h-2 w-48 mx-auto">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '45%' }}></div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Authenticating...</p>
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {connectionStatus === 'failed' && (
          <div className="absolute inset-0 flex items-center justify-center" data-testid="state-failed">
            <div className="text-center">
              <i className="fas fa-exclamation-triangle text-destructive text-4xl mb-4"></i>
              <h3 className="text-lg font-medium text-foreground mb-2">Connection Failed</h3>
              <p className="text-muted-foreground mb-4">Unable to connect to the Raspberry Pi 5</p>
              <div className="text-sm text-muted-foreground">
                <p>Please check your network connection and VNC settings</p>
              </div>
            </div>
          </div>
        )}
        
        {/* VNC Canvas */}
        <canvas 
          ref={canvasRef}
          className={`w-full h-full ${connectionStatus === 'connected' ? 'block' : 'hidden'}`}
          width={800}
          height={600}
          data-testid="vnc-canvas"
        />
      </div>
      
      {/* Performance Stats */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div className="bg-muted rounded-lg p-3">
          <div className="text-muted-foreground">Frame Rate</div>
          <div className="text-lg font-semibold text-foreground" data-testid="stat-framerate">
            {connectionStatus === 'connected' ? `${stats.frameRate} fps` : '-- fps'}
          </div>
        </div>
        <div className="bg-muted rounded-lg p-3">
          <div className="text-muted-foreground">Bandwidth</div>
          <div className="text-lg font-semibold text-foreground" data-testid="stat-bandwidth">
            {connectionStatus === 'connected' ? `${Math.round(stats.bandwidth / 1024)} KB/s` : '-- KB/s'}
          </div>
        </div>
        <div className="bg-muted rounded-lg p-3">
          <div className="text-muted-foreground">Latency</div>
          <div className="text-lg font-semibold text-foreground" data-testid="stat-latency">
            {connectionStatus === 'connected' ? `${stats.latency} ms` : '-- ms'}
          </div>
        </div>
        <div className="bg-muted rounded-lg p-3">
          <div className="text-muted-foreground">Resolution</div>
          <div className="text-lg font-semibold text-foreground" data-testid="stat-resolution">
            {connectionStatus === 'connected' ? stats.resolution : '--x--'}
          </div>
        </div>
      </div>
    </div>
  );
}
