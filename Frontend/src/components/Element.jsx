export default function Element({
  element = {},
  selectedElement,
  setSelectedElement,
  isTextEditing,
  setIsTextEditing,
  handleMouseDown,
  handleResize,
  editingRef,
}) {
  if (!element.position || !element.size) return null;

  const isSelected = selectedElement?.id === element.id;

  const selectElement = (el, e) => {
    e.stopPropagation();
    setSelectedElement(el);
  };

  const startTextEditing = (el, e) => {
    e.stopPropagation();
    setSelectedElement(el);
    setIsTextEditing(true);
  };

  const updateTextContent = (newValue) => {
    setSelectedElement((prev) => ({
      ...prev,
      content: newValue,
    }));
  };

  return (
    <div
      className={`element absolute cursor-move transition-all duration-200 ease-in-out rounded-xl shadow-lg hover:shadow-xl ${
        isSelected ? 'ring-2 ring-purple-500' : 'ring-1 ring-gray-200'
      }`}
      style={{
        left: `${element.position?.x || 0}px`,
        top: `${element.position?.y || 0}px`,
        zIndex: element.zIndex || 1,
        backgroundColor: element.type !== 'image' ? 'white' : 'transparent',
      }}
      onClick={(e) => selectElement(element, e)}
      onMouseDown={(e) => handleMouseDown(e, element)}
      onDoubleClick={(e) => startTextEditing(element, e)}
    >
      {element.type === 'image' && (
        <img
          src={element.content}
          alt="Mood element"
          className="rounded-xl object-cover w-full h-full"
          style={{
            width: `${element.size?.width || 100}px`,
            height: `${element.size?.height || 100}px`,
          }}
          draggable="false"
        />
      )}

      {element.type === 'color' && (
        <div
          className="rounded-xl shadow-inner"
          style={{
            width: `${element.size?.width || 100}px`,
            height: `${element.size?.height || 100}px`,
            backgroundColor: element.content || '#ccc',
          }}
        />
      )}

      {element.type === 'text' &&
        (isTextEditing && isSelected ? (
          <textarea
            ref={editingRef}
            value={selectedElement.content}
            onChange={(e) => updateTextContent(e.target.value)}
            className="p-2 w-full h-full border-none focus:outline-none resize-none text-base rounded-xl shadow-inner"
            style={{
              width: `${element.size?.width || 100}px`,
              height: `${element.size?.height || 50}px`,
              fontFamily: 'Arial, sans-serif',
              fontSize: '16px',
              overflow: 'auto',
            }}
            autoFocus
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <div
            className="p-2 font-medium text-black bg-white rounded-xl"
            style={{
              width: `${element.size?.width || 100}px`,
              minHeight: `${element.size?.height || 50}px`,
              fontFamily: 'Arial, sans-serif',
              fontSize: '16px',
              wordBreak: 'break-word',
              whiteSpace: 'pre-wrap',
              overflow: 'hidden',
            }}
          >
            {element.content}
          </div>
        ))}

      {/* Resize handle */}
      {isSelected && (
        <div
          className="absolute bottom-0 right-0 w-4 h-4 bg-purple-500 rounded-tl-md cursor-se-resize hover:bg-purple-600"
          onMouseDown={(e) => {
            e.stopPropagation();

            const startX = e.clientX;
            const startY = e.clientY;
            const startWidth = element.size?.width || 100;
            const startHeight = element.size?.height || 100;

            const handleMouseMove = (moveEvent) => {
              const newWidth = Math.max(50, startWidth + (moveEvent.clientX - startX));
              const newHeight = Math.max(50, startHeight + (moveEvent.clientY - startY));
              handleResize(element, { width: newWidth, height: newHeight });
            };

            const handleMouseUp = () => {
              document.removeEventListener('mousemove', handleMouseMove);
              document.removeEventListener('mouseup', handleMouseUp);
            };

            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
          }}
        />
      )}
    </div>
  );
}
