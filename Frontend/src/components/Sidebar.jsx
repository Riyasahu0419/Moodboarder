import { useState, useRef, useEffect } from 'react';
import SimpleColorPicker from './SimpleColorPicker';

export default function Sidebar({
  boards,
  activeBoard,
  setActiveBoard,
  addElement,
  selectedElement,
  setSelectedElement,
  isTextEditing,
  setIsTextEditing,
  changeBoardColor,
  showColorPicker,
  setShowColorPicker,
  addNewBoard,
  deleteElement,
  renameBoard,
  deleteBoard,
}) {
  const [newBoardTitle, setNewBoardTitle] = useState('');
  const [showBoardOptions, setShowBoardOptions] = useState(null);
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState('');
  const [animation, setAnimation] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const fileInputRef = useRef(null);
  const renameInputRef = useRef(null);
  
  const currentBoard = boards.find(board => board.id === activeBoard);

  // Animation effect for new element addition
  const triggerAnimation = () => {
    setAnimation('animate-pulse');
    setTimeout(() => setAnimation(''), 500);
  };

  useEffect(() => {
    // Close board options menu when clicking outside
    const handleClickOutside = (e) => {
      if (showBoardOptions && !e.target.closest('.board-options')) {
        setShowBoardOptions(null);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showBoardOptions]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      addElement('image', { src: imageUrl, alt: file.name });
      triggerAnimation();
      // Reset file input so the same file can be uploaded again
      e.target.value = '';
    }
  };

  const handleAddNewBoard = () => {
    if (newBoardTitle.trim()) {
      addNewBoard(newBoardTitle.trim());
      setNewBoardTitle(''); // Clear the input field after adding
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddNewBoard();
    }
  };

  const startRenaming = (boardId, currentTitle) => {
    setIsRenaming(boardId);
    setRenameValue(currentTitle);
    // Focus the input field after rendering
    setTimeout(() => {
      if (renameInputRef.current) {
        renameInputRef.current.focus();
        renameInputRef.current.select();
      }
    }, 50);
  };

  const handleRename = (boardId) => {
    if (renameValue.trim()) {
      renameBoard(boardId, renameValue.trim());
    }
    setIsRenaming(false);
  };

  const handleRenameKeyPress = (e, boardId) => {
    if (e.key === 'Enter') {
      handleRename(boardId);
    } else if (e.key === 'Escape') {
      setIsRenaming(false);
    }
  };

  const handleBoardClick = (boardId, e) => {
    // Don't trigger board selection if clicking board options
    if (e.target.closest('.board-options') || isRenaming) {
      return;
    }
    setActiveBoard(boardId);
  };

  const handleAddElement = (type) => {
    addElement(type);
    triggerAnimation();
  };

  return (
    <div className="relative">
      {/* Toggle Button for small screens */}
      <button 
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden fixed top-4 left-4 z-50 bg-blue-500 text-white p-2 rounded-full shadow-lg"
      >
        {sidebarOpen ? '✕' : '☰'}
      </button>

      {/* Sidebar Content */}
      <div 
        className={`w-full md:w-72 bg-white shadow-lg rounded-xl p-4 md:p-6 flex flex-col space-y-4 md:space-y-6 text-gray-800 border-r border-gray-200 transition-all duration-300 overflow-y-auto max-h-screen ${
          sidebarOpen ? 'fixed md:relative left-0 top-0 bottom-0 z-40' : 'fixed -left-full md:left-0'
        }`}
        style={{ maxWidth: '100vw' }}
      >
        {/* Header */}
        <div className="text-center mb-2 flex items-center justify-between">
          <h1 className="text-xl md:text-2xl font-bold text-blue-600">Design Board</h1>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-gray-500 p-1"
          >
            ✕
          </button>
        </div>
        <p className="text-sm text-gray-500 text-center -mt-2 md:mt-0">Unleash your creativity</p>
        
        {/* Boards Section */}
        <div className="pb-4 border-b border-gray-200">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg md:text-xl font-bold">Your Boards</h2>
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
              {boards.length}
            </span>
          </div>
          <div className="space-y-2 max-h-48 md:max-h-64 overflow-y-auto pr-1">
            {boards.map(board => (
              <div
                key={board.id}
                className={`p-2 rounded-lg cursor-pointer hover:bg-gray-100 transition-all duration-150 flex justify-between items-center ${
                  board.id === activeBoard ? 'bg-blue-100 border-l-4 border-blue-500 pl-2' : ''
                }`}
                onClick={(e) => handleBoardClick(board.id, e)}
              >
                {isRenaming === board.id ? (
                  <input
                    ref={renameInputRef}
                    type="text"
                    value={renameValue}
                    onChange={(e) => setRenameValue(e.target.value)}
                    onBlur={() => handleRename(board.id)}
                    onKeyDown={(e) => handleRenameKeyPress(e, board.id)}
                    className="flex-1 px-2 py-1 border border-blue-400 rounded focus:ring-2 focus:ring-blue-300 focus:outline-none"
                    autoFocus
                  />
                ) : (
                  <>
                    <div className="flex items-center gap-2 truncate flex-1">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: board.backgroundColor || '#e5e7eb' }}
                      />
                      <span className="truncate">{board.title}</span>
                    </div>
                    <div className="board-options relative">
                      <button 
                        className="ml-2 text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-200"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowBoardOptions(showBoardOptions === board.id ? null : board.id);
                        }}
                      >
                        ⋮
                      </button>
                      {showBoardOptions === board.id && (
                        <div className="absolute right-0 mt-1 bg-white shadow-lg rounded-md py-1 z-10 w-36 border border-gray-200">
                          <button 
                            className="w-full text-left px-3 py-2 hover:bg-gray-100 flex items-center gap-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              startRenaming(board.id, board.title);
                              setShowBoardOptions(null);
                            }}
                          >
                            <span className="text-blue-500">✎</span>
                            Rename
                          </button>
                          {boards.length > 1 && (
                            <button 
                              className="w-full text-left px-3 py-2 hover:bg-red-50 text-red-500 flex items-center gap-2"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteBoard(board.id);
                                setShowBoardOptions(null);
                              }}
                            >
                              <span>🗑️</span>
                              Delete
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
          <div className="flex space-x-2 mt-4">
            <input
              type="text"
              placeholder="New board name"
              value={newBoardTitle}
              onChange={(e) => setNewBoardTitle(e.target.value)}
              onKeyDown={handleKeyPress}
              className="flex-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-300 focus:border-blue-500 focus:outline-none"
            />
            <button
              className={`bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-all ${!newBoardTitle.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'}`}
              onClick={handleAddNewBoard}
              disabled={!newBoardTitle.trim()}
            >
              +
            </button>
          </div>
        </div>

        {/* Add Elements */}
        <div className="pb-4 border-b border-gray-200">
          <h2 className="text-lg md:text-xl font-bold mb-3 flex items-center gap-2">
            <span className="text-blue-500">+</span>
            Add Elements
          </h2>
          <div className={`grid grid-cols-2 gap-3 ${animation}`}>
            <button
              onClick={() => handleAddElement('image')}
              className="bg-gray-100 hover:bg-gray-200 py-2 md:py-3 px-2 md:px-3 rounded-lg transition-all hover:shadow-md hover:scale-105 flex flex-col items-center justify-center gap-2 group"
            >
              <span className="text-blue-500 text-lg">🖼️</span>
              <span className="text-xs md:text-sm">Image</span>
            </button>
            <button
              onClick={() => handleAddElement('text')}
              className="bg-gray-100 hover:bg-gray-200 py-2 md:py-3 px-2 md:px-3 rounded-lg transition-all hover:shadow-md hover:scale-105 flex flex-col items-center justify-center gap-2 group"
            >
              <span className="text-green-500 text-lg">T</span>
              <span className="text-xs md:text-sm">Text</span>
            </button>
            <button
              onClick={() => handleAddElement('color')}
              className="bg-gray-100 hover:bg-gray-200 py-2 md:py-3 px-2 md:px-3 rounded-lg transition-all hover:shadow-md hover:scale-105 flex flex-col items-center justify-center gap-2 group"
            >
              <span className="text-purple-500 text-lg">🎨</span>
              <span className="text-xs md:text-sm">Color</span>
            </button>
            <button
              onClick={() => fileInputRef.current.click()}
              className="bg-gray-100 hover:bg-gray-200 py-2 md:py-3 px-2 md:px-3 rounded-lg transition-all hover:shadow-md hover:scale-105 flex flex-col items-center justify-center gap-2 group"
            >
              <span className="text-amber-500 text-lg">📤</span>
              <span className="text-xs md:text-sm">Upload</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
        </div>

        {/* Board Settings */}
        <div className="pb-4 border-b border-gray-200">
          <h2 className="text-lg md:text-xl font-bold mb-3 flex items-center gap-2">
            <span className="text-gray-600">⚙️</span>
            Board Settings
          </h2>
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center space-x-3 mb-3">
              <span className="font-medium">Background:</span>
              <div
                className="w-6 h-6 md:w-8 md:h-8 rounded-full border cursor-pointer shadow-md hover:scale-110 transition-transform"
                style={{ backgroundColor: currentBoard?.backgroundColor || '#fff' }}
                onClick={() => setShowColorPicker(!showColorPicker)}
              />
              {currentBoard?.backgroundColor && (
                <span className="text-xs font-mono bg-gray-200 px-2 py-1 rounded truncate">
                  {currentBoard.backgroundColor}
                </span>
              )}
            </div>
            {showColorPicker && !selectedElement && currentBoard && (
              <div className="border rounded-lg p-2 bg-white shadow-lg max-w-full overflow-x-auto">
                <SimpleColorPicker
                  color={currentBoard.backgroundColor}
                  onChange={changeBoardColor}
                />
              </div>
            )}
          </div>
        </div>

        {/* Selected Element Settings */}
        {selectedElement && (
          <div className="pb-2">
            <h2 className="text-lg md:text-xl font-bold mb-3 flex items-center gap-2">
              <span className="text-indigo-500">✏️</span>
              Element Properties
            </h2>
            
            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
              <div className="text-sm text-indigo-700 mb-3">
                Type: <span className="font-semibold capitalize">{selectedElement.type}</span>
              </div>
              
              {/* Display different options based on element type */}
              {selectedElement.type === 'text' && (
                <div className="mb-3">
                  <button
                    onClick={() => setIsTextEditing(!isTextEditing)}
                    className={`${
                      isTextEditing 
                        ? 'bg-indigo-100 text-indigo-700 border border-indigo-300' 
                        : 'bg-indigo-500 hover:bg-indigo-600 text-white'
                    } py-2 px-4 rounded-lg transition-all duration-200 w-full mb-2 flex items-center justify-center gap-2`}
                  >
                    {isTextEditing ? (
                      <>
                        <span>✓</span>
                        Done Editing
                      </>
                    ) : (
                      <>
                        <span>✎</span>
                        Edit Text
                      </>
                    )}
                  </button>
                </div>
              )}
              
              {selectedElement.type === 'image' && (
                <div className="mb-3">
                  <button
                    onClick={() => fileInputRef.current.click()}
                    className="bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded-lg transition-all duration-200 w-full mb-2 flex items-center justify-center gap-2 hover:shadow-md"
                  >
                    <span>🖼️</span>
                    Replace Image
                  </button>
                </div>
              )}
              
              <button
                onClick={() => deleteElement(selectedElement.id)}
                className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition-all duration-200 w-full flex items-center justify-center gap-2 hover:shadow-md"
              >
                <span>🗑️</span>
                Delete Element
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}