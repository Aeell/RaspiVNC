import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { VncConnection, ConnectionStatus } from "@shared/schema";

interface ConnectionPanelProps {
  onConnect: (connection: VncConnection) => void;
  onDisconnect: () => void;
  onToggleFullscreen: () => void;
  connectionStatus: ConnectionStatus;
  isConnecting: boolean;
}

export function ConnectionPanel({ 
  onConnect, 
  onDisconnect, 
  onToggleFullscreen, 
  connectionStatus, 
  isConnecting 
}: ConnectionPanelProps) {
  const [formData, setFormData] = useState<VncConnection>({
    host: "192.168.0.102",
    port: 5901,
    password: "",
    quality: 6,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConnect(formData);
  };

  const handleInputChange = (field: keyof VncConnection, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const isConnected = connectionStatus === 'connected';

  return (
    <div className="bg-card rounded-lg shadow-sm border border-border p-6 space-y-6">
      <h2 className="text-lg font-semibold text-foreground flex items-center">
        <i className="fas fa-plug text-primary mr-2"></i>
        Connection
      </h2>
      
      {/* Connection Form */}
      <form onSubmit={handleSubmit} className="space-y-4" data-testid="form-connection">
        <div>
          <Label htmlFor="host" className="block text-sm font-medium text-foreground mb-2">
            Host Address
          </Label>
          <Input 
            type="text" 
            id="host" 
            value={formData.host}
            onChange={(e) => handleInputChange('host', e.target.value)}
            className="w-full"
            disabled={isConnected || isConnecting}
            data-testid="input-host"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="port" className="block text-sm font-medium text-foreground mb-2">
              Port
            </Label>
            <Input 
              type="number" 
              id="port" 
              value={formData.port}
              onChange={(e) => handleInputChange('port', parseInt(e.target.value) || 5901)}
              className="w-full"
              disabled={isConnected || isConnecting}
              data-testid="input-port"
            />
          </div>
          <div>
            <Label htmlFor="quality" className="block text-sm font-medium text-foreground mb-2">
              Quality
            </Label>
            <Select 
              value={formData.quality.toString()} 
              onValueChange={(value) => handleInputChange('quality', parseInt(value))}
              disabled={isConnected || isConnecting}
            >
              <SelectTrigger data-testid="select-quality">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Low</SelectItem>
                <SelectItem value="6">Medium</SelectItem>
                <SelectItem value="9">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div>
          <Label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
            Password (optional)
          </Label>
          <Input 
            type="password" 
            id="password" 
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            className="w-full"
            disabled={isConnected || isConnecting}
            data-testid="input-password"
          />
        </div>
        
        <Button 
          type="submit" 
          className="w-full"
          disabled={isConnected || isConnecting}
          data-testid="button-connect"
        >
          <i className="fas fa-play mr-2"></i>
          {isConnecting ? 'Connecting...' : 'Connect'}
        </Button>
      </form>
      
      {/* Connection Actions */}
      <div className="border-t border-border pt-4 space-y-2">
        <Button 
          variant="destructive"
          className="w-full"
          onClick={onDisconnect}
          disabled={!isConnected}
          data-testid="button-disconnect"
        >
          <i className="fas fa-stop mr-2"></i>
          Disconnect
        </Button>
        
        <Button 
          variant="secondary"
          className="w-full"
          onClick={onToggleFullscreen}
          data-testid="button-fullscreen"
        >
          <i className="fas fa-expand mr-2"></i>
          Fullscreen
        </Button>
      </div>
      
      {/* Connection Info */}
      <div className="border-t border-border pt-4">
        <h3 className="text-sm font-medium text-foreground mb-3">Connection Info</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Target:</span>
            <span className="text-foreground" data-testid="info-target">Raspberry Pi 5</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Protocol:</span>
            <span className="text-foreground">VNC (RFB)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Encryption:</span>
            <span className="text-foreground">None</span>
          </div>
        </div>
      </div>
    </div>
  );
}
