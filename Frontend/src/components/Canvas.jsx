import { useState, useEffect } from 'react';
import Element from './Element';

function Canvas({
  currentBoard,
  selectedElement,
  setSelectedElement,
  isTextEditing,
  setIsTextEditing,
  handleMouseDown,
  handleMouseMove,
  handleMouseUp,
  handleResize,
  editingRef,
  canvasSize = { width: 800, height: 600 },
  zoom = 1,
}) {
  const [isDragging, setIsDragging] = useState(false);
  
  // Add event listeners for mouse move and mouse up when dragging
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUpWrapper);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUpWrapper);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Wrapper to handle both mouseUp and setIsDragging
  const handleMouseUpWrapper = (e) => {
    setIsDragging(false);
    handleMouseUp(e);
  };

  // Wrapper to handle both mouseDown and setIsDragging
  const handleMouseDownWrapper = (e, id) => {
    setIsDragging(true);
    handleMouseDown(e, id);
  };

  // Handle click on the canvas background to deselect elements
  const handleCanvasClick = (e) => {
    // Only deselect if clicked directly on the canvas, not on an element
    if (e.target === e.currentTarget) {
      setSelectedElement(null);
      setIsTextEditing(false);
    }
  };

  return (
    <div className="flex-1 p-10 overflow-auto bg-gradient-to-br from-gray-100 to-gray-300">
      <div 
        className="mx-auto flex items-center justify-center min-h-full"
      >
        <div
          className="relative rounded-2xl shadow-2xl transition-all duration-300 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)]"
          style={{
            backgroundColor: currentBoard?.backgroundColor || '#ffffff',
            width: `${canvasSize.width * zoom}px`,
            height: `${canvasSize.height * zoom}px`,
            transform: `scale(${zoom})`,
            transformOrigin: 'center center',
          }}
          onClick={handleCanvasClick}
        >
          {Array.isArray(currentBoard?.elements) &&
            currentBoard.elements.map((element, index) => (
              element && (
                <Element
                  key={element.id || `element-${index}`}
                  element={element}
                  selectedElement={selectedElement}
                  setSelectedElement={setSelectedElement}
                  isTextEditing={isTextEditing && selectedElement?.id === element.id}
                  setIsTextEditing={setIsTextEditing}
                  handleMouseDown={(e) => handleMouseDownWrapper(e, element.id)}
                  handleResize={handleResize}
                  editingRef={editingRef}
                  zoom={zoom}
                />
              )
            ))}
          
          {/* Overlay when no elements to make the canvas more interactive */}
          {(!currentBoard?.elements || currentBoard.elements.length === 0) && (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <p className="text-xl">This board is empty</p>
                <p className="text-sm mt-2">Add elements from the sidebar to get started</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Canvas;