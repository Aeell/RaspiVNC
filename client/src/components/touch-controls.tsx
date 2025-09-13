import { Button } from "@/components/ui/button";

interface TouchControlsProps {
  onLeftClick: () => void;
  onRightClick: () => void;
  onKeyboard: () => void;
  onDrag: () => void;
}

export function TouchControls({ onLeftClick, onRightClick, onKeyboard, onDrag }: TouchControlsProps) {
  return (
    <div className="bg-card rounded-lg shadow-sm border border-border p-4 mt-6">
      <h3 className="text-sm font-medium text-foreground mb-3">Touch Controls</h3>
      <div className="grid grid-cols-2 gap-2">
        <Button 
          variant="secondary" 
          size="sm" 
          onClick={onLeftClick}
          data-testid="button-left-click"
        >
          <i className="fas fa-mouse-pointer mr-1"></i>
          Left Click
        </Button>
        <Button 
          variant="secondary" 
          size="sm" 
          onClick={onRightClick}
          data-testid="button-right-click"
        >
          <i className="fas fa-hand-pointer mr-1"></i>
          Right Click
        </Button>
        <Button 
          variant="secondary" 
          size="sm" 
          onClick={onKeyboard}
          data-testid="button-keyboard"
        >
          <i className="fas fa-keyboard mr-1"></i>
          Keyboard
        </Button>
        <Button 
          variant="secondary" 
          size="sm" 
          onClick={onDrag}
          data-testid="button-drag"
        >
          <i className="fas fa-arrows-alt mr-1"></i>
          Drag
        </Button>
      </div>
    </div>
  );
}
